"use client";

import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react"; // Sleek icon for inspection

export default function InspectionButton() {
  
  const handleInspectionRedirect = () => {
    // Replace with your actual WhatsApp number (e.g., 23480...)
    const phoneNumber = "+2348087442174"; 
    
    // The pre-filled message
    const message = "Hi! I am interested in hiring you for a property inspection. Could you let me know your availability and rates?";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button 
      onClick={handleInspectionRedirect}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 p-4 rounded-full shadow-lg shadow-blue-100 flex gap-2 transition-all hover:scale-105 active:scale-95"
    >
      <ClipboardCheck size={20} />
      Hire for Inspection
    </Button>
  );
}