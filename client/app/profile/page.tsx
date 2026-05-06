"use client";
import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { User, Mail, Briefcase, MapPin, Calendar, Edit, Save, ArrowLeft, Shield, TrendingUp, Award, Target, Sparkles, Rocket, Building2, Linkedin, ExternalLink, Plus, X } from 'lucide-react';
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
        company: '',
        linkedin_url: '',
        skills: [] as string[],
        experience_years: 0
    });
    const [newSkill, setNewSkill] = useState('');
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
                company: currentUser.company || '',
                linkedin_url: currentUser.linkedin_url || '',
                skills: currentUser.skills || [],
                experience_years: currentUser.experience_years || 0
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

    const addSkill = () => {
        if (newSkill && !profileData.skills.includes(newSkill)) {
            setProfileData({ ...profileData, skills: [...profileData.skills, newSkill] });
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setProfileData({ ...profileData, skills: profileData.skills.filter(s => s !== skill) });
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
                    <div className="bg-slate-900 rounded-[2.8rem] w-full relative overflow-hidden flex flex-col md:flex-row shadow-inner">
                        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-[#3d522b] via-emerald-600 to-[#3d522b]"></div>
                        
                        <div className="w-full md:w-[350px] bg-slate-800/90 p-10 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-700/50">
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            
                            <div className="relative mb-8 group mt-6">
                                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#3d522b] to-emerald-600 opacity-20 animate-pulse blur-xl group-hover:opacity-40 transition-opacity duration-700"></div>
                                <div className="h-44 w-44 rounded-full bg-slate-900 border-4 border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-7xl font-black text-white relative z-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#3d522b]/40 to-slate-900"></div>
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-md">
                                        {profileData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="text-center relative z-10 w-full">
                                <div className="inline-flex py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-[0.3em] mb-5">
                                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full mr-2 shadow-[0_0_5px_#34d399]"></span>
                                    Status: Active
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-[1.1] mb-2 truncate px-2">
                                    {profileData.full_name || 'Classified Node'}
                                </h2>
                                <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-8 opacity-80">
                                    {profileData.role === 'founder' ? 'Founder Protocol' : profileData.role === 'investor' ? 'Capital Interface' : 'Professional Asset'}
                                </p>

                                <div className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-4 text-left">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                        <span className="text-emerald-50 font-mono text-[10px] truncate">{user?.email}</span>
                                    </div>
                                    {profileData.location && (
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-4 w-4 text-slate-500" />
                                            <span className="text-emerald-50 font-mono text-[10px] uppercase tracking-wider truncate">{profileData.location}</span>
                                        </div>
                                    )}
                                    {profileData.linkedin_url && (
                                        <a href={profileData.linkedin_url} target="_blank" className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 transition-colors">
                                            <Linkedin className="h-4 w-4" />
                                            <span className="font-mono text-[10px] uppercase tracking-wider">Network Link</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-50 p-6 sm:p-10 md:p-12 relative flex flex-col min-h-[600px]">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/60 relative z-10">
                                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-3">
                                    <Shield className="h-6 w-6 text-[#3d522b]" /> Core Details
                                </h2>
                                {!editing ? (
                                    <Button
                                        onClick={() => setEditing(true)}
                                        className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-[#3d522b] bg-white border border-[#3d522b]/20 hover:bg-[#3d522b] hover:text-white transition-all shadow-sm"
                                    >
                                        <Edit className="h-3.5 w-3.5 mr-2" /> Modify Record
                                    </Button>
                                ) : (
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button
                                            onClick={() => {
                                                setEditing(false);
                                                loadUserProfile();
                                            }}
                                            variant="secondary"
                                            className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                                        >
                                            Discard
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="h-12 px-8 rounded-2xl font-black uppercase text-[10px] bg-[#3d522b] text-white"
                                        >
                                            {saving ? 'Transmitting...' : 'Commit'}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 relative z-10">
                            {editing ? (
                                <div className="space-y-6 max-w-2xl">
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Display Name</label>
                                            <input
                                                type="text"
                                                value={profileData.full_name}
                                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:border-[#3d522b] outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Organization</label>
                                            <input
                                                type="text"
                                                value={profileData.company}
                                                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:border-[#3d522b] outline-none transition-all"
                                            />
                                        </div>
                                     </div>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={profileData.location}
                                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:border-[#3d522b] outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Experience (Years)</label>
                                            <input
                                                type="number"
                                                value={profileData.experience_years}
                                                onChange={(e) => setProfileData({ ...profileData, experience_years: parseInt(e.target.value) })}
                                                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:border-[#3d522b] outline-none transition-all"
                                            />
                                        </div>
                                     </div>
                                     <div>
                                        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">LinkedIn Profile URL</label>
                                        <input
                                            type="text"
                                            value={profileData.linkedin_url}
                                            onChange={(e) => setProfileData({ ...profileData, linkedin_url: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:border-[#3d522b] outline-none transition-all"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Mission Statement (Bio)</label>
                                        <textarea
                                            rows={4}
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:border-[#3d522b] outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Specializations & Skills</label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                                className="flex-1 bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:border-[#3d522b] outline-none"
                                                placeholder="Add a skill..."
                                            />
                                            <Button onClick={addSkill} className="px-4 rounded-xl bg-slate-900 text-white"><Plus className="h-4 w-4" /></Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.skills.map((skill, idx) => (
                                                <div key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2">
                                                    {skill}
                                                    <button onClick={() => removeSkill(skill)}><X className="h-3 w-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
                                         <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                                            <Briefcase className="h-3.5 w-3.5" /> Mission Profile
                                         </h3>
                                         <p className="text-slate-800 text-lg md:text-xl font-medium leading-[1.8]">
                                             "{profileData.bio || 'Dossier description pending initialization...'}"
                                         </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
                                                <Award className="h-3 w-3" /> Specializations
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.skills.length > 0 ? profileData.skills.map((skill, idx) => (
                                                    <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                                        {skill}
                                                    </span>
                                                )) : <span className="text-slate-300 text-[10px] font-bold uppercase italic">No skill tags listed</span>}
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
                                                    <TrendingUp className="h-3 w-3" /> Professional Stature
                                                </h4>
                                                <div className="flex items-end gap-3">
                                                    <span className="text-4xl font-black text-slate-900 leading-none">{profileData.experience_years}</span>
                                                    <span className="text-[10px] font-black uppercase text-slate-400 mb-1">Years of Signal</span>
                                                </div>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                                <span className="text-[9px] font-black uppercase text-slate-400">Current Base</span>
                                                <span className="text-[10px] font-black text-slate-900 uppercase">{profileData.company || 'Private'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {profileData.role === 'founder' && myStartup && (
                                        <div onClick={() => router.push(`/dashboard/startups`)} className="bg-[#3d522b] text-white rounded-[2rem] p-8 flex items-center justify-between group cursor-pointer hover:bg-[#2d3f1f] transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center">
                                                    <Rocket className="h-8 w-8 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Current Protocol</h4>
                                                    <p className="text-2xl font-black uppercase tracking-tight">{myStartup.name}</p>
                                                </div>
                                            </div>
                                            <ExternalLink className="h-6 w-6 text-white/30 group-hover:text-white transition-colors" />
                                        </div>
                                    )}
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
