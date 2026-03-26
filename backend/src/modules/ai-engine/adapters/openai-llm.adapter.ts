import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmAdapterPort } from './llm-adapter.interface.js';
import { LlmProviderException } from '../exceptions/llm-provider.exception.js';
import type { LlmConfig, LlmResponse } from '../types/index.js';

const DEFAULT_MODEL = 'gpt-4o';

/**
 * OpenAI LLM adapter.
 *
 * Wraps the OpenAI SDK behind the LlmAdapterPort interface.
 * Requires `OPENAI_API_KEY` in environment.
 */
@Injectable()
export class OpenAiLlmAdapter extends LlmAdapterPort {
  private readonly logger = new Logger(OpenAiLlmAdapter.name);
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.apiKey = this.config.getOrThrow<string>('OPENAI_API_KEY');
  }

  get providerName(): string {
    return 'openai';
  }

  async complete(
    systemPrompt: string,
    userPrompt: string,
    config: LlmConfig,
  ): Promise<LlmResponse> {
    const model = config.model ?? DEFAULT_MODEL;

    try {
      // TODO: Replace with actual OpenAI SDK call once openai package is installed
      // const openai = new OpenAI({ apiKey: this.apiKey });
      // const response = await openai.chat.completions.create({
      //   model,
      //   max_tokens: config.maxTokens,
      //   temperature: config.temperature,
      //   messages: [
      //     { role: 'system', content: systemPrompt },
      //     { role: 'user', content: userPrompt },
      //   ],
      // });

      this.logger.debug(
        `OpenAI request: model=${model}, maxTokens=${config.maxTokens}`,
      );

      throw new Error(
        'OpenAI SDK not yet installed — install openai to enable',
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
