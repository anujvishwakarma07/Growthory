"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Rocket, Sparkles, AlertCircle, ArrowLeft, Zap, Target, ArrowRight, X, Trash2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function EditStartup() {
    const router = useRouter();
    const params = useParams();
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        description: '',
        industry: '',
        website: '',
        stage: 'Pre-seed'
    });
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
    if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);

    useEffect(() => {
        const fetchStartup = async () => {
            try {
                const token = auth.getToken();
                const res = await fetch(`${API_URL}/startups/${params.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Failed to fetch venture data");
                const data = await res.json();
                
                setFormData({
                    name: data.name || '',
                    tagline: data.tagline || '',
                    description: data.description_raw || '',
                    industry: data.industry || '',
                    website: data.website || '',
                    stage: data.stage || 'Pre-seed'
                });
                setExistingImages(data.image_urls || []);
                setLoading(false);
            } catch (err: any) {
                toast.error(err.message);
                router.push('/dashboard');
            }
        };
        fetchStartup();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...files].slice(0, 5 - existingImages.length));
        }
    };

    const removeExistingImage = (url: string) => {
        setExistingImages(prev => prev.filter(img => img !== url));
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = auth.getToken();
            const body = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => body.append(key, value));
            body.append('existing_images', JSON.stringify(existingImages));
            newImages.forEach(file => body.append('images', file));

            const res = await fetch(`${API_URL}/startups/${params.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update venture');

            toast.success('Venture Protocol Updated');
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to terminate this venture protocol? This cannot be undone.")) return;
        
        try {
            const token = auth.getToken();
            const res = await fetch(`${API_URL}/startups/${params.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete venture");
            toast.success("Venture Terminated");
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-[#3d522b] border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <button onClick={() => router.back()} className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                        <ArrowLeft className="h-5 w-5 text-slate-400" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-none mb-1">Modify Venture</h1>
                        <p className="text-[10px] font-black text-[#3d522b] uppercase tracking-[0.3em]">Protocol Adjustment</p>
                    </div>
                    <button onClick={handleDelete} className="h-12 w-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-red-500 shadow-sm">
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-12 space-y-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 olive-gradient opacity-10"></div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3d522b] mb-4 ml-1 flex items-center gap-2">
                                <Sparkles className="h-3 w-3" /> Updated Vision
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                className="w-full bg-white border-b border-slate-100 rounded-none p-0 py-2 text-slate-900 font-bold text-lg outline-none focus:border-[#3d522b] transition-all resize-none leading-relaxed"
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
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Market Tagline</label>
                                <input
                                    name="tagline"
                                    required
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
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all shadow-sm"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3d522b] mb-4 ml-1">Manage Media Asset</label>
                            
                            {/* Existing Images */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {existingImages.map((url, idx) => (
                                    <div key={idx} className="relative h-24 w-24 rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
                                        <img src={url} className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeExistingImage(url)}
                                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* New Uploads */}
                            <div className="space-y-4">
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 group-hover:border-[#3d522b]/30 transition-all">
                                        <Plus className="h-6 w-6 mb-2 text-slate-300" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attach more photos (Max 5 total)</p>
                                    </div>
                                </div>

                                {newImages.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {newImages.map((file, idx) => (
                                            <div key={idx} className="relative h-16 w-16 rounded-lg overflow-hidden border border-slate-200 group">
                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
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

                    <Button type="submit" disabled={saving} className="w-full py-6 rounded-[1.5rem] bg-[#3d522b] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#3d522b]/20" size="lg">
                        {saving ? 'Synchronizing...' : <><Save className="h-5 w-5 mr-3" /> Commit Changes</>}
                    </Button>
                </form>
            </div>
        </div>
    );
}
