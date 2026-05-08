"use client";

import { useRouter } from "next/navigation";
import { LogOut, Bell, Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface DashboardHeaderProps {
  contactName: string;
  email: string;
}

export default function DashboardHeader({
  contactName,
  email,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const initials = contactName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for students, exams..." 
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all text-zinc-400 hover:text-white group">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-background" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-5 border-l border-white/5">
          <div className="hidden lg:block text-right">
            <p className="text-sm font-bold text-white leading-none mb-1">
              {contactName}
            </p>
            <p className="text-[11px] font-medium text-zinc-500 leading-none">
              {email}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-500/10">
            {initials}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-error/10 text-zinc-500 hover:text-error transition-all"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
