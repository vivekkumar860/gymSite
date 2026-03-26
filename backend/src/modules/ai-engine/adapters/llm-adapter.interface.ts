import type { LlmConfig, LlmResponse } from '../types/index.js';

/** DI token for the LLM adapter. */
export const LLM_ADAPTER = Symbol('LLM_ADAPTER');

/** Abstract port for LLM providers — services depend on this, not on Claude/OpenAI directly. */
export abstract class LlmAdapterPort {
  /** Send a prompt to the LLM and return the raw response. */
  abstract complete(
    systemPrompt: string,
    userPrompt: string,
    config: LlmConfig,
  ): Promise<LlmResponse>;

  /** Return the provider name for logging and diagnostics. */
  abstract get providerName(): string;
}
