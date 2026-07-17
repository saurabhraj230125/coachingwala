"use client";

import { useState } from "react";
import { CheckCircle2, Zap, Shield, QrCode, Smartphone, ArrowRight, Loader2, Star } from "lucide-react";

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<null | 'STARTER' | 'PRO' | 'MAX'>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Your exact UPI Details
  const UPI_ID = "6306814355@ptsbi";
  const PAYEE_NAME = "CoachingWala SaaS";

  const plans = {
    STARTER: { price: 500, name: "Starter Plan", desc: "Perfect for new batches." },
    PRO: { price: 1000, name: "Pro Plan", desc: "For growing coaching centers." },
    MAX: { price: 1500, name: "Max Plan", desc: "The ultimate NTA-level ecosystem." }
  };

  const getUpiUrl = (amount: number) => {
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR&am=${amount}`;
  };

  const getQrUrl = (amount: number) => {
    const upiString = getUpiUrl(amount);
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&color=1e1b4b`;
  };

  const handleSimulatedVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPaymentSuccess(true);
    }, 2500);
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in zoom-in duration-500">
        <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Payment Received!</h1>
        <p className="text-slate-500 font-medium max-w-md">
          Your account is being upgraded. Our system is verifying the UTR with the bank. You will have full access shortly.
        </p>
        <button onClick={() => window.location.href = '/dashboard'} className="mt-8 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8 w-full">
      
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center justify-center gap-2">
          Choose Your Engine <Zap className="h-6 w-6 md:h-8 md:w-8 text-amber-500 fill-amber-500" />
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-2 font-medium max-w-2xl mx-auto">
          Upgrade to unlock NTA test engines, automated fee management, and infinite storage. Zero transaction fees—pay directly via UPI.
        </p>
      </div>

      {/* 3-TIER PRICING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* STARTER PLAN */}
        <div 
          onClick={() => setSelectedPlan('STARTER')}
          className={`group relative text-left cursor-pointer border-2 rounded-[2rem] p-6 transition-all duration-300 active:scale-[0.98] flex flex-col ${
            selectedPlan === 'STARTER' 
              ? 'bg-blue-50/50 border-blue-500 shadow-xl shadow-blue-500/10' 
              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5'
          }`}
        >
          <h2 className="text-lg font-black text-slate-900">Starter Plan</h2>
          <p className="text-xs font-bold text-slate-500 mt-1">{plans.STARTER.desc}</p>
          <div className="mt-4 mb-8 flex items-baseline text-4xl font-black text-slate-900 tracking-tighter">
            ₹500
            <span className="ml-1 text-sm font-bold text-slate-400">/mo</span>
          </div>
          <ul className="space-y-3 flex-1">
            {['Student Roster Management', 'Daily Attendance Tracking', 'Up to 100 Students'].map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                <CheckCircle2 className={`h-4 w-4 shrink-0 transition-colors ${selectedPlan === 'STARTER' ? 'text-blue-600' : 'text-slate-400'}`} /> 
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
          <div className={`mt-8 w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all ${
            selectedPlan === 'STARTER' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-700 group-hover:bg-slate-100'
          }`}>
            {selectedPlan === 'STARTER' ? 'Selected - Scroll Down' : 'Select Starter'}
          </div>
        </div>

        {/* PRO PLAN */}
        <div 
          onClick={() => setSelectedPlan('PRO')}
          className={`group relative text-left cursor-pointer border-2 rounded-[2rem] p-6 transition-all duration-300 active:scale-[0.98] flex flex-col ${
            selectedPlan === 'PRO' 
              ? 'bg-indigo-50 border-indigo-600 shadow-2xl shadow-indigo-500/20' 
              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5'
          }`}
        >
          <h2 className="text-lg font-black text-slate-900">Pro Plan</h2>
          <p className="text-xs font-bold text-slate-500 mt-1">{plans.PRO.desc}</p>
          <div className="mt-4 mb-8 flex items-baseline text-4xl font-black text-slate-900 tracking-tighter">
            ₹1,000
            <span className="ml-1 text-sm font-bold text-slate-400">/mo</span>
          </div>
          <ul className="space-y-3 flex-1">
            {['Everything in Starter', 'Fee Collection Dashboard', 'WhatsApp Reminders', 'Up to 500 Students'].map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                <CheckCircle2 className={`h-4 w-4 shrink-0 transition-colors ${selectedPlan === 'PRO' ? 'text-indigo-600' : 'text-emerald-500'}`} /> 
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
          <div className={`mt-8 w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all ${
            selectedPlan === 'PRO' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100'
          }`}>
            {selectedPlan === 'PRO' ? 'Selected - Scroll Down' : 'Select Pro'}
          </div>
        </div>

        {/* MAX PLAN */}
        <div 
          onClick={() => setSelectedPlan('MAX')}
          className={`group relative text-left cursor-pointer border-2 rounded-[2rem] p-6 transition-all duration-300 active:scale-[0.98] flex flex-col ${
            selectedPlan === 'MAX' 
              ? 'bg-gradient-to-b from-slate-900 to-indigo-950 border-amber-400 shadow-2xl shadow-amber-500/20' 
              : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-slate-900/50'
          }`}
        >
          <div className="absolute top-0 right-6 transform -translate-y-1/2">
            <span className="bg-gradient-to-r from-amber-400 to-amber-200 text-amber-900 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-900" /> Best Value
            </span>
          </div>
          <h2 className="text-lg font-black text-white">Max Plan</h2>
          <p className="text-xs font-bold text-indigo-200 mt-1">{plans.MAX.desc}</p>
          <div className="mt-4 mb-8 flex items-baseline text-4xl font-black text-white tracking-tighter">
            ₹1,500
            <span className="ml-1 text-sm font-bold text-indigo-300">/mo</span>
          </div>
          <ul className="space-y-3 flex-1">
            {['Everything in Pro', 'NTA-Level Exam Engine', 'Unlimited Students', 'Premium Study Vault'].map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-indigo-100">
                <CheckCircle2 className={`h-4 w-4 shrink-0 transition-colors ${selectedPlan === 'MAX' ? 'text-amber-400' : 'text-indigo-400'}`} /> 
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
          <div className={`mt-8 w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all ${
            selectedPlan === 'MAX' ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 shadow-lg shadow-amber-500/20' : 'bg-white/10 text-white group-hover:bg-white/20'
          }`}>
            {selectedPlan === 'MAX' ? 'Selected - Scroll Down' : 'Select Max'}
          </div>
        </div>
      </div>

      {/* SECURE PAYMENT MODAL */}
      {selectedPlan && (
        <div className="mt-10 p-6 md:p-8 bg-white border border-slate-200 rounded-[2rem] shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Shield className="h-3 w-3" /> 100% Secure UPI
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Complete your upgrade</h3>
              <p className="text-slate-500 text-sm font-medium mb-6">
                You selected the <span className="font-bold text-indigo-600">{plans[selectedPlan].name}</span> for ₹{plans[selectedPlan].price}/mo. Scan the QR code or tap the button below to pay directly.
              </p>

              {/* MOBILE ONLY: Deep Link Button */}
              <a 
                href={getUpiUrl(plans[selectedPlan].price)}
                className="lg:hidden w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all"
              >
                <Smartphone className="h-5 w-5" /> Open GPay / PhonePe
              </a>
            </div>

            {/* DESKTOP ONLY: QR Code */}
            <div className="hidden lg:flex flex-col items-center bg-slate-50 p-5 rounded-3xl border border-slate-200">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-3">
                <img 
                  src={getQrUrl(plans[selectedPlan].price)} 
                  alt="UPI QR Code" 
                  className="w-36 h-36 object-contain"
                />
              </div>
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <QrCode className="h-4 w-4" /> Scan with any UPI app
              </p>
            </div>
            
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 pl-1">
              Confirm your payment
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Enter 12-digit UTR / Reference No."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button 
                onClick={handleSimulatedVerification}
                disabled={isVerifying}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70"
              >
                {isVerifying ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  <>Verify Payment <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}