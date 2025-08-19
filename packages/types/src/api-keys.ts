// API Key Provider Constants
export const API_KEY_PROVIDERS = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
  OPENROUTER: "openrouter",
  GOOGLE: "google",
  // GROQ: "groq",
  // OLLAMA: "ollama",
} as const;

export const API_KEY_PROVIDER_NAMES = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  openrouter: "OpenRouter",
  google: "Google",
} as const;

export type ApiKeyProvider =
  (typeof API_KEY_PROVIDERS)[keyof typeof API_KEY_PROVIDERS];

export interface ApiKeyValidationResult {
  isValid: boolean;
  error?: string;
  latencyMs?: number;
  validatedAt?: number; // timestamp
}

export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  openrouter?: string;
  google?: string;
  // groq?: string;
  // ollama?: string;
}

export interface ApiKeyValidation {
  openai?: ApiKeyValidationResult;
  anthropic?: ApiKeyValidationResult;
  openrouter?: ApiKeyValidationResult;
  google?: ApiKeyValidationResult;
  // groq?: ApiKeyValidationResult;
  // ollama?: ApiKeyValidationResult;
}