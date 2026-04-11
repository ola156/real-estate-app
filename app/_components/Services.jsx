import { Search, Users2, ShieldCheck, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const services = [
  {
    title: "Find a Room",
    description: "Browse thousands of verified listings to find a space that fits your lifestyle and budget.",
    icon: <Search className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
     href: "/for-rent",
      btn:'Learn more'
  },
  {
    title: "Roommate Matching",
    description: "Connect with people who share your habits and interests through our smart compatibility matching.",
    icon: <Users2 className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
     href: "/roommates",
     btn:'Learn more'
  },
  {
    title: "Verified Listings",
    description: "Are You An Agent Or Landlord? List Your Property With Us And Reach Thousands Of Potential Tenants.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    href: "/",
     btn:'Contact Us Below'
  },
];

export default function Services() {
  return (
    <section className="py-14 bg-white px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
            What We Do
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight">
            Seamless living starts here.
          </h3>
          <p className="text-grey-500 text-lg max-w-2xl mx-auto">
            We provide the tools you need to find more than just a place to sleep—we help you find a place to thrive.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group border-none shadow-none hover:bg-grey-50 transition-all duration-300 rounded-3xl p-4"
            >
              <CardContent className="space-y-6 pt-6">
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${service.color}`}>
                  {service.icon}
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-grey-500 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Subtle 'Learn More' link */}
                <div className="pt-2">
                  <Link href={service.href} className="text-sm font-semibold text-blue-600 cursor-pointer flex items-center gap-1 group-hover:gap-2 transition-all">
                    {service.btn} <span className="text-lg">→</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}