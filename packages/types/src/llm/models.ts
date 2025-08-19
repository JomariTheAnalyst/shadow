import { ApiKeys, ApiKeyProvider } from "../api-keys";

export interface LLMConfig {
  model: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  provider: "anthropic" | "openai" | "openrouter" | "google" /* | "groq" | "ollama" */;
}

// Model Selection
export const AvailableModels = {
  // OpenAI models
  GPT_5: "gpt-5-2025-08-07",
  GPT_5_MINI: "gpt-5-mini-2025-08-07",
  GPT_4_1: "gpt-4.1",
  GPT_4_1_MINI: "gpt-4.1-mini",
  GPT_4O: "gpt-4o",
  GPT_4O_MINI: "gpt-4o-mini",

  // Anthropic models
  CLAUDE_OPUS_4: "claude-opus-4-1-20250805",
  CLAUDE_SONNET_4: "claude-sonnet-4-20250514",
  CLAUDE_3_5_HAIKU: "claude-3-5-haiku-20241022",

  // Google Gemini models
  GEMINI_2_FLASH: "gemini-2.0-flash",
  GEMINI_1_5_PRO: "gemini-1.5-pro",
  GEMINI_1_5_FLASH: "gemini-1.5-flash",
  GEMINI_1_5_FLASH_8B: "gemini-1.5-flash-8b",

  // OpenRouter models
  XAI_GROK_3: "x-ai/grok-3",
  MOONSHOT_KIMI_K2: "moonshotai/kimi-k2",
  MOONSHOT_KIMI_K2_FREE: "moonshotai/kimi-k2:free",
  MISTRAL_CODESTRAL_2508: "mistralai/codestral-2508",
  DEEPSEEK_R1_0528: "deepseek/deepseek-r1-0528",
  DEEPSEEK_CHAT_V3_0324: "deepseek/deepseek-chat-v3-0324",
  QWEN_3_CODER: "qwen/qwen3-coder",
  QWEN_3_CODER_FREE: "qwen/qwen3-coder:free",
  QWEN_3_235B_A22B_2507: "qwen/qwen3-235b-a22b-2507",
} as const;

export type ModelType = (typeof AvailableModels)[keyof typeof AvailableModels];

export interface ModelInfo {
  id: ModelType;
  name: string;
  provider: "anthropic" | "openai" | "openrouter" | "google" /* | "groq" | "ollama" */;
}

export const ModelInfos: Record<ModelType, ModelInfo> = {
  // OpenAI models
  [AvailableModels.GPT_5]: {
    id: AvailableModels.GPT_5,
    name: "GPT-5",
    provider: "openai",
  },
  [AvailableModels.GPT_4_1]: {
    id: AvailableModels.GPT_4_1,
    name: "GPT-4.1",
    provider: "openai",
  },
  [AvailableModels.GPT_4_1_MINI]: {
    id: AvailableModels.GPT_4_1_MINI,
    name: "GPT-4.1 Mini",
    provider: "openai",
  },
  [AvailableModels.GPT_4O]: {
    id: AvailableModels.GPT_4O,
    name: "GPT-4o",
    provider: "openai",
  },
  [AvailableModels.GPT_4O_MINI]: {
    id: AvailableModels.GPT_4O_MINI,
    name: "GPT-4o Mini",
    provider: "openai",
  },
  [AvailableModels.GPT_5_MINI]: {
    id: AvailableModels.GPT_5_MINI,
    name: "GPT-5 Mini",
    provider: "openai",
  },

  // Anthropic models
  [AvailableModels.CLAUDE_OPUS_4]: {
    id: AvailableModels.CLAUDE_OPUS_4,
    name: "Claude Opus 4.1",
    provider: "anthropic",
  },
  [AvailableModels.CLAUDE_SONNET_4]: {
    id: AvailableModels.CLAUDE_SONNET_4,
    name: "Claude Sonnet 4",
    provider: "anthropic",
  },

  [AvailableModels.CLAUDE_3_5_HAIKU]: {
    id: AvailableModels.CLAUDE_3_5_HAIKU,
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
  },

  // Google Gemini models
  [AvailableModels.GEMINI_2_FLASH]: {
    id: AvailableModels.GEMINI_2_FLASH,
    name: "Gemini 2.0 Flash",
    provider: "google",
  },
  [AvailableModels.GEMINI_1_5_PRO]: {
    id: AvailableModels.GEMINI_1_5_PRO,
    name: "Gemini 1.5 Pro",
    provider: "google",
  },
  [AvailableModels.GEMINI_1_5_FLASH]: {
    id: AvailableModels.GEMINI_1_5_FLASH,
    name: "Gemini 1.5 Flash",
    provider: "google",
  },
  [AvailableModels.GEMINI_1_5_FLASH_8B]: {
    id: AvailableModels.GEMINI_1_5_FLASH_8B,
    name: "Gemini 1.5 Flash 8B",
    provider: "google",
  },

  // OpenRouter models
  [AvailableModels.XAI_GROK_3]: {
    id: AvailableModels.XAI_GROK_3,
    name: "Grok 3",
    provider: "openrouter",
  },
  [AvailableModels.MOONSHOT_KIMI_K2]: {
    id: AvailableModels.MOONSHOT_KIMI_K2,
    name: "Kimi K2",
    provider: "openrouter",
  },
  [AvailableModels.MOONSHOT_KIMI_K2_FREE]: {
    id: AvailableModels.MOONSHOT_KIMI_K2_FREE,
    name: "Kimi K2 (Free)",
    provider: "openrouter",
  },
  [AvailableModels.MISTRAL_CODESTRAL_2508]: {
    id: AvailableModels.MISTRAL_CODESTRAL_2508,
    name: "Codestral 2508",
    provider: "openrouter",
  },
  [AvailableModels.DEEPSEEK_R1_0528]: {
    id: AvailableModels.DEEPSEEK_R1_0528,
    name: "DeepSeek R1 0528",
    provider: "openrouter",
  },
  [AvailableModels.DEEPSEEK_CHAT_V3_0324]: {
    id: AvailableModels.DEEPSEEK_CHAT_V3_0324,
    name: "DeepSeek Chat V3 0324",
    provider: "openrouter",
  },
  [AvailableModels.QWEN_3_CODER]: {
    id: AvailableModels.QWEN_3_CODER,
    name: "Qwen3 Coder",
    provider: "openrouter",
  },
  [AvailableModels.QWEN_3_CODER_FREE]: {
    id: AvailableModels.QWEN_3_CODER_FREE,
    name: "Qwen3 Coder (Free)",
    provider: "openrouter",
  },
  [AvailableModels.QWEN_3_235B_A22B_2507]: {
    id: AvailableModels.QWEN_3_235B_A22B_2507,
    name: "Qwen 3 235B A22B 2507",
    provider: "openrouter",
  },
};

export function getModelProvider(
  model: ModelType
): "anthropic" | "openai" | "openrouter" | "google" /* | "ollama" */ {
  return ModelInfos[model].provider;
}

export function getModelInfo(model: ModelType): ModelInfo {
  return ModelInfos[model];
}

export function getProviderDefaultModel(provider: ApiKeyProvider): ModelType {
  switch (provider) {
    case "anthropic":
      return AvailableModels.CLAUDE_SONNET_4;
    case "openai":
      return AvailableModels.GPT_5;
    case "openrouter":
      return AvailableModels.XAI_GROK_3;
    case "google":
      return AvailableModels.GEMINI_2_FLASH;
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Get all possible models based on user API keys (for settings UI)
 */
export async function getAllPossibleModels(
  userApiKeys: ApiKeys
): Promise<ModelType[]> {
  const models: ModelType[] = [];

  if (userApiKeys.anthropic) {
    models.push(AvailableModels.CLAUDE_OPUS_4, AvailableModels.CLAUDE_SONNET_4);
  }

  if (userApiKeys.openai) {
    models.push(
      AvailableModels.GPT_5,
      AvailableModels.GPT_5_MINI,
      AvailableModels.GPT_4_1,
      AvailableModels.GPT_4O
    );
  }

  if (userApiKeys.google) {
    models.push(
      AvailableModels.GEMINI_2_FLASH,
      AvailableModels.GEMINI_1_5_PRO,
      AvailableModels.GEMINI_1_5_FLASH,
      AvailableModels.GEMINI_1_5_FLASH_8B
    );
  }

  if (userApiKeys.openrouter) {
    models.push(
      AvailableModels.XAI_GROK_3,
      AvailableModels.MOONSHOT_KIMI_K2,
      AvailableModels.MOONSHOT_KIMI_K2_FREE,
      AvailableModels.MISTRAL_CODESTRAL_2508,
      AvailableModels.DEEPSEEK_R1_0528,
      AvailableModels.DEEPSEEK_CHAT_V3_0324,
      AvailableModels.QWEN_3_CODER,
      AvailableModels.QWEN_3_CODER_FREE,
      AvailableModels.QWEN_3_235B_A22B_2507
    );
  }

  // if (userApiKeys.groq) {
  //   models.push(
  //     AvailableModels.GROQ_MIXTRAL_8X7B,
  //     AvailableModels.GROQ_LLAMA3_70B,
  //     AvailableModels.GROQ_LLAMA3_8B
  //   );
  // }

  // if (userApiKeys.ollama) {
  //   // models.push(
  //   //   AvailableModels.OLLAMA_GPT_OSS_120B,
  //   //   AvailableModels.OLLAMA_GPT_OSS_20B
  //   // );
  // }

  return models;
}

/**
 * Get default selected models based on user API keys
 */
export async function getDefaultSelectedModels(
  userApiKeys: ApiKeys
): Promise<ModelType[]> {
  const defaultModels: ModelType[] = [];

  // Add defaults for each provider (matching the user's request)
  if (userApiKeys.openai) {
    defaultModels.push(
      AvailableModels.GPT_5, // default
      AvailableModels.GPT_5_MINI, // default
      AvailableModels.GPT_4_1, // default
      AvailableModels.GPT_4O // default
      // AvailableModels.O3, // default
      // AvailableModels.O4_MINI // default
    );
  }

  if (userApiKeys.anthropic) {
    defaultModels.push(
      AvailableModels.CLAUDE_OPUS_4, // default
      AvailableModels.CLAUDE_SONNET_4 // default
    );
  }

  if (userApiKeys.google) {
    defaultModels.push(
      AvailableModels.GEMINI_2_FLASH, // default
      AvailableModels.GEMINI_1_5_PRO, // default
      AvailableModels.GEMINI_1_5_FLASH, // default
      AvailableModels.GEMINI_1_5_FLASH_8B // default
    );
  }

  if (userApiKeys.openrouter) {
    // All OpenRouter models default
    defaultModels.push(
      AvailableModels.XAI_GROK_3,
      AvailableModels.MOONSHOT_KIMI_K2,
      AvailableModels.MOONSHOT_KIMI_K2_FREE,
      AvailableModels.MISTRAL_CODESTRAL_2508,
      AvailableModels.DEEPSEEK_R1_0528,
      AvailableModels.DEEPSEEK_CHAT_V3_0324,
      AvailableModels.QWEN_3_CODER,
      AvailableModels.QWEN_3_CODER_FREE,
      AvailableModels.QWEN_3_235B_A22B_2507
    );
  }

  // if (userApiKeys.ollama) {
  //   // For Ollama, we get the dynamic models but use static fallbacks for defaults
  //   // defaultModels.push(
  //   //   AvailableModels.OLLAMA_GPT_OSS_120B,
  //   //   AvailableModels.OLLAMA_GPT_OSS_20B
  //   // );
  // }

  return defaultModels;
}

/**
 * Get available models based on user API keys and selected models in settings
 */
export async function getAvailableModels(
  userApiKeys: ApiKeys,
  selectedModels?: ModelType[]
): Promise<ModelType[]> {
  const allPossible = await getAllPossibleModels(userApiKeys);

  // If no user selection, return all possible (backward compatibility)
  if (!selectedModels || selectedModels.length === 0) {
    return allPossible;
  }

  // Filter selected models to only include those that user has API keys for
  return selectedModels.filter((model) => allPossible.includes(model));
}