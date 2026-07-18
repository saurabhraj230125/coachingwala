"use client";

import { useState } from "react";
import { CheckCircle2, Zap, Shield, QrCode, Smartphone, ArrowRight, Loader2, Star, Check } from "lucide-react";
import { submitUTR } from "./actions";

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<null | 'STARTER' | 'PRO' | 'MAX'>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Exact UPI Details tailored for your brand
  const UPI_ID = "6306814355@ptsbi";
  const PAYEE_NAME = "Future Q"; 

  // Psychological Pricing Model
  const plans = {
    STARTER: { 
      monthly: 499, annual: 4999, 
      name: "Starter Plan", desc: "Perfect for new batches.", 
      features: ['Up to 50 Students', 'Student Roster', 'Basic Attendance']
    },
    PRO: { 
      monthly: 1499, annual: 14999, 
      name: "Pro Plan", desc: "For growing coaching centers.", 
      features: ['Up to 300 Students', 'Fee Collection System', 'Student Gateway', 'NTA Test Engine']
    },
    MAX: { 
      monthly: 3999, annual: 39999, 
      name: "Max Plan", desc: "The ultimate scalable ecosystem.", 
      features: ['Unlimited Students', 'WhatsApp Automations', 'Priority Support', 'Custom Domain Setup']
    }
  };

  const getPrice = (planKey: 'STARTER' | 'PRO' | 'MAX') => {
    return isAnnual ? plans[planKey].annual : plans[planKey].monthly;
  };

  const getUpiUrl = (amount: number) => {
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR&am=${amount}`;
  };

  const getQrUrl = (amount: number) => {
    const upiString = getUpiUrl(amount);
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&color=1e1b4b`;
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifying(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      // Calls the secure Next.js Server Action
      await submitUTR(formData);
      setPaymentSuccess(true);
    } catch (error) {
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in zoom-in duration-500">
        <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Verification Pending!</h1>
        <p className="text-slate-500 font-medium max-w-md">
          We have received your UTR number. Our finance team will verify the payment with the bank shortly. Your dashboard will automatically unlock once approved.
        </p>
        <button onClick={() => window.location.href = '/dashboard'} className="mt-8 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8 w-full selection:bg-indigo-100">
      
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-700 mb-4">
          <Shield className="h-4 w-4" /> Trusted by Coaching Centers
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
          Simple, transparent pricing.
        </h1>
        
        {/* The Cashflow Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Pay Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-slate-900 rounded-full relative p-1 transition-colors"
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
            Pay Annually 
            <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">Save 17%</span>
          </span>
        </div>
      </div>

      {/* PRICING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        
        {/* STARTER */}
        <div onClick={() => setSelectedPlan('STARTER')} className={`group relative cursor-pointer border-2 rounded-[2rem] p-8 transition-all duration-300 flex flex-col ${selectedPlan === 'STARTER' ? 'bg-slate-50 border-slate-900 shadow-xl' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
          <h2 className="text-xl font-black text-slate-900">{plans.STARTER.name}</h2>
          <p className="text-sm font-medium text-slate-500 mt-2">{plans.STARTER.desc}</p>
          <div className="mt-6 mb-8 flex items-end gap-1">
            <span className="text-4xl font-black text-slate-900">₹{getPrice('STARTER')}</span>
            <span className="text-sm font-bold text-slate-400 mb-1">/{isAnnual ? 'yr' : 'mo'}</span>
          </div>
          <ul className="space-y-4 flex-1">
            {plans.STARTER.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                <Check className={`h-5 w-5 shrink-0 ${selectedPlan === 'STARTER' ? 'text-slate-900' : 'text-slate-300'}`} /> {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* PRO (The Target) */}
        <div onClick={() => setSelectedPlan('PRO')} className={`group relative cursor-pointer border-2 rounded-[2rem] p-8 transition-all duration-300 flex flex-col ${selectedPlan === 'PRO' ? 'bg-indigo-50/50 border-indigo-600 shadow-2xl shadow-indigo-500/20' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
            Most Popular
          </div>
          <h2 className="text-xl font-black text-slate-900">{plans.PRO.name}</h2>
          <p className="text-sm font-medium text-slate-500 mt-2">{plans.PRO.desc}</p>
          <div className="mt-6 mb-8 flex items-end gap-1">
            <span className="text-4xl font-black text-indigo-900">₹{getPrice('PRO')}</span>
            <span className="text-sm font-bold text-indigo-400 mb-1">/{isAnnual ? 'yr' : 'mo'}</span>
          </div>
          <ul className="space-y-4 flex-1">
            {plans.PRO.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                <Check className={`h-5 w-5 shrink-0 ${selectedPlan === 'PRO' ? 'text-indigo-600' : 'text-slate-300'}`} /> {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* MAX (The Decoy) */}
        <div onClick={() => setSelectedPlan('MAX')} className={`group relative cursor-pointer border-2 rounded-[2rem] p-8 transition-all duration-300 flex flex-col ${selectedPlan === 'MAX' ? 'bg-slate-900 border-amber-400 shadow-2xl shadow-amber-500/10' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
          <h2 className="text-xl font-black text-white">{plans.MAX.name}</h2>
          <p className="text-sm font-medium text-slate-400 mt-2">{plans.MAX.desc}</p>
          <div className="mt-6 mb-8 flex items-end gap-1">
            <span className="text-4xl font-black text-white">₹{getPrice('MAX')}</span>
            <span className="text-sm font-bold text-slate-500 mb-1">/{isAnnual ? 'yr' : 'mo'}</span>
          </div>
          <ul className="space-y-4 flex-1">
            {plans.MAX.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-300">
                <Check className={`h-5 w-5 shrink-0 ${selectedPlan === 'MAX' ? 'text-amber-400' : 'text-slate-600'}`} /> {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SECURE PAYMENT MODAL */}
      {selectedPlan && (
        <div className="mt-12 p-6 md:p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Finalize your upgrade</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                You are upgrading to the <span className="font-bold text-indigo-600">{plans[selectedPlan].name}</span> for ₹{getPrice(selectedPlan)}. We charge exactly zero transaction fees. Pay directly to our business account via UPI.
              </p>

              <a 
                href={getUpiUrl(getPrice(selectedPlan))}
                className="md:hidden w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all mb-6"
              >
                <Smartphone className="h-5 w-5" /> Open UPI App to Pay
              </a>

              <form onSubmit={handlePaymentSubmit} className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
                  Step 2: Enter UTR Number
                </label>
                <p className="text-xs text-slate-500 font-medium mb-4">After paying, find the 12-digit UTR/Reference number in your UPI app and enter it below.</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    name="utr"
                    required
                    minLength={12}
                    maxLength={12}
                    placeholder="e.g. 312456789012"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={isVerifying}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 whitespace-nowrap"
                  >
                    {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit for Verification"}
                  </button>
                </div>
              </form>
            </div>

            <div className="hidden md:flex flex-col items-center bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm shrink-0">
              <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                <img 
                  src={getQrUrl(getPrice(selectedPlan))} 
                  alt="UPI QR Code" 
                  className="w-40 h-40 object-contain mix-blend-multiply"
                />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-1">
                <QrCode className="h-4 w-4" /> Scan to Pay
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Google Pay • PhonePe • Paytm</p>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}