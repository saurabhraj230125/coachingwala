import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { FolderOpen, UploadCloud, FileText, Link as LinkIcon, Video, Trash2 } from "lucide-react";

// SERVER ACTION: Uploading a resource link
async function uploadMaterial(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: institute } = await supabase.from("institutes").select("id").eq("owner_id", user?.id).single();

  if (institute) {
    await supabase.from("study_materials").insert({
      institute_id: institute.id,
      title: formData.get("title") as string,
      batch_target: formData.get("batch_target") as string,
      resource_type: formData.get("resource_type") as string,
      file_url: formData.get("file_url") as string,
    });
    revalidatePath("/dashboard/materials");
  }
}

export default async function StudyMaterialVault() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: institute } = await supabase.from("institutes").select("id").eq("owner_id", user?.id).single();

  const { data: materials } = await supabase
    .from("study_materials")
    .select("*")
    .eq("institute_id", institute?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full bg-[#f4f7fb] min-h-screen text-slate-900">
      
      <div className="mb-10 pb-6 border-b border-slate-200/60">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-blue-500" /> Study Material Vault
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Distribute notes, formulas, and video lectures securely to your batches.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT TWO COLUMNS: THE VAULT */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900">Shared Resources</h3>
            </div>
            
            <div className="divide-y divide-slate-100 p-4">
              {materials?.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 rounded-xl transition-all flex justify-between items-center group border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      item.resource_type === 'PDF' ? 'bg-red-50 text-red-500' :
                      item.resource_type === 'Video' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      {item.resource_type === 'PDF' ? <FileText className="h-5 w-5" /> :
                       item.resource_type === 'Video' ? <Video className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">{item.batch_target}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={item.file_url} target="_blank" className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-200">View</a>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
              {(!materials || materials.length === 0) && (
                <div className="py-12 text-center text-slate-400">
                  <UploadCloud className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="font-bold">Your vault is empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: UPLOAD PANEL */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <UploadCloud className="h-5 w-5 text-blue-500" />
            <h3 className="font-extrabold text-slate-900">Upload Material</h3>
          </div>

          <form action={uploadMaterial} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Resource Title</label>
              <input name="title" required placeholder="e.g., Physics Mechanics Notes" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Target Batch</label>
                <select name="batch_target" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none">
                  <option value="JEE Droppers">JEE Droppers</option>
                  <option value="NEET Batch">NEET Batch</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">File Type</label>
                <select name="resource_type" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none">
                  <option value="PDF">Drive PDF</option>
                  <option value="Video">YouTube Unlisted</option>
                  <option value="Link">Web Link</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">URL / Link</label>
              <input name="file_url" required placeholder="Paste Google Drive or YouTube link..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>

            <button type="submit" className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all text-sm">
              Distribute to Portal
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}