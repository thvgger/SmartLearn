import Link from "next/link";
import { Globe, AtSign, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full pt-24 pb-12 bg-surface-container-lowest border-t border-white/5 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 px-8 max-w-7xl mx-auto mb-16">
        <div className="lg:col-span-2">
          <Link href="/" className="text-xl font-extrabold text-white flex items-center gap-2 font-headline mb-6">
            <Zap className="text-indigo-400 w-6 h-6" strokeWidth={2.5} />
            Swift Learn
          </Link>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
            The most advanced and reliable computer-based testing platform designed specifically for the Nigerian education sector.
          </p>
        </div>
        
        <div>
          <div className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 font-headline">Product</div>
          <ul className="space-y-4">
            <li>
              <Link href="/features" className="text-xs font-bold text-zinc-500 hover:text-indigo-300 transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-xs font-bold text-zinc-500 hover:text-indigo-300 transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="text-xs font-bold text-zinc-500 hover:text-indigo-300 transition-colors">
                Security
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 font-headline">Account</div>
          <ul className="space-y-4">
            <li>
              <Link href="/login" className="text-xs font-bold text-zinc-500 hover:text-indigo-300 transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-xs font-bold text-zinc-500 hover:text-indigo-300 transition-colors">
                Register School
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-xs font-bold text-zinc-500 hover:text-indigo-300 transition-colors">
                Contact Sales
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 font-headline">Support</div>
          <ul className="space-y-4">
            <li>
              <Link href="#" className="text-xs font-bold text-zinc-500 hover:text-indigo-300 transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="#" className="text-xs font-bold text-zinc-500 hover:text-indigo-300 transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="text-xs font-bold text-zinc-500 hover:text-indigo-300 transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          Built for Nigerian Schools &copy; {new Date().getFullYear()} Swift Learn
        </p>
        <div className="flex gap-6">
          <Globe className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
          <AtSign className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}
