"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Users, Plus, Search, Phone, 
  ShieldCheck, Loader2, FolderOpen, Send, Trash2, UserPlus, X, Key
} from "lucide-react";

export default function StudentRoster() {
  const supabase = createClient();
  const [students, setStudents] = useState<any[]>([]);
  const [instituteId, setInstituteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [activeBatch, setActiveBatch] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  // Derived Data
  const batches = ["All", ...Array.from(new Set(students.map(s => s.batch_name).filter(Boolean)))];
  
  const filteredStudents = students.filter(s => {
    const matchesBatch = activeBatch === "All" || s.batch_name === activeBatch;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (s.name?.toLowerCase().includes(searchLower) || "") || 
      (s.full_name?.toLowerCase().includes(searchLower) || "") || 
      (s.phone_number?.includes(searchQuery) || "");
    return matchesBatch && matchesSearch;
  });

  // Actions
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
      alert(`Database Error: ${error.message}`);
      setIsSubmitting(false);
      return; 
    }

    if (data) {
      setStudents([data[0], ...students]);
      setFormData({ fullName: "", phone: "", parentPhone: "", batch: "" });
      setIsAddModalOpen(false);
      copyWhatsAppMessage(data[0]);
    }
    
    setIsSubmitting(false);
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name}? This will remove their portal access and cannot be undone.`)) return;
    
    setDeletingId(id);
    const { error } = await supabase.from("students").delete().eq("id", id);
    
    if (error) {
      alert(`Failed to delete: ${error.message}`);
    } else {
      setStudents(students.filter(s => s.id !== id));
    }
    setDeletingId(null);
  };

  const copyWhatsAppMessage = (student: any) => {
    const baseUrl = window.location.origin;
    const portalLink = `${baseUrl}/portal`;
    
    const message = `🎓 *Welcome to the Gateway!*\n\nHere are your secure login details for the Student Portal. You can check your materials, test scores, and attendance here.\n\n🔗 *Portal Link:* ${portalLink}\n👤 *Gateway ID:* ${student.portal_username}\n🔑 *PIN:* ${student.portal_pin}\n\n_Please keep this PIN safe and do not share it._`;
    
    navigator.clipboard.writeText(message);
    alert(`Portal Access Copied!\n\nYou can now paste this directly into WhatsApp for ${student.name || student.full_name}.`);
  };

  // UI Components
  if (loading) {
    return <div className="h-[60vh] flex flex-col items-center justify-center gap-3"><Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /><p className="text-sm font-bold text-slate-400">Loading roster...</p></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 w-full pb-24">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Roster</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage enrollments, batches, and Gateway access credentials.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm shadow-indigo-600/20 whitespace-nowrap"
          >
            <UserPlus className="h-4 w-4" /> Add Student
          </button>
        </div>
      </div>

      {/* BATCH FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {batches.map(batch => (
          <button
            key={batch}
            onClick={() => setActiveBatch(batch as string)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeBatch === batch 
                ? "bg-slate-800 text-white shadow-sm" 
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {batch}
          </button>
        ))}
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {filteredStudents.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center px-4">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <FolderOpen className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No students found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              {searchQuery ? "No students match your search criteria. Try a different name or phone number." : "Your roster is empty. Add your first student to generate their Portal Gateway access."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-500">Student Info</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-500">Batch Assignment</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-500">Gateway Access</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const studentName = student.name || student.full_name;
                  const initials = studentName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Name & Contact */}
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100 shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{studentName}</div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 font-medium">
                              <Phone className="h-3 w-3" /> {student.phone_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                          {student.batch_name}
                        </span>
                      </td>

                      {/* Portal Credentials */}
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[11px] font-mono bg-indigo-50/50 px-2.5 py-1 rounded-md w-max border border-indigo-100">
                            <span className="text-indigo-400 select-none flex items-center gap-1"><Users className="h-3 w-3"/> ID:</span> 
                            <span className="font-bold text-indigo-900">{student.portal_username || 'Pending'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-mono bg-emerald-50/50 px-2.5 py-1 rounded-md w-max border border-emerald-100">
                            <span className="text-emerald-500 select-none flex items-center gap-1"><Key className="h-3 w-3"/> PIN:</span> 
                            <span className="font-bold text-emerald-900">{student.portal_pin || 'Pending'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => copyWhatsAppMessage(student)}
                            title="Share via WhatsApp"
                            className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-100 hover:border-indigo-600 shadow-sm"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteStudent(student.id, studentName)}
                            disabled={deletingId === student.id}
                            title="Delete Student"
                            className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-600 hover:text-white transition-colors border border-rose-100 hover:border-rose-600 shadow-sm disabled:opacity-50"
                          >
                            {deletingId === student.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FLOATING ADD STUDENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Enroll New Student</h2>
                  <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Gateway Auto-Provisioning</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                  <input required type="text" placeholder="e.g. Saurabh Raj" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Batch Assignment</label>
                  <input required type="text" placeholder="e.g. Target JEE 2027" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Student Phone</label>
                  <input required type="tel" placeholder="10-digit number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Parent Phone</label>
                  <input required type="tel" placeholder="10-digit number" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70 shadow-md shadow-indigo-600/20">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Create Account
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}