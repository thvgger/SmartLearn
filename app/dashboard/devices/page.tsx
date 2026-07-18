"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LicenseKey {
  id: string;
  key: string;
  device_name: string | null;
  is_active: boolean;
  last_verified: string | null;
  created_at: string;
}

export default function DevicesPage() {
  const [licenses, setLicenses] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchLicenses = useCallback(async () => {
    try {
      const res = await fetch("/api/licenses");
      if (res.ok) {
        const data = await res.json();
        setLicenses(data.keys || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const activeCount = licenses.filter((l) => l.is_active).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Devices & Licenses
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">
            Manage your CBT application license keys and connected devices.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 shadow-lg shadow-blue-600/20">
          <Icon icon="ri:add-line" className="w-4 h-4 mr-2" />
          Generate License
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "ri:computer-line", label: "Total Devices", value: licenses.length, color: "text-blue-400" },
          { icon: "ri:checkbox-circle-line", label: "Active", value: activeCount, color: "text-emerald-400" },
          { icon: "ri:close-circle-line", label: "Revoked", value: licenses.length - activeCount, color: "text-rose-400" },
        ].map((s, i) => (
          <Card key={i} className="bg-zinc-900 border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Icon icon={s.icon as string} className={`w-5 h-5 ${s.color}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{s.label}</span>
            </div>
            <p className="text-2xl font-headline font-black text-white">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* License Table */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-0 overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-white/5 flex flex-row items-center justify-between">
          <CardTitle className="font-headline font-bold text-lg text-white">License Keys</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchLicenses}
            className="text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg h-8 w-8"
          >
            <Icon icon="ri:refresh-line" className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-zinc-500">
              <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Syncing devices...</p>
            </div>
          ) : licenses.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl m-6">
              <Icon icon="ri:shield-line" className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-white font-bold">No license keys yet</p>
              <p className="text-zinc-500 text-sm mt-1">Generate a key to activate a CBT application.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {licenses.map((lic) => (
                <div
                  key={lic.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 gap-4 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl transition-all group-hover:scale-110 ${
                        lic.is_active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      <Icon icon="ri:computer-line" className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        {lic.device_name || "Unnamed Device"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs text-zinc-500 font-mono bg-white/5 px-2 py-0.5 rounded truncate max-w-[200px]">
                          {lic.key}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(lic.key)}
                          className="h-7 w-7 text-zinc-600 hover:text-blue-400 hover:bg-blue-500/10"
                        >
                          {copiedKey === lic.key ? (
                            <Icon icon="ri:check-line" className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Icon icon="ri:file-copy-line" className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    {lic.last_verified && (
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        <Icon icon="ri:time-line" className="w-3 h-3" />
                        <span>Last Active: {new Date(lic.last_verified).toLocaleDateString()}</span>
                      </div>
                    )}
                    <Badge
                      className={`text-[9px] font-black uppercase tracking-widest border-none px-2.5 py-0.5 ${
                        lic.is_active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {lic.is_active ? "Active" : "Revoked"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
