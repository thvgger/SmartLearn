"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";

interface Subscription {
  plan: string;
  status: string;
  expires_at: string | null;
}

interface DashboardUser {
  id: string;
  email: string;
  school_name: string;
  contact_name: string;
  subscription: Subscription | null;
}

const UserContext = createContext<DashboardUser | null>(null);
export const useDashboardUser = () => useContext(UserContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm font-medium animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <UserContext.Provider value={user}>
      <div className="min-h-screen bg-surface flex">
        <Sidebar
          schoolName={user.school_name}
          plan={user.subscription?.plan || "free"}
        />
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <DashboardHeader contactName={user.contact_name} email={user.email} />
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  );
}
