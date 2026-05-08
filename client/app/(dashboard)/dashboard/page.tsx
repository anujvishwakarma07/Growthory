"use client";
import React, { useEffect, useState } from 'react';
import { auth, API_URL } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
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
    Trash,
    X,
    MapPin
} from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const toast = useToast();
    const [user, setUser] = useState<any>(null);
    const [startups, setStartups] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [myProfile, setMyProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [connectionCount, setConnectionCount] = useState(0);
    const [likesModal, setLikesModal] = useState<string | null>(null);
    const [likesData, setLikesData] = useState<any[]>([]);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [activeInsights, setActiveInsights] = useState<string | null>(null);
    const [commentsData, setCommentsData] = useState<Record<string, any[]>>({});
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const toggleExpand = (id: string) => {
        setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const fetchComments = async (startupId: string) => {
        try {
            const res = await fetch(`${API_URL}/startups/${startupId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setCommentsData(prev => ({ ...prev, [startupId]: data }));
            }
        } catch (err) {
            console.error("Fetch comments error:", err);
        }
    };

    const handleAddComment = async (startupId: string) => {
        if (!commentText.trim() || isSubmittingComment) return;

        setIsSubmittingComment(true);
        try {
            const res = await fetch(`${API_URL}/startups/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: JSON.stringify({
                    startup_id: startupId,
                    user_id: user.id,
                    content: commentText
                })
            });

            if (res.ok) {
                const newComment = await res.json();
                setCommentsData(prev => ({
                    ...prev,
                    [startupId]: [newComment, ...(prev[startupId] || [])]
                }));
                setCommentText("");
                // Update local startup count
                setStartups(prev => prev.map(s => s._id === startupId ? { ...s, comment_count: (s.comment_count || 0) + 1 } : s));
            }
        } catch (err) {
            console.error("Add comment error:", err);
            toast.error("Failed to post insight");
        } finally {
            setIsSubmittingComment(false);
        }
    };

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

            // Fresh sync
            try {
                const freshUser = await auth.getMe();
                if (freshUser) {
                    localStorage.setItem('growthory_user', JSON.stringify(freshUser));
                    setUser(freshUser);
                } else {
                    setUser(currentUser);
                }
            } catch (e) {
                setUser(currentUser);
            }

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

                // Fetch connection count
                const connectionsRes = await fetch(`${API_URL}/network/my-network/${currentUser.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (connectionsRes.ok) {
                    const connectionsData = await connectionsRes.json();
                    setConnectionCount(connectionsData.length);
                }
            } catch (err: any) {
                console.error("Dashboard feed fetch error:", err);
                toast.error(err.message || "Failed to sync with ecosystem nodes");
                setStartups([]);
            }

            // Role-based redirection
            if (currentUser.role === 'professional' && pathname === '/dashboard') {
                router.push('/professional');
                return;
            }
            if (currentUser.role === 'investor' && pathname === '/dashboard') {
                router.push('/investor/matches'); 
                return;
            }

            setLoading(false);
        };
        checkUser();
    }, [router, pathname]);

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
                        <div className="h-16 w-full relative overflow-hidden">
                            {user?.banner_url ? (
                                <img src={user.banner_url} className="w-full h-full object-cover" alt="Banner" />
                            ) : (
                                <div className="h-full w-full olive-gradient"></div>
                            )}
                        </div>
                        <div className="px-5 pb-6">
                            <div className="relative -mt-10 mb-4 inline-block">
                                <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-md overflow-hidden">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} className="h-full w-full rounded-lg object-cover" alt="Avatar" />
                                    ) : (
                                        <div className="h-full w-full rounded-lg bg-[#3d522b]/5 flex items-center justify-center text-2xl font-black text-[#3d522b] border border-[#3d522b]/10">
                                            {fullName?.[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{role} @ Growthory</p>

                            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors" onClick={() => router.push('/network')}>
                                    <span className="text-slate-500">Node Connections</span>
                                    <span className="text-[#3d522b]">{connectionCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-500">Signal Strength</span>
                                    <span className="text-[#3d522b]">{connectionCount > 0 ? Math.min(100, 70 + connectionCount * 2) : 0}%</span>
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
                    <div style={{flex: 1, overflowY: 'auto', paddingTop: '1rem', paddingBottom: '8rem'}} className="space-y-6 no-scrollbar">
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
                            <div key={s._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-[#3d522b]/5 border border-[#3d522b]/10 flex items-center justify-center text-[#3d522b]">
                                                {s.logo_url ? <img src={s.logo_url} alt={s.name} className="h-full w-full object-contain rounded-lg" /> : <Building2 className="h-6 w-6" />}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/profile/${s.founder_id}`} className="text-[10px] font-black uppercase tracking-widest text-[#3d522b] hover:underline">
                                                        {s.founder?.full_name || 'Ecosystem Founder'}
                                                    </Link>
                                                    <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden md:block">{s.tagline || 'Stealth Venture'}</p>
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
                                                    {(user && (String(s.founder_id) === String(user.id) || String(s.founder_id) === String(user._id) || String(s.founder?._id) === String(user.id) || String(s.founder?._id) === String(user._id))) && (
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

                                    <div className="text-sm text-slate-600 leading-relaxed mb-6">
                                        {expandedCards[s._id] || (s.description_raw?.length || 0) <= 180 ? (
                                            s.description_raw
                                        ) : (
                                            <>
                                                {s.description_raw?.substring(0, 180)}...
                                                <button 
                                                    onClick={() => toggleExpand(s._id)}
                                                    className="ml-1 text-[#3d522b] font-black hover:underline cursor-pointer lowercase"
                                                >
                                                    more
                                                </button>
                                            </>
                                        )}
                                        {expandedCards[s._id] && (s.description_raw?.length || 0) > 180 && (
                                            <button 
                                                onClick={() => toggleExpand(s._id)}
                                                className="ml-1 text-slate-400 font-bold hover:underline cursor-pointer lowercase block mt-2"
                                            >
                                                show less
                                            </button>
                                        )}
                                    </div>

                                    {/* Image Gallery */}
                                    {(() => {
                                        const images = s.image_urls && s.image_urls.length > 0 ? s.image_urls : (s.image_url ? [s.image_url] : []);
                                        if (images.length === 0) return null;
                                        
                                        return (
                                            <div className="mb-6 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                                {images.length === 1 && (
                                                    <div className="w-full relative bg-slate-50 flex items-center justify-center overflow-hidden">
                                                        <img src={images[0]} alt={`${s.name} asset`} className="w-full max-h-[600px] object-cover" />
                                                    </div>
                                                )}
                                                {images.length === 2 && (
                                                    <div className="grid grid-cols-2 gap-1">
                                                        {images.map((img: string, idx: number) => (
                                                            <div key={idx} className="relative aspect-square bg-slate-50 overflow-hidden">
                                                                <img src={img} alt={`${s.name} asset ${idx+1}`} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {images.length === 3 && (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="w-full relative aspect-video bg-slate-50 overflow-hidden">
                                                            <img src={images[0]} alt={`${s.name} asset 1`} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-1">
                                                            {images.slice(1, 3).map((img: string, idx: number) => (
                                                                <div key={idx} className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                                                                    <img src={img} alt={`${s.name} asset ${idx+2}`} className="w-full h-full object-cover" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {images.length >= 4 && (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="w-full relative aspect-video bg-slate-50 overflow-hidden">
                                                            <img src={images[0]} alt={`${s.name} asset 1`} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-1">
                                                            {images.slice(1, 4).map((img: string, idx: number) => (
                                                                <div key={idx} className="relative aspect-[4/3] bg-slate-50 overflow-hidden group">
                                                                    <img src={img} alt={`${s.name} asset ${idx+2}`} className="w-full h-full object-cover" />
                                                                    {idx === 2 && images.length > 4 && (
                                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                                                            <span className="text-white text-3xl font-semibold">+{images.length - 4}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 bg-[#3d522b]/10 text-[#3d522b] rounded-full text-[10px] font-black uppercase tracking-widest">{s.industry}</span>
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">{s.stage}</span>
                                    </div>

                                    {(s.location || s.website) && (
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t border-slate-50 pt-4">
                                            {s.location && <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {s.location}</div>}
                                            {s.website && <a href={s.website.startsWith('http') ? s.website : `https://${s.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#3d522b] hover:underline"><Globe className="h-3 w-3" /> {s.website.replace(/^https?:\/\/(www\.)?/, '')}</a>}
                                        </div>
                                    )}

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
                                            <button 
                                                onClick={() => {
                                                    if (activeInsights === s._id) {
                                                        setActiveInsights(null);
                                                    } else {
                                                        setActiveInsights(s._id);
                                                        if (!commentsData[s._id]) fetchComments(s._id);
                                                    }
                                                }} 
                                                className={`flex items-center gap-2 transition-colors ${activeInsights === s._id ? 'text-[#3d522b]' : 'text-slate-500 hover:text-[#3d522b]'}`}
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                                <span className="text-xs font-bold uppercase tracking-widest">{s.comment_count || 0} Insights</span>
                                            </button>
                                        </div>
                                        <button className="text-slate-400 hover:text-amber-500"><Bookmark className="h-5 w-5" /></button>
                                    </div>

                                    {/* Insights (Comments) Section */}
                                    {activeInsights === s._id && (
                                        <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3d522b] mb-4 flex items-center gap-2">
                                                <Sparkles className="h-3 w-3" /> Collective Intelligence
                                            </h4>

                                            {/* Comment Input */}
                                            <div className="flex gap-3 mb-6">
                                                <div className="h-8 w-8 rounded-lg bg-[#3d522b]/5 flex items-center justify-center text-[10px] font-bold text-[#3d522b] border border-[#3d522b]/10 flex-shrink-0">
                                                    {fullName?.[0]}
                                                </div>
                                                <div className="flex-grow relative">
                                                    <textarea
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        placeholder="Add your insight to this venture..."
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d522b]/20 focus:border-[#3d522b] transition-all resize-none h-10"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleAddComment(s._id);
                                                            }
                                                        }}
                                                    />
                                                    <button 
                                                        onClick={() => handleAddComment(s._id)}
                                                        disabled={!commentText.trim() || isSubmittingComment}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#3d522b] hover:bg-[#3d522b]/10 rounded-lg transition-all disabled:opacity-30"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Comments List */}
                                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                                {commentsData[s._id] ? (
                                                    commentsData[s._id].length > 0 ? (
                                                        commentsData[s._id].map((comment: any) => (
                                                            <div key={comment._id} className="flex gap-3 group">
                                                                <div className="h-7 w-7 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                                    {comment.user_id?.avatar_url ? (
                                                                        <img src={comment.user_id.avatar_url} className="h-full w-full object-cover" alt="User" />
                                                                    ) : (
                                                                        <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                                            {comment.user_id?.full_name?.[0] || '?'}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <div className="flex items-center gap-2 mb-0.5">
                                                                        <span className="text-[10px] font-black uppercase text-slate-900 tracking-tight">
                                                                            {comment.user_id?.full_name || 'Anonymous'}
                                                                        </span>
                                                                        <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                                                                        <span className="text-[9px] font-bold text-slate-400">
                                                                            {new Date(comment.createdAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-xl rounded-tl-none border border-slate-100">
                                                                        {comment.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-4">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Be the first to signal an insight</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="flex justify-center py-4">
                                                        <div className="animate-spin h-4 w-4 border-2 border-[#3d522b] border-t-transparent rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
