"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, API_URL } from '@/lib/auth';
import { Trash2, ExternalLink, ShieldAlert, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';

export default function AdminPage() {
    const [startups, setStartups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        const currentUser = auth.getUser();
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        setUser(currentUser);
        fetchStartups();
    }, [router]);

    const fetchStartups = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/startups`);
            const data = await res.json();
            setStartups(data);
        } catch (error) {
            showToast('Failed to load startups', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`${API_URL}/startups/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            if (res.ok) {
                showToast('Startup deleted successfully', 'success');
                setStartups(startups.filter(s => s._id !== id));
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to delete startup', 'error');
            }
        } catch (error) {
            showToast('An error occurred during deletion', 'error');
        }
    };

    const filteredStartups = startups.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.industry?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-red-500" />
                        Admin Command Center
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage all platform startups and maintain ecosystem integrity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={fetchStartups} 
                        variant="secondary" 
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Sync Data
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Startups</p>
                    <p className="text-4xl font-black text-[#3d522b]">{startups.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Sectors</p>
                    <p className="text-4xl font-black text-[#3d522b]">{new Set(startups.map(s => s.industry)).size}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Admin Access</p>
                    <p className="text-lg font-black text-red-500 uppercase">Super Admin Mode</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search startups by name or industry..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3d522b] font-bold text-slate-700 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Startup List */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Startup</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Industry</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Stage</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Founder</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredStartups.length > 0 ? (
                                filteredStartups.map((startup) => (
                                    <tr key={startup._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                {startup.image_urls?.[0] ? (
                                                    <img src={startup.image_urls[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                        <Rocket className="h-5 w-5 text-slate-300" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-black text-slate-900">{startup.name}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{startup.tagline}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                {startup.industry || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-slate-600 uppercase">
                                                {startup.stage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-[#3d522b]/10 flex items-center justify-center text-[#3d522b] text-[10px] font-black">
                                                    {startup.founder?.full_name?.[0] || 'U'}
                                                </div>
                                                <span className="text-xs font-medium text-slate-600">{startup.founder?.full_name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => window.open(`/startups/${startup._id}`, '_blank')}
                                                    className="p-2 text-slate-400 hover:text-[#3d522b] hover:bg-[#3d522b]/5 rounded-lg transition-all"
                                                    title="View Startup"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(startup._id, startup.name)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Startup"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <AlertTriangle className="h-10 w-10 text-slate-200" />
                                            <p className="text-slate-400 font-bold">No startups found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
