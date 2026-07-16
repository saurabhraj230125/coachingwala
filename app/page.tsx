import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#f8fafc]">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4 text-center">
        CoachingStack
      </h1>
      <p className="text-lg text-slate-500 mb-8 max-w-md text-center">
        The ultimate management platform for local coaching institutes. Simplify attendance, tests, and communication for just ₹500/month.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all"
        >
          Start 14-Day Free Trial
        </Link>
      </div>
    </div>
  );
}