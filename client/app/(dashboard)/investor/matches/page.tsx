"use client";
import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Rocket, Target, BarChart3, ArrowUpRight, Zap, Filter, Sparkles, SlidersHorizontal, ArrowLeft, Globe, MapPin, Building2, TrendingUp, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

interface StartupAnalysis {
    one_line_pitch: string;
    investor_appeal_score: number;
}

interface Startup {
    id: string;
    _id?: string;
    name: string;
    industry: string;
    stage: string;
    description_raw: string;
    startup_analysis?: StartupAnalysis[];
}

export default function InvestorMatches() {
    const [matches, setMatches] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const currentUser = auth.getUser();
                if (!currentUser) {
                    router.push('/login');
                    return;
                }

                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
                const token = auth.getToken();
                const res = await fetch(`${API_URL}/investors/${currentUser.id}/matches`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.matches) {
                    setMatches(data.matches);
                }
            } catch (err: any) {
                console.error(err);
                toast.error('Failed to analyze ecosystem signals');
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [router, toast]);

    if (loading) return (
        <div className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-center space-y-6">
            <div className="relative">
                <div className="h-20 w-20 rounded-3xl olive-gradient animate-pulse flex items-center justify-center shadow-2xl shadow-[#3d522b]/20">
                    <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 h-20 w-20 rounded-3xl border-4 border-[#3d522b] animate-ping opacity-20"></div>
            </div>
            <div className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Scanning High-Signal Nodes...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-6 selection:bg-[#3d522b]/20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#3d522b] text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
                            <Zap className="h-3 w-3" /> Real-time Matching
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tight mb-2 text-slate-900">Ecosystem Deal Flow</h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">Curated high-signal ventures matched with precision to your investment thesis vectors.</p>
                    </div>
                    <Link href="/investor/setup">
                        <Button className="bg-[#3d522b] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#3d522b]/20 group">
                            <SlidersHorizontal className="h-4 w-4 mr-3 group-hover:rotate-180 transition-transform duration-500" /> Shift Thesis
                        </Button>
                    </Link>
                </div>

                {matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {matches.map((startup) => (
                            <div key={startup._id} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#3d522b]/5 transition-all duration-500 group relative flex flex-col h-full border-b-4 border-b-[#3d522b]/0 hover:border-b-[#3d522b]">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-10">
                                    <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center group-hover:bg-[#3d522b] group-hover:border-[#3d522b] transition-all duration-500 shadow-sm">
                                        <Building2 className="h-8 w-8 text-[#3d522b] group-hover:text-white transition-colors" />
                                    </div>
                                    {startup.startup_analysis?.[0] && (
                                        <div className="olive-gradient px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] text-white shadow-lg shadow-[#3d522b]/20 italic flex items-center gap-2">
                                            <TrendingUp className="h-3 w-3 animate-pulse" />
                                            {startup.startup_analysis[0].investor_appeal_score}% MATCH
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight group-hover:text-[#3d522b] transition-colors">{startup.name}</h3>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg">{startup.industry}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-[#3d522b]/5 text-[#3d522b] rounded-lg">{startup.stage}</span>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3 italic">
                                        "{startup.startup_analysis?.[0]?.one_line_pitch || startup.description_raw}"
                                    </p>
                                </div>

                                {/* Action */}
                                <div className="pt-8 border-t border-slate-50 mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-[#3d522b] transition-colors">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">SF / Remote</span>
                                    </div>
                                    <button className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#3d522b] group-hover:text-white transition-all shadow-sm">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3.5rem] p-20 border border-slate-200 text-center shadow-sm">
                        <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <Search className="h-10 w-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-4">No Matches Detected</h2>
                        <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">We couldn't find any ventures that match your current investment thesis. Try expanding your parameters.</p>
                        <Link href="/investor/setup">
                            <Button className="bg-[#3d522b] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Adjust Thesis</Button>
                        </Link>
                    </div>
                )}

                {/* Footer Insight */}
                <div className="mt-20 p-10 bg-white rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3d522b]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 relative z-10 border border-slate-100">
                        <Sparkles className="h-8 w-8 text-[#3d522b]" />
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-1">Semantic Sourcing Active</h4>
                        <p className="text-slate-500 text-sm font-medium">Growthory AI is continuously monitoring the global startup landscape for matches to your specific deployment vectors.</p>
                    </div>
                    <div className="md:ml-auto relative z-10">
                        <div className="text-right">
                            <div className="text-2xl font-black text-[#3d522b] leading-none mb-1">12k+</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Scanned Today</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
