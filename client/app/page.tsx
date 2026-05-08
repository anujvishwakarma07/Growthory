"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Rocket, TrendingUp, Users, Zap, ArrowRight, Shield, Globe, Sparkles, Building2, Target } from 'lucide-react';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        if (auth.getUser()) {
            router.push('/dashboard');
        }
    }, [router]);
    return (
        <div className="bg-[#f8faf7] min-h-screen text-slate-900 font-sans selection:bg-[#3d522b]/20">
            {/* Hero Section */}
            <section className="relative pt-40 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                    <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] bg-[#3d522b]/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-[#3d522b] text-[10px] font-black uppercase tracking-[0.2em] mb-12 shadow-sm animate-slide-up">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3d522b] animate-pulse"></span>
                        V2.0 Semantic Growth Engine
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tightest mb-8 leading-[0.85] text-slate-900 uppercase">
                        Unified <br />
                        <span className="text-[#3d522b]">Ecosystem.</span>
                    </h1>

                    <p className="mt-8 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
                        Growthory consolidates founders, investors, and experts into a single, high-fidelity semantic network. Stop searching. <span className="text-[#3d522b] font-bold underline decoration-2 underline-offset-4">Start Scaling.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/signup">
                            <button className="px-10 py-5 bg-[#3d522b] hover:bg-[#606c38] text-white rounded-2xl text-lg font-black uppercase tracking-widest transition-all shadow-xl shadow-[#3d522b]/20 hover:scale-[1.02] active:scale-[0.98]">
                                Initialize Node
                            </button>
                        </Link>
                        <Link href="/features">
                            <button className="px-10 py-5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl text-lg font-black uppercase tracking-widest transition-all shadow-sm">
                                Explore Capability
                            </button>
                        </Link>
                    </div>

                    {/* Trust Bar */}
                    <div className="mt-32 pt-20 border-t border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10 text-center">Powering the Next-Gen Global Ventures</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                            {/* Placeholder Logos as elegant text */}
                            <span className="text-2xl font-black italic tracking-tighter">FINTECH.</span>
                            <span className="text-2xl font-black italic tracking-tighter">SAAS_CORE.</span>
                            <span className="text-2xl font-black italic tracking-tighter">ROBOTICS AI.</span>
                            <span className="text-2xl font-black italic tracking-tighter">HEALTH.MODERN.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* LinkedIn-Style Clean Feature Section */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-6 group">
                            <div className="h-14 w-14 bg-[#3d522b]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#3d522b] transition-all duration-500 shadow-sm border border-slate-100">
                                <Building2 className="h-6 w-6 text-[#3d522b] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Venture Indexing</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">Register your startup once. Our AI creates a highly-indexed profile that reaches the right LPs and Talent instantly.</p>
                        </div>

                        <div className="space-y-6 group">
                            <div className="h-14 w-14 bg-[#3d522b]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#3d522b] transition-all duration-500 shadow-sm border border-slate-100">
                                <Target className="h-6 w-6 text-[#3d522b] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Capital Matching</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">Sophisticated vector search ensures investors only see deals that match their thesis, reducing noise to zero.</p>
                        </div>

                        <div className="space-y-6 group">
                            <div className="h-14 w-14 bg-[#3d522b]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#3d522b] transition-all duration-500 shadow-sm border border-slate-100">
                                <Sparkles className="h-6 w-6 text-[#3d522b] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">AI Intelligence</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">Get real-time feedback on your pitch, market trends, and competitive analysis powered by GPT-4 and custom models.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 olive-gradient opacity-5"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-8 uppercase">Ready to enter the ecosystem?</h2>
                    <p className="text-lg text-slate-500 mb-12 font-medium">Join 5,000+ nodes already building the future on Growthory.</p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-[#3d522b] text-white px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#3d522b]/30">Create Free Identity</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

