import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  LLM_ADAPTER,
  LlmAdapterPort,
} from '../adapters/llm-adapter.interface.js';
import { PromptRegistryService } from '../prompts/prompt-registry.service.js';
import { OutputValidatorService } from '../validators/output-validator.service.js';
import { AiCapability } from '../types/index.js';
import type { ValidationResult } from '../types/index.js';

/**
 * Internal orchestration layer: context → prompt → LLM call → validation.
 *
 * This service is NOT exported from the module. Only the AiFacade uses it.
 * It handles the full lifecycle of an AI request and returns a validated
 * result or an Invalid marker so the facade can apply fallbacks.
 */
@Injectable()
export class AiOrchestrationService {
  private readonly logger = new Logger(AiOrchestrationService.name);

  constructor(
    @Inject(LLM_ADAPTER) private readonly llmAdapter: LlmAdapterPort,
    private readonly promptRegistry: PromptRegistryService,
    private readonly outputValidator: OutputValidatorService,
  ) {}

  /**
   * Execute the full AI pipeline for a given capability.
   *
   * @returns Validated data on success, or Invalid with reason on failure.
   */
  async execute<T>(
    capability: AiCapability,
    variables: Record<string, string>,
  ): Promise<ValidationResult<T>> {
    const prompt = this.promptRegistry.resolve(capability, variables);

    this.logger.debug(
      `Executing AI pipeline: capability=${capability}, version=${prompt.version}, provider=${this.llmAdapter.providerName}`,
    );

    try {
      const response = await this.llmAdapter.complete(
        prompt.system,
        prompt.user,
        {
          temperature: prompt.config.temperature,
          maxTokens: prompt.config.maxTokens,
        },
      );

      this.logger.debug(
        `LLM response received: tokens=${response.tokenUsage.promptTokens}+${response.tokenUsage.completionTokens}`,
      );

      return this.outputValidator.validate<T>(capability, response.content);
    } catch (error) {
      this.logger.error(
        `AI pipeline failed for ${capability}: ${(error as Error).message}`,
      );
      return {
        valid: false,
        reason: `LLM call failed: ${(error as Error).message}`,
      };
    }
  }
}
