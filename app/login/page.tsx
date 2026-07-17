"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, Loader2, Smartphone, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState<"google" | "phone" | "otp" | null>(null);
  
  // Phone Auth State
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading("google");
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // 🔥 THE DEEP FIX: Dynamically grabs your domain so Google knows exactly where to send the secure token
        redirectTo: `${window.location.origin}/auth/callback`, 
      },
    });
    
    if (error) {
      setError(error.message);
      setLoading(null);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("phone");
    setError(null);
    
    // Ensure phone has country code +91
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    } else {
      setStep("otp");
      setLoading(null);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("otp");
    setError(null);
    
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    
    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    } else {
      // 🔥 SUCCESS: Hard redirect to dashboard layout which acts as the gatekeeper
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#fafafa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-slate-900/20">
          CW
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-slate-900">
          CoachingWala OS
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          The operating system for modern coaching institutes.
        </p>
      </div>

      {/* The Auth Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-slate-200/50 sm:rounded-[2rem] sm:px-10 border border-slate-100 relative overflow-hidden">
          
          {step === "phone" ? (
            <div className="space-y-6">
              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading === "google" ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-slate-300 font-bold text-xs uppercase tracking-widest">OR</span></div>
              </div>

              {/* Phone Input Form */}
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <div className="flex bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900 transition-all">
                    <span className="flex items-center justify-center px-4 bg-slate-100 text-slate-500 font-bold border-r border-slate-200">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-transparent border-none py-3.5 px-4 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-0 outline-none"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

                <button
                  type="submit"
                  disabled={loading !== null || phone.length < 10}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 px-4 rounded-2xl transition-all active:scale-[0.98] hover:bg-slate-800 disabled:opacity-50 shadow-lg shadow-slate-900/20"
                >
                  {loading === "phone" ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Smartphone className="h-4 w-4" /> Send Login Code</>}
                </button>
              </form>
            </div>
          ) : (
            
            /* OTP VERIFICATION STEP */
            <form onSubmit={handleOtpVerify} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Enter secure code</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">We sent a 6-digit code to +91 {phone}</p>
              </div>

              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.7em] text-4xl font-black bg-slate-50 border border-slate-200 rounded-2xl py-4 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder:text-slate-200"
                />
              </div>

              {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

              <button
                type="submit"
                disabled={loading !== null || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 px-4 rounded-2xl transition-all active:scale-[0.98] hover:bg-slate-800 disabled:opacity-50 shadow-lg shadow-slate-900/20"
              >
                {loading === "otp" ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ArrowRight className="h-4 w-4" /> Verify & Continue</>}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep("phone")}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Wrong number? Go back
              </button>
            </form>
          )}

        </div>
        <p className="text-center text-xs font-bold text-slate-400 mt-8">By continuing, you agree to our Terms of Service.</p>
      </div>
    </div>
  );
}