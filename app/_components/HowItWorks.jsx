import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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

          {/* Links Side - Organized by Columns */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="/for-rent" className="hover:text-blue-600 transition-colors">Find a Room</a></li>
                <li><a href="/roommates" className="hover:text-blue-600 transition-colors">Roommates</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Support</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">
            &copy; {currentYear} Instrict. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-medium text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}