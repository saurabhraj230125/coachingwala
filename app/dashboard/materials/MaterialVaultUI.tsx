"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  UploadCloud, Folder, FileText, Trash2, Edit2, 
  X, Check, Plus, Loader2, Link as LinkIcon, Search, 
  MoreVertical, CheckCircle2, ChevronRight, HardDrive
} from "lucide-react";

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function MaterialVaultUI({ instituteId }: { instituteId: string }) {
  const supabase = createClient();
  
  // Data States
  const [folders, setFolders] = useState<any[]>([]);
  const [activeFolder, setActiveFolder] = useState<any | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // Visual mock: 5GB limit

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folder Edit States
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");

  useEffect(() => {
    fetchFoldersAndStats();
  }, []);

  useEffect(() => {
    if (activeFolder) {
      setSearchQuery(""); // Reset search on folder change
      fetchFiles(activeFolder.id);
    }
  }, [activeFolder]);

  const fetchFoldersAndStats = async () => {
    const { data: folderData } = await supabase.from("study_folders").select("*").eq("institute_id", instituteId).order("created_at", { ascending: true });
    if (folderData) {
      setFolders(folderData);
      if (folderData.length > 0 && !activeFolder) setActiveFolder(folderData[0]);
    }

    const { data: fileData } = await supabase.from("study_materials").select("file_size").eq("institute_id", instituteId);
    if (fileData) {
      setStorageUsed(fileData.reduce((acc, curr) => acc + (curr.file_size || 0), 0));
    }
  };

  const fetchFiles = async (folderId: string) => {
    const { data } = await supabase.from("study_materials").select("*").eq("folder_id", folderId).order("created_at", { ascending: false });
    if (data) setFiles(data);
  };

  // --- Folder Actions ---
  const handleCreateFolder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newFolderName.trim()) return setIsCreatingFolder(false);
    
    const { data } = await supabase.from("study_folders").insert([{ institute_id: instituteId, name: newFolderName }]).select().single();
    if (data) {
      setFolders([...folders, data]);
      setActiveFolder(data);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const handleRenameFolder = async (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
    if (!window.confirm("Are you sure? This will delete the folder and ALL files inside it permanently. This cannot be undone.")) return;
    
    await supabase.from("study_folders").delete().eq("id", id);
    setFolders(folders.filter(f => f.id !== id));
    if (activeFolder?.id === id) {
      setActiveFolder(folders.filter(f => f.id !== id)[0] || null);
      if (folders.length <= 1) setFiles([]);
    }
  };

  // --- File Upload & Delete ---
  const processUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("For security and consistency, only PDF files are allowed.");
      return;
    }
    
    let targetFolder = activeFolder;
    if (!targetFolder) {
      alert("Please create or select a folder first.");
      return;
    }

    setIsUploading(true);
    const fileName = `${Math.random().toString(36).slice(2)}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
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

      if (newDbFile && targetFolder.id === activeFolder?.id) {
        setFiles(prev => [newDbFile, ...prev]);
        setStorageUsed(prev => prev + file.size);
      }
    } catch (error) {
      alert("Upload failed. Please check your storage permissions or try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (id: string, url: string, size: number) => {
    if (!window.confirm("Delete this PDF permanently?")) return;
    const fileName = url.split('/').pop();
    if (fileName) await supabase.storage.from("study-materials").remove([`${instituteId}/${fileName}`]);
    await supabase.from("study_materials").delete().eq("id", id);
    setFiles(files.filter(f => f.id !== id));
    setStorageUsed(prev => prev - size);
  };

  const copyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Derived Data
  const filteredFiles = files.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const storagePercentage = Math.min((storageUsed / STORAGE_LIMIT) * 100, 100);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full pb-24 h-[100dvh] md:h-screen flex flex-col">
      
      {/* APP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Material Vault</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage and distribute your institute's study resources.</p>
        </div>
        
        {/* Modern Storage Widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm w-full md:w-64 flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><HardDrive className="h-3 w-3"/> Storage</span>
            <span className="text-xs font-bold text-slate-700">{formatSize(storageUsed)}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${storagePercentage > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
              style={{ width: `${Math.max(storagePercentage, 2)}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN EXPLORER INTERFACE */}
      <div className="flex-1 bg-white border border-slate-200/80 rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col lg:flex-row">
        
        {/* SIDEBAR: FOLDERS */}
        <div className="w-full lg:w-72 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col h-64 lg:h-auto shrink-0">
          <div className="p-5 border-b border-slate-200/60 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Library</h2>
            <button 
              onClick={() => setIsCreatingFolder(true)} 
              className="h-7 w-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-sm transition-all"
              title="New Folder"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3 overflow-y-auto flex-1 scrollbar-hide space-y-1">
            
            {/* Create Folder Inline Form */}
            {isCreatingFolder && (
              <form onSubmit={handleCreateFolder} className="flex items-center gap-2 p-2 bg-white border border-indigo-200 rounded-xl shadow-sm animate-in slide-in-from-top-2 fade-in">
                <Folder className="h-4 w-4 text-indigo-400 shrink-0" />
                <input 
                  autoFocus type="text" placeholder="Folder Name..." value={newFolderName} onChange={e => setNewFolderName(e.target.value)} 
                  className="w-full text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                />
                <button type="submit" className="text-emerald-500 hover:bg-emerald-50 p-1 rounded-md"><Check className="h-4 w-4"/></button>
                <button type="button" onClick={() => setIsCreatingFolder(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-md"><X className="h-4 w-4"/></button>
              </form>
            )}

            {folders.length === 0 && !isCreatingFolder && (
              <div className="text-center py-8">
                <p className="text-xs font-bold text-slate-400">No folders yet.</p>
                <button onClick={() => setIsCreatingFolder(true)} className="text-xs font-bold text-indigo-500 hover:underline mt-1">Create your first folder</button>
              </div>
            )}

            {/* Folder List */}
            {folders.map((folder) => {
              const isActive = activeFolder?.id === folder.id;
              const isEditing = editingFolderId === folder.id;

              return (
                <div 
                  key={folder.id} 
                  onClick={() => { if (!isEditing) setActiveFolder(folder); }}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : 'hover:bg-white text-slate-600 hover:shadow-sm border border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <Folder className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'fill-indigo-500 text-white' : 'fill-slate-200 text-slate-400 group-hover:text-indigo-400'}`} />
                    
                    {isEditing ? (
                      <form onSubmit={(e) => handleRenameFolder(folder.id, e)} className="flex-1 flex items-center" onClick={e => e.stopPropagation()}>
                        <input 
                          autoFocus type="text" value={editFolderName} onChange={e => setEditFolderName(e.target.value)} 
                          className="w-full text-sm font-bold bg-white text-slate-900 px-2 py-0.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" 
                        />
                      </form>
                    ) : (
                      <span className="text-sm font-bold truncate pr-2">{folder.name}</span>
                    )}
                  </div>

                  {/* Folder Actions Menu (Visible on hover) */}
                  <div className={`flex items-center gap-1 transition-opacity shrink-0 ${isActive && !isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isEditing ? (
                      <button onClick={(e) => { e.stopPropagation(); handleRenameFolder(folder.id); }} className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-md"><Check className="h-3 w-3"/></button>
                    ) : (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingFolderId(folder.id); setEditFolderName(folder.name); }} 
                          className={`p-1.5 rounded-md transition-colors ${isActive ? 'text-indigo-200 hover:text-white hover:bg-white/20' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                        >
                          <Edit2 className="h-3.5 w-3.5"/>
                        </button>
                        <button 
                          onClick={(e) => handleDeleteFolder(folder.id, e)} 
                          className={`p-1.5 rounded-md transition-colors ${isActive ? 'text-indigo-200 hover:text-white hover:bg-white/20' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}
                        >
                          <Trash2 className="h-3.5 w-3.5"/>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN CANVAS: FILE VIEW & DROPZONE */}
        <div className="flex-1 flex flex-col relative bg-slate-50 lg:bg-transparent overflow-hidden">
          
          {activeFolder ? (
            <>
              {/* Toolbar */}
              <div className="p-4 md:p-5 border-b border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex h-10 w-10 bg-indigo-50 rounded-xl items-center justify-center border border-indigo-100/50">
                    <Folder className="h-5 w-5 fill-indigo-200 text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      {activeFolder.name}
                    </h2>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{files.length} Documents</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Search Box */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" placeholder="Search PDFs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                  
                  {/* Upload Button */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm shadow-indigo-600/20 whitespace-nowrap shrink-0"
                  >
                    <UploadCloud className="h-4 w-4" /> <span className="hidden sm:inline">Upload</span>
                  </button>
                  <input type="file" ref={fileInputRef} accept="application/pdf" className="hidden" onChange={e => { if(e.target.files && e.target.files[0]) processUpload(e.target.files[0]) }} />
                </div>
              </div>

              {/* Dropzone Wrapper */}
              <div 
                className="flex-1 relative overflow-y-auto"
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) processUpload(e.dataTransfer.files[0]); }}
              >
                
                {/* Drag Overlay State */}
                {dragActive && (
                  <div className="absolute inset-0 bg-indigo-600/5 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-indigo-400 m-4 rounded-3xl animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
                      <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <UploadCloud className="h-8 w-8 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Drop PDF to Upload</h3>
                      <p className="text-sm font-bold text-slate-500 mt-1">Uploading to {activeFolder.name}</p>
                    </div>
                  </div>
                )}

                {/* Uploading State Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center animate-in fade-in">
                    <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                    <h3 className="text-lg font-black text-slate-900">Encrypting & Uploading...</h3>
                    <p className="text-sm font-bold text-slate-500 mt-1">Please keep this window open.</p>
                  </div>
                )}

                {/* File Grid/List */}
                <div className="p-4 md:p-6">
                  {filteredFiles.length === 0 ? (
                    <div className="h-[40vh] flex flex-col items-center justify-center text-center">
                      <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200/60 shadow-inner">
                        <FileText className="h-10 w-10 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">{searchQuery ? "No matching files found" : "This folder is empty"}</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">
                        {searchQuery ? "Try a different search term." : "Drag and drop PDF documents here, or click the upload button to get started."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                      {filteredFiles.map((file) => (
                        <div key={file.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between h-[120px]">
                          
                          <div className="flex items-start gap-3 overflow-hidden">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0 border border-rose-100/50 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300 text-rose-500">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 overflow-hidden pt-0.5">
                              <a href={file.file_url} target="_blank" rel="noreferrer" className="text-sm font-black text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors leading-tight">
                                {file.title}
                              </a>
                              <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">{formatSize(file.file_size)}</p>
                            </div>
                          </div>

                          {/* File Action Bar */}
                          <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-slate-50">
                            <button 
                              onClick={() => copyLink(file.id, file.file_url)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                            >
                              {copiedId === file.id ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500"/> Copied</> : <><LinkIcon className="h-3.5 w-3.5"/> Copy Link</>}
                            </button>
                            <button 
                              onClick={() => deleteFile(file.id, file.file_url, file.file_size)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete File"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            // No Folder Selected State
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
              <div className="h-24 w-24 bg-white shadow-sm rounded-[2rem] flex items-center justify-center mb-6 border border-slate-200/60 rotate-[-5deg]">
                <Folder className="h-10 w-10 text-indigo-200 fill-indigo-50" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your Digital Library</h3>
              <p className="text-sm font-medium text-slate-500 mt-2 max-w-sm">
                Select a folder from the sidebar or create a new one to start uploading and managing study materials.
              </p>
              <button 
                onClick={() => setIsCreatingFolder(true)}
                className="mt-6 flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
              >
                <Plus className="h-4 w-4" /> Create First Folder
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}