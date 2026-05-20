import Link from "next/link";
import { Icon } from "@iconify/react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="w-full pt-24 pb-12 bg-zinc-950 border-t border-white/5 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 px-8 max-w-7xl mx-auto mb-16">
        <div className="lg:col-span-2">
          <Link href="/" className="text-xl font-extrabold text-white flex items-center gap-2 font-headline mb-6 hover:opacity-80 transition-opacity">
            <Icon icon="lucide:zap" className="text-indigo-400 w-6 h-6" />
            Swift Learn
          </Link>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-8">
            The most advanced and reliable computer-based testing platform designed specifically for the Nigerian education sector.
          </p>
          <div className="flex gap-4">
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
              <Icon icon="lucide:twitter" className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
              <Icon icon="lucide:linkedin" className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
              <Icon icon="lucide:github" className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 font-headline">Product</div>
          <ul className="space-y-4">
            <li>
              <Link href="/features" className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors">
                Security
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 font-headline">Account</div>
          <ul className="space-y-4">
            <li>
              <Link href="/login" className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors">
                Register School
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors">
                Contact Sales
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 font-headline">Support</div>
          <ul className="space-y-4">
            <li>
              <Link href="#" className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="#" className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="px-8 max-w-7xl mx-auto">
        <Separator className="bg-white/5 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            Built for Nigerian Schools &copy; {new Date().getFullYear()} Swift Learn
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:globe" className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">English (NG)</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:mail" className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">support@swiftlearn.edu.ng</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
