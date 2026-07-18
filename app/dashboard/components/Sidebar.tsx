"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "ri:dashboard-line" },
  { href: "/dashboard/users", label: "Users", icon: "ri:group-line" },
  { href: "/dashboard/exams", label: "Exams", icon: "ri:file-text-line" },
  { href: "/dashboard/settings", label: "Settings", icon: "ri:settings-3-line" },
];

interface SidebarProps {
  schoolName: string;
  plan: string;
}

export default function Sidebar({ schoolName, plan }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-surface-container-lowest border-r border-white/5 transition-all duration-300 z-50 ${
        collapsed ? "w-[80px]" : "w-[260px]"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
          <Icon icon="ri:flashlight-fill" className="text-blue-400 w-5 h-5" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg tracking-tight text-white">
            Swift Learn
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const iconName = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative ${
                isActive
                  ? "bg-white/5 text-white"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon icon={iconName}
                className={`w-[18px] h-[18px] shrink-0 transition-colors duration-300 ${
                  isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
              
              {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-blue-500 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/5">
        {!collapsed && (
          <div className="mb-6 p-4 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="ri:shield-check-fill" className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-400">
                {plan} Plan
              </span>
            </div>
            <p className="text-sm font-medium text-white truncate">
              {schoolName}
            </p>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <Icon icon="ri:arrow-right-s-line" className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold">
              <Icon icon="ri:arrow-left-s-line" className="w-4 h-4" />
              <span>Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
