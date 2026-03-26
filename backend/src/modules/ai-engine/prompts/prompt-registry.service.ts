import { Injectable } from '@nestjs/common';
import { AiCapability } from '../types/index.js';
import type { LlmConfig } from '../types/index.js';

import {
  workoutAdjustmentPrompts,
  activeWorkoutAdjustmentVersion,
} from './templates/workout-adjustment.prompts.js';
import {
  mealSwapPrompts,
  activeMealSwapVersion,
} from './templates/meal-swap.prompts.js';
import {
  progressSummaryPrompts,
  activeProgressSummaryVersion,
} from './templates/progress-summary.prompts.js';
import {
  missedWorkoutPrompts,
  activeMissedWorkoutVersion,
} from './templates/missed-workout.prompts.js';
import {
  motivationalPrompts,
  activeMotivationalVersion,
} from './templates/motivational.prompts.js';

/** Shape of a versioned prompt template. */
export interface PromptTemplate {
  version: string;
  system: string;
  userTemplate: string;
  config: Pick<LlmConfig, 'temperature' | 'maxTokens'>;
}

/** Resolved prompt ready to be sent to the LLM adapter. */
export interface ResolvedPrompt {
  system: string;
  user: string;
  version: string;
  config: Pick<LlmConfig, 'temperature' | 'maxTokens'>;
}

interface CapabilityEntry {
  templates: Record<string, PromptTemplate>;
  activeVersion: string;
}

/**
 * Registry of versioned prompt templates.
 *
 * Resolves the active template for a given capability and
 * fills template variables from a flat key-value map.
 */
@Injectable()
export class PromptRegistryService {
  private readonly registry: Record<AiCapability, CapabilityEntry> = {
    [AiCapability.WORKOUT_ADJUSTMENT]: {
      templates: workoutAdjustmentPrompts,
      activeVersion: activeWorkoutAdjustmentVersion,
    },
    [AiCapability.MEAL_SWAP]: {
      templates: mealSwapPrompts,
      activeVersion: activeMealSwapVersion,
    },
    [AiCapability.PROGRESS_SUMMARY]: {
      templates: progressSummaryPrompts,
      activeVersion: activeProgressSummaryVersion,
    },
    [AiCapability.MISSED_WORKOUT_RECOVERY]: {
      templates: missedWorkoutPrompts,
      activeVersion: activeMissedWorkoutVersion,
    },
    [AiCapability.MOTIVATIONAL_SUMMARY]: {
      templates: motivationalPrompts,
      activeVersion: activeMotivationalVersion,
    },
  };

  /**
   * Resolve a prompt template for a capability.
   * Fills template variables from the provided context map.
   */
  resolve(
    capability: AiCapability,
    variables: Record<string, string>,
    version?: string,
  ): ResolvedPrompt {
    const entry = this.registry[capability];
    const targetVersion = version ?? entry.activeVersion;
    const template = entry.templates[targetVersion];

    if (!template) {
      throw new Error(
        `Prompt version "${targetVersion}" not found for capability "${capability}"`,
      );
    }

    return {
      system: template.system,
      user: this.interpolate(template.userTemplate, variables),
      version: template.version,
      config: template.config,
    };
  }

  /** List available versions for a capability. */
  getVersions(capability: AiCapability): string[] {
    return Object.keys(this.registry[capability].templates);
  }

  /** Simple mustache-style interpolation: {{key}} → value. */
  private interpolate(
    template: string,
    variables: Record<string, string>,
  ): string {
    // Handle conditional sections: {{#key}}content{{/key}}
    let result = template.replace(
      /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
      (_, key, content) =>
        variables[key]
          ? content.replace(/\{\{(\w+)\}\}/g, (__, k) => variables[k] ?? '')
          : '',
    );

    // Handle simple variable replacement
    result = result.replace(
      /\{\{([\w.]+)\}\}/g,
      (_, key) => variables[key] ?? '',
    );

    return result.trim();
  }
}
