import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  accent = "text-indigo-400",
}: StatsCardProps) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 hover:bg-white/[0.03] transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] rounded-full -translate-y-12 translate-x-12 group-hover:bg-indigo-500/10 transition-colors" />
      
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white/[0.05] ${accent}`}>
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
        
        {trend && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
              trendUp
                ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
                : "text-rose-400 bg-rose-400/10 border border-rose-400/20"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-headline font-black text-white tracking-tight mb-1">
          {value}
        </h3>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          {label}
        </p>
      </div>
    </div>
  );
}
