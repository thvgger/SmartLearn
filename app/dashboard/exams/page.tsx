"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  BookOpen,
  Users,
  MoreHorizontal,
  Layers,
  Trash2,
  X,
} from "lucide-react";

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
      return { icon: CheckCircle2, label: "Completed", class: "text-emerald-400 bg-emerald-400/10" };
    case "scheduled":
      return { icon: Clock, label: "Scheduled", class: "text-amber-400 bg-amber-400/10" };
    case "draft":
      return { icon: AlertCircle, label: "Draft", class: "text-outline-variant bg-surface-container-high" };
    default:
      return { icon: AlertCircle, label: status, class: "text-outline-variant bg-surface-container-high" };
  }
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [questionCounts, setQuestionCounts] = useState<QuestionCount[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);


  
  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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



  const subjectIcons: Record<string, string> = {
    Mathematics: "📐", English: "📝", Physics: "⚡", Chemistry: "🧪",
    Biology: "🧬", Civics: "📚", ICT: "💻", History: "📜",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-on-surface">
            Exams & Question Bank
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Create, schedule, and manage your assessments.
          </p>
        </div>
      </div>

      {/* Question Bank Overview */}
      {/* <div className="glass-card rounded-xl border border-outline-variant/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-container/10 text-primary">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg">Question Bank</h2>
              <p className="text-xs text-outline-variant">
                {totalQuestions} questions across {questionCounts.length} subjects
              </p>
            </div>
          </div>
        </div>
        {questionCounts.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No questions yet. Add questions to build your bank.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {questionCounts.map((qs) => (
              <div
                key={qs.subject}
                className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/5 hover:border-primary/20 transition-all text-center"
              >
                <p className="text-lg mb-1">{subjectIcons[qs.subject] || "📋"}</p>
                <p className="font-headline font-bold text-lg">{qs.count}</p>
                <p className="text-[10px] uppercase tracking-widest text-outline-variant font-medium">
                  {qs.subject}
                </p>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
          <input
            type="text"
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {["all", "draft", "scheduled", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                statusFilter === s
                  ? "bg-primary-container/20 text-primary border border-primary/30"
                  : "bg-surface-container-high text-outline-variant hover:text-on-surface border border-transparent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Exams List */}
      <div className="glass-card rounded-xl border border-outline-variant/10 pb-6">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-outline-variant/10 text-[10px] uppercase tracking-widest text-outline-variant font-bold">
          <div className="col-span-4">Exam</div>
          <div className="col-span-2">Questions</div>
          <div className="col-span-2">Students</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Score</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading exams...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-outline-variant/30 mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">
              {exams.length === 0 ? "No exams yet" : "No exams found"}
            </p>
            <p className="text-outline-variant text-sm mt-1">
              {exams.length === 0 ? "Create your first exam to get started." : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/5">
            {filtered.map((exam) => {
              const statusConfig = getStatusConfig(exam.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div
                  key={exam.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center hover:bg-surface-container-high/30 transition-colors"
                >
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface-container-high text-primary">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface">{exam.title}</p>
                        <p className="text-[11px] text-outline-variant">{exam.subject} • {exam.duration}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-on-surface-variant">
                    {exam.question_count} questions
                  </div>
                  <div className="col-span-2">
                    <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                      <Users className="w-3.5 h-3.5" />
                      {exam.student_count || "—"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${statusConfig.class}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-on-surface">
                      {exam.avg_score !== null ? `${exam.avg_score}%` : "—"}
                    </span>
                    <div className="flex gap-1 relative">

                      <button
                        onClick={() => setActiveDropdown(activeDropdown === exam.id ? null : exam.id)}
                        className="p-1.5 rounded-md text-outline-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeDropdown === exam.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-surface-container-high border border-outline-variant/10 rounded-lg shadow-xl py-1 z-50">
                          <button 
                            onClick={() => { alert(`Viewing detailed report for ${exam.title}`); setActiveDropdown(null); }}
                            className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container-highest transition-colors"
                          >
                            View Report
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
