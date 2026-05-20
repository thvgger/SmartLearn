"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "./components/AppSidebar";
import DashboardHeader from "./components/DashboardHeader";
import { useAuth } from "@/lib/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-medium animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-950">
        <AppSidebar
          schoolName={user.school_name}
          plan={user.subscription?.plan || "free"}
        />
        <SidebarInset className="flex flex-col bg-zinc-950">
          <DashboardHeader contactName={user.contact_name} email={user.email} />
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
