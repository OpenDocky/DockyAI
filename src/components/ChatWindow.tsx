"use client";

import { useState, useRef, useEffect } from "react";
import { AIModel, MODELS, Message } from "@/lib/models";
import { usePuter } from "./PuterProvider";
import { Send, User, Bot, Loader2, Sparkles, CheckCircle2, Zap, Settings2, Cpu, ChevronUp, BrainCircuit, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (content: string, modelId: string) => void;
    isLoading: boolean;
    streamingContent: string;
    currentModelId: string;
    onModelChange: (modelId: string) => void;
    isBlindTest: boolean;
    blindResponses: { id: string, content: string }[];
    onBlindVote: (id: string) => void;
}

function MessageBubble({ msg, isStreaming = false }: { msg: { role: string, content: string, isBlind?: boolean }, isStreaming?: boolean }) {
    const [isThoughtExpanded, setIsThoughtExpanded] = useState(isStreaming);

    // Parse <think> tags
    const parseContent = (text: string) => {
        const thinkRegex = /<think>([\s\S]*?)(?:<\/think>|$)/g;
        const thoughts: string[] = [];
        let lastIndex = 0;
        let match;
        const parts: { type: 'text' | 'thought', content: string }[] = [];

        while ((match = thinkRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
            }
            parts.push({ type: 'thought', content: match[1] });
            lastIndex = thinkRegex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push({ type: 'text', content: text.substring(lastIndex) });
        }

        return parts.length > 0 ? parts : [{ type: 'text' as const, content: text }];
    };

    const contentParts = parseContent(msg.content);

    return (
        <div className={clsx(
            "flex gap-6 animate-fade-in group w-full",
            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
        )}>
            <div className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-500",
                msg.role === 'user' ? "bg-white border-white text-black" : "bg-white/5 border-white/10"
            )}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={clsx(
                "max-w-[85%] space-y-3",
                msg.role === 'user' ? "text-right" : "text-left"
            )}>
                <div className="flex flex-col gap-3">
                    {contentParts.map((part, idx) => (
                        part.type === 'thought' ? (
                            <div key={idx} className="flex flex-col gap-2">
                                <button
                                    onClick={() => setIsThoughtExpanded(!isThoughtExpanded)}
                                    className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity w-fit"
                                >
                                    <BrainCircuit size={14} className="text-amber-500/50" />
                                    <span>{isThoughtExpanded ? "Masquer la réflexion" : "Voir la réflexion"}</span>
                                    <ChevronDown size={12} className={clsx("transition-transform", isThoughtExpanded && "rotate-180")} />
                                </button>
                                {isThoughtExpanded && (
                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-[13px] leading-relaxed text-secondary italic font-medium animate-fade-in">
                                        {part.content}
                                    </div>
                                )}
                            </div>
                        ) : (
                            part.content.trim() && (
                                <div key={idx} className={clsx(
                                    "inline-block p-4 sm:p-5 rounded-2xl text-[15px] leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-white/5 border border-white/10 font-medium"
                                        : "bg-[#0d0d0d] border border-white/5 text-white/90"
                                )}>
                                    {part.content}
                                    {isStreaming && idx === contentParts.length - 1 && (
                                        <span className="inline-block w-1.5 h-4 bg-white/40 ml-1 animate-pulse" />
                                    )}
                                </div>
                            )
                        )
                    ))}
                </div>
                {msg.isBlind && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest px-1">
                        <CheckCircle2 size={12} />
                        Node Validé via Blind Test
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ChatWindow({
    messages,
    onSendMessage,
    isLoading,
    streamingContent,
    currentModelId,
    onModelChange,
    isBlindTest,
    blindResponses,
    onBlindVote
}: ChatWindowProps) {
    const [input, setInput] = useState("");
    const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [credits, setCredits] = useState(100);
    const { user } = usePuter();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const selectorRef = useRef<HTMLDivElement>(null);

    const currentModel = MODELS.find(m => m.id === currentModelId) || MODELS[0];

    const brands = Array.from(new Set(MODELS.map(m => m.brand))).sort();
    const filteredModels = selectedBrand
        ? MODELS.filter(m => m.brand === selectedBrand)
        : MODELS;

    useEffect(() => {
        const savedCredits = localStorage.getItem('docky_credits');
        if (savedCredits) setCredits(parseInt(savedCredits));
    }, [isLoading]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, blindResponses, isLoading, streamingContent]);

    const handleSend = () => {
        if (!input.trim() || isLoading || isBlindTest) return;
        onSendMessage(input, currentModelId);
        setInput("");
    };

    // Close selector when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                setIsModelSelectorOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto px-6">
            {/* Header */}
            <header className="py-6 flex items-center justify-between border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <div className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center border",
                        isBlindTest ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-white/5 border-white/10"
                    )}>
                        {isBlindTest ? <Zap size={20} /> : <Bot size={20} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-lg tracking-tight">
                            {isBlindTest ? "Blind Test Mode" : currentModel.name}
                        </span>
                        {!isBlindTest && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                {currentModel.provider} Provider
                            </span>
                        )}
                    </div>
                </div>

                {currentModel.tier === 'premium' && (
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Zap size={12} className="text-blue-500" />
                            <span className="text-xs font-bold tabular-nums text-blue-500">{credits} / 100</span>
                        </div>
                    </div>
                )}
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto pt-10 pb-48 space-y-12 scrollbar-hide">
                {messages.length === 0 && !isBlindTest && !streamingContent && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="relative group mb-8">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl opacity-20" />
                            <div className="relative w-20 h-20 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Sparkles size={36} className="text-white/20" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black mb-2 tracking-tighter">Comment puis-je vous aider aujourd'hui ?</h2>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} />
                ))}

                {/* Streaming Message */}
                {streamingContent && (
                    <MessageBubble msg={{ role: 'assistant', content: streamingContent }} isStreaming={true} />
                )}

                {isBlindTest && blindResponses.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 animate-fade-in">
                        {blindResponses.map((res, idx) => (
                            <div key={idx} className="flex flex-col gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-50">Réponse {idx + 1}</span>
                                    <Zap size={14} className="text-amber-500 opacity-30" />
                                </div>
                                <p className="text-sm leading-relaxed text-white/80 flex-1">{res.content}</p>
                                <button
                                    onClick={() => onBlindVote(res.id)}
                                    className="w-full py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-[0.98] transition-transform shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
                                >
                                    Valider ce Node
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {isLoading && !isBlindTest && !streamingContent && (
                    <div className="flex gap-6 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-secondary" />
                        </div>
                        <div className="flex items-center px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">Initialisation...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Wrapper */}
            <div className="fixed bottom-0 left-0 right-0 lg:left-72 p-6 z-30 pointer-events-none">
                <div className="max-w-4xl mx-auto pointer-events-auto">
                    <div className="relative bg-[#0d0d0d] border border-white/10 rounded-[1.8rem] p-2 focus-within:border-white/20 transition-all shadow-2xl flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isBlindTest ? "Node verrouillé..." : `Écrire à ${currentModel.name}...`}
                            disabled={isLoading || isBlindTest}
                            className="flex-1 bg-transparent px-6 py-3.5 outline-none text-white placeholder:text-white/20 text-sm font-medium"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim() || isBlindTest}
                            className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-[1.4rem] hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="relative" ref={selectorRef}>
                            <button
                                onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group"
                            >
                                <Settings2 size={12} className="text-secondary group-hover:text-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary group-hover:text-white">
                                    Modèle : {currentModel.name}
                                </span>
                                <ChevronUp size={12} className={clsx("text-secondary transition-transform", isModelSelectorOpen && "rotate-180")} />
                            </button>

                            {isModelSelectorOpen && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-h-[32rem] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl animate-fade-in">
                                    <div className="p-3 mb-1 flex flex-col gap-3">
                                        <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">Filtrer par marque</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            <button
                                                onClick={() => setSelectedBrand(null)}
                                                className={clsx(
                                                    "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
                                                    selectedBrand === null ? "bg-white text-black" : "bg-white/5 text-secondary hover:bg-white/10"
                                                )}
                                            >
                                                Tous
                                            </button>
                                            {brands.map(brand => (
                                                <button
                                                    key={brand}
                                                    onClick={() => setSelectedBrand(brand)}
                                                    className={clsx(
                                                        "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
                                                        selectedBrand === brand ? "bg-white text-black" : "bg-white/5 text-secondary hover:bg-white/10"
                                                    )}
                                                >
                                                    {brand}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1 p-1">
                                        <div className="px-2 pb-1 border-b border-white/5 mb-1">
                                            <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">Modèles disponibles</span>
                                        </div>
                                        {filteredModels.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => {
                                                    onModelChange(m.id);
                                                    setIsModelSelectorOpen(false);
                                                }}
                                                className={clsx(
                                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all border",
                                                    currentModelId === m.id
                                                        ? "bg-white/5 border-white/10 text-white"
                                                        : "bg-transparent border-transparent text-secondary hover:text-white hover:bg-white/[0.02]"
                                                )}
                                            >
                                                <div className="flex flex-col items-start min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold truncate">{m.name}</span>
                                                        <span className="text-[8px] font-bold bg-white/5 px-1.5 py-0.5 rounded text-white/40 uppercase tracking-tighter">
                                                            {m.brand}
                                                        </span>
                                                    </div>
                                                    <span className="text-[8px] uppercase tracking-widest opacity-40">{m.provider}</span>
                                                </div>
                                                {m.tier === 'premium' && <Cpu size={10} className="text-blue-500" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
