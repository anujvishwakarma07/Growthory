"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Shield, Sparkles, ArrowRight, Target, DollarSign, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function InvestorSetup() {
    const router = useRouter();
    const toast = useToast();
    const [formData, setFormData] = useState({
        ticket_size_min: 10000,
        ticket_size_max: 500000,
        industries: '',
        stages: 'Seed',
        bio: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const currentUser = auth.getUser();
        if (!currentUser) {
            toast.error("You must be logged in");
            setError("You must be logged in");
            setLoading(false);
            return;
        }

        const industriesList = formData.industries.split(',').map(s => s.trim()).filter(s => s !== '');
        const stagesList = formData.stages.split(',').map(s => s.trim()).filter(s => s !== '');

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
        const token = auth.getToken();

        try {
            const userId = currentUser.id || currentUser._id;
            const response = await fetch(`${API_URL}/investors/${userId}/preferences`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    industries: industriesList,
                    stages: stagesList
                })
            });

            if (!response.ok) throw new Error('Failed to save preferences');

            toast.success('Preferences saved successfully!');
            router.push('/investor/matches');
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'An error occurred');
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-6 selection:bg-[#3d522b]/20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex h-16 w-16 bg-white border border-slate-200 rounded-2xl items-center justify-center mb-6 shadow-sm">
                        <Target className="h-8 w-8 text-[#3d522b]" />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-3 text-slate-900">Investment Thesis</h1>
                    <p className="text-slate-500 text-base font-medium">Define your deployment strategy and source precision deal flow.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[3.5rem] p-10 md:p-14 space-y-10 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 olive-gradient opacity-10"></div>

                    {/* Ticket Size Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <DollarSign className="h-5 w-5 text-[#3d522b]" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Check Size Range</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Minimum ($)</label>
                                <input
                                    type="number"
                                    value={formData.ticket_size_min}
                                    onChange={(e) => setFormData({ ...formData, ticket_size_min: Number(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm"
                                    placeholder="10000"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Maximum ($)</label>
                                <input
                                    type="number"
                                    value={formData.ticket_size_max}
                                    onChange={(e) => setFormData({ ...formData, ticket_size_max: Number(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm"
                                    placeholder="500000"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Industries */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Briefcase className="h-5 w-5 text-[#3d522b]" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Target Sectors</h3>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Industries (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.industries}
                                onChange={(e) => setFormData({ ...formData, industries: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm"
                                placeholder="AI/ML, Fintech, SaaS, Healthcare"
                                required
                            />
                        </div>
                    </div>

                    {/* Stages */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="h-5 w-5 text-[#3d522b]" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Preferred Stages</h3>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Stages (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.stages}
                                onChange={(e) => setFormData({ ...formData, stages: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm"
                                placeholder="Pre-seed, Seed, Series A"
                                required
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Investment Philosophy</h3>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Bio & Thesis</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={5}
                                className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm resize-none leading-relaxed"
                                placeholder="Describe your investment approach, what you look for in founders, and your value-add beyond capital..."
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest p-5 rounded-[1.5rem] border border-red-100 flex items-center gap-4">
                            <AlertCircle className="h-5 w-5" /> {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 rounded-[1.5rem] bg-[#3d522b] hover:bg-[#606c38] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#3d522b]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        size="lg"
                    >
                        {loading ? (
                            <span className="flex items-center gap-3">
                                <Sparkles className="animate-spin h-5 w-5" /> Saving Preferences...
                            </span>
                        ) : (
                            <span className="flex items-center gap-3">
                                Save & View Matches <ArrowRight className="h-5 w-5" />
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
