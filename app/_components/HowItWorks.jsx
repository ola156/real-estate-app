"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Info } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

 

const handleComingSoon = (e, feature) => {
  e.preventDefault();
  toast.info(`${feature} is coming soon`, {
    description: "Our team is working on the documentation.",
  });
};

  return (
    <footer className="bg-white border-t border-slate-100 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* Brand Side */}
          <div className="space-y-4 max-w-xs">
            <Image src={'/logo.svg'} width={120} height={150} alt='logo'/>
            <p className="text-slate-500 text-sm leading-relaxed">
              Simplifying the search for modern living spaces and compatible roommates through secure, verified technology.
            </p>
          </div>

          {/* Links Side */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="/for-rent" className="hover:text-blue-600 transition-colors">Find a Room</Link></li>
                <li><Link href="/roommates" className="hover:text-blue-600 transition-colors">Roommates</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Support</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <button 
                    onClick={(e) => handleComingSoon(e, "Help Center")}
                    className="hover:text-blue-600 transition-colors text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  {/* Functional: Opens email directly */}
                  <a href="mailto:agboolausman58@gmail.com" className="hover:text-blue-600 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
            &copy; {currentYear} Instrict. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-medium text-slate-400">
            <button onClick={(e) => handleComingSoon(e, "Privacy Policy")} className="hover:text-slate-900 transition-colors">Privacy</button>
            <button onClick={(e) => handleComingSoon(e, "Terms of Service")} className="hover:text-slate-900 transition-colors">Terms</button>
            <button onClick={(e) => handleComingSoon(e, "Cookie Policy")} className="hover:text-slate-900 transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}