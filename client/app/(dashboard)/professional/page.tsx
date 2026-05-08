"use client";
import React, { useEffect, useState } from 'react';
import { auth, API_URL } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { 
    Briefcase, 
    Zap, 
    Sparkles, 
    FileText, 
    Trophy, 
    TrendingUp, 
    Search, 
    Users, 
    Rocket,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    MapPin,
    Globe,
    MessageCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ProfessionalDashboard() {
    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<any>(null);
    const [startups, setStartups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [resumeData, setResumeData] = useState<any>(null);
    const [openForRoles, setOpenForRoles] = useState(false);
    const [signaledStartups, setSignaledStartups] = useState<Set<string>>(new Set());

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = auth.getUser();
            if (!currentUser || currentUser.role !== 'professional') {
                router.push('/dashboard');
                return;
            }
            setUser(currentUser);

            try {
                const token = auth.getToken();
                
                // Fetch Startups for the Expert to see
                const res = await fetch(`${API_URL}/startups`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStartups(data.slice(0, 6)); // Just a few for the dashboard
                }

                // In a real app, we'd fetch the professional profile here
                // For now we use the user data which contains skills
            } catch (err) {
                console.error("Dashboard data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf7]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d522b]"></div>
        </div>
    );

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto selection:bg-[#3d522b]/20">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-[#3d522b]/10 text-[#3d522b] rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Zap className="h-3 w-3 fill-current" /> Expert Node Active
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 leading-tight">
                        Welcome back, <span className="text-[#3d522b]">{user?.full_name?.split(' ')[0]}</span>.
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-xl">
                        Your professional signal is reaching <span className="text-slate-900 font-bold">1,240 ventures</span>. Here are the top opportunities matching your expertise.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => router.push('/profile')}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        Update Resume
                    </button>
                    <button 
                        onClick={() => {
                            setOpenForRoles(!openForRoles);
                            toast.success(openForRoles ? 'You are no longer visible to recruiters.' : 'Your profile is now visible to active ventures!');
                        }}
                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl ${openForRoles ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' : 'bg-[#3d522b] hover:bg-[#606c38] text-white shadow-[#3d522b]/20'}`}
                    >
                        {openForRoles ? 'Hibernate Signal' : 'Open for Roles'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Expert Stats & Profile */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Signal Strength Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                            <Trophy className="h-24 w-24 text-[#3d522b]" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Expert Signal Strength</h3>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-6xl font-black text-slate-900">94</span>
                            <span className="text-xl font-black text-[#3d522b] mb-2">%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-[#3d522b] w-[94%] rounded-full"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Profile Integrity</span>
                                <span className="text-[10px] font-black text-slate-900 uppercase">Complete</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Ecosystem Trust</span>
                                <span className="text-[10px] font-black text-slate-900 uppercase">Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Skill Matrix */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> Core Competencies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {user?.skills?.length > 0 ? user.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors cursor-default border border-white/5">
                                    {skill}
                                </span>
                            )) : (
                                <p className="text-slate-500 text-xs font-medium italic">No skills extracted yet. Upload your resume to begin.</p>
                            )}
                        </div>
                        <button 
                            onClick={() => router.push('/profile')}
                            className="w-full mt-8 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                        >
                            Refine Skillset
                        </button>
                    </div>

                    {/* Quick Access */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/network" className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-[#3d522b]/30 transition-all group">
                            <div className="h-10 w-10 rounded-xl bg-[#3d522b]/5 flex items-center justify-center text-[#3d522b] mb-4 group-hover:scale-110 transition-transform">
                                <Users className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Network Map</span>
                        </Link>
                        <Link href="/analytics" className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-[#3d522b]/30 transition-all group">
                            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Ecosystem Pulse</span>
                        </Link>
                    </div>
                </div>

                {/* Right Column: Matched Ventures */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Top Matches Header */}
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <Rocket className="h-6 w-6 text-[#3d522b]" />
                            Top Venture Matches
                        </h2>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#3d522b] hover:opacity-70 transition-opacity">
                            View All Opportunities
                        </button>
                    </div>

                    {/* Venture Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {startups.map((startup) => (
                            <div key={startup._id} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#3d522b]/5 transition-all group border-b-4 border-b-transparent hover:border-b-[#3d522b]">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#3d522b] group-hover:scale-110 transition-transform overflow-hidden">
                                        {startup.logo_url ? <img src={startup.logo_url} className="h-full w-full object-cover" /> : <Briefcase className="h-6 w-6" />}
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${startup.industry === user?.industry ? 'bg-green-50 text-green-600' : 'bg-[#3d522b]/10 text-[#3d522b]'}`}>
                                        <CheckCircle2 className="h-3 w-3" /> {90 + (startup.name.length % 10)}% Match
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-black text-slate-900 mb-1">{startup.name}</h3>
                                <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-1">{startup.tagline}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{startup.industry}</span>
                                    <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{startup.stage}</span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Clock className="h-3.5 w-3.5" /> Hiring: 2 Positions
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <MapPin className="h-3.5 w-3.5" /> {startup.location || 'Remote Node'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => router.push(`/startups/${startup._id}`)}
                                        className="py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        Details
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (signaledStartups.has(startup._id)) {
                                                toast.error('Interest already signaled');
                                                return;
                                            }
                                            setSignaledStartups(prev => new Set(prev).add(startup._id));
                                            toast.success(`Interest signaled to ${startup.name}!`);
                                        }}
                                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${signaledStartups.has(startup._id) ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-[#3d522b] text-white hover:bg-[#606c38]'}`}
                                    >
                                        {signaledStartups.has(startup._id) ? 'Signaled' : 'Signal Interest'} {!signaledStartups.has(startup._id) && <ArrowUpRight className="h-3 w-3" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ecosystem Intelligence Bar */}
                    <div className="bg-[#3d522b] rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <MessageCircle className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-black">Ecosystem Insights</h3>
                            </div>
                            <p className="text-white/70 text-sm font-medium mb-8 max-w-md leading-relaxed">
                                AI has detected a surge in demand for <span className="text-white font-bold">Vector Database Engineering</span> in your region. 12 stealth startups are currently scouting for your skill profile.
                            </p>
                            <button 
                                onClick={() => router.push('/analytics')}
                                className="px-8 py-4 bg-white text-[#3d522b] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-black/20"
                            >
                                View Intelligence Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
