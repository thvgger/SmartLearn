import Link from "next/link";
import { Globe, AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-8 bg-[#0e0e14] border-t border-white/5 mt-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto mb-16">
        <div>
          <div className="text-lg font-bold text-white mb-4 font-headline">Brand</div>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="font-body text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="font-body text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                Contact
              </Link>
            </li>
            <li>
              <Link href="#" className="font-body text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                Careers
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-lg font-bold text-white mb-4 font-headline">Product</div>
          <ul className="space-y-3">
            <li>
              <Link href="/features" className="font-body text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="font-body text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="font-body text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                Security
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-lg font-bold text-white mb-4 font-headline">Account</div>
          <ul className="space-y-3">
            <li>
              <Link href="/login" className="font-body text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/register" className="font-body text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                Register School
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-lg font-bold text-white mb-4 font-[var(--font-headline)]">Support</div>
          <ul className="space-y-3">
            <li>
              <Link href="#" className="font-[var(--font-body)] text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="#" className="font-[var(--font-body)] text-xs text-slate-500 hover:text-indigo-300 hover:translate-x-1 transition-transform inline-block">
                Help Center
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
        <p className="font-[var(--font-body)] text-xs text-slate-400">Built for Nigerian Schools &copy; {new Date().getFullYear()} Swift Learn</p>
        <div className="flex gap-6">
          <Globe className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
          <AtSign className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}
