"use client";
import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { User, Mail, Briefcase, MapPin, Calendar, ArrowLeft, Shield, TrendingUp, Award, Target, Rocket, Building2, UserPlus, Users, Loader2, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export default function PublicProfilePage() {
    const router = useRouter();
    const params = useParams();
    const toast = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [profileUser, setProfileUser] = useState<any>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);

    const profileId = params?.id as string;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Get current logged in user
                const user = auth.getUser();
                setCurrentUser(user);

                if (user?.id === profileId) {
                    router.replace('/profile');
                    return;
                }

                const token = auth.getToken();
                const headers: any = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                // 2. Fetch public profile
                let url = `${API_URL}/users/${profileId}`;
                if (user?.id) {
                    url += `?currentUserId=${user.id}`;
                }
                const res = await fetch(url, { headers });
                if (!res.ok) throw new Error("Profile not found");
                const userData = await res.json();
                setProfileUser(userData);

                // 3. Fetch suggestions
                const sugRes = await fetch(`${API_URL}/users/suggestions?excludeId=${profileId}&limit=3`, { headers });
                const sugData = await sugRes.json();
                setSuggestions(sugData);

            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error("Cluster node not found in ecosystem");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [profileId, router]);

    const handleConnect = async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setConnecting(true);
        try {
            const res = await fetch(`${API_URL}/network/connect`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: JSON.stringify({
                    source_id: currentUser.id,
                    target_id: profileId,
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Signal connection request transmitted.");
            } else {
                toast.error(data.error || "Failed to connect");
            }
        } catch (err) {
            toast.error("Network sync lost");
        } finally {
            setConnecting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-[#3d522b]" />
            </div>
        );
    }

    if (!profileUser) return null;

    const joinedDate = profileUser.created_at ? new Date(profileUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';
    const startup = profileUser.startups?.[0];

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Navigation */}
                <div className="flex items-center gap-6 mb-12">
                    <button onClick={() => router.back()} className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm group">
                        <ArrowLeft className="h-6 w-6 text-slate-400 group-hover:text-[#3d522b] transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">Public Node</h1>
                        <p className="text-slate-500 font-medium mt-1">Growthory Ecosystem Explorer</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm text-center sticky top-32">
                            <div className="h-32 w-32 mx-auto rounded-full bg-[#3d522b]/10 border-4 border-white shadow-xl flex items-center justify-center text-5xl font-black text-[#3d522b] mb-6">
                                {profileUser.full_name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                                {profileUser.full_name || 'Anonymous User'}
                            </h2>
                            <p className="text-sm text-[#3d522b] font-black uppercase tracking-widest mb-8">
                                {profileUser.role} @ Ecosystem
                            </p>

                            <div className="space-y-4 text-left mb-8">
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">Global Cluster Node</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">Joined {joinedDate}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleConnect}
                                    disabled={connecting || profileUser.connection_status === 'pending' || profileUser.connection_status === 'accepted'}
                                    className={`w-full h-14 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl ${profileUser.connection_status === 'accepted' ? 'bg-[#3d522b]/10 text-[#3d522b] shadow-none' : profileUser.connection_status === 'pending' ? 'bg-slate-100 text-slate-400 shadow-none' : 'shadow-[#3d522b]/10'}`}
                                >
                                    {connecting ? 'Syncing...' :
                                        profileUser.connection_status === 'accepted' ? <><Shield className="h-4 w-4 mr-2" /> Connected</> :
                                            profileUser.connection_status === 'pending' ? <><Loader2 className="h-4 w-4 mr-2" /> Request Sent</> :
                                                <><UserPlus className="h-4 w-4 mr-2" /> Connect Node</>}
                                </Button>
                                <button className="w-full h-14 rounded-2xl border border-slate-200 text-slate-400 hover:text-[#3d522b] hover:border-[#3d522b]/30 font-black uppercase text-xs tracking-[0.2em] transition-all">
                                    Follow Signal
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Details */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Venture View */}
                        {profileUser.role === 'founder' && startup && (
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm overflow-hidden relative">
                                <Rocket className="absolute top-0 right-0 h-16 w-16 text-[#3d522b]/5 transition-transform group-hover:scale-110" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-[#3d522b]" /> Venture Logic
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">{startup.name}</h4>
                                        <p className="text-sm text-[#3d522b] font-bold uppercase tracking-widest italic">{startup.tagline}</p>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {startup.description_raw}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-4 py-1.5 bg-[#3d522b]/5 text-[#3d522b] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#3d522b]/10">{startup.industry}</span>
                                        <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">{startup.stage}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Experience View (For Pros) */}
                        {profileUser.role === 'professional' && profileUser.professional_profiles && (
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-3">
                                    <Briefcase className="h-5 w-5 text-[#3d522b]" /> Capability Matrix
                                </h3>
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <div className="text-2xl font-black text-[#3d522b]">{profileUser.professional_profiles.experience_years}y</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</div>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <div className="text-2xl font-black text-amber-500">Tier-1</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Level</div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Verified Skills</label>
                                        <div className="flex flex-wrap gap-3">
                                            {profileUser.professional_profiles.skills?.map((skill: string, i: number) => (
                                                <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:border-[#3d522b]/30 transition-all">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Matrix */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm text-center">
                                <Users className="h-8 w-8 text-[#3d522b] mx-auto mb-3" />
                                <div className="text-2xl font-black text-slate-900">42</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Connections</div>
                            </div>
                            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm text-center">
                                <Award className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                                <div className="text-2xl font-black text-slate-900">8.2k</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ecosystem Rep</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Suggestions */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-[#3d522b] rounded-[2.5rem] p-8 text-white">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-amber-400" /> Discover Nodes
                            </h3>
                            <div className="space-y-6">
                                {suggestions.map((sug, i) => (
                                    <div key={i} className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push(`/profile/${sug.id}`)}>
                                        <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg font-black group-hover:bg-white group-hover:text-[#3d522b] transition-all">
                                            {sug.full_name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-sm font-black uppercase tracking-tight group-hover:text-amber-400 transition-colors">{sug.full_name}</div>
                                            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{sug.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                Explore Ecosystem
                            </button>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                            <Shield className="h-8 w-8 text-[#3d522b] mb-4" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">Verified Node</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">This identity has been verified through a multi-sig protocol on the Growthory chain.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
