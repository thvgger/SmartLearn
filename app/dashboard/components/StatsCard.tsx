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
  accent = "text-primary",
}: StatsCardProps) {
  return (
    <div className="glass-card rounded-xl p-5 border border-outline-variant/10 hover:border-outline-variant/20 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg bg-primary-container/10 ${accent}`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trendUp
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-rose-400 bg-rose-400/10"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-headline font-extrabold tracking-tight text-on-surface mb-1">
        {value}
      </p>
      <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}
