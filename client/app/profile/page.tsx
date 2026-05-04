"use client";
import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { User, Mail, Briefcase, MapPin, Calendar, Edit, Save, ArrowLeft, Shield, TrendingUp, Award, Target, Sparkles, Rocket, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export default function ProfilePage() {
    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: '',
        bio: '',
        role: '',
        location: '',
        company: ''
    });
    const [myStartup, setMyStartup] = useState<any>(null);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const currentUser = auth.getUser();
            if (!currentUser) {
                router.push('/login');
                return;
            }

            setUser(currentUser);
            setProfileData({
                full_name: currentUser.full_name || '',
                bio: currentUser.bio || '',
                role: currentUser.role || 'founder',
                location: currentUser.location || '',
                company: currentUser.company || ''
            });

            // Fetch startup if founder
            if (currentUser.role === 'founder') {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
                const token = auth.getToken();
                const res = await fetch(`${API_URL}/startups`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const startups = await res.json();
                if (Array.isArray(startups)) {
                    const mine = startups.find((s: any) => s.founder_id === currentUser.id);
                    setMyStartup(mine);
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
            const token = auth.getToken();
            
            const res = await fetch(`${API_URL}/users/update-profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update profile');

            // Update local storage user data
            const updatedUser = { ...auth.getUser(), ...data.user };
            localStorage.setItem('growthory_user', JSON.stringify(updatedUser));

            toast.success('Profile updated successfully!');
            setUser(updatedUser);
            setEditing(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const joinedDate = user?.created_at || user?.createdAt 
        ? new Date(user.created_at || user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
        : 'Classified';

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#3d522b] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-4 md:px-6 selection:bg-[#3d522b]/20">
            <div className="max-w-5xl mx-auto">
                 {/* Top Navigation */}
                <div className="flex items-center mb-10 pl-2">
                    <button onClick={() => router.back()} className="h-12 w-12 rounded-[1.2rem] bg-white border border-slate-200 flex items-center justify-center hover:bg-[#3d522b] hover:text-white hover:border-[#3d522b] transition-all shadow-sm group">
                        <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                    <div className="ml-6">
                        <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Identity Management</h1>
                        <p className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Security Dossier</p>
                    </div>
                </div>

                {/* Immersive Profile Card (Dossier) */}
                <div className="relative bg-white rounded-[3rem] p-1 shadow-2xl shadow-indigo-900/5 overflow-hidden">
                    {/* The Outer Shell */}
                    <div className="bg-slate-900 rounded-[2.8rem] w-full relative overflow-hidden flex flex-col md:flex-row shadow-inner">
                        {/* Dossier Left Accent */}
                        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-[#3d522b] via-emerald-600 to-[#3d522b]"></div>
                        
                        {/* Profile Header Block (Left side in md, Top in sm) */}
                        <div className="w-full md:w-[350px] bg-slate-800/90 p-10 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-700/50">
                            {/* Decorative Tech Map */}
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            
                            <div className="relative mb-8 group mt-6">
                                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#3d522b] to-emerald-600 opacity-20 animate-pulse blur-xl group-hover:opacity-40 transition-opacity duration-700"></div>
                                <div className="absolute -inset-2 rounded-full border border-emerald-500/20 scale-90 group-hover:scale-105 transition-transform duration-700"></div>
                                <div className="h-44 w-44 rounded-full bg-slate-900 border-4 border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-7xl font-black text-white relative z-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#3d522b]/40 to-slate-900"></div>
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-md">
                                        {profileData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="text-center relative z-10 w-full">
                                <div className="inline-flex py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-[0.3em] mb-5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full mr-2 shadow-[0_0_5px_#34d399]"></span>
                                    Status: Active
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-[1.1] mb-2 truncate px-2">
                                    {profileData.full_name || 'Classified Node'}
                                </h2>
                                <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-8 opacity-80">
                                    {profileData.role === 'founder' ? 'Founder Protocol' : profileData.role === 'investor' ? 'Capital Interface' : 'Professional Asset'}
                                </p>

                                <div className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-4 text-left shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 flex justify-center"><Mail className="h-4 w-4 text-slate-500" /></div>
                                        <span className="text-emerald-50 font-mono text-[10px] truncate">{user?.email}</span>
                                    </div>
                                    {profileData.location && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 flex justify-center"><MapPin className="h-4 w-4 text-slate-500" /></div>
                                            <span className="text-emerald-50 font-mono text-[10px] uppercase tracking-wider truncate">{profileData.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mt-1 pt-3 border-t border-slate-700/70">
                                         <div className="w-6 flex justify-center"><Calendar className="h-4 w-4 text-slate-600" /></div>
                                         <span className="text-slate-400 font-mono text-[9px] uppercase tracking-widest">Init: {joinedDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Content Block */}
                        <div className="flex-1 bg-slate-50 p-6 sm:p-10 md:p-12 relative flex flex-col min-h-[600px]">
                            {/* Decorative background for the content area */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3d522b]/[0.02] rounded-bl-full pointer-events-none"></div>

                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/60 relative z-10">
                                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-3">
                                    <Shield className="h-6 w-6 text-[#3d522b]" /> Core Details
                                </h2>
                                {!editing ? (
                                    <Button
                                        onClick={() => setEditing(true)}
                                        className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-[#3d522b] bg-white border border-[#3d522b]/20 hover:bg-[#3d522b] hover:border-[#3d522b] hover:text-white transition-all shadow-sm"
                                    >
                                        <Edit className="h-3.5 w-3.5 mr-2" /> Modify Record
                                    </Button>
                                ) : (
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button
                                            onClick={() => {
                                                setEditing(false);
                                                // Reset data
                                                setProfileData({
                                                    full_name: user?.full_name || '',
                                                    bio: user?.bio || '',
                                                    role: user?.role || 'founder',
                                                    location: user?.location || '',
                                                    company: user?.company || ''
                                                });
                                            }}
                                            variant="secondary"
                                            className="flex-1 sm:flex-none h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                                        >
                                            Discard
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex-1 sm:flex-none h-12 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#3d522b]/20 bg-[#3d522b] text-white disabled:opacity-50 hover:bg-[#2d3f1f]"
                                        >
                                            {saving ? 'Transmitting...' : <><Save className="h-3.5 w-3.5 mr-2" /> Commit</>}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Content based on Edit State */}
                            <div className="flex-1 relative z-10">
                            {editing ? (
                                <div className="space-y-6">
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-[#3d522b] mb-2 px-1">Designation / Call Sign</label>
                                            <input
                                                type="text"
                                                value={profileData.full_name}
                                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-[1.2rem] p-4 text-sm font-bold text-slate-900 focus:border-[#3d522b] focus:ring-4 focus:ring-[#3d522b]/5 outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-[#3d522b] mb-2 px-1">Organization Base</label>
                                            <input
                                                type="text"
                                                value={profileData.company}
                                                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-[1.2rem] p-4 text-sm font-bold text-slate-900 focus:border-[#3d522b] focus:ring-4 focus:ring-[#3d522b]/5 outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                     </div>
                                     <div>
                                        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-[#3d522b] mb-2 px-1">Geographic Coordinates</label>
                                        <input
                                            type="text"
                                            value={profileData.location}
                                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-[1.2rem] p-4 text-sm font-bold text-slate-900 focus:border-[#3d522b] focus:ring-4 focus:ring-[#3d522b]/5 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-[#3d522b] mb-2 px-1">Operational Profile</label>
                                        <textarea
                                            rows={6}
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 text-sm font-bold leading-relaxed text-slate-900 focus:border-[#3d522b] focus:ring-4 focus:ring-[#3d522b]/5 outline-none transition-all shadow-sm resize-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="bg-white border text-center md:text-left border-slate-200 shadow-sm rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
                                         <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-[#3d522b]/5 to-transparent rounded-bl-full pointer-events-none"></div>
                                         <h3 className="flex justify-center md:justify-start items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 w-full">
                                            <Briefcase className="h-3.5 w-3.5" /> Mission Profile
                                         </h3>
                                         {profileData.bio ? (
                                             <p className="text-slate-800 text-lg md:text-xl font-medium leading-[1.8]">
                                                 "{profileData.bio}"
                                             </p>
                                         ) : (
                                            <div className="flex flex-col items-center justify-center py-6">
                                                <Sparkles className="h-8 w-8 text-slate-200 mb-3" />
                                                <p className="text-slate-400 font-medium">No operational data recorded.</p>
                                            </div>
                                         )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="bg-white border border-slate-200 text-center shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-[2rem] p-8 hover:shadow-xl hover:border-[#3d522b]/30 transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                                <Building2 className="h-6 w-6 text-[#3d522b]" />
                                            </div>
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Base of Operations</h4>
                                            <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{profileData.company || 'Independent Asset'}</p>
                                        </div>

                                        {(profileData.role === 'founder' && myStartup) && (
                                            <div className="border border-emerald-200 bg-emerald-50 text-center rounded-[2rem] p-8 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => router.push(`/dashboard/startups`)}>
                                                <div className="h-14 w-14 bg-emerald-100/50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                                    <Rocket className="h-6 w-6 text-emerald-600" />
                                                </div>
                                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600/70 mb-2">Active Protocol</h4>
                                                <p className="text-lg font-black text-emerald-900 uppercase tracking-tight">{myStartup.name}</p>
                                            </div>
                                        )}
                                        
                                        {(profileData.role === 'investor' || profileData.role === 'professional') && (
                                              <div className="border border-[#3d522b]/20 bg-[#3d522b] text-center rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-[#3d522b]/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => router.push('/dashboard')}>
                                                <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                                    <Target className="h-6 w-6 text-white" />
                                                </div>
                                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">System Diagnostics</h4>
                                                <p className="text-lg font-black text-white uppercase tracking-tight">View Analytics</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
