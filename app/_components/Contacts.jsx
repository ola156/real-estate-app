"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
  });

  const handleWhatsApp = (e) => {
    e.preventDefault();
    
    // Replace with your actual phone number (include country code)
    const phoneNumber = "+2348087442174"; 
    
    // Construct the message
    const text = `Hi, my name is ${formData.name}. I am an ${formData.role}. ${formData.message}`;
    
    // Encode for URL
    const encodedText = encodeURIComponent(text);
    
    // Open WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
  };

  return (
    <section className="py-5 bg-white px-6">
      <div className="container mx-auto max-w-xl">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">
            Get in Touch
          </h2>
          <p className="text-slate-500">
            Have questions? Message us directly on WhatsApp.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleWhatsApp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <Input
              required
              placeholder="Agboola Usman"
              className="border-slate-200 focus:ring-blue-600 h-12 rounded-xl"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Your Role / Occupation</label>
            <Input
              required
              placeholder="e.g. Student, Developer"
              className="border-slate-200 focus:ring-blue-600 h-12 rounded-xl"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Message (Optional)</label>
            <Textarea
              placeholder="Tell us more about what you're looking for..."
              className="border-slate-200 focus:ring-blue-600 min-h-[120px] rounded-xl pt-3"
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl text-lg font-bold shadow-lg shadow-blue-100 flex gap-3 transition-transform active:scale-95"
          >
            <MessageCircle size={20} />
            Send to WhatsApp
          </Button>
        </form>
      </div>
    </section>
  );
}