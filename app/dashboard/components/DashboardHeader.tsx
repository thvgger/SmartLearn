"use client";

import { useRouter } from "next/navigation";
import { LogOut, Bell } from "lucide-react";

interface DashboardHeaderProps {
  contactName: string;
  email: string;
}

export default function DashboardHeader({
  contactName,
  email,
}: DashboardHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const initials = contactName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-outline-variant/10 bg-surface-container-lowest/50 backdrop-blur-lg sticky top-0 z-40">
      <div>
        {/* Mobile logo */}
        <h2 className="md:hidden font-headline font-bold text-lg text-white">
          Swift Learn
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-surface-container-high transition-colors text-outline-variant hover:text-on-surface">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* User */}
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-outline-variant/10">
          <div className="text-right">
            <p className="text-sm font-medium text-on-surface leading-tight">
              {contactName}
            </p>
            <p className="text-[11px] text-outline-variant leading-tight">
              {email}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/20">
            {initials}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-error/10 text-outline-variant hover:text-error transition-colors"
          title="Sign out"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      </div>
    </header>
  );
}
