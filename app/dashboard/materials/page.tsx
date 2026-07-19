import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Folder, FileText, Download, ShieldCheck, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

// Initialize Supabase safely for reading data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Uses service role to bypass RLS for students
);

export default async function StudentMaterialsPage({
  searchParams,
}: {
  searchParams: { folder?: string };
}) {
  const cookieStore = await cookies();
  const instituteId = cookieStore.get("institute_id")?.value;

  if (!instituteId) {
    redirect("/");
  }

  // 1. Fetch all folders for this institute
  const { data: folders } = await supabase
    .from("study_folders")
    .select("*")
    .eq("institute_id", instituteId)
    .order("created_at", { ascending: true });

  const activeFolderId = searchParams.folder;
  
  // 2. If a folder is clicked, fetch its files
  let files: any[] = [];
  let activeFolderName = "";
  
  if (activeFolderId) {
    const { data: fileData } = await supabase
      .from("study_materials")
      .select("*")
      .eq("folder_id", activeFolderId)
      .order("created_at", { ascending: false });
    
    files = fileData || [];
    activeFolderName = folders?.find(f => f.id === activeFolderId)?.name || "Folder";
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Study Materials</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure files shared by your institute.
        </p>
      </div>

      {/* DYNAMIC VIEW */}
      {!activeFolderId ? (
        // SHOW FOLDERS GRID
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(!folders || folders.length === 0) && (
            <p className="text-slate-400 font-bold">No materials uploaded yet.</p>
          )}
          
          {folders?.map((folder) => (
            <a 
              key={folder.id} 
              href={`/dashboard/materials?folder=${folder.id}`}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-500 mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Folder className="h-7 w-7 fill-indigo-200" />
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{folder.name}</h4>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Click to open</p>
            </a>
          ))}
        </div>
      ) : (
        // SHOW FILES IN SELECTED FOLDER
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <a 
            href="/dashboard/materials"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md"
          >
            ← Back to Folders
          </a>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Folder className="h-5 w-5 text-indigo-600 fill-indigo-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">{activeFolderName}</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {files.length === 0 && (
              <div className="col-span-2 p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">This folder is currently empty.</p>
              </div>
            )}
            
            {files.map((file) => (
              <a 
                key={file.id}
                href={file.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white border border-slate-200 p-5 rounded-3xl flex items-center justify-between hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group hover:-translate-y-1 duration-300"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="h-12 w-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm truncate max-w-[200px] sm:max-w-xs group-hover:text-indigo-600 transition-colors">{file.title}</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                      {(file.file_size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Download className="h-5 w-5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}