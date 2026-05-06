"use client";
import React, { useState, useEffect } from 'react';
import { auth, API_URL } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { MapPin, Edit, ArrowLeft, Linkedin, ExternalLink, Plus, X, Building2, Briefcase, Camera, CheckCircle2, Users, Target, Rocket, Shield, Award, Mail } from 'lucide-react';
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
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

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
            setAvatarPreview(currentUser.avatar_url || null);
            setBannerPreview(currentUser.banner_url || null);

            if (currentUser.role === 'founder') {
                const token = auth.getToken();
                const res = await fetch(`${API_URL}/startups`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const startups = await res.json();
                const myCol = Array.isArray(startups) ? startups.find((s: any) => s.founder_id === currentUser.id || s.founder_id === currentUser._id || s.founder?._id === currentUser.id || s.founder?._id === currentUser._id) : null;
                setMyStartup(myCol);
            }
        } catch (err: any) {
            console.error("Profile load error:", err);
            toast.error("Failed to load profile intelligence");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = auth.getToken();
            
            const formData = new FormData();
            formData.append('full_name', profileData.full_name);
            formData.append('bio', profileData.bio);
            formData.append('location', profileData.location);
            formData.append('company', profileData.company);
            formData.append('linkedin_url', profileData.linkedin_url);
            formData.append('skills', JSON.stringify(profileData.skills));
            formData.append('experience_years', profileData.experience_years.toString());
            
            if (avatarFile) formData.append('avatar', avatarFile);
            if (bannerFile) formData.append('banner', bannerFile);

            const res = await fetch(`${API_URL}/users/update-profile`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update profile');

            const updatedUser = { ...auth.getUser(), ...data.user };
            localStorage.setItem('growthory_user', JSON.stringify(updatedUser));

            toast.success('Profile updated successfully!');
            setUser(updatedUser);
            setEditing(false);
            setAvatarFile(null);
            setBannerFile(null);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-[#3d522b] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-900 pt-24 pb-20 px-4 sm:px-6 selection:bg-[#3d522b]/20">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header Action */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => router.back()} className="flex items-center text-sm font-bold text-slate-500 hover:text-[#3d522b] transition-colors group">
                        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        RETURN TO HUB
                    </button>
                    {!editing && (
                        <Button onClick={() => setEditing(true)} className="rounded-full bg-white text-[#3d522b] border border-[#3d522b]/20 hover:bg-[#3d522b] hover:text-white shadow-sm font-bold text-xs uppercase tracking-widest px-6 h-10 transition-all flex items-center gap-2">
                            <Edit className="h-4 w-4" /> Modify Profile
                        </Button>
                    )}
                </div>

                {/* Identity Card */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden relative">
                    {/* Growthory Style Cover */}
                    <div className="h-56 w-full bg-slate-900 relative overflow-hidden group">
                        {bannerPreview ? (
                            <img src={bannerPreview} className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3d522b] via-slate-900 to-slate-900"></div>
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                            </>
                        )}
                        {editing && (
                            <label className="absolute top-4 right-4 bg-white/10 backdrop-blur p-3 rounded-full cursor-pointer hover:bg-white/20 transition-all border border-white/20">
                                <Camera className="h-5 w-5 text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setBannerFile(e.target.files[0]);
                                        setBannerPreview(URL.createObjectURL(e.target.files[0]));
                                    }
                                }} />
                            </label>
                        )}
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar Overlap */}
                        <div className="flex justify-between items-start -mt-24 mb-6 relative z-10">
                            <div className="relative group">
                                <div className="h-40 w-40 rounded-full border-[6px] border-white bg-slate-50 flex items-center justify-center text-6xl font-black text-[#3d522b] overflow-hidden shadow-lg relative">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} className="w-full h-full object-cover" />
                                    ) : (
                                        profileData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
                                    )}
                                </div>
                                {editing && (
                                    <label className="absolute inset-0 border-[6px] border-transparent flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-8 w-8 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setAvatarFile(e.target.files[0]);
                                                setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                                            }
                                        }} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {editing ? (
                            <div className="space-y-6 animate-in fade-in duration-300 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Edit className="h-4 w-4"/> Editing Core Identity</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Display Name</label>
                                        <input type="text" value={profileData.full_name} onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:border-[#3d522b] outline-none transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Current Organization</label>
                                        <input type="text" value={profileData.company} onChange={(e) => setProfileData({ ...profileData, company: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:border-[#3d522b] outline-none transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Operational Base (Location)</label>
                                        <input type="text" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:border-[#3d522b] outline-none transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Years Active</label>
                                        <input type="number" value={profileData.experience_years} onChange={(e) => setProfileData({ ...profileData, experience_years: parseInt(e.target.value) })} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:border-[#3d522b] outline-none transition-all shadow-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">LinkedIn Identifier</label>
                                    <input type="text" value={profileData.linkedin_url} onChange={(e) => setProfileData({ ...profileData, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/username" className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-bold focus:border-[#3d522b] outline-none transition-all shadow-sm" />
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-slate-200 justify-end">
                                    <button onClick={() => { setEditing(false); loadUserProfile(); }} className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-colors">Discard</button>
                                    <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-white bg-[#3d522b] hover:bg-slate-900 shadow-md transition-colors">
                                        {saving ? 'Syncing...' : 'Confirm Changes'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-300">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profileData.full_name || 'Anonymous User'}</h1>
                                <p className="text-lg font-medium text-slate-700 mt-1 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-[#3d522b]"/>
                                    {profileData.company ? `${profileData.role === 'founder' ? 'Founder' : 'Investor'} at ${profileData.company}` : `${profileData.role === 'founder' ? 'Founder' : 'Investor'}`}
                                </p>
                                <p className="text-sm font-bold text-slate-500 mt-3 flex items-center gap-2">
                                    {profileData.location && <><MapPin className="h-4 w-4" /> {profileData.location} <span className="mx-2">•</span></>}
                                    <Mail className="h-4 w-4" /> {user?.email}
                                </p>
                                
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d522b]/10 text-[#3d522b] text-xs font-black uppercase tracking-widest border border-[#3d522b]/20">
                                        <CheckCircle2 className="h-4 w-4" /> Verified Identity
                                    </span>
                                    {profileData.linkedin_url && (
                                        <a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a66c2]/10 text-[#0a66c2] hover:bg-[#0a66c2]/20 transition-colors text-xs font-black uppercase tracking-widest border border-[#0a66c2]/20">
                                            <Linkedin className="h-4 w-4" /> Connect Network
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column (About & Skills) */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Summary / Mission */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden p-8 relative">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-5 flex items-center gap-2">
                                <Target className="h-5 w-5 text-[#3d522b]" /> Mission Statement
                            </h2>
                            {editing ? (
                                <textarea rows={5} value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-900 focus:border-[#3d522b] outline-none transition-all resize-none shadow-inner" placeholder="Detail your operational background and mission..." />
                            ) : (
                                <p className="text-base text-slate-700 leading-relaxed font-medium">
                                    {profileData.bio || 'No mission profile generated yet. Awaiting input.'}
                                </p>
                            )}
                        </div>

                        {/* Specializations */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden p-8 relative">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                <Award className="h-5 w-5 text-[#3d522b]" /> Technical Specializations
                            </h2>
                            {editing && (
                                <div className="flex gap-2 mb-6">
                                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addSkill()} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:border-[#3d522b] outline-none transition-all shadow-inner" placeholder="Type a skill and hit Enter..." />
                                    <Button onClick={addSkill} className="px-4 rounded-xl bg-[#3d522b] text-white"><Plus className="h-5 w-5" /></Button>
                                </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                                {profileData.skills.length > 0 ? profileData.skills.map((skill, idx) => (
                                    <div key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                                        {skill}
                                        {editing && (
                                            <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors ml-1"><X className="h-4 w-4" /></button>
                                        )}
                                    </div>
                                )) : (
                                    <p className="text-sm font-medium text-slate-500 italic">No specializations logged in the system.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Experience/Startup Focus) */}
                    <div className="space-y-6">
                        {/* Stats Widget */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden p-8 flex flex-col justify-center items-center text-center">
                            <Shield className="h-10 w-10 text-slate-300 mb-4" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Verified Experience</h3>
                            <div className="text-5xl font-black text-slate-900">{profileData.experience_years} <span className="text-xl font-bold text-slate-400">YRS</span></div>
                        </div>

                        {/* Founder Startup Card */}
                        {profileData.role === 'founder' && myStartup && (
                            <div className="bg-[#3d522b] rounded-[2rem] shadow-lg overflow-hidden relative group">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                <div className="p-8 relative z-10 text-white">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-md">
                                            {myStartup.logo_url ? <img src={myStartup.logo_url} className="w-full h-full object-cover" /> : <Rocket className="h-6 w-6 text-[#3d522b]" />}
                                        </div>
                                        <button onClick={() => router.push(`/dashboard/startups`)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur">
                                            <ExternalLink className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 mb-1">Founder Protocol</h3>
                                    <h2 className="text-2xl font-black tracking-tight mb-2">{myStartup.name}</h2>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[9px] font-black uppercase tracking-widest">{myStartup.industry}</span>
                                        <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[9px] font-black uppercase tracking-widest">{myStartup.stage}</span>
                                    </div>
                                    
                                    <p className="text-sm font-medium text-emerald-50/80 leading-relaxed line-clamp-4">
                                        "{myStartup.tagline}"
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {/* Placeholder if Founder but no startup */}
                        {profileData.role === 'founder' && !myStartup && (
                            <div onClick={() => router.push('/startups/create')} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 border-dashed overflow-hidden p-8 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-slate-50 transition-colors group">
                                <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Rocket className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">Register Startup</h3>
                                <p className="text-xs font-medium text-slate-500">You haven't initiated a founder protocol yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
