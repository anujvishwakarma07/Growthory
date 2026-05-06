"use client";
import React, { useEffect, useState } from 'react';
import { auth, API_URL } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useToast } from '@/components/ui/ToastProvider';
import {
    Plus,
    Search,
    Briefcase,
    Zap,
    User,
    ArrowUpRight,
    BarChart3,
    Globe,
    Home,
    Users,
    Bell,
    MessageCircle,
    Settings,
    MoreHorizontal,
    Share2,
    Bookmark,
    Sparkles,
    Building2,
    TrendingUp,
    Rocket,
    Target,
    Activity,
    Edit3,
    ExternalLink,
    Trash
} from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<any>(null);
    const [startups, setStartups] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [myProfile, setMyProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [likesModal, setLikesModal] = useState<string | null>(null);
    const [likesData, setLikesData] = useState<any[]>([]);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Lock body scroll on dashboard mount, restore on unmount
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        return () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = auth.getUser();
            if (!currentUser) {
                router.push('/login');
                return;
            }
            setUser(currentUser);

            const token = auth.getToken();

            try {
                // Fetch Stats
                const statsRes = await fetch(`${API_URL}/system/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                // Fetch All Startups for the Feed
                const res = await fetch(`${API_URL}/startups`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Failed to fetch startups");
                const allStartups = await res.json();

                const startupsArray = Array.isArray(allStartups) ? allStartups : [];
                setStartups(startupsArray);

                const role = currentUser.role || 'founder';
                if (role === 'founder') {
                    const myCol = startupsArray.find((s: any) => s.founder_id === currentUser.id);
                    setMyProfile(myCol);
                }
            } catch (err: any) {
                console.error("Dashboard feed fetch error:", err);
                toast.error(err.message || "Failed to sync with ecosystem nodes");
                setStartups([]);
            }

            setLoading(false);
        };
        checkUser();
    }, [router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf7]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d522b]"></div>
        </div>
    );

    const role = user?.role || 'founder';
    const fullName = user?.full_name || user?.email?.split('@')[0];

    return (
        <>
            <div style={{position: 'fixed', top: '80px', left: 0, right: 0, bottom: 0, background: '#f8faf7', display: 'flex', justifyContent: 'center', zIndex: 1}}>
                <div style={{width: '100%', maxWidth: '1280px', display: 'flex', gap: '1.5rem', padding: '0 1.5rem', height: '100%'}}>

                    {/* Left Sidebar: FIXED in place, never scrolls */}
                    <div style={{width: '260px', flexShrink: 0, paddingTop: '1rem', paddingBottom: '1rem', overflowY: 'auto', scrollbarWidth: 'none'}} className="hidden lg:block">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                        <div className="h-16 olive-gradient w-full"></div>
                        <div className="px-5 pb-6">
                            <div className="relative -mt-10 mb-4 inline-block">
                                <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-md">
                                    <div className="h-full w-full rounded-lg bg-[#3d522b]/5 flex items-center justify-center text-2xl font-black text-[#3d522b] border border-[#3d522b]/10">
                                        {fullName?.[0].toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{role} @ Growthory</p>

                            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors" onClick={() => router.push('/network')}>
                                    <span className="text-slate-500">Node Connections</span>
                                    <span className="text-[#3d522b]">1,240</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-500">Signal Strength</span>
                                    <span className="text-[#3d522b]">94%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Discovery</h3>
                        <nav className="space-y-1">
                            {[
                                { name: 'Network Map', icon: Globe, href: '/network' },
                                { name: 'Direct Matches', icon: Zap, href: role === 'investor' ? '/investor/matches' : '/network' },
                                { name: 'Professional Hub', icon: Briefcase, href: '/network' },
                                { name: 'Analytics Pulse', icon: BarChart3, href: '/analytics' },
                            ].map((item, i) => (
                                <Link key={i} href={item.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                    <item.icon className="h-4 w-4 text-slate-400 group-hover:text-[#3d522b] transition-colors" />
                                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                    </div>

                    {/* Center Content: THE ONLY SCROLLABLE AREA */}
                    <div style={{flex: 1, overflowY: 'auto', paddingTop: '1rem', paddingBottom: '5rem'}} className="space-y-6">
                    {/* Live Ecosystem Pulse Bar */}
                    {stats && (
                        <div className="bg-[#3d522b] rounded-xl shadow-xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#606c38]/40 to-transparent pointer-events-none"></div>
                            <div className="flex items-center justify-between px-6 py-4 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-2 bg-[#8a9a5b] rounded-full animate-pulse shadow-[0_0_10px_#8a9a5b]"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Live Ecosystem Signal</span>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <div className="text-xs font-black text-white">{stats.totalStartups}</div>
                                        <div className="text-[8px] font-bold text-[#8a9a5b] uppercase">Ventures</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-black text-white">{stats.signalsToday}</div>
                                        <div className="text-[8px] font-bold text-[#8a9a5b] uppercase">24h Signal</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-black text-white">{stats.totalInvestors}</div>
                                        <div className="text-[8px] font-bold text-[#8a9a5b] uppercase">Capital</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create Action Box */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex gap-4 mb-4">
                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-lg font-bold text-[#3d522b]">
                                {fullName?.[0]}
                            </div>
                            <button
                                onClick={() => router.push(role === 'founder' ? '/startups/create' : role === 'investor' ? '/investor/setup' : '/profile')}
                                className="flex-grow bg-slate-50 hover:bg-slate-100 text-left border border-slate-200 rounded-full px-5 text-sm font-medium text-slate-500 transition-colors"
                            >
                                {role === 'founder' ? 'Register a new venture...' : role === 'investor' ? 'Define your investment thesis...' : 'Update your career vector...'}
                            </button>
                        </div>
                        <div className="flex justify-around pt-2">
                            <button onClick={() => router.push(role === 'founder' ? '/startups/create' : '/network')} className="flex items-center justify-center gap-2 p-2 px-4 rounded-lg hover:bg-slate-50 transition-colors">
                                <Rocket className="h-4 w-4 text-[#3d522b]" />
                                <span className="text-sm font-bold text-slate-600">Startup</span>
                            </button>
                            <button onClick={() => router.push('/analytics')} className="flex items-center justify-center gap-2 p-2 px-4 rounded-lg hover:bg-slate-50 transition-colors">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-bold text-slate-600">Analysis</span>
                            </button>
                            <button onClick={() => router.push(role === 'investor' ? '/investor/matches' : '/network')} className="flex items-center justify-center gap-2 p-2 px-4 rounded-lg hover:bg-slate-50 transition-colors">
                                <Target className="h-4 w-4 text-[#3d522b]" />
                                <span className="text-sm font-bold text-slate-600">Match</span>
                            </button>
                        </div>
                    </div>

                    {/* Feed Sorter */}
                    <div className="flex items-center gap-2 px-2">
                        <div className="h-px flex-grow bg-slate-200"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            Sort by: <span className="text-slate-900 cursor-pointer">Semantic Signal</span>
                        </span>
                    </div>

                    {/* Startup Cards (Feed) */}
                    <div className="space-y-4">
                        {startups.length > 0 ? startups.map((s) => (
                            <div key={s._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transform transition-all hover:border-slate-300 group">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-[#3d522b]/5 border border-[#3d522b]/10 flex items-center justify-center text-[#3d522b]">
                                                {s.logo_url ? <img src={s.logo_url} alt={s.name} className="h-full w-full object-contain rounded-lg" /> : <Building2 className="h-6 w-6" />}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#3d522b] transition-colors">{s.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/profile/${s.founder_id}`} className="text-[10px] font-black uppercase tracking-widest text-[#3d522b] hover:underline">
                                                        {s.founder?.full_name || 'Ecosystem Founder'}
                                                    </Link>
                                                    <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.tagline || 'Stealth Venture'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <button 
                                                onClick={() => setActiveMenu(activeMenu === s._id ? null : s._id)}
                                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-all"
                                            >
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                            
                                            {activeMenu === s._id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                                    {(s.founder_id === user?.id) && (
                                                        <button 
                                                            onClick={() => router.push(`/startups/${s._id}/edit`)}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-[#3d522b] transition-all"
                                                        >
                                                            <Edit3 className="h-4 w-4" /> Edit Protocol
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(`${window.location.origin}/profile/${s.founder_id}`);
                                                            toast.success("Signal link copied to clipboard");
                                                            setActiveMenu(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                                                    >
                                                        <Share2 className="h-4 w-4" /> Share Signal
                                                    </button>
                                                    <button 
                                                        onClick={() => setActiveMenu(null)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border-t border-slate-50"
                                                    >
                                                        <X className="h-4 w-4" /> Close
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3 italic">
                                        "{s.description_raw}"
                                    </p>

                                    {/* Image Gallery */}
                                    {((s.image_urls && s.image_urls.length > 0) || s.image_url) && (
                                        <div className="mb-6 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                            <div className={`grid gap-1 ${
                                                (s.image_urls?.length || (s.image_url ? 1 : 0)) > 1 ? 'grid-cols-2' : 'grid-cols-1'
                                            }`}>
                                                {(s.image_urls && s.image_urls.length > 0 ? s.image_urls : [s.image_url]).slice(0, 4).map((img: string, idx: number) => (
                                                    <div key={idx} className="relative aspect-video bg-slate-50">
                                                        <img 
                                                            src={img} 
                                                            alt={`${s.name} asset`} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-3 py-1 bg-[#3d522b]/10 text-[#3d522b] rounded-full text-[10px] font-black uppercase tracking-widest">{s.industry}</span>
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">{s.stage}</span>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={async () => {
                                                        const res = await fetch(`${API_URL}/startups/toggle-like`, {
                                                            method: 'POST',
                                                            headers: { 
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${auth.getToken()}`
                                                            },
                                                            body: JSON.stringify({ startup_id: s._id, user_id: user.id })
                                                        });
                                                        const data = await res.json();
                                                        setStartups(prev => prev.map(item => item._id === s._id ? { ...item, like_count: data.liked ? item.like_count + 1 : item.like_count - 1, liked: data.liked } : item));
                                                    }}
                                                    className={`flex items-center gap-2 transition-colors ${s.liked ? 'text-[#3d522b]' : 'text-slate-500 hover:text-[#3d522b]'}`}
                                                >
                                                    <TrendingUp className={`h-4 w-4 ${s.liked ? 'fill-current' : ''}`} />
                                                    <span className="text-xs font-bold uppercase tracking-widest">{s.like_count} Signals</span>
                                                </button>
                                            </div>
                                            <button onClick={() => toast.info("Insights section deploying in V2.1")} className="flex items-center gap-2 text-slate-500 hover:text-[#3d522b] transition-colors">
                                                <MessageCircle className="h-4 w-4" />
                                                <span className="text-xs font-bold uppercase tracking-widest">{s.comment_count || 0} Insights</span>
                                            </button>
                                        </div>
                                        <button className="text-slate-400 hover:text-amber-500"><Bookmark className="h-5 w-5" /></button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                                <Globe className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No Ventures Found</h3>
                                <p className="text-slate-500 mb-6">Be the first to register a startup in your network.</p>
                                <Button onClick={() => router.push('/startups/create')} variant="primary" className="rounded-full px-8 bg-[#3d522b]">Register Venture</Button>
                            </div>
                        )}
                    </div>
                    </div>

                    {/* Right Sidebar: FIXED in place, never scrolls */}
                    <div style={{width: '260px', flexShrink: 0, paddingTop: '1rem', paddingBottom: '1rem'}} className="hidden lg:block">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#3d522b]">Sector Signals</h3>
                            <Activity className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: 'Photonic AI', stats: '3 Active Rounds', trend: '+12%' },
                                { title: 'Cellular Ag', stats: 'Seed Phase', trend: '+5%' },
                                { title: 'Space Logistics', stats: 'Series A', trend: '+24%' },
                            ].map((trend, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-black text-slate-800 group-hover:text-[#3d522b] transition-colors">#{trend.title.replace(' ', '')}</span>
                                        <TrendingUp className="h-3 w-3 text-[#3d522b]" />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>{trend.stats}</span>
                                        <span className="text-green-600">{trend.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>

                </div>
            </div>
        </>
    );
}
