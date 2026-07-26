"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

export default function DownloadAppPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const schoolTag = user?.school_tag || "Set tag in settings";

  const handleCopyTag = () => {
    if (!user?.school_tag) return;
    navigator.clipboard.writeText(user.school_tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
          Download Swift Learn CBT App
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Install the secure offline client application on your school server, lab computers, or student laptops.
        </p>
      </div>

      {/* Main Panel - Windows Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Download Card */}
        <Card className="lg:col-span-2 bg-zinc-900 border-white/10 rounded-xl p-8 hover:border-white/20 transition-all flex flex-col justify-between group relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600/10 to-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <Icon icon="ri:windows-line" className="w-8 h-8" />
              </div>
              <div className="text-right">
                <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-black text-[9px] tracking-widest px-3 py-1 mb-1.5 select-none uppercase">
                  Active Release
                </Badge>
                <p className="text-xs text-zinc-500 font-bold">v2.4.1 • 42.5 MB</p>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
              Windows Desktop Client
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              The official Swift Learn CBT application. Features a locked-down examination browser mode that prevents students from browsing the web, accessing local files, or cheating during active assessments.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm h-12 transition-all shadow-lg shadow-blue-600/20 border-none cursor-pointer"
            >
              <a href="/download/windows">
                <Icon icon="ri:download-line" className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                Download Windows Installer (.exe)
              </a>
            </Button>
            <p className="text-center text-[10px] text-zinc-500">
              SHA256: 9e58b8f2a688b50f7574b29dc1d8920401bcf9d26857ea2e4a68ef3bd7a810f2
            </p>
          </div>
        </Card>

        {/* Right Column: System Specs & Config */}
        <div className="space-y-6">
          {/* Activation Details */}
          <Card className="bg-zinc-900 border-white/10 rounded-xl p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Icon icon="ri:key-2-line" className="w-4 h-4 text-blue-400" />
                Activation Code
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <p className="text-zinc-500 text-xs leading-relaxed">
                Copy and paste this School Tag inside the desktop app settings to link it to your school cloud dashboard.
              </p>
              
              <div className="flex items-center gap-2.5 bg-zinc-950 px-3 py-2.5 rounded-lg border border-white/5">
                <span className="text-xs text-blue-300 font-mono font-bold select-all flex-1 truncate">{schoolTag}</span>
                {user?.school_tag && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyTag}
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    {copied ? (
                      <Icon icon="ri:checkbox-circle-line" className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Icon icon="ri:file-copy-line" className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Requirements */}
          <Card className="bg-zinc-900 border-white/10 rounded-xl p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Icon icon="ri:cpu-line" className="w-4 h-4 text-blue-400" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <Icon icon="ri:checkbox-circle-line" className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>Windows 10 / 11 (64-bit)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <Icon icon="ri:checkbox-circle-line" className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>2 GB RAM (4 GB Recommended)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <Icon icon="ri:checkbox-circle-line" className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>100 MB available storage</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <Icon icon="ri:checkbox-circle-line" className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>WebView2 Runtime (Installed by default)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Installation Guide */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-0 overflow-hidden">
        <CardHeader className="p-6 pb-4 flex flex-row items-center gap-3">
          <div className="p-2.5 rounded-md bg-white/5 border border-white/5 text-blue-400 shrink-0">
            <Icon icon="ri:guide-line" className="w-5 h-5" />
          </div>
          <CardTitle className="font-headline font-bold text-lg text-white">How to Set Up offline assessments</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black flex items-center justify-center select-none shrink-0">
                  1
                </span>
                <h4 className="text-white font-bold text-sm">Install App</h4>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed pl-8">
                Download the `.exe` installer and run it on all Windows PCs designated for exams.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black flex items-center justify-center select-none shrink-0">
                  2
                </span>
                <h4 className="text-white font-bold text-sm">Enter School Tag</h4>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed pl-8">
                Launch the application and enter your School Tag <strong>&ldquo;{schoolTag}&ldquo;</strong> to sync exams and data.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black flex items-center justify-center select-none shrink-0">
                  3
                </span>
                <h4 className="text-white font-bold text-sm">Run Secure Exams</h4>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed pl-8">
                Administer completely offline, secure local exams. Grades sync back automatically once internet access resumes!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
