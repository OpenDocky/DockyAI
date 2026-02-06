import { NextRequest } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { modelId, messages } = await req.json();

        if (!modelId || !messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: "Requête malformée : modelId ou messages manquants." }), { status: 400 });
        }

        // Check if it's a Groq model
        const validKeywords = ['llama', 'deepseek', 'qwen', 'gemma', 'mixtral', 'kimi', 'gpt'];
        const isGroqModel = validKeywords.some(kw => modelId.toLowerCase().includes(kw));

        if (!isGroqModel) {
            return new Response(JSON.stringify({ error: `Le modèle ${modelId} n'est pas géré par le flux Groq.` }), { status: 400 });
        }

        const stream = await groq.chat.completions.create({
            model: modelId,
            messages: messages.map((m: any) => ({
                role: m.role === 'user' || m.role === 'assistant' ? m.role : 'user',
                content: m.content || ""
            })),
            stream: true,
        });

        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (streamErr: any) {
                    console.error("[Groq Stream Error]:", streamErr);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (error: any) {
        console.error("[Groq API Route Error]:", error);

        // If it's a 400 or other API error, return the specific message
        const status = error.status || 500;
        const message = error.error?.message || error.message || "Erreur interne du serveur";

        return new Response(JSON.stringify({ error: message }), { status });
    }
}
