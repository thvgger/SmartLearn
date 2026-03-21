"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

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
              <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg text-sm font-bold hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-container/20"
              >
                Get Started
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
