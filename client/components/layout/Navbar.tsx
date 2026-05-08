"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Menu, X, Rocket, ChevronDown, Globe, Zap, Users, BarChart3, LogOut, User, Settings, Plus, Home, ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const pathname = usePathname();
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial user load
        setUser(auth.getUser());

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [pathname]); // Re-check user on route changes

    const handleLogout = () => {
        auth.logout();
        setUser(null);
        window.location.href = '/login';
    };

    const navLinks = [
        { name: 'Dashboard', href: user?.role === 'professional' ? '/professional' : '/dashboard', icon: Rocket },
        { name: 'Network', href: '/network', icon: Users },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Features', href: '/features', icon: Zap },
        ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin', icon: ShieldAlert }] : []),
    ];

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    if (isAuthPage) return null;

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 pointer-events-none ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between pointer-events-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-9 w-auto flex items-center justify-center transition-all duration-300">
                            <Image
                                src="/brand-logo.png"
                                alt="Growthory Logo"
                                width={400}
                                height={30}
                                className="h-full w-auto object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${pathname === link.href ? 'text-[#3d522b]' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* User Avatar with Dropdown */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-[#3d522b] font-black border border-slate-200 hover:bg-[#3d522b] hover:text-white transition-all cursor-pointer"
                                    >
                                        {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-slate-100">
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                                    {user.full_name || 'User'}
                                                </p>
                                                <p className="text-xs text-slate-500 font-medium truncate">
                                                    {user.email}
                                                </p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                                                >
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">Profile</span>
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                                                >
                                                    <Settings className="h-4 w-4 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">Settings</span>
                                                </Link>
                                                {user.role === 'admin' && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setShowUserMenu(false)}
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors"
                                                    >
                                                        <ShieldAlert className="h-4 w-4 text-red-500" />
                                                        <span className="text-sm font-black text-red-600 uppercase tracking-tighter">Admin Portal</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Logout Button - Separate */}
                                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Sign Out">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-xs font-black uppercase tracking-[0.2em] text-[#3d522b] hover:opacity-70 transition-opacity">Sign In</Link>
                                <Link href="/signup">
                                    <Button className="bg-[#3d522b] hover:bg-[#606c38] text-white rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3d522b]/20">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Actions - Profile + Toggle */}
                    <div className="lg:hidden flex items-center gap-3">
                        {user && (
                            <Link href="/profile" className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-[#3d522b] font-black border border-slate-200 shadow-sm overflow-hidden active:scale-90 transition-transform">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-xs">{user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}</span>
                                )}
                            </Link>
                        )}
                        <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 p-6 space-y-4 animate-in slide-in-from-top-2 pointer-events-auto">
                        {user && navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <link.icon className={`h-5 w-5 ${pathname === link.href ? 'text-[#3d522b]' : 'text-slate-400'}`} />
                                <span className={`font-bold uppercase tracking-widest text-sm ${pathname === link.href ? 'text-[#3d522b]' : 'text-slate-600'}`}>{link.name}</span>
                            </Link>
                        ))}

                        {user ? (
                            <>
                                <div className="pt-4 border-t border-slate-100">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        <User className="h-5 w-5 text-slate-400" />
                                        <span className="font-bold uppercase tracking-widest text-sm text-slate-600">Profile</span>
                                    </Link>
                                    <Link
                                        href="/settings"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        <Settings className="h-5 w-5 text-slate-400" />
                                        <span className="font-bold uppercase tracking-widest text-sm text-slate-600">Settings</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center gap-4 p-4 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                                    >
                                        <LogOut className="h-5 w-5 text-red-500" />
                                        <span className="font-bold uppercase tracking-widest text-sm text-red-500">Sign Out</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <Link href="/login" className="py-3 text-center text-xs font-black uppercase text-[#3d522b]">Sign In</Link>
                                <Link href="/signup" className="py-3 text-center bg-[#3d522b] text-white rounded-xl text-xs font-black uppercase">Sign Up</Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Mobile Bottom Navigation - Global - Only visible when logged in */}
            {user && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
                    <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] safe-area-bottom pointer-events-auto">
                        <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${pathname === '/dashboard' ? 'text-[#3d522b]' : 'text-slate-400'}`}>
                            <Home className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Hub</span>
                        </Link>
                        <Link href="/network" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${pathname === '/network' ? 'text-[#3d522b]' : 'text-slate-400'}`}>
                            <Users className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Node</span>
                        </Link>
                        <div className="relative">
                            <Link href="/startups/create" className="flex flex-col items-center justify-center bg-[#3d522b] text-white h-14 w-14 rounded-2xl shadow-[0_8px_25px_-5px_rgba(61,82,43,0.4)] -mt-10 border-4 border-[#f8faf7] transition-all active:scale-95">
                                <Plus className="h-7 w-7" />
                            </Link>
                        </div>
                        <Link href="/analytics" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${pathname === '/analytics' ? 'text-[#3d522b]' : 'text-slate-400'}`}>
                            <BarChart3 className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Signal</span>
                        </Link>
                        <Link href="/profile" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${pathname === '/profile' ? 'text-[#3d522b]' : 'text-slate-400'}`}>
                            <User className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Self</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
