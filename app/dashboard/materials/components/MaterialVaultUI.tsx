"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { UploadCloud, Folder, FileText, MoreVertical, Eye, Lock, BellRing, CheckCircle2, Plus, Loader2, Trash2, Edit2, X, Check } from "lucide-react";

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function MaterialVaultUI({ instituteId }: { instituteId: string }) {
  const supabase = createClient();
  
  const [folders, setFolders] = useState<any[]>([]);
  const [activeFolder, setActiveFolder] = useState<any | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);

  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [notifiedFile, setNotifiedFile] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  // Folder Edit States
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");

  useEffect(() => {
    fetchFoldersAndStats();
  }, []);

  useEffect(() => {
    if (activeFolder) fetchFiles(activeFolder.id);
  }, [activeFolder]);

  const fetchFoldersAndStats = async () => {
    const { data: folderData } = await supabase.from("study_folders").select("*").eq("institute_id", instituteId).order("created_at", { ascending: true });
    if (folderData) setFolders(folderData);

    const { data: fileData } = await supabase.from("study_materials").select("file_size").eq("institute_id", instituteId);
    if (fileData) {
      const totalBytes = fileData.reduce((acc, curr) => acc + (curr.file_size || 0), 0);
      setStorageUsed(totalBytes);
    }
  };

  const fetchFiles = async (folderId: string) => {
    const { data } = await supabase.from("study_materials").select("*").eq("folder_id", folderId).order("created_at", { ascending: false });
    if (data) setFiles(data);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return setIsCreatingFolder(false);
    const { data } = await supabase.from("study_folders").insert([{ institute_id: instituteId, name: newFolderName }]).select().single();
    if (data) {
      setFolders([...folders, data]);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const handleRenameFolder = async (id: string) => {
    if (!editFolderName.trim()) return setEditingFolderId(null);
    const { data } = await supabase.from("study_folders").update({ name: editFolderName }).eq("id", id).select().single();
    if (data) {
      setFolders(folders.map(f => f.id === id ? data : f));
      if (activeFolder?.id === id) setActiveFolder(data);
    }
    setEditingFolderId(null);
  };

  const handleDeleteFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure? This will delete the folder and ALL PDFs inside it.")) return;
    
    await supabase.from("study_folders").delete().eq("id", id);
    setFolders(folders.filter(f => f.id !== id));
    if (activeFolder?.id === id) {
      setActiveFolder(null);
      setFiles([]);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    if (file.type !== "application/pdf") return alert("Only PDFs allowed.");
    
    let targetFolder = activeFolder;

    // 🔥 THE FIX: Auto-Create "General Materials" if no folder is selected!
    if (!targetFolder) {
      let generalFolder = folders.find(f => f.name === "General Materials");
      if (!generalFolder) {
        const { data } = await supabase.from("study_folders").insert([{ institute_id: instituteId, name: "General Materials" }]).select().single();
        if (data) {
          generalFolder = data;
          setFolders(prev => [...prev, data]);
        }
      }
      targetFolder = generalFolder;
      setActiveFolder(generalFolder);
    }

    setIsUploading(true);
    const fileName = `${Math.random().toString(36).slice(2)}_${file.name}`;
    const filePath = `${instituteId}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from("study-materials").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("study-materials").getPublicUrl(filePath);

      const { data: newDbFile } = await supabase.from("study_materials").insert([{
        institute_id: instituteId,
        folder_id: targetFolder.id,
        title: file.name,
        file_url: publicUrl,
        file_size: file.size
      }]).select().single();

      if (newDbFile && targetFolder.id === (activeFolder?.id || targetFolder.id)) {
        setFiles(prev => [newDbFile, ...prev]);
        setStorageUsed(prev => prev + file.size);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (id: string, url: string, size: number) => {
    const fileName = url.split('/').pop();
    if (fileName) await supabase.storage.from("study-materials").remove([`${instituteId}/${fileName}`]);
    await supabase.from("study_materials").delete().eq("id", id);
    setFiles(files.filter(f => f.id !== id));
    setStorageUsed(prev => prev - size);
  };

  const handleNotifyBatch = (fileId: string) => {
    setNotifiedFile(fileId);
    setTimeout(() => setNotifiedFile(null), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8 relative min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Material Vault</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Securely host and distribute PDFs to your active students.</p>
        </div>
        
        {isCreatingFolder ? (
          <div className="flex gap-2 w-full md:w-auto">
            <input 
              autoFocus
              type="text" 
              placeholder="Folder Name..." 
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              className="px-4 py-2 text-sm font-bold border border-indigo-300 rounded-xl outline-none focus:ring-2 ring-indigo-500/20"
            />
            <button onClick={handleCreateFolder} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">Save</button>
            <button onClick={() => setIsCreatingFolder(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setIsCreatingFolder(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:border-indigo-300 transition-all shadow-sm">
            <Plus className="h-4 w-4" /> New Folder
          </button>
        )}
      </div>

      {/* STORAGE & DROPZONE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Storage Used</p>
            <h2 className="text-2xl font-black text-slate-900 flex items-baseline gap-1">
              {formatSize(storageUsed)}
            </h2>
            <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className="w-full h-full bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <label 
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`md:col-span-2 border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
            dragActive ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]" : "border-slate-300 bg-slate-50/50 hover:bg-slate-100/50 hover:border-indigo-400"
          }`}
        >
          <input type="file" accept="application/pdf" className="hidden" onChange={e => { if(e.target.files) processUpload(e.target.files[0]) }} />
          {isUploading ? (
            <div className="animate-in fade-in flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-3" />
              <p className="text-sm font-black text-indigo-900">Encrypting & Uploading...</p>
            </div>
          ) : (
            <>
              <div className={`h-12 w-12 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 ${dragActive ? 'animate-bounce' : ''}`}>
                <UploadCloud className={`h-6 w-6 ${dragActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              </div>
              <p className="text-sm font-black text-slate-900">
                {activeFolder ? `Upload to "${activeFolder.name}"` : "Drag & drop PDFs here (Auto-saves to General folder)"}
              </p>
            </>
          )}
        </label>
      </div>

      {/* FOLDERS GRID WITH RENAME & DELETE */}
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Your Folders</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {folders.length === 0 && <p className="text-sm font-bold text-slate-400">No folders created yet.</p>}
        
        {folders.map((folder) => (
          <div 
            key={folder.id} 
            onClick={() => { if (editingFolderId !== folder.id) setActiveFolder(folder); }}
            className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group relative ${activeFolder?.id === folder.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/60 hover:border-indigo-300'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${activeFolder?.id === folder.id ? 'from-indigo-500 to-purple-600' : 'from-slate-300 to-slate-400'} flex items-center justify-center text-white shadow-inner`}>
                <Folder className="h-6 w-6 fill-white/20" />
              </div>

              {/* Folder Actions Menu */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); setEditingFolderId(folder.id); setEditFolderName(folder.name); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={(e) => handleDeleteFolder(folder.id, e)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {editingFolderId === folder.id ? (
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <input 
                  autoFocus
                  type="text"
                  value={editFolderName}
                  onChange={e => setEditFolderName(e.target.value)}
                  className="w-full text-sm font-bold border-b border-indigo-300 outline-none pb-1"
                />
                <button onClick={() => handleRenameFolder(folder.id)} className="text-emerald-500"><Check className="h-4 w-4"/></button>
                <button onClick={() => setEditingFolderId(null)} className="text-slate-400"><X className="h-4 w-4"/></button>
              </div>
            ) : (
              <h4 className="text-sm font-bold text-slate-900 truncate">{folder.name}</h4>
            )}
          </div>
        ))}
      </div>

      {/* FILES LIST */}
      {activeFolder && (
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Folder className="h-4 w-4 text-indigo-500" /> Files in {activeFolder.name}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-100">
                {files.length === 0 && (
                  <tr><td className="px-6 py-8 text-center text-slate-400 font-bold text-sm">No PDFs here yet. Drag one into the box above!</td></tr>
                )}
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 border border-red-100 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <a href={file.file_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-900 truncate max-w-[200px] md:max-w-md hover:text-indigo-600 hover:underline">{file.title}</a>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-medium text-slate-500">{formatSize(file.file_size)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleNotifyBatch(file.id)} className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 font-bold text-xs rounded-lg transition-all active:scale-95 ${notifiedFile === file.id ? "bg-emerald-100 text-emerald-700" : "bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20"}`}>
                          {notifiedFile === file.id ? <><CheckCircle2 className="h-3.5 w-3.5" /> Sent</> : <><BellRing className="h-3.5 w-3.5" /> Notify WhatsApp</>}
                        </button>
                        <button onClick={() => deleteFile(file.id, file.file_url, file.file_size)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}