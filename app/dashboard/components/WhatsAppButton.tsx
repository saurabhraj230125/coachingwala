"use client";

import { MessageCircle } from "lucide-react";

// You will pass the student data into this button from your table
interface StudentProp {
  name: string;
  username: string;
  pin: string;
  phone: string; // The parent's or student's phone number
}

export default function WhatsAppButton({ student }: { student: StudentProp }) {
  
  const handleWhatsAppShare = () => {
    // Automatically grabs localhost during testing, and your Vercel URL in production
    // Make sure NEXT_PUBLIC_SITE_URL is set in your .env.local!
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    
    const text = `Hello ${student.name},\n\nHere is your CoachingWala Student Gateway access:\n\n🌐 *Portal Link:* ${baseUrl}/portal\n👤 *Username:* ${student.username}\n🔑 *PIN:* ${student.pin}\n\nPlease click the link to view your study materials and test scores.`;
    
    const encodedText = encodeURIComponent(text);
    
    // Open WhatsApp web or app
    window.open(`https://wa.me/${student.phone}?text=${encodedText}`, "_blank");
  };

  return (
    <button 
      onClick={handleWhatsAppShare}
      className="flex items-center gap-2 bg-[#25D366] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#1ebd5a] active:scale-95 transition-all shadow-sm shadow-[#25D366]/20"
    >
      <MessageCircle className="h-4 w-4" /> Send Access
    </button>
  );
}