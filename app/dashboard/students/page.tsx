"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Users, Plus, Search, MoreVertical, Key, Phone, 
  ShieldCheck, Loader2, Calendar, FolderOpen, Copy, Send
} from "lucide-react";

export default function StudentRoster() {
  const supabase = createClient();
  const [students, setStudents] = useState<any[]>([]);
  const [instituteId, setInstituteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBatch, setActiveBatch] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", phone: "", parentPhone: "", batch: "" });

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: institute } = await supabase
        .from("institutes")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (institute) {
        setInstituteId(institute.id);
        const { data: roster } = await supabase
          .from("students")
          .select("*")
          .eq("institute_id", institute.id)
          .order("created_at", { ascending: false });
        
        if (roster) setStudents(roster);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const batches = ["All", ...Array.from(new Set(students.map(s => s.batch_name).filter(Boolean)))];
  
  const filteredStudents = activeBatch === "All" 
    ? students 
    : students.filter(s => s.batch_name === activeBatch);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instituteId) return;
    setIsSubmitting(true);

    const firstName = formData.fullName.split(" ")[0].toLowerCase();
    const generatedUsername = `${firstName}${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();

    const { data, error } = await supabase.from("students").insert([{
      institute_id: instituteId,
      name: formData.fullName,       
      full_name: formData.fullName,  
      phone_number: formData.phone,
      parent_phone: formData.parentPhone,
      batch_name: formData.batch,
      portal_username: generatedUsername,
      portal_pin: generatedPin
    }]).select();

    if (error) {
      console.error("SUPABASE FATAL ERROR:", error);
      alert(`Database Error: ${error.message}\n\nDetails: ${error.details || 'Check console'}`);
      setIsSubmitting(false);
      return; 
    }

    if (data) {
      setStudents([data[0], ...students]);
      setFormData({ fullName: "", phone: "", parentPhone: "", batch: "" });
      setIsAddModalOpen(false);
      
      // Auto-trigger the copy function for the newly added student
      copyWhatsAppMessage(data[0]);
    }
    
    setIsSubmitting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 🔥 THE DEEP FIX: Generates a beautiful WhatsApp-ready message with the exact website link
  const copyWhatsAppMessage = (student: any) => {
    // This dynamically gets your current website link (localhost or live domain)
    const baseUrl = window.location.origin;
    const portalLink = `${baseUrl}/portal`;
    
    const message = `🎓 *Welcome to the Gateway!*\n\nHere are your secure login details for the Student Portal. You can check your materials, test scores, and attendance here.\n\n🔗 *Portal Link:* ${portalLink}\n👤 *Gateway ID:* ${student.portal_username}\n🔑 *PIN:* ${student.portal_pin}\n\n_Please keep this PIN safe and do not share it._`;
    
    navigator.clipboard.writeText(message);
    alert(`Portal Access Copied!\n\nYou can now paste this directly into WhatsApp for ${student.name || student.full_name}.`);
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Roster</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage enrollments, batches, and Gateway access.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(!isAddModalOpen)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md shadow-indigo-200"
        >
          <Plus className="h-4 w-4" /> Add New Student
        </button>
      </div>

      {isAddModalOpen && (
        <div className="bg-white border border-indigo-100 rounded-[2rem] p-6 shadow-xl shadow-indigo-500/5 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Users className="h-5 w-5" /></div>
            <h2 className="text-xl font-black text-slate-900">Enroll Student</h2>
          </div>
          
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Full Name (e.g. Saurabh Raj)" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            <input required type="text" placeholder="Batch Name (e.g. Target JEE 2027)" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            <input required type="tel" placeholder="Student Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            <input required type="tel" placeholder="Parent Phone Number" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:text-slate-700">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Provision Account
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {batches.map(batch => (
          <button
            key={batch}
            onClick={() => setActiveBatch(batch as string)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeBatch === batch 
                ? "bg-slate-900 text-white shadow-md" 
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {batch}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm">
        {filteredStudents.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center px-4">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><FolderOpen className="h-8 w-8 text-slate-300" /></div>
            <h3 className="text-lg font-black text-slate-900">No students found</h3>
            <p className="text-sm text-slate-500 mt-1">Add your first student to generate their Portal Gateway access.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Student Info</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Batch</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Gateway Access</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{student.name || student.full_name}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100/50">
                        {student.batch_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-2 py-1 rounded-md w-max border border-slate-200">
                          <span className="text-slate-400 select-none">ID:</span> 
                          <span className="font-bold text-slate-700">{student.portal_username || 'Pending'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-2 py-1 rounded-md w-max border border-slate-200">
                          <span className="text-slate-400 select-none">PIN:</span> 
                          <span className="font-bold text-slate-700">{student.portal_pin || 'Pending'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* 🔥 NEW SHARE BUTTON */}
                      <button 
                        onClick={() => copyWhatsAppMessage(student)}
                        className="flex items-center justify-end w-full gap-2 px-3 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100"
                      >
                        Share Access <Send className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}