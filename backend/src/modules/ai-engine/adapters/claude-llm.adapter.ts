import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmAdapterPort } from './llm-adapter.interface.js';
import { LlmProviderException } from '../exceptions/llm-provider.exception.js';
import type { LlmConfig, LlmResponse } from '../types/index.js';

const DEFAULT_MODEL = 'claude-sonnet-4-6';

/**
 * Claude (Anthropic) LLM adapter.
 *
 * Wraps the Anthropic SDK behind the LlmAdapterPort interface.
 * Requires `ANTHROPIC_API_KEY` in environment.
 */
@Injectable()
export class ClaudeLlmAdapter extends LlmAdapterPort {
  private readonly logger = new Logger(ClaudeLlmAdapter.name);
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.apiKey = this.config.getOrThrow<string>('ANTHROPIC_API_KEY');
  }

  get providerName(): string {
    return 'claude';
  }

  async complete(
    systemPrompt: string,
    userPrompt: string,
    config: LlmConfig,
  ): Promise<LlmResponse> {
    const model = config.model ?? DEFAULT_MODEL;

    try {
      // TODO: Replace with actual Anthropic SDK call once @anthropic-ai/sdk is installed
      // const anthropic = new Anthropic({ apiKey: this.apiKey });
      // const message = await anthropic.messages.create({
      //   model,
      //   max_tokens: config.maxTokens,
      //   temperature: config.temperature,
      //   system: systemPrompt,
      //   messages: [{ role: 'user', content: userPrompt }],
      // });

      this.logger.debug(
        `Claude request: model=${model}, maxTokens=${config.maxTokens}`,
      );

      throw new Error(
        'Anthropic SDK not yet installed — install @anthropic-ai/sdk to enable',
      );
    } catch (error) {
      throw new LlmProviderException(
        this.providerName,
        (error as Error).message,
        error,
      );
    }
  }
}
