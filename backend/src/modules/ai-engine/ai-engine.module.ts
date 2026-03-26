import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiFacade } from './facade/ai.facade.js';
import { AiOrchestrationService } from './orchestration/ai-orchestration.service.js';
import { ContextBuilderService } from './context/context-builder.service.js';
import { PromptRegistryService } from './prompts/prompt-registry.service.js';
import { OutputValidatorService } from './validators/output-validator.service.js';
import { LLM_ADAPTER } from './adapters/llm-adapter.interface.js';
import { MockLlmAdapter } from './adapters/mock-llm.adapter.js';

/**
 * AI Fitness Engine module.
 *
 * Exposes only the {@link AiFacade} — all internals are encapsulated.
 *
 * To swap LLM providers, change the `LLM_ADAPTER` provider below:
 * - `MockLlmAdapter`  → testing / development (default)
 * - `ClaudeLlmAdapter` → production with Anthropic
 * - `OpenAiLlmAdapter` → production with OpenAI
 */
@Module({
  imports: [ConfigModule],
  providers: [
    // Public facade
    AiFacade,

    // Internal services
    AiOrchestrationService,
    ContextBuilderService,
    PromptRegistryService,
    OutputValidatorService,

    // LLM adapter — swap implementation per environment
    { provide: LLM_ADAPTER, useClass: MockLlmAdapter },
  ],
  exports: [AiFacade],
})
export class AiEngineModule {}
