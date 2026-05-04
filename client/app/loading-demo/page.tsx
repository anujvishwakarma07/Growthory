"use client";
import React, { useState } from 'react';
import LoadingSpinner, { PulseLoader, RingLoader, EcosystemLoader } from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';

export default function LoadingDemo() {
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleButtonClick = () => {
        setButtonLoading(true);
        setTimeout(() => setButtonLoading(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#f8faf7] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-4">
                        Loading Animations
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Premium loading states for the Growthory ecosystem
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Orbital Spinner */}
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                            Orbital Spinner
                        </h3>
                        <div className="space-y-8">
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Small</span>
                                <LoadingSpinner size="sm" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Medium</span>
                                <LoadingSpinner size="md" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Large</span>
                                <LoadingSpinner size="lg" />
                            </div>
                        </div>
                    </div>

                    {/* Pulse Loader */}
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                            Pulse Loader
                        </h3>
                        <div className="space-y-8">
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Small</span>
                                <PulseLoader size="sm" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Medium</span>
                                <PulseLoader size="md" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Large</span>
                                <PulseLoader size="lg" />
                            </div>
                        </div>
                    </div>

                    {/* Ring Loader */}
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                            Ring Loader
                        </h3>
                        <div className="space-y-8">
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Small</span>
                                <RingLoader size="sm" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Medium</span>
                                <RingLoader size="md" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Large</span>
                                <RingLoader size="lg" />
                            </div>
                        </div>
                    </div>

                    {/* Ecosystem Loader */}
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                            Ecosystem Nodes
                        </h3>
                        <div className="space-y-8">
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Small</span>
                                <EcosystemLoader size="sm" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Medium</span>
                                <EcosystemLoader size="md" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Large</span>
                                <EcosystemLoader size="lg" />
                            </div>
                        </div>
                    </div>

                    {/* With Message */}
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                            With Message
                        </h3>
                        <div className="flex items-center justify-center h-full">
                            <LoadingSpinner size="lg" message="Syncing..." />
                        </div>
                    </div>

                    {/* Button States */}
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                            Button Loading
                        </h3>
                        <div className="space-y-4">
                            <Button
                                onClick={handleButtonClick}
                                loading={buttonLoading}
                                className="w-full"
                            >
                                Click Me
                            </Button>
                            <Button
                                variant="secondary"
                                loading={buttonLoading}
                                className="w-full"
                            >
                                Secondary
                            </Button>
                            <Button
                                variant="outline"
                                loading={buttonLoading}
                                className="w-full"
                            >
                                Outline
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Full Screen Demo */}
                <div className="mt-12 bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                        Full Screen Loader
                    </h3>
                    <Button onClick={() => {
                        setShowFullScreen(true);
                        setTimeout(() => setShowFullScreen(false), 3000);
                    }}>
                        Show Full Screen Loader
                    </Button>
                </div>

                {showFullScreen && (
                    <LoadingSpinner
                        fullScreen
                        size="xl"
                        message="Processing your request..."
                    />
                )}
            </div>
        </div>
    );
}
