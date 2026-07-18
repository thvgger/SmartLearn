"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "ri:dashboard-3-line", activeIcon: "ri:dashboard-3-fill" },
  { href: "/dashboard/users", label: "Manage Users", icon: "ri:group-line", activeIcon: "ri:group-fill" },
  { href: "/dashboard/exams", label: "Examinations", icon: "ri:file-list-3-line", activeIcon: "ri:file-list-3-fill" },
  // { href: "/dashboard/devices", label: "CBT Devices", icon: "ri:macbook-line", activeIcon: "ri:macbook-fill" },
  { href: "/dashboard/download", label: "Download App", icon: "ri:download-cloud-2-line", activeIcon: "ri:download-cloud-2-fill" },
  { href: "/dashboard/settings", label: "Settings", icon: "ri:settings-4-line", activeIcon: "ri:settings-4-fill" },
];

interface AppSidebarProps {
  schoolName: string;
  plan: string;
}

export function AppSidebar({ schoolName, plan }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-zinc-950">
      <SidebarHeader className="h-20 flex items-center justify-center group-data-[collapsible=icon]:px-0 px-6">
        <div className="flex items-center gap-3 w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center">
          <div className="w-9 h-9 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 transition-all">
            <Icon icon="ri:flashlight-fill" className="text-white w-5 h-5 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-lg tracking-tight text-white leading-none mb-1">
              Swift Learn
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-0 pt-6">
        <SidebarGroup className="group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 group-data-[collapsible=icon]:hidden px-3">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
            <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-full">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href} className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className={`h-11 rounded-lg transition-colors group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center ${
                        isActive 
                          ? "bg-blue-600/10 text-white" 
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {/* Active Indicator Line */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full group-data-[collapsible=icon]:left-0" />
                      )}
                      
                      <Icon 
                        icon={isActive ? item.activeIcon : item.icon} 
                        className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-400"}`} 
                      />
                      <span className="font-medium text-sm group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Small System Widget - only shows when expanded */}
        {/* <div className="mt-auto pt-8 px-3 pb-2 group-data-[collapsible=icon]:hidden">
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5">
                <Icon icon="ri:server-line" className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">System Status</p>
                <p className="text-[10px] font-medium text-emerald-500">All systems operational</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-medium">
                <span className="text-zinc-400">Storage Usage</span>
                <span className="text-zinc-300">32%</span>
              </div>
              <Progress value={32} className="h-1.5 bg-zinc-800" indicatorClassName="bg-blue-500" />
            </div>
          </div>
        </div> */}
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 border-t border-white/5 flex justify-center">
        <SidebarMenu className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-full">
          <SidebarMenuItem className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <SidebarMenuButton 
                  size="lg" 
                  className="h-14 data-[state=open]:bg-white/5 text-white hover:bg-white/5 transition-colors rounded-xl group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-0" 
                />
              }>
                <div className="flex aspect-square size-9 group-data-[collapsible=icon]:size-7 items-center justify-center rounded-lg bg-zinc-800 border border-white/5 text-white flex-shrink-0 transition-all">
                  <Icon icon="ri:building-4-fill" className="size-4 group-data-[collapsible=icon]:size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                  <span className="truncate font-bold text-white">{schoolName}</span>
                  <span className="truncate text-xs text-zinc-500 capitalize">{plan} Plan</span>
                </div>
                <Icon icon="ri:expand-up-down-line" className="ml-auto size-4 text-zinc-500 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 bg-zinc-900 border-white/10 rounded-xl p-2"
                side="bottom"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem className="text-zinc-300 hover:text-white focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg px-3 py-2">
                  <Icon icon="ri:profile-line" className="w-4 h-4 mr-2 text-zinc-400" />
                  <span className="font-medium text-sm">School Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:text-white focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg px-3 py-2">
                  <Icon icon="ri:bank-card-line" className="w-4 h-4 mr-2 text-zinc-400" />
                  <span className="font-medium text-sm">Billing & Plan</span>
                </DropdownMenuItem>
                <div className="h-px bg-white/5 my-1 mx-2" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 cursor-pointer rounded-lg px-3 py-2"
                >
                  <Icon icon="ri:logout-circle-r-line" className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
