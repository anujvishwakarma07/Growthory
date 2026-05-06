"use client";
import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
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

    const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5000/api` : 'http://localhost:5000/api');

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
        setLoading(true);
        try {
            const token = auth.getToken();
            const res = await fetch(`${API_URL}/network/my-network/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to load connections");
            const data = await res.json();
            setConnections(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch connections error:", err);
            toast.error("Failed to load connections");
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingRequests = async (userId: string) => {
        setLoading(true);
        try {
            const token = auth.getToken();
            const res = await fetch(`${API_URL}/network/pending-requests/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to load pending requests");
            const data = await res.json();
            setPendingRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch pending requests error:", err);
            toast.error("Failed to load pending requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = auth.getUser();
            if (!currentUser) {
                router.push('/login');
                return;
            }
            setUser(currentUser);
            fetchPeople('', 'all', currentUser.id);
        };
        checkUser();
    }, [router]);

    useEffect(() => {
        if (!user) return;

        if (tab === 'discover') {
            fetchPeople(searchQuery, activeRole, user.id);
        } else if (tab === 'connections') {
            fetchConnections(user.id);
        } else if (tab === 'pending') {
            fetchPendingRequests(user.id);
        }
    }, [tab, user]);

    const handleConnect = async (targetId: string, role: string) => {
        if (!user) return;

        try {
            const token = auth.getToken();
            const res = await fetch(`${API_URL}/network/connect`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    source_id: user.id,
                    target_id: targetId,
                    match_type: role === 'founder' ? 'investor_startup' : 'user_connection'
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Signal connection request transmitted.");
                setPeople(prev => prev.map(p => (p.id === targetId || p._id === targetId) ? { ...p, pending: true } : p));
            } else {
                toast.error(data.error || "Failed to connect");
            }
        } catch (err) {
            toast.error("Network synchronization lost");
        }
    };

    const handleRespondToRequest = async (matchId: string, action: 'accept' | 'reject') => {
        try {
            const token = auth.getToken();
            const res = await fetch(`${API_URL}/network/respond/${matchId}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(action === 'accept' ? 'Connection accepted!' : 'Request rejected');
                if (user) fetchPendingRequests(user.id);
            } else {
                toast.error(data.error || "Failed to respond");
            }
        } catch (err) {
            toast.error("Failed to respond to request");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-28 pb-32 selection:bg-[#3d522b]/20">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Abstract Header Deck */}
                <div className="relative mb-16 bg-white rounded-[3rem] p-10 md:p-14 border border-[#3d522b]/10 overflow-hidden shadow-[0_20px_50px_rgba(61,82,43,0.03)]">
                    {/* Atmospheric Effects */}
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#3d522b]/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#3d522b]/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-12">
                        <div className="max-w-2xl text-center xl:text-left">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#3d522b]/5 border border-[#3d522b]/10 text-[#3d522b] text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                                <div className="h-2 w-2 rounded-full bg-[#3d522b] animate-ping"></div>
                                Live Intelligence Node
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.85] mb-8">
                                The <span className="text-[#3d522b]">Nexus</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-lg lg:text-xl leading-relaxed max-w-xl mx-auto xl:mx-0">
                                Global mapping of active ecosystem signals. Identify, query, and uplink with high-value assets securely.
                            </p>
                        </div>
                        
                        {/* Refined Search Area */}
                        <div className="w-full xl:w-[450px] bg-[#f8faf7] rounded-[2.5rem] p-8 border border-[#3d522b]/10 shadow-inner">
                            <div className="flex flex-col gap-6 relative z-10">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-[#3d522b]/40 group-focus-within:text-[#3d522b] transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search ecosystem nodes..."
                                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#3d522b]/30 focus:ring-4 focus:ring-[#3d522b]/5 transition-all shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); fetchPeople(e.target.value, activeRole); }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'all', label: 'All Nodes' },
                                        { id: 'founder', label: 'Founders' },
                                        { id: 'investor', label: 'Capital' },
                                        { id: 'professional', label: 'Talent' }
                                    ].map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => { setActiveRole(r.id); fetchPeople(searchQuery, r.id); }}
                                            className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRole === r.id ? 'bg-[#3d522b] text-white shadow-lg shadow-[#3d522b]/20' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#3d522b]/30 hover:text-[#3d522b]'}`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-navigation Deck */}
                <div className="flex justify-center mb-12">
                     <div className="inline-flex p-2 bg-white/50 backdrop-blur-md border border-slate-200/60 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative z-20">
                         {[
                            { id: 'discover', label: 'Global Radar' },
                            { id: 'connections', label: 'Active Uplinks' },
                            { id: 'pending', label: 'Intercepts' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`px-6 md:px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${tab === t.id ? 'bg-[#3d522b] text-white shadow-lg shadow-[#3d522b]/20 scale-100' : 'text-slate-400 hover:text-slate-900 hover:bg-white scale-95'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Data Render */}
                <div className="relative min-h-[500px]">
                    {loading ? (
                         <div className="flex flex-col items-center justify-center py-40">
                             <div className="relative h-32 w-32 mb-10">
                                <div className="absolute inset-0 border-[6px] border-[#3d522b]/10 rounded-full"></div>
                                <div className="absolute inset-0 border-[6px] border-[#3d522b] rounded-full border-t-transparent animate-[spin_1.5s_linear_infinite]"></div>
                                <div className="absolute inset-4 border-[4px] border-[#3d522b]/20 rounded-full border-b-transparent animate-[spin_2s_linear_infinite_reverse]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <NetworkIcon className="h-10 w-10 text-[#3d522b] opacity-80" />
                                </div>
                            </div>
                            <p className="text-xs font-mono text-[#3d522b] uppercase tracking-[0.4em] animate-pulse">Establishing Node Sync...</p>
                        </div>
                    ) : (
                        <>
                            {tab === 'discover' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {people.length > 0 ? people.map((person) => (
                                        <div key={person.id} className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-[#3d522b]/10 hover:border-[#3d522b]/30 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1">
                                            
                                            <div className="flex items-start justify-between mb-8">
                                                <div className="relative">
                                                     <div className="h-16 w-16 rounded-[1.2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-black text-slate-900 group-hover:bg-[#3d522b] group-hover:text-white group-hover:border-[#3d522b] transition-all duration-500">
                                                         {person.full_name?.[0].toUpperCase()}
                                                     </div>
                                                     {person.connected && (
                                                         <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
                                                            <Check className="h-3 w-3" />
                                                         </div>
                                                     )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-[8px] font-black uppercase tracking-[0.2em] rounded-lg">
                                                        {person.role}
                                                    </span>   
                                                </div>
                                            </div>

                                            <div className="flex-1 mb-8">
                                                <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-[#3d522b] transition-colors cursor-pointer" onClick={() => router.push(`/profile/${person.id}`)}>
                                                    {person.full_name}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-3">
                                                    "{person.details || 'Awaiting structural details regarding current operations.'}"
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-2">
                                                <Button
                                                    onClick={() => !person.connected && handleConnect(person.id, person.role)}
                                                    variant={person.connected ? 'outline' : person.pending ? 'outline' : 'primary'}
                                                    disabled={person.pending || person.connected}
                                                    className={`flex-grow rounded-xl h-11 text-[9px] font-black uppercase tracking-[0.2em] px-0 ${person.connected ? 'border-[#3d522b]/20 text-[#3d522b] bg-[#3d522b]/5' : person.pending ? 'border-amber-200 text-amber-600 bg-amber-50' : 'bg-[#3d522b] hover:bg-[#2d3f1f] text-white shadow-lg shadow-[#3d522b]/20'}`}
                                                >
                                                    {person.connected ? 'Uplink Established' : person.pending ? 'Signal Propagating...' : 'Connect'}
                                                </Button>
                                                <button 
                                                    onClick={() => router.push(`/profile/${person.id}`)}
                                                    className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-white hover:border-[#3d522b] hover:bg-[#3d522b] transition-all"
                                                >
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full bg-white rounded-[3rem] p-24 border border-slate-200 text-center shadow-sm max-w-4xl mx-auto w-full">
                                            <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                                <Globe className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-3">Void Sector</h2>
                                            <p className="text-slate-500 font-medium md:text-lg mb-10 max-w-md mx-auto">No nodes match your current surveillance parameters. Re-calibrate your radar.</p>
                                            <Button onClick={() => {setSearchQuery(''); setActiveRole('all'); fetchPeople('', 'all', user?.id)}} className="bg-[#3d522b] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[#10px]">Reset Parameters</Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Pending & Connections tabs */}
                             {(tab === 'pending' || tab === 'connections') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                                    {tab === 'pending' ? (
                                        pendingRequests.length > 0 ? pendingRequests.map((request) => (
                                            <div key={request.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 xl:p-8 flex flex-col xl:flex-row items-center justify-between gap-6 hover:shadow-xl hover:border-[#3d522b]/20 transition-all duration-300">
                                                <div className="flex items-center gap-5 text-center xl:text-left">
                                                    <div className="h-16 w-16 rounded-[1.2rem] bg-[#3d522b] shadow-md shadow-[#3d522b]/20 flex items-center justify-center flex-shrink-0">
                                                        <div className="text-2xl font-black text-white">
                                                            {request.from.full_name?.[0].toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="inline-flex items-center gap-2 mb-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></div>
                                                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">Incoming Handshake</span>
                                                        </div>
                                                        <h3 className="text-lg font-black text-slate-900 mb-1">{request.from.full_name}</h3>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{request.from.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-2 w-full xl:w-auto">
                                                     <Button
                                                        onClick={() => handleRespondToRequest(request.id, 'accept')}
                                                        className="flex-1 xl:flex-none bg-[#3d522b] text-white hover:bg-[#2d3d20] rounded-xl px-5 h-12 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#3d522b]/20"
                                                    >
                                                        Accept
                                                    </Button>
                                                    <button
                                                        onClick={() => handleRespondToRequest(request.id, 'reject')}
                                                        className="flex items-center justify-center h-12 w-12 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-slate-200 shadow-sm max-w-3xl mx-auto w-full">
                                                <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                                    <Zap className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Clear Skies</h3>
                                                <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto">No incoming handshake requests found in the network buffer.</p>
                                            </div>
                                        )
                                    ) : (
                                        connections.length > 0 ? connections.map((connection) => {
                                            const isSource = connection.source_id === user?.id;
                                            const targetId = isSource ? connection.target_id : connection.source_id;
                                            return (
                                            <div key={connection.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 xl:p-8 flex flex-col xl:flex-row items-center justify-between gap-6 hover:shadow-xl hover:border-[#3d522b]/20 transition-all duration-300">
                                                <div className="flex items-center gap-5 text-center xl:text-left">
                                                    <div className="h-16 w-16 rounded-[1.2rem] bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0">
                                                        <NetworkIcon className="h-6 w-6 text-[#3d522b]" />
                                                    </div>
                                                    <div>
                                                        <div className="inline-flex items-center gap-2 mb-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-[#3d522b]"></div>
                                                            <span className="text-[9px] font-black text-[#3d522b] uppercase tracking-[0.2em]">Active Uplink</span>
                                                        </div>
                                                        <h3 className="text-lg font-black text-slate-900 mb-1">Secured Node</h3>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                                           EST: {new Date(connection.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-full xl:w-auto">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full xl:w-auto border-slate-200 text-slate-700 hover:text-white hover:border-[#3d522b] hover:bg-[#3d522b] rounded-xl px-8 h-12 text-[10px] font-black uppercase tracking-widest transition-all"
                                                        onClick={() => router.push(`/profile/${targetId}`)}
                                                    >
                                                        Access Node
                                                    </Button>
                                                </div>
                                            </div>
                                        )}) : (
                                            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-slate-200 shadow-sm max-w-3xl mx-auto w-full">
                                                <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                                    <Users className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Network Isolated</h3>
                                                <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto">Initialize connections in the Global Radar to construct your ecosystem.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                             )}

                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
