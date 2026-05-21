"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

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

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <nav className={isAuthPage ? "absolute top-0 w-full z-50 p-8 flex justify-center md:justify-start" : "fixed top-0 w-full z-50 bg-background/50 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border-b border-white/5"}>
      <div className={isAuthPage ? "" : "flex justify-between items-center px-8 py-4 max-w-7xl mx-auto"}>
        <Link href="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 font-headline cursor-pointer hover:opacity-90 transition-opacity">
          <Icon icon="ri:flashlight-line" className="text-indigo-300 w-6 h-6" />
          Swift Learn
        </Link>
        
        {!isAuthPage && (
          <>
            <div className="hidden md:flex gap-8 items-center">
              {[
                { label: "Home", href: "/" },
                { label: "Features", href: "/features" },
                { label: "Pricing", href: "/pricing" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-headline font-bold tracking-tight text-sm transition-colors ${
                    pathname === link.href ? "text-indigo-300 border-b-2 border-indigo-400 pb-1" : "text-slate-400 hover:text-white pb-1 border-b-2 border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-20 h-8 bg-white/5 animate-pulse rounded-lg" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group outline-none">
                      <div className="hidden sm:block text-right mr-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Signed in as</p>
                        <p className="text-xs font-bold text-white leading-none">{user.contact_name.split(' ')[0]}</p>
                      </div>
                      <Avatar className="w-8 h-8 border-none ring-offset-background group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[10px] font-bold border-none">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <Icon icon="ri:arrow-down-s-line" className="w-4 h-4 text-slate-400 transition-transform duration-300 group-aria-expanded:rotate-180" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 bg-zinc-900/95 backdrop-blur-xl border-white/10 rounded-xl" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex flex-col space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Institution</p>
                          <p className="text-sm font-bold text-white truncate">{user.school_name}</p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem 
                      onClick={() => router.push("/dashboard")}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Icon icon="ri:dashboard-line" className="w-4 h-4 text-indigo-400" />
                      Go to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push("/dashboard/settings")}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Icon icon="ri:user-line" className="w-4 h-4 text-indigo-400" />
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-400/10 transition-colors cursor-pointer"
                    >
                      <Icon icon="ri:logout-box-r-line" className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 shadow-lg shadow-indigo-600/20">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
