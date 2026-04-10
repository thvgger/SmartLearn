"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Upload,
  GraduationCap,
  Mail,
  MoreHorizontal,
  UserPlus,
  X,
  Trash2,
} from "lucide-react";

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
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");



  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch {
      // silent
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
    if (score >= 85) return "text-emerald-400 bg-emerald-400/10";
    if (score >= 70) return "text-amber-400 bg-amber-400/10";
    if (score > 0) return "text-rose-400 bg-rose-400/10";
    return "text-outline-variant bg-surface-container-high";
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-on-surface">
            Student Directory
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {students.length} students across {allClasses.length - 1} classes
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${
                selectedClass === cls
                  ? "bg-primary-container/20 text-primary border border-primary/30"
                  : "bg-surface-container-high text-outline-variant hover:text-on-surface border border-transparent"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Student Table */}
      <div className="glass-card rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-outline-variant/10 text-[10px] uppercase tracking-widest text-outline-variant font-bold">
          <div className="col-span-4">Student</div>
          <div className="col-span-2">Class</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Avg Score</div>
          <div className="col-span-1"></div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading students...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-outline-variant/30 mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">
              {students.length === 0 ? "No students yet" : "No students found"}
            </p>
            <p className="text-outline-variant text-sm mt-1">
              {students.length === 0 ? "Add your first student to get started." : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/5">
            {filtered.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center hover:bg-surface-container-high/30 transition-colors"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/40 to-violet-500/40 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <p className="text-sm font-medium text-on-surface">{student.name}</p>
                </div>
                <div className="col-span-2">
                  <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {student.class_name}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="flex items-center gap-1.5 text-sm text-outline-variant">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{student.email || "—"}</span>
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${getScoreColor(student.avg_score)}`}>
                    {student.avg_score > 0 ? `${student.avg_score}%` : "—"}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end gap-1">

                  <button className="p-1.5 rounded-md text-outline-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
