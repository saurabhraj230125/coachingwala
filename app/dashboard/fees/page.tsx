import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Wallet, IndianRupee, CheckCircle2, Clock, Smartphone, Banknote, Receipt } from "lucide-react";

// SERVER ACTION: Instantly record a payment and refresh the ledger
async function collectFee(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const studentId = formData.get("studentId") as string;
  const instituteId = formData.get("instituteId") as string;
  const amount = parseInt(formData.get("amount") as string);
  const method = formData.get("method") as string;

  await supabase.from("fee_payments").insert({
    student_id: studentId,
    institute_id: instituteId,
    amount_paid: amount,
    payment_method: method
  });

  revalidatePath("/dashboard/fees");
}

export default async function FeeManagementModule() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: institute } = await supabase.from("institutes").select("id").eq("owner_id", user?.id).single();

  if (!institute) return null;

  // Fetch all students to build the payment roster
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("institute_id", institute.id)
    .order("name", { ascending: true });

  // Fetch payments ONLY for the current month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const { data: currentMonthPayments } = await supabase
    .from("fee_payments")
    .select("*")
    .eq("institute_id", institute.id)
    .gte("payment_date", startOfMonth);

  // Financial Telemetry Calculations
  let totalCollected = 0;
  let totalExpected = 0;
  
  const paymentMap = new Map();
  currentMonthPayments?.forEach(payment => {
    totalCollected += payment.amount_paid;
    paymentMap.set(payment.student_id, payment);
  });

  students?.forEach(student => {
    totalExpected += student.monthly_fee || 1000;
  });

  const totalPending = totalExpected - totalCollected;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full bg-[#f4f7fb] min-h-screen text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="mb-10 pb-6 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Wallet className="h-8 w-8 text-amber-500" /> Financial Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Track pending dues, collect payments, and monitor monthly revenue.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-amber-600 shadow-sm flex items-center gap-2">
          <Clock className="h-4 w-4" /> Current Cycle: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* ULTRA UI: TOP REVENUE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Total Collected */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><IndianRupee className="h-32 w-32" /></div>
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-100 mb-1">Collected This Month</p>
          <h2 className="text-4xl font-black flex items-center">₹{totalCollected.toLocaleString()}</h2>
          <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-800/40 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-50">
            <CheckCircle2 className="h-3.5 w-3.5" /> Direct to Bank
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Dues</p>
            <div className="p-2 bg-rose-50 rounded-lg"><Clock className="h-4 w-4 text-rose-500" /></div>
          </div>
          <h2 className="text-4xl font-black text-slate-900">₹{totalPending > 0 ? totalPending.toLocaleString() : 0}</h2>
          <p className="mt-4 text-xs font-bold text-rose-600 flex items-center gap-1">Action Required</p>
        </div>

        {/* Expected Projection */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Expected Revenue</p>
            <div className="p-2 bg-indigo-50 rounded-lg"><Receipt className="h-4 w-4 text-indigo-500" /></div>
          </div>
          <h2 className="text-4xl font-black text-slate-900">₹{totalExpected.toLocaleString()}</h2>
          <p className="mt-4 text-xs font-bold text-slate-400 flex items-center gap-1">100% Collection Target</p>
        </div>
      </div>

      {/* 1-CLICK COLLECTION ROSTER */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-900">Student Fee Roster</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {students?.map((student) => {
            const hasPaid = paymentMap.has(student.id);
            const paymentDetails = paymentMap.get(student.id);

            return (
              <div key={student.id} className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg border ${hasPaid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">{student.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{student.parent_phone} • {student.batch_name}</p>
                  </div>
                </div>

                {hasPaid ? (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 pl-4 pr-3 py-2 rounded-xl">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">Paid Successfully</p>
                      <p className="text-sm font-bold text-emerald-800">₹{paymentDetails.amount_paid}</p>
                    </div>
                    <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                      {paymentDetails.payment_method === 'UPI' ? <Smartphone className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
                    </div>
                  </div>
                ) : (
                  <form action={collectFee} className="flex items-center gap-2 w-full md:w-auto">
                    <input type="hidden" name="studentId" value={student.id} />
                    <input type="hidden" name="instituteId" value={institute.id} />
                    
                    <div className="relative w-28">
                      <IndianRupee className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                      <input 
                        name="amount" 
                        type="number" 
                        defaultValue={student.monthly_fee || 1000} 
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <select name="method" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none">
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                    </select>

                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-sm shadow-amber-200">
                      Collect
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}