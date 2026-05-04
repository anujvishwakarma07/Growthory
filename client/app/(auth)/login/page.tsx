"use client";
import React, { useState } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { LogIn, Mail, Lock, Rocket, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function Login() {
    const router = useRouter();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await auth.login(email, password);
            toast.success('Authentication successful!');
            router.push('/dashboard');
        } catch (err: any) {
            const message = err.message || 'Login failed';
            toast.error(message);
            setError(message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center p-6 selection:bg-[#3d522b]/20">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex h-14 w-14 items-center justify-center rounded-2xl olive-gradient text-white mb-6 shadow-xl shadow-[#3d522b]/20">
                        <Rocket className="h-7 w-7" />
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Authenticate</h1>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Secure Node Access</p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Signal Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#3d522b] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-sm"
                                    placeholder="john@growthory.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Access Protocol</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#3d522b] transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
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
                            {loading ? 'Decrypting...' : 'Establish Connection'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            New Node? {' '}
                            <Link href="/signup" className="text-[#3d522b] hover:opacity-70 transition-opacity">
                                Initialize Identity
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

