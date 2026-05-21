import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: string;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  accent = "text-zinc-100",
}: StatsCardProps) {
  return (
    <Card className="bg-zinc-900 border-white/10 rounded-lg shadow-sm hover:border-white/20 transition-colors p-0">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400 mb-1">
            {label}
          </p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold text-white tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                  trendUp
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-rose-400 bg-rose-400/10"
                }`}
              >
                {trendUp ? "↑" : "↓"} {trend}
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-md bg-white/5 border border-white/5 ${accent}`}>
          <Icon icon={icon} className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}
