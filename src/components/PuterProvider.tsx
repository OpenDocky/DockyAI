"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface PuterContextType {
    isLoaded: boolean;
    user: any;
    login: () => Promise<void>;
    chat: (model: string, messages: any[], onChunk?: (chunk: string) => void) => Promise<any>;
}

const PuterContext = createContext<PuterContextType | undefined>(undefined);

export function PuterProvider({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const script = document.createElement('script');
        script.src = 'https://js.puter.com/v2/';
        script.onload = () => {
            setIsLoaded(true);
            // @ts-ignore
            if (window.puter) {
                // @ts-ignore
                window.puter.auth.getUser().then((u: any) => setUser(u));
            }
        };
        document.head.appendChild(script);
    }, []);

    const login = async () => {
        // @ts-ignore
        if (!window.puter) return;
        // @ts-ignore
        const u = await window.puter.auth.signIn();
        setUser(u);
    };

    const chat = async (modelId: string, messages: any[], onChunk?: (chunk: string) => void) => {
        // @ts-ignore
        if (!window.puter) throw new Error("Puter.js n'est pas prêt.");

        try {
            console.log(`[DockyAI] Calling Puter SDK with model: "${modelId}"`);

            // @ts-ignore
            const response = await window.puter.ai.chat(messages, {
                model: modelId,
                stream: !!onChunk
            });

            if (onChunk) {
                let fullText = "";
                if (response && typeof response[Symbol.asyncIterator] === 'function') {
                    for await (const chunk of response) {
                        const content = chunk?.text || "";
                        if (content) {
                            fullText += content;
                            onChunk(content);
                        }
                    }
                } else if (response?.message?.content) {
                    const content = response.message.content;
                    for (const char of content) {
                        onChunk(char);
                        await new Promise(r => setTimeout(r, 5));
                    }
                    fullText = content;
                }
                return { message: { content: fullText } };
            }

            return response;

        } catch (error: any) {
            console.error("[Puter Error Details]:", error);

            // Extracting the most specific error message from Puter
            let specificError = "Erreur Inconnue";
            if (typeof error === 'string') specificError = error;
            else if (error?.message) specificError = error.message;
            else if (error?.error?.message) specificError = error.error.message;

            throw new Error(`Puter API: ${specificError}`);
        }
    };

    return (
        <PuterContext.Provider value={{ isLoaded, user, login, chat }}>
            {children}
        </PuterContext.Provider>
    );
}

export const usePuter = () => {
    const context = useContext(PuterContext);
    if (!context) throw new Error("usePuter must be used within PuterProvider");
    return context;
};
