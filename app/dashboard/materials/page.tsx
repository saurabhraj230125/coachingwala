"use client";

import { useState } from "react";
import { UploadCloud, Folder, FileText, Search, MoreVertical, Eye, Share2, Lock, HardDrive, BellRing, CheckCircle2, Plus } from "lucide-react";

// Mock Architecture for Folders and Files
const folders = [
  { id: "f1", name: "Physics - Mechanics", batch: "Class 11", fileCount: 12, color: "from-blue-500 to-indigo-500" },
  { id: "f2", name: "Organic Chemistry", batch: "Class 12", fileCount: 8, color: "from-emerald-400 to-emerald-600" },
  { id: "f3", name: "Previous Year Papers (JEE)", batch: "Droppers", fileCount: 24, color: "from-amber-400 to-orange-500" },
  { id: "f4", name: "Math - Calculus", batch: "Class 12", fileCount: 6, color: "from-purple-500 to-fuchsia-500" },
];

const recentFiles = [
  { id: "1", name: "Electrostatics_DPP_04.pdf", size: "2.4 MB", date: "Today, 10:30 AM", views: 45, folder: "Physics - Mechanics" },
  { id: "2", name: "Nomenclature_Rules_CheatSheet.pdf", size: "1.1 MB", date: "Yesterday", views: 112, folder: "Organic Chemistry" },
  { id: "3", name: "JEE_Mains_2025_Shift_1.pdf", size: "4.8 MB", date: "14 Jul 2026", views: 340, folder: "Previous Year Papers (JEE)" },
  { id: "4", name: "Integration_Formulas.pdf", size: "850 KB", date: "10 Jul 2026", views: 89, folder: "Math - Calculus" },
];

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [notifiedFile, setNotifiedFile] = useState<string | null>(null);

  // Micro UX: Drag & Drop Simulation
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    triggerUploadSimulation();
  };

  const triggerUploadSimulation = () => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 2000); // Simulate upload time
  };

  // Micro UX: Notify Batch about new material via WhatsApp
  const handleNotifyBatch = (fileId: string) => {
    setNotifiedFile(fileId);
    setTimeout(() => setNotifiedFile(null), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8 relative min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Study Vault</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Securely host and distribute PDFs to your active students.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all">
            <Plus className="h-4 w-4" /> New Folder
          </button>
        </div>
      </div>

      {/* STRIPE-STYLE STORAGE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors cursor-pointer">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Storage Used</p>
            <h2 className="text-2xl font-black text-slate-900 flex items-baseline gap-1">
              4.2 <span className="text-sm font-bold text-slate-500">GB</span>
            </h2>
            <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className="w-[42%] h-full bg-indigo-500 rounded-full"></div>
            </div>
          </div>
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <HardDrive className="h-5 w-5" />
          </div>
        </div>

        {/* UPLOAD DROPZONE */}
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerUploadSimulation}
          className={`md:col-span-2 border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
            dragActive 
              ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]" 
              : "border-slate-300 bg-slate-50/50 hover:bg-slate-100/50 hover:border-indigo-400"
          }`}
        >
          {isUploading ? (
            <div className="animate-in fade-in flex flex-col items-center">
              <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-black text-indigo-900">Encrypting & Uploading...</p>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 bg-white shadow-sm rounded-full flex items-center justify-center mb-3">
                <UploadCloud className={`h-6 w-6 ${dragActive ? 'text-indigo-600 animate-bounce' : 'text-slate-400'}`} />
              </div>
              <p className="text-sm font-black text-slate-900">Drag & Drop PDFs here</p>
              <p className="text-xs font-medium text-slate-500 mt-1">or click to browse from your computer (Max 50MB)</p>
            </>
          )}
        </div>
      </div>

      {/* FOLDERS GRID */}
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Batches & Subjects</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {folders.map((folder) => (
          <div key={folder.id} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-95">
            <div className="flex justify-between items-start mb-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${folder.color} flex items-center justify-center text-white shadow-inner`}>
                <Folder className="h-6 w-6 fill-white/20" />
              </div>
              <button className="text-slate-300 hover:text-slate-600 p-1">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{folder.name}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{folder.batch}</span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <FileText className="h-3 w-3" /> {folder.fileCount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT FILES LIST */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recently Uploaded</h3>
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200 w-48 hidden md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search files..."
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-slate-100">
              {recentFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 border border-red-100 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">{file.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{file.folder}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                          <span className="text-xs font-medium text-slate-500">{file.size}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">{file.date}</span>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                        <Lock className="h-3 w-3" /> Secure Access
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg w-fit">
                      <Eye className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold">{file.views} views</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      
                      {/* MICRO UX: Send WhatsApp Notification to Batch */}
                      <button 
                        onClick={() => handleNotifyBatch(file.id)}
                        disabled={notifiedFile === file.id}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 font-bold text-xs rounded-lg transition-all active:scale-95 ${
                          notifiedFile === file.id 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20"
                        }`}
                      >
                        {notifiedFile === file.id ? (
                          <><CheckCircle2 className="h-3.5 w-3.5" /> Sent</>
                        ) : (
                          <><BellRing className="h-3.5 w-3.5" /> Notify Batch</>
                        )}
                      </button>
                      
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}