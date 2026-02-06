"use server";

import { Groq } from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function chatWithModel(modelId: string, messages: any[]) {
    try {
        console.log(`[DockyAI] Routing Request -> Model: ${modelId}`);

        // Google Gemini handling
        if (modelId.startsWith('gemini')) {
            const model = genAI.getGenerativeModel({ model: modelId });
            const prompt = messages[messages.length - 1].content;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return { content: response.text() };
        }

        // Default to Groq for all other free models (Llama, GPT OSS, Qwen, DeepSeek, etc.)
        const response = await groq.chat.completions.create({
            model: modelId,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content || ""
            })),
        });

        return { content: response.choices[0].message.content };

    } catch (error: any) {
        console.error("[DockyAI] Provider Error:", error.message);

        // Return the exact error for debugging (user wants to see if it works or not)
        return { error: `Erreur ${modelId} : ${error.message}` };
    }
}
