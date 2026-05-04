"use client";
import React, { useState } from 'react';
import { auth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { FileText, CheckCircle2, Upload, Rocket, Briefcase, Zap, Sparkles, User, ArrowLeft, Award, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function ProfessionalProfile() {
    const router = useRouter();
    const toast = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const currentUser = auth.getUser();

        if (!currentUser) {
            setLoading(false);
            router.push('/login');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('id', currentUser.id);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
        const token = auth.getToken();

        try {
            const res = await fetch(`${API_URL}/professionals/upload-resume`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to process resume');

            toast.success('Resume analyzed successfully!');
            setResult(data.data);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Error processing resume');
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-6 selection:bg-[#3d522b]/20">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-6 mb-12">
                        <button onClick={() => router.push('/dashboard')} className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm group">
                            <ArrowLeft className="h-6 w-6 text-slate-400 group-hover:text-[#3d522b] transition-colors" />
                        </button>
                        <div>
                            <div className="text-[10px] font-black text-[#3d522b] uppercase tracking-[0.3em] mb-1">Profile Analysis</div>
                            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">Resume Processed</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-[#3d522b] rounded-[2.5rem] p-10 text-center shadow-xl shadow-[#3d522b]/20">
                            <Award className="h-12 w-12 text-white mx-auto mb-4" />
                            <div className="text-4xl font-black text-white mb-2">{result.parsed_resume_data?.experience_years || 'N/A'}</div>
                            <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Years Experience</div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 text-center border border-slate-200 shadow-sm">
                            <Briefcase className="h-12 w-12 text-[#3d522b] mx-auto mb-4" />
                            <div className="text-4xl font-black text-slate-900 mb-2">{result.skills?.length || 0}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skills Detected</div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 text-center border border-slate-200 shadow-sm">
                            <TrendingUp className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                            <div className="text-4xl font-black text-slate-900 mb-2">95%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-slate-900 flex items-center gap-4">
                            <User className="h-5 w-5 text-[#3d522b]" /> Professional Identity
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Role</div>
                                <div className="text-xl font-bold text-slate-900">{result.parsed_resume_data?.current_role || 'Not specified'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Summary</div>
                                <div className="text-sm text-slate-600 leading-relaxed font-medium">{result.parsed_resume_data?.summary || 'No summary available'}</div>
                            </div>
                        </div>
                    </div>

                    {result.skills && result.skills.length > 0 && (
                        <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-slate-900 flex items-center gap-4">
                                <Sparkles className="h-5 w-5 text-amber-500" /> Core Competencies
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {result.skills.map((skill: string, i: number) => (
                                    <span key={i} className="px-5 py-3 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold border border-slate-100 hover:bg-[#3d522b]/10 hover:text-[#3d522b] hover:border-[#3d522b]/20 transition-all">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Button size="lg" className="rounded-2xl px-12 py-5 bg-[#3d522b] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#3d522b]/20" onClick={() => router.push('/dashboard')}>
                            View Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-6 selection:bg-[#3d522b]/20">
            <div className="max-w-2xl mx-auto">
                <div className="mb-16 text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-[#3d522b] mb-6 shadow-sm">
                        <Briefcase className="h-7 w-7" />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-none mb-3">Professional Profile</h1>
                    <p className="text-slate-500 font-medium">Upload your resume to join the expert network.</p>
                </div>

                <form onSubmit={handleUpload} className="bg-white rounded-[3.5rem] p-10 md:p-14 space-y-10 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 olive-gradient opacity-10"></div>

                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center hover:border-[#3d522b]/30 hover:bg-slate-50 transition-all group cursor-pointer relative">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                required
                            />
                            <Upload className="h-16 w-16 text-slate-300 mx-auto mb-6 group-hover:text-[#3d522b] transition-colors" />
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-3">
                                {file ? file.name : 'Drop Resume Here'}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">
                                {file ? 'File selected. Click submit to process.' : 'PDF format only. Max 5MB.'}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                            <div className="flex items-start gap-4 mb-6">
                                <Sparkles className="h-5 w-5 text-[#3d522b] mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-2">AI Processing</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                        Our AI will extract your skills, experience, and career highlights to match you with relevant opportunities.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    'Skill extraction & categorization',
                                    'Experience timeline analysis',
                                    'Role & seniority detection',
                                    'Semantic job matching'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                        <CheckCircle2 className="h-4 w-4 text-[#3d522b]" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full py-6 rounded-[1.5rem] bg-[#3d522b] hover:bg-[#606c38] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#3d522b]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                    >
                        {loading ? (
                            <span className="flex items-center gap-3">
                                <Sparkles className="animate-spin h-5 w-5" /> Processing Resume...
                            </span>
                        ) : (
                            <span className="flex items-center gap-3">
                                <Rocket className="h-5 w-5" /> Submit Profile
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
