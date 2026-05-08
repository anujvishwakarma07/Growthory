"use client";
import React, { useEffect, useState } from 'react';
import { auth, API_URL } from '@/lib/auth';
import { BarChart3, TrendingUp, Zap, PieChart, Activity, Globe, ArrowUpRight, ArrowDownRight, Rocket, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('1M');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/system/stats?timeframe=${timeframe}`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [timeframe]);

    const statDisplay = [
        { label: 'Total Ventures', value: stats?.totalStartups || '842', trend: '+12.5%', up: true, icon: Rocket },
        { label: 'Protocol Matches', value: stats?.activeMatches || '156', trend: '+5.2%', up: true, icon: Zap },
        { label: 'Market Velocity', value: stats?.totalVolume || '$1.4B', trend: '-1.2%', up: false, icon: PieChart },
        { label: 'Active Nodes', value: stats?.globalNodes || '42k', trend: '+2%', up: true, icon: Globe },
    ];

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 selection:bg-[#3d522b]/20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3d522b]/5 border border-[#3d522b]/10 text-[#3d522b] text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
                            <Activity className="h-3 w-3" /> System Intelligence
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">Ecosystem Pulse</h1>
                        <p className="text-slate-500 font-medium mt-2">Aggregated semantic signals from the global network.</p>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {statDisplay.map((stat, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#3d522b]/5 transition-all duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center">
                                    <stat.icon className="h-6 w-6 text-[#3d522b]" />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                                    {stat.trend} {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                </div>
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-3xl font-black text-slate-900 leading-none">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-16 relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Global Venture Flow</h3>
                            <div className="flex bg-slate-50 p-1 rounded-full border border-slate-200">
                                {['1W', '1M', '1Y'].map((t) => (
                                    <button 
                                        key={t}
                                        onClick={() => setTimeframe(t)}
                                        className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                            timeframe === t 
                                            ? 'bg-[#3d522b] text-white shadow-lg shadow-[#3d522b]/20' 
                                            : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[350px] flex items-end gap-2 px-4 relative z-10">
                            {(Array.isArray(stats?.monthlyTrend) && stats.monthlyTrend.length === 12 
                                ? stats.monthlyTrend 
                                : [40, 60, 45, 70, 55, 90, 65, 80, 50, 85, 95, 75]
                            ).map((h: number, i: number) => (
                                <div key={i} className="flex-grow group/bar relative h-full flex items-end">
                                    <div
                                        className="w-full rounded-t-xl transition-all duration-700 ease-out bg-[#3d522b]/10 group-hover/bar:bg-[#3d522b] shadow-sm min-w-[12px]"
                                        style={{ height: `${Math.max(8, h)}%` }}
                                    ></div>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black opacity-0 group-hover/bar:opacity-100 transition-all transform translate-y-2 group-hover/bar:translate-y-0 shadow-xl whitespace-nowrap z-20">
                                        {h}% Growth
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-t border-slate-50 pt-8">
                            {timeframe === '1W' ? (
                                <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></>
                            ) : (
                                <><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-4 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-12">Sector Map</h3>
                            <div className="space-y-10">
                                {(Array.isArray(stats?.sectorMap) && stats.sectorMap.length > 0
                                    ? stats.sectorMap
                                    : [
                                        { name: 'Artificial Intelligence', val: 42, color: 'bg-[#3d522b]' },
                                        { name: 'Fintech / Web3', val: 28, color: 'bg-amber-500' },
                                        { name: 'SaaS / Enterprise', val: 18, color: 'bg-blue-600' },
                                        { name: 'Healthtech', val: 12, color: 'bg-teal-600' },
                                    ]
                                ).map((item: any, i: number) => {
                                    const colors = ['bg-[#3d522b]', 'bg-amber-500', 'bg-blue-600', 'bg-teal-600', 'bg-purple-600'];
                                    return (
                                        <div key={i} className="group">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                                <span className="text-slate-500 group-hover:text-[#3d522b] transition-colors">{item.name}</span>
                                                <span className="text-slate-900">{item.val}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                <div className={`h-full ${item.color || colors[i % colors.length]} shadow-sm group-hover:opacity-80 transition-opacity`} style={{ width: `${item.val}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-12 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-center">
                            <TrendingUp className="h-8 w-8 text-[#3d522b] mx-auto mb-3" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                SECTOR SHIFT PREDICTED IN <br /> <span className="text-[#3d522b]">Q3 2026</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* AI Activity Stream */}
                <div className="mt-12 bg-[#3d522b] rounded-[3.5rem] p-12 shadow-2xl shadow-[#3d522b]/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-[100px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000"></div>

                    <div className="flex items-center gap-4 mb-12">
                        <Sparkles className="h-8 w-8 text-white animate-pulse" />
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none">Semantic Signal Stream</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Major pivot detected in Fintech sector (London node)",
                            "High-intensity match score (98%) between Aura AI and Sequoia VC",
                            "Global talent migration shift towards AI-safety startups",
                            "New unicorn-potential seed round initiated in Southeast Asia"
                        ].map((log, i) => (
                            <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>
                                <span className="text-white/80 text-sm font-bold tracking-tight">{log}</span>
                                <span className="ml-auto text-[8px] font-black text-white/40 uppercase tracking-widest font-mono">2m ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

