"use client";

import { Conversation } from "@/lib/models";
import { usePuter } from "./PuterProvider";
import { MessageSquare, Trophy, LogIn, Plus, Clock, Trash2 } from "lucide-react";
import { clsx } from "clsx";

interface SidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onNewChat: () => void;
    currentPage: string;
    setCurrentPage: (page: string) => void;
}

export default function Sidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    onDeleteConversation,
    onNewChat,
    currentPage,
    setCurrentPage
}: SidebarProps) {
    const { user, login } = usePuter();

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col z-50">
            {/* Brand */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <span className="text-black font-black text-2xl tracking-tighter">D</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-tight leading-none text-white">DockyAI</h1>
                        <span className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1 opacity-50">v21</span>
                    </div>
                </div>
            </div>

            {/* Primary Actions */}
            <div className="px-4 mb-6">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-white/5 shadow-lg group"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    Nouvelle Conversation
                </button>
            </div>

            {/* Main Nav */}
            <nav className="px-3 space-y-1 mb-6">
                <button
                    onClick={() => setCurrentPage('chat')}
                    className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                        currentPage === 'chat' ? "bg-white/5 text-white shadow-inner" : "text-secondary hover:text-white hover:bg-white/[0.02]"
                    )}
                >
                    <MessageSquare size={18} />
                    <span>Conversations</span>
                </button>
                <button
                    onClick={() => setCurrentPage('leaderboard')}
                    className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                        currentPage === 'leaderboard' ? "bg-white/5 text-white shadow-inner" : "text-secondary hover:text-white hover:bg-white/[0.02]"
                    )}
                >
                    <Trophy size={18} />
                    <span>Leaderboard</span>
                </button>
            </nav>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-3 scrollbar-hide space-y-6 pb-6">
                {currentPage === 'chat' && (
                    <div>
                        <div className="flex items-center justify-between px-4 mb-4">
                            <div className="flex items-center gap-2">
                                <Clock size={12} className="text-secondary" />
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">Historique</p>
                            </div>
                        </div>

                        {conversations.length === 0 ? (
                            <div className="px-4 py-8 text-center border border-dashed border-white/5 rounded-2xl">
                                <p className="text-[10px] text-secondary uppercase tracking-widest leading-relaxed">Aucun historique disponible</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {conversations.sort((a, b) => b.createdAt - a.createdAt).map(conv => (
                                    <div key={conv.id} className="group relative">
                                        <button
                                            onClick={() => onSelectConversation(conv.id)}
                                            className={clsx(
                                                "w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all border",
                                                activeConversationId === conv.id
                                                    ? "bg-white/5 border-white/10 ring-1 ring-white/5"
                                                    : "bg-transparent border-transparent hover:border-white/5 hover:bg-white/[0.01]"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-2 h-2 rounded-full shrink-0 transition-all",
                                                activeConversationId === conv.id ? "bg-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-white/10"
                                            )} />
                                            <div className="flex flex-col min-w-0 pr-6">
                                                <span className={clsx(
                                                    "text-sm font-semibold truncate transition-colors",
                                                    activeConversationId === conv.id ? "text-white" : "text-secondary group-hover:text-white"
                                                )}>
                                                    {conv.title || "Nouvelle discussion"}
                                                </span>
                                                <span className="text-[9px] text-secondary uppercase font-bold tracking-widest opacity-30 mt-0.5">
                                                    {new Date(conv.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </button>

                                        {/* Delete Action Overlay */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteConversation(conv.id);
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 text-secondary transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}
