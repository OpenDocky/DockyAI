// Curated list of top models from Hugging Face
export const DEFAULT_CHAT_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  // Meta Llama
  {
    id: "meta-llama/Llama-3.1-8B-Instruct",
    name: "Llama 3.1 8B",
    provider: "meta",
    description: "Fast and efficient Llama model for daily tasks",
  },
  {
    id: "meta-llama/Llama-3.1-70B-Instruct",
    name: "Llama 3.1 70B",
    provider: "meta",
    description: "Highly capable for complex reasoning and tasks",
  },
  {
    id: "NousResearch/Hermes-3-Llama-3.1-8B",
    name: "Hermes 3 (Llama 8B)",
    provider: "meta",
    description: "Llama 3.1 fine-tuned for better instruction following",
  },
  // Qwen (Alibaba)
  {
    id: "Qwen/Qwen2.5-7B-Instruct",
    name: "Qwen 2.5 7B",
    provider: "alibaba",
    description: "Alibaba's latest efficient 7B model",
  },
  {
    id: "Qwen/Qwen2.5-32B-Instruct",
    name: "Qwen 2.5 32B",
    provider: "alibaba",
    description: "Perfect balance between speed and performance",
  },
  {
    id: "Qwen/Qwen2.5-72B-Instruct",
    name: "Qwen 2.5 72B",
    provider: "alibaba",
    description: "Most powerful Qwen model for expert results",
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
