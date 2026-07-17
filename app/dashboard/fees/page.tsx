"use client";

import { useState } from "react";
import { IndianRupee, TrendingUp, AlertCircle, MessageCircle, Download, CheckCircle2, Search, Filter } from "lucide-react";

// Dummy data for financial architecture
const feeRecords = [
  { id: "1", name: "Rahul Kumar", parentPhone: "9988776655", batch: "Class 12 - Target JEE", amountDue: 2500, dueDate: "10 Jul 2026", status: "Overdue" },
  { id: "2", name: "Amit Sharma", parentPhone: "7766554433", batch: "Class 12 - Dropper", amountDue: 3000, dueDate: "15 Jul 2026", status: "Overdue" },
  { id: "3", name: "Priya Singh", parentPhone: "8877665544", batch: "Class 11 - Foundation", amountDue: 2000, dueDate: "20 Jul 2026", status: "Pending" },
  { id: "4", name: "Neha Gupta", parentPhone: "6655443322", batch: "Class 10 - Boards", amountDue: 1500, dueDate: "05 Jul 2026", status: "Paid" },
];

export default function FeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'Action Required' | 'All History'>('Action Required');

  // Filter logic
  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Action Required') {
      return matchesSearch && (record.status === 'Overdue' || record.status === 'Pending');
    }
    return matchesSearch;
  });

  // Micro UX: The Magic WhatsApp Generator
  const sendWhatsAppReminder = (record: any) => {
    const message = `Hello, this is a gentle reminder from CoachingWala. The monthly fee of ₹${record.amountDue} for ${record.name} was due on ${record.dueDate}. Kindly clear the dues at your earliest convenience. You can pay directly via UPI: 6306814355@ptsbi`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/91${record.parentPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Fee Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Automate your cash flow and track every rupee.</p>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95">
          <Download className="h-4 w-4" /> Export Excel
        </button>
      </div>

      {/* STRIPE-STYLE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <IndianRupee className="h-16 w-16" />
          </div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Collected This Month</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-slate-900">₹84,500</h2>
          </div>
          <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +12% from last month
          </p>
        </div>

        <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-extrabold text-amber-600/70 uppercase tracking-widest mb-2">Pending (Upcoming)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-amber-900">₹12,000</h2>
          </div>
          <p className="text-xs font-bold text-amber-700 mt-2">Due in the next 7 days</p>
        </div>

        <div className="bg-red-50/50 border border-red-200/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-extrabold text-red-600/70 uppercase tracking-widest mb-2">Total Overdue</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-red-900">₹5,500</h2>
          </div>
          <p className="text-xs font-bold text-red-700 mt-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Requires immediate action
          </p>
        </div>
      </div>

      {/* THE ACTION TABLE */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Header & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          
          {/* Custom Tabs */}
          <div className="flex bg-slate-200/50 p-1 rounded-xl w-full md:w-auto">
            {['Action Required', 'All History'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto bg-white px-3 py-2 rounded-xl border border-slate-200">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none w-full md:w-48"
            />
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Student</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Due Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{record.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{record.batch}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">₹{record.amountDue}</span>
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
                    {record.status !== 'Paid' ? (
                      <button 
                        onClick={() => sendWhatsAppReminder(record)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-bold text-xs rounded-xl transition-all active:scale-95"
                      >
                        <MessageCircle className="h-4 w-4" /> Remind
                      </button>
                    ) : (
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed">
                        <CheckCircle2 className="h-4 w-4" /> Cleared
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRecords.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-sm font-medium flex flex-col items-center">
              <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              No pending dues! Everyone is caught up.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}