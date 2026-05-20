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
import { 
  Plus, 
  Search, 
  FileText, 
  BookOpen, 
  Layers, 
  Clock, 
  Users, 
  MoreHorizontal,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Exam {
  id: string;
  title: string;
  subject: string;
  question_count: number;
  duration: string;
  status: string;
  scheduled_date: string | null;
  student_count: number;
  avg_score: number | null;
  created_at: string;
}

interface QuestionCount {
  subject: string;
  count: number;
}

function getStatusConfig(status: string) {
  switch (status) {
    case "completed":
      return { icon: CheckCircle2, label: "Completed", variant: "default" as const, class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    case "scheduled":
      return { icon: Clock, label: "Scheduled", variant: "secondary" as const, class: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    case "draft":
      return { icon: AlertCircle, label: "Draft", variant: "outline" as const, class: "bg-white/5 text-zinc-500 border-white/5" };
    default:
      return { icon: AlertCircle, label: status, variant: "outline" as const, class: "bg-white/5 text-zinc-500 border-white/5" };
  }
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionCounts, setQuestionCounts] = useState<QuestionCount[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalQuestions, setTotalQuestions] = useState(0);

  const fetchExams = useCallback(async () => {
    try {
      const res = await fetch("/api/exams");
      if (res.ok) {
        const data = await res.json();
        setExams(data.exams || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuestionCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/questions?counts=true");
      if (res.ok) {
        const data = await res.json();
        setQuestionCounts(data.counts || []);
        setTotalQuestions(data.total || 0);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchExams();
    fetchQuestionCounts();
  }, [fetchExams, fetchQuestionCounts]);

  const filtered = exams.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Exams & Question Bank
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">
            Create, schedule, and manage your assessments.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-6 shadow-lg shadow-indigo-600/20">
          <Plus className="w-4 h-4 mr-2" strokeWidth={3} />
          Create New Exam
        </Button>
      </div>

      {/* Search & Filter */}
      <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-4 gap-0">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input
              type="text"
              placeholder="Search exams by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border-white/5 rounded-xl pl-10 h-11 text-white placeholder:text-zinc-600 font-medium"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            {["all", "draft", "scheduled", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Exams List */}
      <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-zinc-500">
            <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Loading exams...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl m-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-white font-bold text-lg">
              {exams.length === 0 ? "No exams yet" : "No exams found"}
            </p>
            <p className="text-zinc-500 text-sm mt-1 max-w-[280px]">
              {exams.length === 0 ? "Create your first exam to get started with Swift Learn." : "Try adjusting your search or filter settings."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="w-[40%] text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Exam</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Details</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12">Stats</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-500 h-12 px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((exam) => {
                const statusConfig = getStatusConfig(exam.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <TableRow key={exam.id} className="hover:bg-white/[0.02] border-white/5 group">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{exam.title}</p>
                          <p className="text-[11px] text-zinc-500 font-medium">{exam.subject}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                          <Layers className="w-3 h-3" />
                          {exam.question_count} questions
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                          <Clock className="w-3 h-3" />
                          {exam.duration}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-[9px] font-black uppercase tracking-widest border-none px-2.5 py-0.5", statusConfig.class)}>
                        <StatusIcon className="w-3 h-3 mr-1.5" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-bold">
                          {exam.avg_score !== null ? `${Math.round(exam.avg_score)}%` : "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 font-medium">
                          <Users className="w-3 h-3" />
                          {exam.student_count || 0} students
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg" />}>
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 w-40">
                          <DropdownMenuItem className="text-xs font-bold text-zinc-300 focus:text-white cursor-pointer" onClick={() => alert(`Detailed report for ${exam.title}`)}>
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold text-zinc-300 focus:text-white cursor-pointer">
                            Edit Exam
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold text-rose-400 focus:text-rose-300 focus:bg-rose-400/10 cursor-pointer">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
