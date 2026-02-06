"use client";

import { useEffect, useState } from "react";
import { MODELS } from "@/lib/models";
import { Trophy, Star, TrendingUp, Cpu, Zap } from "lucide-react";
import { clsx } from "clsx";

export default function Leaderboard() {
    const [rankings, setRankings] = useState<{ id: string, name: string, votes: number, provider: string }[]>([]);

    useEffect(() => {
        const votes = JSON.parse(localStorage.getItem('docky_votes') || '{}');
        const sorted = MODELS.map(m => ({
            id: m.id,
            name: m.name,
            votes: votes[m.id] || 0,
            provider: m.provider
        })).sort((a, b) => b.votes - a.votes);

        if (Object.keys(votes).length === 0) {
            const demoSorted = MODELS.map((m, idx) => ({
                id: m.id,
                name: m.name,
                votes: [254, 198, 142, 89, 76, 54, 32, 21, 15][idx] || 0,
                provider: m.provider
            })).sort((a, b) => b.votes - a.votes);
            setRankings(demoSorted);
        } else {
            setRankings(sorted);
        }
    }, []);

    return (
        <div className="min-h-screen bg-background overflow-y-auto px-6 py-12 scrollbar-hide">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16 px-4">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Statistiques en Temps Réel</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter leading-none">Leader<span className="text-white/20">board</span></h1>
                        <p className="text-secondary max-w-sm font-medium leading-relaxed">
                            Classement hiérarchique des modèles basé sur les préférences cognitives des utilisateurs.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center min-w-[140px]">
                            <div className="text-3xl font-black tabular-nums mb-1">94%</div>
                            <div className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-40">Précision Moyenne</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center min-w-[140px]">
                            <div className="text-3xl font-black tabular-nums mb-1">2</div>
                            <div className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-40">Votes Totaux</div>
                        </div>
                    </div>
                </div>

                {/* Ranking Grid */}
                <div className="grid gap-3">
                    {rankings.map((model, idx) => (
                        <div
                            key={model.id}
                            className={clsx(
                                "group relative overflow-hidden flex items-center justify-between p-6 sm:p-8 rounded-[2rem] border transition-all duration-500",
                                idx === 0
                                    ? "bg-white/[0.04] border-white/20 shadow-[0_20px_50px_rgba(255,255,255,0.05)]"
                                    : "bg-white/[0.01] border-white/5 hover:bg-white/[0.02] hover:border-white/10"
                            )}
                        >
                            {/* Rank Badge */}
                            <div className="flex items-center gap-8">
                                <div className={clsx(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border transition-all duration-500",
                                    idx === 0 ? "bg-white text-black border-white rotate-3 shadow-xl" :
                                        idx === 1 ? "bg-white/10 text-white border-white/20" :
                                            idx === 2 ? "bg-white/5 text-white/60 border-white/10" :
                                                "bg-transparent text-white/20 border-transparent"
                                )}>
                                    {idx + 1}
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-black text-xl tracking-tight leading-none group-hover:translate-x-1 transition-transform">{model.name}</h3>
                                        {idx === 0 && <Star size={16} className="text-amber-500 fill-amber-500" />}
                                    </div>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-secondary uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:bg-white/10 transition-colors">
                                            <Cpu size={10} /> {model.provider}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-amber-500/60 uppercase tracking-widest">
                                            <TrendingUp size={10} /> +{Math.max(2, 12 - idx)}% conversion
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Vote Count */}
                            <div className="text-right">
                                <div className="text-3xl font-black tabular-nums leading-none tracking-tighter mb-2 group-hover:scale-110 transition-transform origin-right">
                                    {model.votes.toLocaleString()}
                                </div>
                                <div className="text-[9px] font-bold text-secondary uppercase tracking-[0.3em] opacity-40">Unités de Préférence</div>
                            </div>

                            {/* Decorative Background */}
                            {idx === 0 && (
                                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-16 flex flex-col items-center gap-4 py-12 px-6 rounded-[2.5rem] bg-white/[0.01] border border-white/5 text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-secondary mb-2">
                        <Info size={24} className="opacity-40" />
                    </div>
                    <p className="text-secondary text-sm max-w-lg leading-relaxed font-medium">
                        Les scores ci-dessus sont calculés selon le protocole de triage <span className="text-white">Docky Neural Evaluation</span>.
                        Chaque point représente une validation consciente lors d'un test aveugle.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Info({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}
