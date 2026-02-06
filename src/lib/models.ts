export type ModelTier = 'free' | 'premium';

export interface AIModel {
    id: string;
    name: string;
    provider: 'groq' | 'google' | 'puter';
    tier: ModelTier;
    description: string;
    icon?: string;
    requiresPuter?: boolean;
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    modelId?: string;
    isBlind?: boolean;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    modelId: string;
    createdAt: number;
}

export const MODELS: AIModel[] = [
    // TIER 1: Free (Groq & Google)
    {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3',
        provider: 'groq',
        tier: 'free',
        description: 'Meta flagship versatile model.',
    },
    {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1',
        provider: 'groq',
        tier: 'free',
        description: 'Ultra-fast inference.',
    },
    {
        id: 'meta-llama/llama-4-maverick-17b-128e-instruct',
        name: 'Llama 4 Maverick',
        provider: 'groq',
        tier: 'free',
        description: 'Meta Llama 4 - 17B Instruct (128E).',
    },
    {
        id: 'meta-llama/llama-4-scout-17b-16e-instruct',
        name: 'Llama 4 Scout',
        provider: 'groq',
        tier: 'free',
        description: 'Meta Llama 4 - 17B Instruct (16E).',
    },
    {
        id: 'openai/gpt-oss-120b',
        name: 'GPT OSS 120B',
        provider: 'groq',
        tier: 'free',
        description: 'Large open-weights GPT series.',
    },
    {
        id: 'moonshotai/kimi-k2-instruct-0905',
        name: 'Kimi K2',
        provider: 'groq',
        tier: 'free',
        description: 'Advanced reasoning model.',
    },
    {
        id: 'qwen/qwen3-32b',
        name: 'Qwen 3',
        provider: 'groq',
        tier: 'free',
        description: 'Alibaba next-gen open model.',
    },
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'google',
        tier: 'free',
        description: 'Google next-gen high-speed model.',
    },
    {
        id: 'gemma2-9b-it',
        name: 'Gemma 2',
        provider: 'groq',
        tier: 'free',
        description: 'Google lightweight open model.',
    },
];
