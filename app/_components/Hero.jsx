import { Button } from "@/components/ui/button";
import { Users, Building2, CheckCircle2} from "lucide-react"; // Sleek icons
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full pt-1  min-h-[80vh] flex items-center justify-center bg-white px-4">
      {/* Optional: Subtle background pattern or gradient for a modern feel */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Badge/Tagline */}
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            ✨ Your next home is just a click away
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 lg:leading-[1.1]">
            Living made <span className="text-blue-600">simple.</span> <br />
            Find your space today.
          </h1>

          {/* Subtext */}
          <p className="max-w-[600px] text-grey-500 text-sm md:text-xl leading-relaxed">
            Whether you need a private room or a compatible roommate, we provide 
            the most trusted marketplace for modern living.
          </p>

          {/* Buttons Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 text-md font-semibold h-14"
            >
              <Link href="/for-rent" >Find a Room</Link> 
            </Button>
          
            <Button 
              size="lg" 
              variant="outline" className="w-full sm:w-48 border-grey-300 text-grey-700 hover:bg-grey-50 hover:border-grey-400 transition-all hover:scale-105 active:scale-95 text-md font-semibold h-14"
            >
               <Link href="/roommates" >Find a Roommate</Link>
            </Button>
          
          </div>

          {/* THE NEW, SLEEK "TRUST BAR" SOCIAL PROOF */}
          <div className="w-full max-w-4xl py-7">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 p-4 md:p-3 rounded-2xl md:rounded-full bg-white border border-grey-100 shadow-lg shadow-grey-100/50">
              
              {/* Stat 1: Verified Rooms */}
              <div className="flex items-center gap-4 px-4 py-2 w-full md:w-auto md:border-r md:border-grey-100 flex-1 justify-center md:justify-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600">
                  <Building2 size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-950 tracking-tight">100+</p>
                  <p className="text-sm text-grey-500 font-medium">Verified Rooms</p>
                </div>
              </div>

              {/* Stat 2: Active Users */}
              <div className="flex items-center gap-4 px-4 py-2 w-full md:w-auto md:border-r md:border-grey-100 flex-1 justify-center md:justify-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600">
                  <Users size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-950 tracking-tight">500+</p>
                  <p className="text-sm text-grey-500 font-medium">Active Matchups</p>
                </div>
              </div>

              {/* Stat 3: Security */}
              <div className="flex items-center gap-4 px-4 py-2 w-full md:w-auto flex-1 justify-center md:justify-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-950 tracking-tight">100%</p>
                  <p className="text-sm text-grey-500 font-medium">Secure Platform</p>
                </div>
              </div>

            </div>
          </div>
          {/* EnD TRUST BAR */}


        </div>
      </div>
    </section>
  );
}

