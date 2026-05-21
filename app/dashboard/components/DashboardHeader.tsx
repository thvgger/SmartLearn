"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="text-zinc-400 hover:text-white" />
        <div className="max-w-md w-full hidden md:block">
          <div className="relative group">
            <Icon icon="ri:search-line" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input 
              type="text" 
              placeholder="Search for students, exams..." 
              className="w-full bg-white/[0.03] border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative text-zinc-400 hover:text-white hover:bg-white/5 group">
          <Icon icon="ri:notification-3-line" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-950" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="flex items-center gap-3 pl-3 lg:pl-5 border-l border-white/5 outline-none group" />}>
            <div className="hidden lg:block text-right">
              <p className="text-sm font-bold text-white leading-none mb-1 group-hover:text-indigo-300 transition-colors">
                {contactName}
              </p>
              <p className="text-[11px] font-medium text-zinc-500 leading-none">
                {email}
              </p>
            </div>
            <Avatar className="w-9 h-9 border-none shadow-lg shadow-indigo-500/10 transition-transform group-hover:scale-105">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-zinc-900 border-white/10" align="end">
            <DropdownMenuItem render={<button onClick={() => router.push("/dashboard/settings")} className="w-full text-left cursor-pointer" />}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-red-400/10 cursor-pointer">
              <Icon icon="ri:logout-box-r-line" className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
