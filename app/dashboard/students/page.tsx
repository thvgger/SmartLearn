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

interface Student {
  id: string;
  name: string;
  email: string | null;
  class_name: string;
  avg_score: number;
  enrolled_at: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/students");
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      setError(await getErrorMessage(err, "Failed to load students. Please try again."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Derive class list from data
  const allClasses = ["All", ...Array.from(new Set(students.map((s) => s.class_name))).sort()];

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "All" || s.class_name === selectedClass;
    return matchesSearch && matchesClass;
  });

  function getScoreColor(score: number) {
    if (score >= 85) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 70) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (score > 0) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    return "bg-white/5 text-zinc-500 border-white/5";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Student Directory
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">
            {students.length} students across {allClasses.length - 1} classes
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 shadow-lg shadow-blue-600/20">
          <Icon icon="ri:user-line-plus" className="w-4 h-4 mr-2" />
          Add New Student
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3">
          <Icon icon="ri:error-warning-fill" className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <Button size="sm" variant="ghost" onClick={fetchStudents} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-3 border-none">
            Retry
          </Button>
        </div>
      )}

      {/* Search & Filter */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Icon icon="ri:search-line" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border-white/5 rounded-xl pl-10 h-11 text-white placeholder:text-zinc-600 font-medium"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
            {allClasses.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedClass === cls
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Student Table */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-0 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-zinc-500">
            <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Loading students...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl m-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Icon icon="ri:user-line" className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-white font-bold text-lg">
              {students.length === 0 ? "No students yet" : "No students found"}
            </p>
            <p className="text-zinc-500 text-sm mt-1 max-w-[280px]">
              {students.length === 0 ? "Add your first student to get started." : "Try adjusting your search or filter settings."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="w-[30%] text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Student</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Class</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Contact</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Avg Score</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12 px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id} className="hover:bg-white/[0.02] border-white/5 group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border-none group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-black">
                          {student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{student.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                      <Icon icon="ri:graduation-cap-line" className="w-3 h-3" />
                      {student.class_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium max-w-[180px]">
                      <Icon icon="ri:send-plane-line" className="w-3 h-3 shrink-0 text-zinc-600" />
                      <span className="truncate">{student.email || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-[10px] font-black border-none px-2.5 py-0.5", getScoreColor(student.avg_score))}>
                      {student.avg_score > 0 ? `${Math.round(student.avg_score)}%` : "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg" />}>
                        <Icon icon="ri:more-line" className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 w-40">
                        <DropdownMenuItem className="text-xs font-bold text-zinc-300 focus:text-white cursor-pointer" onClick={() => alert(`Detailed analytics for ${student.name}`)}>
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold text-zinc-300 focus:text-white cursor-pointer">
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold text-rose-400 focus:text-rose-300 focus:bg-rose-400/10 cursor-pointer">
                          Delete Record
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
