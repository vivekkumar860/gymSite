/** Configuration passed to the LLM adapter per request. */
export interface LlmConfig {
  temperature: number;
  maxTokens: number;
  /** Optional model override — adapter uses its default if omitted. */
  model?: string;
}

/** Raw response shape returned by all LLM adapters. */
export interface LlmResponse {
  content: string;
  promptVersion: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
  };
}
