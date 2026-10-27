import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  ArrowRight,
  Mail,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const SimpleLoginPage: React.FC = () => {
  const { sendEmailOtp, verifyOtp, otpSession, clearOtpSession } = useApp();

  const [selectedRole, setSelectedRole] = useState<'college' | 'aicte'>('college');
  const [email, setEmail] = useState<string>('principal@apex-tech.edu.in');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleRoleSelect = (role: 'college' | 'aicte') => {
    setSelectedRole(role);
    if (role === 'college') {
      setEmail('principal@apex-tech.edu.in');
    } else {
      setEmail('ananya.sharma@aicte-india.org');
    }
    clearOtpSession();
    setGeneratedCode(null);
    setEnteredOtp('');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const code = sendEmailOtp(email, selectedRole);
    setGeneratedCode(code);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp(enteredOtp);
  };

  const handleAutoFill = () => {
    if (generatedCode) {
      setEnteredOtp(generatedCode);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F4F9FF] via-white to-[#EBF3FC] flex flex-col justify-center items-center p-4 sm:p-6 text-center">
      <div className="max-w-xl w-full space-y-6">
        {/* Emblem & Portal Branding */}
        <div className="space-y-3">
          <div className="inline-flex h-16 w-16 rounded-3xl bg-linear-to-tr from-[#0284C7] to-[#29B6F6] items-center justify-center text-white shadow-xl shadow-sky-500/25">
            <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="font-black text-2xl sm:text-3xl text-[#183153] tracking-tight">AICTE</span>
              <span className="font-extrabold text-2xl sm:text-3xl text-[#0284C7] tracking-tight">SmartVerify</span>
              <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-[#0369A1]">
                2FA Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              National Technical Education Regulatory Verification Portal • Two-Factor Email OTP Authentication
            </p>
          </div>
        </div>

        {/* Dedicated Auth Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl text-left space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                {!otpSession ? 'Step 1: Role & Email' : 'Step 2: Enter Email OTP'}
              </span>
              <h2 className="text-base font-extrabold text-[#183153] mt-1">
                {!otpSession ? 'Sign In via Institutional Email' : 'Enter 6-Digit Email Verification Code'}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <span className={!otpSession ? 'text-[#0284C7] font-black' : 'text-slate-400'}>1. Email</span>
              <span>→</span>
              <span className={otpSession ? 'text-[#0284C7] font-black' : 'text-slate-400'}>2. OTP</span>
            </div>
          </div>

          {!otpSession ? (
            /* STEP 1: Select Role & Enter Email */
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Your Portal Workspace:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('college')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                      selectedRole === 'college'
                        ? 'border-[#0284C7] bg-sky-50/60 ring-2 ring-sky-200 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        selectedRole === 'college'
                          ? 'bg-[#0284C7] text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#183153]">College Portal</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Apex Institute of Tech</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('aicte')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                      selectedRole === 'aicte'
                        ? 'border-[#0284C7] bg-sky-50/60 ring-2 ring-sky-200 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        selectedRole === 'aicte'
                          ? 'bg-[#0284C7] text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#183153]">AICTE Desk</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Central Scrutiny Wing</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Authorized Email Address *</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    OTP will be dispatched to this mail
                  </span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. principal@apex-tech.edu.in"
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 text-slate-800 font-medium font-mono"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons for Instant Demo */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">Quick Demo Presets:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('college');
                      setEmail('principal@apex-tech.edu.in');
                    }}
                    className="text-[11px] font-bold text-[#0284C7] bg-white px-2 py-1 rounded-md border border-slate-200 hover:bg-sky-50"
                  >
                    College Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('aicte');
                      setEmail('ananya.sharma@aicte-india.org');
                    }}
                    className="text-[11px] font-bold text-[#0284C7] bg-white px-2 py-1 rounded-md border border-slate-200 hover:bg-sky-50"
                  >
                    AICTE Officer Email
                  </button>
                </div>
              </div>

              {/* Send OTP Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Send Verification Code (OTP) to Mail</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: Enter & Verify OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* Email Sent Notice Box */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0284C7] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>OTP Dispatched Successfully!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => clearOtpSession()}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
                <p className="text-slate-600 text-[11px]">
                  A 6-digit one-time password was sent to: <strong className="font-mono text-slate-800">{otpSession.email}</strong>
                </p>

                {/* Simulated Live Inbox Banner for Easy Testing */}
                {generatedCode && (
                  <div className="mt-2 p-2.5 bg-white rounded-xl border border-sky-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Simulated Email Inbox:
                      </span>
                      <span className="font-mono font-black text-sm text-[#0284C7] tracking-widest">
                        {generatedCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-[#0369A1] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Fill OTP</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 6-Digit Code Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Enter 6-Digit Security OTP *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 482910"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 text-base sm:text-lg bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 text-slate-900 font-mono font-bold tracking-widest text-center"
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={enteredOtp.length < 6}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify OTP & Enter {selectedRole === 'college' ? 'College Portal' : 'AICTE Scrutiny Desk'}</span>
              </button>

              {/* Resend option */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const code = sendEmailOtp(email, selectedRole);
                    setGeneratedCode(code);
                  }}
                  className="text-xs font-bold text-[#0284C7] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend OTP to Email</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Minimal Footer */}
        <p className="text-xs text-slate-400">
          All India Council for Technical Education (AICTE) • National Regulatory Verification Portal
        </p>
      </div>
    </div>
  );
};
