import { Injectable, Logger } from '@nestjs/common';
import { LlmAdapterPort } from './llm-adapter.interface.js';
import type { LlmConfig, LlmResponse } from '../types/index.js';

/**
 * Mock LLM adapter for testing.
 *
 * Returns deterministic JSON fixtures so tests never hit a real provider.
 * Set `mockResponse` before calling `complete()` to control the output.
 */
@Injectable()
export class MockLlmAdapter extends LlmAdapterPort {
  private readonly logger = new Logger(MockLlmAdapter.name);

  /** Override this in tests to control what the adapter returns. */
  public mockResponse: string = '{}';

  /** Track calls for assertion. */
  public callLog: {
    systemPrompt: string;
    userPrompt: string;
    config: LlmConfig;
  }[] = [];

  get providerName(): string {
    return 'mock';
  }

  async complete(
    systemPrompt: string,
    userPrompt: string,
    config: LlmConfig,
  ): Promise<LlmResponse> {
    this.callLog.push({ systemPrompt, userPrompt, config });
    this.logger.debug('Mock LLM called');

    return {
      content: this.mockResponse,
      promptVersion: 'mock-v1',
      tokenUsage: { promptTokens: 0, completionTokens: 0 },
    };
  }

  /** Reset call log and mock response between tests. */
  reset(): void {
    this.mockResponse = '{}';
    this.callLog = [];
  }
}
