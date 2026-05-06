"use client";
import React, { useEffect, useState } from 'react';
import { auth, API_URL } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import {
    Search,
    Users,
    UserPlus,
    Globe,
    Filter,
    ArrowUpRight,
    Briefcase,
    Zap,
    TrendingUp,
    ShieldCheck,
    MapPin,
    Network as NetworkIcon,
    Loader2,
    Check,
    X
} from 'lucide-react';

export default function NetworkPage() {
    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<any>(null);
    const [people, setPeople] = useState<any[]>([]);
    const [connections, setConnections] = useState<any[]>([]);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeRole, setActiveRole] = useState('all');
    const [tab, setTab] = useState('discover'); // discover, connections, pending

    const fetchPeople = async (query = '', role = 'all', userId = user?.id) => {
        setLoading(true);
        try {
            const token = auth.getToken();
            const headers: any = { 'Authorization': `Bearer ${token}` };

            let url = `${API_URL}/network/explore?role=${role === 'all' ? '' : role}&searchQuery=${query}`;
            if (userId) url += `&currentUserId=${userId}`;
            
            const res = await fetch(url, { headers });
            if (!res.ok) throw new Error("Failed to fetch nodes");
            const data = await res.json();
            setPeople(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Fetch network error:", err);
            toast.error(err.message || "Failed to sync with ecosystem nodes");
        } finally {
            setLoading(false);
        }
    };

    const fetchConnections = async (userId: string) => {
        try {
            const token = auth.getToken();
            const res = await fetch(`${API_URL}/network/connections?userId=${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setConnections(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPending = async (userId: string) => {
        try {
            const token = auth.getToken();
            const res = await fetch(`${API_URL}/network/pending?userId=${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPendingRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const currentUser = auth.getUser();
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        fetchPeople('', 'all', currentUser.id);
        fetchConnections(currentUser.id);
        fetchPending(currentUser.id);
    }, [router]);

    const handleConnect = async (targetId: string) => {
        try {
            const token = auth.getToken();
            const res = await fetch(`${API_URL}/network/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    requesterId: user.id,
                    recipientId: targetId
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            toast.success("Connection request initiated");
            setPeople(prev => prev.map(p => p._id === targetId ? { ...p, status: 'pending' } : p));
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleAccept = async (requestId: string) => {
        try {
            const token = auth.getToken();
            const res = await fetch(`${API_URL}/network/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    requestId,
                    status: 'accepted'
                })
            });
            if (!res.ok) throw new Error("Failed to accept");
            
            toast.success("Connection secured");
            setPendingRequests(prev => prev.filter(r => r._id !== requestId));
            fetchConnections(user.id);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPeople(searchQuery, activeRole);
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'accepted': return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
            case 'pending': return <Zap className="h-4 w-4 text-amber-500 animate-pulse" />;
            default: return <UserPlus className="h-4 w-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pb-20 pt-32">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="text-[10px] font-black text-[#3d522b] uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                            <Globe className="h-3 w-3" /> Node Discovery Protocol
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">The Network</h1>
                    </div>
                    
                    <div className="flex bg-white rounded-2xl p-1 border border-slate-200 shadow-sm">
                        {['discover', 'connections', 'pending'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    tab === t ? 'bg-[#3d522b] text-white shadow-lg shadow-[#3d522b]/20' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {t} {t === 'pending' && pendingRequests.length > 0 && (
                                    <span className="ml-2 bg-red-500 text-white rounded-full h-4 w-4 inline-flex items-center justify-center text-[8px]">
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {tab === 'discover' && (
                    <>
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-8">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                                <div className="flex-grow relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                    <input
                                        type="text"
                                        placeholder="Search by mission, tech stack, or name..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-14 font-bold outline-none focus:bg-white focus:border-[#3d522b] transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <select 
                                        className="bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold outline-none cursor-pointer"
                                        value={activeRole}
                                        onChange={(e) => setActiveRole(e.target.value)}
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="founder">Founders</option>
                                        <option value="investor">Investors</option>
                                        <option value="professional">Professionals</option>
                                    </select>
                                    <Button type="submit" className="rounded-2xl px-8 bg-[#3d522b]">Search Node</Button>
                                </div>
                            </form>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-10 w-10 text-[#3d522b] animate-spin mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Scanning Ecosystem...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {people.length > 0 ? people.map((p) => (
                                    <div key={p._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-[#3d522b]/30 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#3d522b]/5 rounded-bl-[100px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        <div className="flex items-start gap-4 mb-6 relative z-10">
                                            <div className="h-16 w-16 rounded-2xl bg-[#3d522b]/5 border border-[#3d522b]/10 flex items-center justify-center text-xl font-black text-[#3d522b]">
                                                {p.avatar_url ? <img src={p.avatar_url} className="h-full w-full object-cover rounded-2xl" /> : p.full_name?.[0]}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-slate-900 group-hover:text-[#3d522b] transition-colors">{p.full_name}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#3d522b] mt-1">{p.role}</p>
                                                <div className="flex items-center gap-1 text-slate-400 mt-2">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold">{p.location || 'Ecosystem Node'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6 italic">
                                            "{p.bio || 'Building the future in stealth mode.'}"
                                        </p>

                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100"></div>
                                                ))}
                                                <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-400">+12</div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => p.status === 'none' && handleConnect(p._id)}
                                                disabled={p.status !== 'none'}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    p.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 
                                                    p.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-slate-900 text-white hover:bg-[#3d522b] shadow-lg shadow-slate-900/10'
                                                }`}
                                            >
                                                {getStatusIcon(p.status)}
                                                {p.status === 'none' ? 'Connect' : p.status}
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200">
                                        <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching nodes found in this sector</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {tab === 'connections' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {connections.length > 0 ? connections.map((c) => {
                            const person = c.requester._id === user.id ? c.recipient : c.requester;
                            return (
                                <div key={c._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-[#3d522b]/5 flex items-center justify-center font-black text-[#3d522b]">
                                        {person.avatar_url ? <img src={person.avatar_url} className="h-full w-full object-cover rounded-xl" /> : person.full_name?.[0]}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-sm text-slate-900">{person.full_name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#3d522b]">{person.role}</p>
                                    </div>
                                    <button onClick={() => router.push(`/profile/${person._id}`)} className="p-2 rounded-lg hover:bg-slate-50">
                                        <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                    </button>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active node connections</p>
                            </div>
                        )}
                    </div>
                )}

                {tab === 'pending' && (
                    <div className="max-w-2xl mx-auto space-y-4">
                        {pendingRequests.length > 0 ? pendingRequests.map((r) => (
                            <div key={r._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                        {r.requester.full_name?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900">{r.requester.full_name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#3d522b]">{r.requester.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleAccept(r._id)}
                                        className="p-2 bg-[#3d522b] text-white rounded-lg hover:opacity-90"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No pending requests</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
