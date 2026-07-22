"use client";

import { useState, useMemo } from "react";
import { 
  IndianRupee, TrendingUp, AlertCircle, MessageCircle, 
  Download, CheckCircle2, Search, Plus, User, Calendar, 
  Phone, X, Wallet, Receipt, Trash2, ArrowRight
} from "lucide-react";

// Types
type FeeStatus = 'Overdue' | 'Pending' | 'Paid';
interface FeeRecord {
  id: string;
  name: string;
  parentPhone: string;
  batch: string;
  amountDue: number;
  dueDate: string;
  status: FeeStatus;
}

export default function FeesPage() {
  // We start with an EMPTY state so new users see the "Zero Zero" dashboard.
  const [records, setRecords] = useState<FeeRecord[]>([]);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'Action Required' | 'Paid' | 'All'>('Action Required');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form States
  const [newFee, setNewFee] = useState({ name: "", phone: "", batch: "Class 12 - Target JEE", amount: "", date: "" });

  // --- Dynamic Financial Intelligence (Calculates on the fly) ---
  const metrics = useMemo(() => {
    let collected = 0;
    let pending = 0;
    let overdue = 0;

    records.forEach(r => {
      if (r.status === 'Paid') collected += r.amountDue;
      if (r.status === 'Pending') pending += r.amountDue;
      if (r.status === 'Overdue') overdue += r.amountDue;
    });

    const totalExpected = collected + pending + overdue;
    const collectionRate = totalExpected === 0 ? 0 : Math.round((collected / totalExpected) * 100);

    return { collected, pending, overdue, totalExpected, collectionRate };
  }, [records]);

  // --- Filter Logic ---
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === 'Action Required') return matchesSearch && (record.status === 'Overdue' || record.status === 'Pending');
      if (activeTab === 'Paid') return matchesSearch && record.status === 'Paid';
      return matchesSearch; // 'All'
    });
  }, [records, searchQuery, activeTab]);

  // --- Actions ---
  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFee.name || !newFee.amount || !newFee.date) return;

    // Logic to determine status based on date
    const selectedDate = new Date(newFee.date);
    const today = new Date();
    const isOverdue = selectedDate < today && selectedDate.toDateString() !== today.toDateString();

    const record: FeeRecord = {
      id: Math.random().toString(36).substring(7),
      name: newFee.name,
      parentPhone: newFee.phone || "0000000000",
      batch: newFee.batch,
      amountDue: Number(newFee.amount),
      dueDate: selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), // e.g., 10 Jul 2026
      status: isOverdue ? 'Overdue' : 'Pending'
    };

    setRecords(prev => [record, ...prev]);
    setIsCreateModalOpen(false);
    setNewFee({ name: "", phone: "", batch: "Class 12 - Target JEE", amount: "", date: "" });
  };

  const markAsPaid = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Paid' } : r));
  };

  const deleteRecord = (id: string) => {
    if(window.confirm("Delete this fee record?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const sendWhatsAppReminder = (record: FeeRecord) => {
    const message = `Hello, this is a gentle reminder from CoachingWala. The monthly fee of ₹${record.amountDue} for ${record.name} was due on ${record.dueDate}. Kindly clear the dues at your earliest convenience.`;
    window.open(`https://wa.me/91${record.parentPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const loadDemoData = () => {
    setRecords([
      { id: "1", name: "Rahul Kumar", parentPhone: "9988776655", batch: "Class 12 - Target JEE", amountDue: 2500, dueDate: "10 Jul 2026", status: "Overdue" },
      { id: "2", name: "Priya Singh", parentPhone: "8877665544", batch: "Class 11 - Foundation", amountDue: 2000, dueDate: "25 Jul 2026", status: "Pending" },
      { id: "3", name: "Neha Gupta", parentPhone: "6655443322", batch: "Class 10 - Boards", amountDue: 1500, dueDate: "05 Jul 2026", status: "Paid" },
    ]);
  };

  // --- Render ---
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8 min-h-screen flex flex-col">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Fee Ledger</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Generate requests, track payments, and automate cash flow.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {records.length === 0 && (
            <button onClick={loadDemoData} className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
              Load Demo Data
            </button>
          )}
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> New Request
          </button>
        </div>
      </div>

      {/* STRIPE-STYLE DYNAMIC METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Collected */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group hover:border-emerald-200 hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
            <Wallet className="h-20 w-20 text-emerald-900" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Collected Revenue</p>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-4xl font-black tracking-tight ${metrics.collected > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
              ₹{metrics.collected.toLocaleString('en-IN')}
            </h2>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[10px] font-bold mb-1.5">
              <span className="text-slate-500">Collection Rate</span>
              <span className={metrics.collectionRate === 100 ? 'text-emerald-500' : 'text-slate-700'}>{metrics.collectionRate}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${metrics.collectionRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group hover:border-amber-200 hover:shadow-md transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span> Pending Pipeline
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-4xl font-black tracking-tight ${metrics.pending > 0 ? 'text-amber-600' : 'text-slate-300'}`}>
              ₹{metrics.pending.toLocaleString('en-IN')}
            </h2>
          </div>
          <p className="text-xs font-bold text-slate-500 mt-2">Dues scheduled for the future</p>
        </div>

        {/* Overdue */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group hover:border-red-200 hover:shadow-md transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span> Action Required
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-4xl font-black tracking-tight ${metrics.overdue > 0 ? 'text-red-600' : 'text-slate-300'}`}>
              ₹{metrics.overdue.toLocaleString('en-IN')}
            </h2>
          </div>
          <p className="text-xs font-bold text-slate-500 mt-2">Payments missed past due date</p>
        </div>
      </div>

      {/* MAIN TABLE / LIST AREA */}
      <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col relative">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div className="flex bg-slate-200/60 p-1 rounded-xl w-full md:w-auto">
            {(['Action Required', 'Paid', 'All'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" placeholder="Search student roster..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none w-full md:w-56"
            />
          </div>
        </div>

        {/* Content */}
        {records.length === 0 ? (
          // --- THE ZERO STATE ---
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
            <div className="h-24 w-24 bg-white shadow-sm rounded-full border border-slate-100 flex items-center justify-center mb-6">
              <Receipt className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your ledger is perfectly clean.</h3>
            <p className="text-sm font-medium text-slate-500 mt-2 max-w-sm">
              Generate your first fee request to start tracking revenue, managing cash flow, and automating reminders.
            </p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-6 flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Generate First Invoice <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : filteredRecords.length === 0 ? (
          // --- NO SEARCH RESULTS ---
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <h3 className="text-lg font-black text-slate-900">No records found.</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          // --- THE DATA TABLE ---
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Student Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Due Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm uppercase shrink-0 border border-indigo-100">
                          {record.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{record.name}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{record.batch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-black ${record.status === 'Paid' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        ₹{record.amountDue.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">{record.dueDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        record.status === 'Overdue' ? 'bg-red-50 text-red-700 border border-red-200' : 
                        record.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          record.status === 'Overdue' ? 'bg-red-500 animate-pulse' : 
                          record.status === 'Pending' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}></span>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {record.status !== 'Paid' ? (
                          <>
                            <button onClick={() => markAsPaid(record.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200" title="Mark as Paid">
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => sendWhatsAppReminder(record)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-bold text-xs rounded-lg transition-all">
                              <MessageCircle className="h-3.5 w-3.5" /> Remind
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 mr-2">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Settled
                          </span>
                        )}
                        
                        <button onClick={() => deleteRecord(record.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-2" title="Delete Record">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SLIDE-UP MODAL: NEW FEE REQUEST */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Generate Request</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">Assign a new fee to a student</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="h-8 w-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFee} className="p-6 space-y-4">
              
              {/* Fake Roster Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input required type="text" placeholder="e.g. Rahul Kumar" value={newFee.name} onChange={e => setNewFee({...newFee, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input required type="tel" placeholder="WhatsApp No." value={newFee.phone} onChange={e => setNewFee({...newFee, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Batch</label>
                  <select value={newFee.batch} onChange={e => setNewFee({...newFee, batch: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all appearance-none cursor-pointer">
                    <option>Class 12 - Target JEE</option>
                    <option>Class 11 - Foundation</option>
                    <option>Class 10 - Boards</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input required type="number" min="0" placeholder="0" value={newFee.amount} onChange={e => setNewFee({...newFee, amount: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input required type="date" value={newFee.date} onChange={e => setNewFee({...newFee, date: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Create Request
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}