"use client";
import React, { useState } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Rocket, Target, Briefcase, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function Signup() {
    const router = useRouter();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'founder' | 'investor' | 'professional'>('founder');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await auth.signup(email, password, fullName, role);
            toast.success('Identity Initialized! Establishment successful.');
            router.push('/dashboard');
        } catch (err: any) {
            const message = err.message || 'Signup failed';
            toast.error(message);
            setError(message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center p-6 selection:bg-[#3d522b]/20">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex h-14 w-14 items-center justify-center rounded-2xl olive-gradient text-white mb-6 shadow-xl shadow-[#3d522b]/20">
                        <UserPlus className="h-7 w-7" />
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Initialize Identity</h1>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Join the Global Venture Ecosystem</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-200">
                    <form onSubmit={handleSignup} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Full Identity</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-sm"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Signal Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-sm"
                                    placeholder="john@growthory.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Access Protocol (Password)</label>
                            <input
                                type="password"
                                required
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 text-center font-bold">Protocol Role</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { id: 'founder', label: 'Founder', icon: Rocket },
                                    { id: 'investor', label: 'Investor', icon: Target },
                                    { id: 'professional', label: 'Expert', icon: Briefcase }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setRole(item.id as any)}
                                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all relative overflow-hidden group ${role === item.id
                                            ? `bg-[#3d522b]/5 border-[#3d522b] text-[#3d522b] shadow-sm`
                                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                                            }`}
                                    >
                                        <item.icon className={`h-6 w-6 mb-3 transition-colors ${role === item.id ? `text-[#3d522b]` : 'group-hover:text-slate-500'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                        {role === item.id && (
                                            <div className="absolute top-3 right-3">
                                                <CheckCircle2 className="h-4 w-4 text-[#3d522b]" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl flex items-center gap-3 border border-red-100">
                                <AlertCircle className="h-4 w-4" /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#3d522b] hover:bg-[#606c38] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-[#3d522b]/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Synchronizing...' : 'Initialize Identity'}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            Existing Identity? {' '}
                            <Link href="/login" className="text-[#3d522b] hover:opacity-70 transition-opacity">
                                Authenticate
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

