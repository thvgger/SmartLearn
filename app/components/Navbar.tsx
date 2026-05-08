"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, LayoutDashboard, LogOut, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const initials = user?.contact_name
    ? user.contact_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <nav className={pathname === "/login" || pathname === "/register" ? "absolute top-0 w-full z-50 p-8 flex justify-center md:justify-start" : "fixed top-0 w-full z-50 bg-[#131319]/50 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border-b border-white/5"}>
      <div className={pathname === "/login" || pathname === "/register" ? "" : "flex justify-between items-center px-8 py-4 max-w-7xl mx-auto"}>
        <Link href="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 font-headline cursor-pointer">
          <Zap className="text-indigo-300 w-6 h-6" strokeWidth={2.5} />
          Swift Learn
        </Link>
        
        {!(pathname === "/login" || pathname === "/register") && (
          <>
            <div className="hidden md:flex gap-8 items-center">
              <Link
                href="/"
                className={`font-headline font-bold tracking-tight text-sm transition-colors ${
                  pathname === "/" ? "text-indigo-300 border-b-2 border-indigo-400 pb-1" : "text-slate-400 hover:text-white pb-1 border-b-2 border-transparent"
                }`}
              >
                Home
              </Link>
              <Link
                href="/features"
                className={`font-headline font-bold tracking-tight text-sm transition-colors ${
                  pathname === "/features" ? "text-indigo-300 border-b-2 border-indigo-400 pb-1" : "text-slate-400 hover:text-white pb-1 border-b-2 border-transparent"
                }`}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className={`font-headline font-bold tracking-tight text-sm transition-colors ${
                  pathname === "/pricing" ? "text-indigo-300 border-b-2 border-indigo-400 pb-1" : "text-slate-400 hover:text-white pb-1 border-b-2 border-transparent"
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className={`font-headline font-bold tracking-tight text-sm transition-colors ${
                  pathname === "/contact" ? "text-indigo-300 border-b-2 border-indigo-400 pb-1" : "text-slate-400 hover:text-white pb-1 border-b-2 border-transparent"
                }`}
              >
                Contact
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-20 h-8 bg-white/5 animate-pulse rounded-lg" />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                  >
                    <div className="hidden sm:block text-right mr-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Signed in as</p>
                      <p className="text-xs font-bold text-white leading-none">{user.contact_name.split(' ')[0]}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                      {initials}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 glass-card border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up py-2 z-[60]">
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Institution</p>
                        <p className="text-sm font-bold text-white truncate">{user.school_name}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        Go to Dashboard
                      </Link>
                      
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-400" />
                        Account Settings
                      </Link>

                      <div className="h-px bg-white/5 my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-error hover:bg-error/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg text-sm font-bold hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-container/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
