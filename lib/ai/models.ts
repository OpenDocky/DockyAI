// Curated list of top models from Hugging Face
export const DEFAULT_CHAT_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  // Meta Llama 3.1 & 3.2
  {
    id: "meta-llama/Llama-3.1-8B-Instruct",
    name: "Llama 3.1 8B",
    provider: "meta",
    description: "Standard Meta Llama 3.1 8B Instruct",
  },
  {
    id: "meta-llama/Llama-3.1-70B-Instruct",
    name: "Llama 3.1 70B",
    provider: "meta",
    description: "Meta Llama 3.1 70B for high-end reasoning",
  },
  {
    id: "meta-llama/Llama-3.2-1B-Instruct",
    name: "Llama 3.2 1B",
    provider: "meta",
    description: "Ultra-fast Llama 3.2 model",
  },
  {
    id: "meta-llama/Llama-3.2-3B-Instruct",
    name: "Llama 3.2 3B",
    provider: "meta",
    description: "Efficient Llama 3.2 model",
  },
  // Qwen 2.5
  {
    id: "Qwen/Qwen2.5-7B-Instruct",
    name: "Qwen 2.5 7B",
    provider: "alibaba",
    description: "Small and fast Qwen 2.5",
  },
  {
    id: "Qwen/Qwen2.5-14B-Instruct",
    name: "Qwen 2.5 14B",
    provider: "alibaba",
    description: "Mid-size Qwen 2.5 Instruct",
  },
  {
    id: "Qwen/Qwen2.5-32B-Instruct",
    name: "Qwen 2.5 32B",
    provider: "alibaba",
    description: "Highly capable balanced Qwen 2.5",
  },
  {
    id: "Qwen/Qwen2.5-72B-Instruct",
    name: "Qwen 2.5 72B",
    provider: "alibaba",
    description: "The most powerful Qwen 2.5",
  },
  // Specialized Qwen-based
  {
    id: "Qwen/Qwen2.5-Coder-7B-Instruct",
    name: "Qwen Coder 7B",
    provider: "alibaba",
    description: "Specially tuned for coding tasks",
  },
  {
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    name: "Qwen Coder 32B",
    provider: "alibaba",
    description: "Expert level coding assistant model",
  },
];

// Group models by provider for UI
export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
