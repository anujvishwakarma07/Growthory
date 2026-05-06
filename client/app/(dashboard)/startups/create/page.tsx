"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Rocket, Sparkles, AlertCircle, ArrowLeft, CheckCircle2, Zap, Target, ArrowRight, X } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function CreateStartup() {
    const router = useRouter();
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        description: '',
        industry: '',
        website: '',
        stage: 'Pre-seed'
    });
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles].slice(0, 5));
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAnalyzing(true);
        setError(null);

        try {
            const currentUser = auth.getUser();
            if (!currentUser) throw new Error("You must be logged in");

            const token = auth.getToken();
            
            const body = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                body.append(key, value);
            });
            body.append('founder_id', currentUser.id);
            images.forEach(file => {
                body.append('images', file);
            });

            const response = await fetch(`${API_URL}/startups`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                body
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create startup');

            toast.success('Venture Initialized!');
            setAiResult(data.analysis);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Error processing request');
            setError(err.message);
            setLoading(false);
            setAnalyzing(false);
        }
    };

    if (aiResult) {
        return (
            <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-6 selection:bg-[#3d522b]/20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-6 mb-12">
                        <button onClick={() => router.push('/dashboard')} className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm group">
                            <ArrowLeft className="h-6 w-6 text-slate-400 group-hover:text-[#3d522b] transition-colors" />
                        </button>
                        <div>
                            <div className="text-[10px] font-black text-[#3d522b] uppercase tracking-[0.3em] mb-1">Intelligence Protocol</div>
                            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">Analysis Report</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Score Card */}
                        <div className="md:col-span-4 bg-[#3d522b] rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl shadow-[#3d522b]/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative mb-6">
                                <div className="text-7xl font-black text-white leading-none">
                                    {aiResult.investor_appeal_score}
                                </div>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Market Appeal</div>
                        </div>

                        {/* One Liner */}
                        <div className="md:col-span-8 bg-white rounded-[3rem] p-12 flex flex-col justify-center border border-slate-200 shadow-sm relative">
                            <div className="inline-flex items-center gap-2 text-[#3d522b] font-black text-[10px] uppercase tracking-widest mb-6">
                                <Sparkles className="h-4 w-4" /> Optimized Signal
                            </div>
                            <blockquote className="text-2xl font-bold leading-relaxed text-slate-800 italic">
                                "{aiResult.one_line_pitch}"
                            </blockquote>
                        </div>

                        {/* Strengths */}
                        <div className="md:col-span-6 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-10 text-slate-900 flex items-center gap-4">
                                <CheckCircle2 className="h-5 w-5 text-[#3d522b]" /> Critical Advantages
                            </h3>
                            <ul className="space-y-6">
                                {aiResult.strengths?.map((item: string, i: number) => (
                                    <li key={i} className="flex gap-4 items-start text-slate-600">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#3d522b] mt-2 flex-shrink-0 shadow-[0_0_8px_#3d522b]"></div>
                                        <span className="text-sm font-bold leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Suggestions */}
                        <div className="md:col-span-6 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-10 text-slate-900 flex items-center gap-4">
                                <Zap className="h-5 w-5 text-amber-500" /> Improvement Vector
                            </h3>
                            <ul className="space-y-6">
                                {aiResult.suggestions?.map((item: string, i: number) => (
                                    <li key={i} className="flex gap-4 items-start text-slate-600">
                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0 shadow-[0_0_8px_#f59e0b]"></div>
                                        <span className="text-sm font-bold leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <Button size="lg" className="rounded-2xl px-12 py-5 bg-[#3d522b] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#3d522b]/20" onClick={() => router.push('/dashboard')}>
                            Commit to Ecosystem <ArrowRight className="ml-3 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-6 selection:bg-[#3d522b]/20">
            <div className="max-w-2xl mx-auto">
                <div className="mb-16 text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-[#3d522b] mb-6 shadow-sm">
                        <Rocket className="h-7 w-7" />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-none mb-3">Register Venture</h1>
                    <p className="text-slate-500 font-medium">Initialize your startup node for global discovery.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-12 space-y-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 olive-gradient opacity-10"></div>

                    <div className="space-y-6">
                        {/* The 'Post' Content */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3d522b] mb-4 ml-1 flex items-center gap-2">
                                <Sparkles className="h-3 w-3" /> What is your venture's vision?
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                placeholder="Share your product's core mission and the problem you're solving..."
                                className="w-full bg-white border-b border-slate-100 rounded-none p-0 py-2 text-slate-900 font-bold text-lg outline-none focus:border-[#3d522b] transition-all resize-none leading-relaxed placeholder:text-slate-300"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Venture Name</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm"
                                    placeholder="Unicorn Lab Inc."
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Market Tagline</label>
                                <input
                                    name="tagline"
                                    required
                                    placeholder="Neural matching for capital"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm"
                                    value={formData.tagline}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Sector</label>
                                <input
                                    name="industry"
                                    required
                                    placeholder="Fintech"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm"
                                    value={formData.industry}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Stage</label>
                                <select
                                    name="stage"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm appearance-none"
                                    value={formData.stage}
                                    onChange={handleChange}
                                >
                                    <option>Pre-seed</option>
                                    <option>Seed</option>
                                    <option>Series A</option>
                                    <option>Series B+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Website</label>
                                <input
                                    name="website"
                                    placeholder="https://..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3d522b] mb-4 ml-1">Add Media Visuals (Protocol Images)</label>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`w-full border-2 border-dashed ${images.length > 0 ? 'border-[#3d522b] bg-[#3d522b]/5' : 'border-slate-200 bg-slate-50'} rounded-2xl p-6 flex flex-col items-center justify-center transition-all group-hover:border-[#3d522b]/30`}>
                                        <Rocket className={`h-6 w-6 mb-2 ${images.length > 0 ? 'text-[#3d522b]' : 'text-slate-300'}`} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attach up to 5 photos</p>
                                    </div>
                                </div>

                                {images.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {images.map((file, idx) => (
                                            <div key={idx} className="relative h-16 w-16 rounded-lg overflow-hidden border border-slate-200 group">
                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest p-5 rounded-[1.5rem] border border-red-100 flex items-center gap-4">
                            <AlertCircle className="h-5 w-5" /> {error}
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full py-6 rounded-[1.5rem] bg-[#3d522b] hover:bg-[#606c38] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#3d522b]/20 hover:scale-[1.02] active:scale-[0.98] transition-all" size="lg">
                        {analyzing ? (
                            <span className="flex items-center gap-3">
                                <Sparkles className="animate-spin h-5 w-5" /> Optimizing Signal...
                            </span>
                        ) : (
                            <span className="flex items-center gap-3">
                                <Rocket className="h-5 w-5" /> Initialize Venture
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

