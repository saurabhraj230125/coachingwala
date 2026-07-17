"use client";

import { useState } from "react";
import { Search, Filter, Plus, ChevronRight } from "lucide-react";
// The slash below was missing!
import StudentSlideOut from "./components/StudentSlideOut"; 

// Dummy data for visual architecture (We will connect Supabase next)
const mockStudents = [
  { id: "1", name: "Rahul Kumar", rollNumber: "BOK-24-001", phone: "9876543210", parentPhone: "9988776655", batch: "Class 12 - Target JEE", status: "Active", attendancePct: 92 },
  { id: "2", name: "Priya Singh", rollNumber: "BOK-24-002", phone: "8765432109", parentPhone: "8877665544", batch: "Class 11 - Foundation", status: "Active", attendancePct: 88 },
  { id: "3", name: "Amit Sharma", rollNumber: "BOK-24-003", phone: "7654321098", parentPhone: "7766554433", batch: "Class 12 - Dropper", status: "Warning", attendancePct: 64 },
];

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Instant Client-Side Search Filtering
  const filteredStudents = mockStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.phone.includes(searchQuery)
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Student CRM</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage {mockStudents.length} active enrollments.</p>
        </div>
        
        <div className="w-full md:w-auto flex gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> Add Student
          </button>
        </div>
      </div>

      {/* AIRTABLE-STYLE DATA TABLE */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Search Bar Row */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, phone, or roll number... (Cmd+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none"
          />
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Student Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Batch</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Attendance</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  onClick={() => setSelectedStudent(student)}
                  className="group hover:bg-indigo-50/30 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{student.rollNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                      {student.batch}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Visual progress bar for attendance */}
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${student.attendancePct > 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                          style={{ width: `${student.attendancePct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{student.attendancePct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors inline-flex items-center justify-center rounded-lg group-hover:bg-indigo-50">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-sm font-medium">
              No students found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* RENDER THE SLIDE-OUT PANEL */}
      <StudentSlideOut 
        student={selectedStudent} 
        isOpen={selectedStudent !== null} 
        onClose={() => setSelectedStudent(null)} 
      />

    </div>
  );
}