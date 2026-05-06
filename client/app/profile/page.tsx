"use client";
import React, { useState, useEffect } from 'react';
import { auth, API_URL } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Edit, Save, ArrowLeft, Linkedin, ExternalLink, Plus, X, Building2, Briefcase, Camera } from 'lucide-react';
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
            
            const res = await fetch(`${API_URL}/users/profile`, {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F3F2EF] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#0a66c2] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F2EF] text-slate-900 pt-24 pb-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-4">
                {/* Back button */}
                <button onClick={() => router.back()} className="flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 mb-4 group transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                {/* Main Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                    {/* Cover Photo */}
                    <div className="h-48 w-full bg-slate-200 relative overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" className="w-full h-full object-cover" alt="Cover" />
                        {editing && (
                            <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-slate-50 transition-colors">
                                <Camera className="h-5 w-5 text-[#0a66c2]" />
                            </div>
                        )}
                    </div>

                    <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                        {/* Avatar & Top Actions */}
                        <div className="flex justify-between items-start -mt-20 mb-4">
                            <div className="relative group">
                                <div className="h-36 w-36 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-5xl font-semibold text-slate-600 overflow-hidden shadow-sm relative z-10">
                                    {profileData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                {editing && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="pt-24">
                                {!editing && (
                                    <button 
                                        onClick={() => setEditing(true)}
                                        className="h-9 px-4 rounded-full border border-slate-500 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-700 hover:shadow-sm transition-all flex items-center gap-2"
                                    >
                                        <Edit className="h-4 w-4" />
                                        <span className="hidden sm:inline">Edit Profile</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Info */}
                        {editing ? (
                            <div className="space-y-6 mt-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.full_name}
                                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                            className="w-full bg-transparent border border-slate-400 rounded p-2 text-sm text-slate-900 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Company / Organization</label>
                                        <input
                                            type="text"
                                            value={profileData.company}
                                            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                            className="w-full bg-transparent border border-slate-400 rounded p-2 text-sm text-slate-900 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={profileData.location}
                                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                            className="w-full bg-transparent border border-slate-400 rounded p-2 text-sm text-slate-900 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
                                        <input
                                            type="number"
                                            value={profileData.experience_years}
                                            onChange={(e) => setProfileData({ ...profileData, experience_years: parseInt(e.target.value) })}
                                            className="w-full bg-transparent border border-slate-400 rounded p-2 text-sm text-slate-900 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile URL</label>
                                    <input
                                        type="text"
                                        value={profileData.linkedin_url}
                                        onChange={(e) => setProfileData({ ...profileData, linkedin_url: e.target.value })}
                                        className="w-full bg-transparent border border-slate-400 rounded p-2 text-sm text-slate-900 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none transition-all"
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 mt-6">
                                    <button
                                        onClick={() => { setEditing(false); loadUserProfile(); }}
                                        className="px-5 py-1.5 rounded-full font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-5 py-1.5 rounded-full font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] transition-colors border border-transparent"
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-300">
                                <h1 className="text-2xl font-semibold text-slate-900">{profileData.full_name || 'Anonymous User'}</h1>
                                <p className="text-base text-slate-900 mt-1">{profileData.company ? `${profileData.role === 'founder' ? 'Founder' : 'Investor'} at ${profileData.company}` : `${profileData.role === 'founder' ? 'Founder' : 'Investor'}`}</p>
                                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                    {profileData.location && <span>{profileData.location} &bull; </span>}
                                    <span className="font-medium text-[#0a66c2] hover:underline cursor-pointer">Contact info</span>
                                </p>
                                
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcf8c6] text-[#0f5132] text-sm font-semibold border border-[#c3e6cb]">
                                        Open to work
                                    </span>
                                    {profileData.linkedin_url && (
                                        <a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-500 text-slate-600 hover:bg-slate-50 hover:border-slate-700 hover:shadow-sm transition-all text-sm font-semibold">
                                            <Linkedin className="h-4 w-4" /> LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-slate-900">About</h2>
                        {!editing && (
                            <button onClick={() => setEditing(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                                <Edit className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    {editing ? (
                        <div>
                            <textarea
                                rows={4}
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                className="w-full bg-transparent border border-slate-400 rounded p-3 text-sm text-slate-900 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none transition-all resize-none"
                                placeholder="Write a summary about yourself..."
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {profileData.bio || 'No summary provided yet.'}
                        </p>
                    )}
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">Skills</h2>
                        {editing && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                    className="w-48 bg-transparent border border-slate-400 rounded px-3 py-1 text-sm text-slate-900 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] outline-none transition-all"
                                    placeholder="Add a skill..."
                                />
                                <button onClick={addSkill} className="px-3 py-1 rounded text-white bg-[#0a66c2] hover:bg-[#004182] font-semibold text-sm transition-colors">
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        {profileData.skills.length > 0 ? profileData.skills.map((skill, idx) => (
                            <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 last:pb-0">
                                <div className="font-semibold text-slate-800 text-sm">{skill}</div>
                                {editing && (
                                    <button onClick={() => removeSkill(skill)} className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 rounded-full transition-colors">
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500">No skills added yet.</p>
                        )}
                    </div>
                </div>

                {/* Experience / Startup Section */}
                {profileData.role === 'founder' && myStartup && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-6">Experience</h2>
                        <div className="flex gap-4">
                            <div className="h-14 w-14 bg-slate-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
                                {myStartup.logo_url ? <img src={myStartup.logo_url} className="w-full h-full object-cover" /> : <Building2 className="h-6 w-6 text-slate-400" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-slate-900">{myStartup.name}</h3>
                                <p className="text-sm text-slate-900">Founder</p>
                                <p className="text-sm text-slate-500 mt-0.5">{myStartup.industry} &bull; {myStartup.stage}</p>
                                <p className="text-sm text-slate-700 mt-3 leading-relaxed">{myStartup.tagline}</p>
                            </div>
                            <div>
                                <button onClick={() => router.push(`/dashboard/startups`)} className="p-2 hover:bg-slate-100 rounded-full transition-colors group text-slate-500">
                                    <ExternalLink className="h-5 w-5 group-hover:text-slate-900" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
