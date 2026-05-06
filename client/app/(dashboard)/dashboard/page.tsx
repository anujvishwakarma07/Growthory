"use client";
import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
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
    Target
} from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<any>(null);
    const [startups, setStartups] = useState<any[]>([]);
    const [myProfile, setMyProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [likesModal, setLikesModal] = useState<string | null>(null);
    const [likesData, setLikesData] = useState<any[]>([]);

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = auth.getUser();
            if (!currentUser) {
                router.push('/login');
                return;
            }
            setUser(currentUser);

            const token = auth.getToken();
            const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5000/api` : 'http://localhost:5000/api');

            try {
                // Fetch All Startups for the Feed
                const res = await fetch(`${API_URL}/startups`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Failed to fetch startups");
                const allStartups = await res.json();

                // Ensure allStartups is an array for feed and for finding profile
                const startupsArray = Array.isArray(allStartups) ? allStartups : [];
                setStartups(startupsArray);

                // Find user's specific profile
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
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pb-20 pt-20">
            {/* Top Navigation - LinkedIn Style Mobile/Sub-Navbar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around p-3">
                <Home className="text-[#3d522b] h-6 w-6" />
                <Users className="text-slate-400 h-6 w-6" />
                <Plus className="text-slate-400 h-6 w-6" />
                <Bell className="text-slate-400 h-6 w-6" />
                <User className="text-slate-400 h-6 w-6" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">

                {/* Left Sidebar: Profile Card */}
                <div className="lg:col-span-3 space-y-4">
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
                                <div className="flex justify-between items-center text-xs font-bold">
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

                {/* Center Content: The Startup Feed */}
                <div className="lg:col-span-6 space-y-6">
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
                            <button
                                onClick={() => router.push(role === 'founder' ? '/startups/create' : '/network')}
                                className="flex items-center justify-center gap-2 p-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <Rocket className="h-4 w-4 text-[#3d522b]" />
                                <span className="text-sm font-bold text-slate-600">Startup</span>
                            </button>
                            <button
                                onClick={() => router.push('/analytics')}
                                className="flex items-center justify-center gap-2 p-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-bold text-slate-600">Analysis</span>
                            </button>
                            <button
                                onClick={() => router.push(role === 'investor' ? '/investor/matches' : '/network')}
                                className="flex items-center justify-center gap-2 p-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                            >
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
                            <div key={s._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transform transition-all hover:border-slate-300">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-[#3d522b]/5 border border-[#3d522b]/10 flex items-center justify-center text-[#3d522b]">
                                                {s.logo_url ? <img src={s.logo_url} alt={s.name} className="h-full w-full object-contain rounded-lg" /> : <Building2 className="h-6 w-6" />}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#3d522b]">{s.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/profile/${s.founder_id}`} className="text-[10px] font-black uppercase tracking-widest text-[#3d522b] hover:underline">
                                                        {s.founder?.full_name || 'Anonymous founder'}
                                                    </Link>
                                                    <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.tagline || 'Stealth Venture'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                                        {s.description_raw}
                                    </p>

                                    {/* Image Gallery - LinkedIn Style */}
                                    {((s.image_urls && s.image_urls.length > 0) || s.image_url) && (
                                        <div className="mb-6 px-2">
                                            <div className={`grid gap-2 ${
                                                (s.image_urls?.length || (s.image_url ? 1 : 0)) > 1 ? 'grid-cols-2' : 'grid-cols-1'
                                            }`}>
                                                {(s.image_urls && s.image_urls.length > 0 ? s.image_urls : [s.image_url]).map((img: string, idx: number) => (
                                                    <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 aspect-video md:aspect-auto">
                                                        <img 
                                                            src={img} 
                                                            alt={`${s.name} visualization ${idx + 1}`} 
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop'; // Technical fallback
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-3 py-1 bg-[#3d522b]/10 text-[#3d522b] rounded-full text-[10px] font-black uppercase tracking-widest">{s.industry}</span>
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">{s.stage}</span>
                                        {s.startup_analysis?.[0] && (
                                            <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3" /> Analysis: {s.startup_analysis[0].investor_appeal_score}
                                            </span>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={async () => {
                                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/startups/toggle-like`, {
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
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/startups/${s._id}/likes`, {
                                                            headers: { 'Authorization': `Bearer ${auth.getToken()}` }
                                                        });
                                                        const data = await res.json();
                                                        setLikesData(data);
                                                        setLikesModal(s.name);
                                                    }}
                                                    className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#3d522b]"
                                                >
                                                    {s.like_count} Signals
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => toast.info("Insights section deploying in V2.1")}
                                                className="flex items-center gap-2 text-slate-500 hover:text-[#3d522b] transition-colors"
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                                <span className="text-xs font-bold uppercase tracking-widest">{s.comment_count} Insights</span>
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/network/connect`, {
                                                        method: 'POST',
                                                        headers: { 
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${auth.getToken()}`
                                                        },
                                                        body: JSON.stringify({ source_id: user.id, target_id: s.founder_id })
                                                    });
                                                    const data = await res.json();
                                                    if (data.success) toast.success("Signal connection request transmitted.");
                                                    else toast.error(data.error);
                                                }}
                                                className="flex items-center gap-2 text-slate-500 hover:text-[#3d522b] transition-colors"
                                            >
                                                <ArrowUpRight className="h-5 w-5" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Connect</span>
                                            </button>
                                        </div>
                                        <button className="text-slate-400 hover:text-amber-500">
                                            <Bookmark className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                                <Globe className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No Ventures Found</h3>
                                <p className="text-slate-500 mb-6">Be the first to register a startup in your network.</p>
                                <Button onClick={() => router.push('/startups/create')} variant="primary" className="rounded-full px-8 bg-[#3d522b]">
                                    Register Venture
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Likes Modal */}
                {likesModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#3d522b]">Protocol Signals: {likesModal}</h3>
                                <button onClick={() => setLikesModal(null)} className="h-8 w-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors">
                                    <Plus className="h-5 w-5 rotate-45 text-slate-400" />
                                </button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto p-2">
                                {likesData.map((node: any) => (
                                    <div
                                        key={node.id}
                                        className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group"
                                        onClick={() => router.push(`/profile/${node.id}`)}
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-[#3d522b]/5 border border-[#3d522b]/10 flex items-center justify-center text-lg font-black text-[#3d522b] group-hover:bg-[#3d522b] group-hover:text-white transition-all">
                                            {node.full_name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-sm font-black uppercase tracking-tight text-slate-900">{node.full_name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{node.role} @ Ecosystem</div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-[#3d522b] transition-colors" />
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50 text-center">
                                <button onClick={() => setLikesModal(null)} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3d522b]">Close Transmission</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Right Sidebar: Trends & Suggested */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#3d522b]">Ecosystem Pulse</h3>
                            <Settings className="h-4 w-4 text-slate-400" />
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: 'AI-SaaS Boom', stats: '42 Active Rounds', trend: '+12%' },
                                { title: 'Fintech Liquidity', stats: '$2.4M Volume', trend: '+5%' },
                                { title: 'Green Energy Hub', stats: '12 New Nodes', trend: '+24%' },
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

                        <button className="w-full mt-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-center text-[#3d522b] hover:bg-[#3d522b]/5 rounded-lg transition-all">
                            View Full Report
                        </button>
                    </div>

                    <div className="sticky top-24 p-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex flex-wrap justify-center gap-x-4 gap-y-2">
                            <a href="#" className="hover:text-[#3d522b]">About</a>
                            <a href="#" className="hover:text-[#3d522b]">Accessibility</a>
                            <a href="#" className="hover:text-[#3d522b]">Help Center</a>
                            <a href="#" className="hover:text-[#3d522b]">Privacy & Terms</a>
                            <a href="#" className="hover:text-[#3d522b]">Sales Solutions</a>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-[10px] font-black text-[#3d522b] uppercase tracking-[0.3em]">Growthory © 2026</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

