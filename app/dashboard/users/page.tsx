"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@iconify/react";
import { cn, getErrorMessage } from "@/lib/utils";

interface UserRecord {
  id: string;
  name: string;
  email: string | null;
  role: string;
  class_name: string;
  avg_score: number;
  enrolled_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(await getErrorMessage(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Derive class and role lists from data
  const allClasses = ["All", ...Array.from(new Set(users.map((u) => u.class_name))).sort()];
  const allRoles = ["All", ...Array.from(new Set(users.map((u) => u.role))).sort()];

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "All" || u.class_name === selectedClass;
    const matchesRole = selectedRole === "All" || u.role === selectedRole;
    return matchesSearch && matchesClass && matchesRole;
  });

  function getScoreColor(score: number) {
    if (score >= 85) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 70) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (score > 0) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    return "bg-white/5 text-zinc-500 border-white/5";
  }

  function getRoleIcon(role: string) {
    if (role === "teacher" || role === "admin") return "ri:shield-line";
    return "ri:user-line";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            User Directory
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">
            {users.length} users across {allClasses.length - 1} classes
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-6 shadow-lg shadow-indigo-600/20">
          <Icon icon="ri:user-line-plus" className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3">
          <Icon icon="ri:error-warning-fill" className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <Button size="sm" variant="ghost" onClick={fetchUsers} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-3 border-none cursor-pointer">
            Retry
          </Button>
        </div>
      )}

      {/* Search & Filter */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-4">
        <div className="flex flex-col gap-6">
          <div className="relative flex-1 group">
            <Icon icon="ri:search-line" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border-white/5 rounded-xl pl-10 h-11 text-white placeholder:text-zinc-600 font-medium"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Role</span>
              <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
                {allRoles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      selectedRole === r
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-px h-8 bg-white/5 hidden md:block" />

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Class</span>
              <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
                {allClasses.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      selectedClass === cls
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* User Table */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-0 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-zinc-500">
            <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl m-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Icon icon="ri:user-line" className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-white font-bold text-lg">
              {users.length === 0 ? "No users yet" : "No users found"}
            </p>
            <p className="text-zinc-500 text-sm mt-1 max-w-[280px]">
              {users.length === 0 ? "Add your first user to start managing your school." : "Try adjusting your search or filter settings."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="w-[30%] text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">User</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Role & Class</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Contact</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Avg Score</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12 px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id} className="hover:bg-white/[0.02] border-white/5 group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border-none group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/10">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-black">
                          {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{user.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-violet-400">
                        <Icon icon={getRoleIcon(user.role)} className="w-3 h-3" />
                        {user.role}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                        <Icon icon="ri:graduation-cap-line" className="w-3 h-3" />
                        {user.class_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium max-w-[180px]">
                      <Icon icon="ri:send-plane-line" className="w-3 h-3 shrink-0 text-zinc-600" />
                      <span className="truncate">{user.email || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === "student" ? (
                      <Badge className={cn("text-[10px] font-black border-none px-2.5 py-0.5", getScoreColor(user.avg_score))}>
                        {user.avg_score > 0 ? `${Math.round(user.avg_score)}%` : "—"}
                      </Badge>
                    ) : (
                      <span className="text-xs text-zinc-700 font-black">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg" />}>
                        <Icon icon="ri:more-line" className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 w-40">
                        <DropdownMenuItem className="text-xs font-bold text-zinc-300 focus:text-white cursor-pointer" onClick={() => alert(`Detailed analytics for ${user.name}`)}>
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold text-zinc-300 focus:text-white cursor-pointer">
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold text-rose-400 focus:text-rose-300 focus:bg-rose-400/10 cursor-pointer">
                          Suspend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
