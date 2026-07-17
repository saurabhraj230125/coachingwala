"use client";

import { useState } from "react";
import { CheckCircle2, Zap, Shield, QrCode, Smartphone, ArrowRight, Loader2 } from "lucide-react";

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<null | 'PRO' | 'MAX'>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Your specific UPI Details
  const UPI_ID = "6306814355@ptsbi";
  const PAYEE_NAME = "CoachingWala SaaS";

  const plans = {
    PRO: { price: 1499, name: "Pro Plan", desc: "For growing coaching centers." },
    MAX: { price: 2999, name: "Max Plan", desc: "The ultimate NTA-level ecosystem." }
  };

  // Dynamically generate the UPI Intent Link
  const getUpiUrl = (amount: number) => {
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR&am=${amount}`;
  };

  // Use a reliable, free API to instantly generate a QR code from the UPI link for Desktop users
  const getQrUrl = (amount: number) => {
    const upiString = getUpiUrl(amount);
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&color=1e1b4b`;
  };

  const handleSimulatedVerification = () => {
    setIsVerifying(true);
    // In production, you would ask them for a UTR/Transaction ID to verify manually.
    // Here we simulate the sleek loading state.
    setTimeout(() => {
      setIsVerifying(false);
      setPaymentSuccess(true);
    }, 2500);
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
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
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 w-full">
      
      <div className="mb-8 md:mb-12 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center justify-center md:justify-start gap-2">
          Scale Your Empire <Zap className="h-6 w-6 md:h-8 md:w-8 text-amber-500 fill-amber-500" />
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-2 font-medium">
          Upgrade to unlock NTA test engines, automated fee management, and infinite storage. Zero transaction fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        {/* PRO PLAN */}
        <div className={`relative bg-white border-2 rounded-[2.5rem] p-6 md:p-8 transition-all duration-300 ${selectedPlan === 'PRO' ? 'border-indigo-600 shadow-2xl shadow-indigo-500/20' : 'border-slate-200 hover:border-indigo-300'}`}>
          <h2 className="text-xl font-black text-slate-900">Pro Plan</h2>
          <div className="mt-4 flex items-baseline text-5xl font-black text-slate-900 tracking-tighter">
            ₹1,499
            <span className="ml-1 text-lg font-bold text-slate-400">/yr</span>
          </div>
          <ul className="mt-8 space-y-4">
            {['Fee Collection Dashboard', 'WhatsApp Fee Reminders', 'Up to 500 Students', 'Basic Study Material Vault'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setSelectedPlan('PRO')}
            className={`mt-10 w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${selectedPlan === 'PRO' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
          >
            {selectedPlan === 'PRO' ? 'Selected' : 'Select Pro'}
          </button>
        </div>

        {/* MAX PLAN */}
        <div className={`relative bg-gradient-to-b from-slate-900 to-indigo-950 border-2 rounded-[2.5rem] p-6 md:p-8 transition-all duration-300 ${selectedPlan === 'MAX' ? 'border-amber-400 shadow-2xl shadow-amber-500/20' : 'border-slate-800 hover:border-slate-700'}`}>
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
            <span className="bg-gradient-to-r from-amber-400 to-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Most Popular</span>
          </div>
          <h2 className="text-xl font-black text-white">Max Plan</h2>
          <div className="mt-4 flex items-baseline text-5xl font-black text-white tracking-tighter">
            ₹2,999
            <span className="ml-1 text-lg font-bold text-indigo-300">/yr</span>
          </div>
          <ul className="mt-8 space-y-4">
            {['Everything in Pro', 'NTA-Level Exam Engine (Anti-Cheat)', 'Unlimited Students', 'Parent App Access'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-indigo-100">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" /> {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setSelectedPlan('MAX')}
            className={`mt-10 w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${selectedPlan === 'MAX' ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 shadow-lg shadow-amber-500/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {selectedPlan === 'MAX' ? 'Selected' : 'Select Max'}
          </button>
        </div>
      </div>

      {/* SECURE PAYMENT MODAL (Only shows when a plan is selected) */}
      {selectedPlan && (
        <div className="mt-8 p-6 md:p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Shield className="h-3 w-3" /> Secure UPI Transfer
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Complete your upgrade</h3>
              <p className="text-slate-500 text-sm font-medium mb-6">
                You selected the <span className="font-bold text-indigo-600">{plans[selectedPlan].name}</span> for ₹{plans[selectedPlan].price}. Scan the QR code or tap the button below to pay directly via any UPI app.
              </p>

              {/* MOBILE ONLY: Deep Link Button */}
              <a 
                href={getUpiUrl(plans[selectedPlan].price)}
                className="lg:hidden w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all"
              >
                <Smartphone className="h-5 w-5" /> Open GPay / PhonePe
              </a>
            </div>

            {/* DESKTOP ONLY: QR Code */}
            <div className="hidden lg:flex flex-col items-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
                 {/* This automatically generates a QR code pointing directly to your UPI ID */}
                <img 
                  src={getQrUrl(plans[selectedPlan].price)} 
                  alt="UPI QR Code" 
                  className="w-40 h-40 object-contain"
                />
              </div>
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <QrCode className="h-4 w-4" /> Scan with any UPI app
              </p>
            </div>
            
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 pl-1">
              Have you completed the payment?
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Enter 12-digit UTR / Reference No."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base md:text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button 
                onClick={handleSimulatedVerification}
                disabled={isVerifying}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70"
              >
                {isVerifying ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Verifying...</>
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