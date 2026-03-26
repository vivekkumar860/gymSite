import { DomainError } from '../../../common/errors/index.js';

/** Thrown when an LLM provider call fails (timeout, rate-limit, network error). */
export class LlmProviderException extends DomainError {
  constructor(
    public readonly provider: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super('LLM_PROVIDER_ERROR', `[${provider}] ${message}`, 502);
  }
}
