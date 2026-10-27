import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  UserCheck,
  Sliders,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface LoginPageProps {
  setActiveTab: (tab: string) => void;
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setActiveTab, onLoginSuccess }) => {
  const { login, register, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('principal@greenfield.edu.in');
  const [password, setPassword] = useState<string>('college123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('institution');

  // Registration state
  const [regName, setRegName] = useState<string>('');
  const [regInstName, setRegInstName] = useState<string>('');

  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid official email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please enter your password (minimum 4 characters).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = login(email, password, selectedRole);
      setIsSubmitting(false);
      if (success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          setActiveTab('dashboard');
        }
      }
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter full legal name of authorized officer.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid official institutional email.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = register(regName, email, password, selectedRole, regInstName);
      setIsSubmitting(false);
      if (success) {
        setActiveTab('dashboard');
      }
    }, 600);
  };

  const handleQuickDemoFill = (demoEmail: string, demoPass: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSelectedRole(demoRole);
    setErrorMessage('');
    showToast(`Loaded ${demoRole} demo credentials`, 'info');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Top Portal Crest & Branding */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-linear-to-tr from-[#29B6F6] to-[#0284C7] flex items-center justify-center text-white shadow-lg shadow-sky-500/25 mb-3">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[11px] font-bold text-[#0284C7] mb-2">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>AICTE Approval Process Handbook (APH 2026-27)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#183153] tracking-tight">
            AICTE SmartVerify AI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            National Technical Education Regulatory Verification Portal
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-[24px] border border-sky-100 shadow-xl shadow-sky-950/5 p-6 sm:p-8 space-y-6 text-left">
          {/* Tab Selector: Login vs Register */}
          <div className="flex bg-[#F4F9FF] p-1 rounded-xl border border-sky-100 text-xs">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#0284C7] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In to Portal
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#0284C7] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              New Institution Register
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. principal@greenfield.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => showToast('Demo environment: any password is accepted, or click a demo account below.', 'info')}
                    className="text-[11px] text-[#0284C7] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#0284C7]"
                  />
                  <span>Remember official credentials</span>
                </label>
                <span className="text-slate-400">256-Bit SSL Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-linear-to-r from-[#29B6F6] to-[#0284C7] text-white text-xs font-bold hover:shadow-md hover:shadow-sky-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Authenticating Credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Scrutiny Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Full Name of Nodal Officer / Principal
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Greenfield Institute of Technology"
                  value={regInstName}
                  onChange={(e) => setRegInstName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="principal@college.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Create Security Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register & Access Portal</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Demo Credentials Quick-Fill Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Credentials
              </span>
              <span className="text-[10px] text-[#0284C7] font-semibold">Demo Sandbox Mode</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('principal@greenfield.edu.in', 'college123', 'institution')}
                className="w-full p-2.5 rounded-xl bg-[#F4F9FF] border border-sky-100 hover:border-sky-300 transition-colors flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-sky-100 text-[#0284C7] flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 group-hover:text-[#0284C7]">
                      College User (Principal)
                    </div>
                    <div className="text-[10px] text-slate-400">principal@greenfield.edu.in</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#0284C7] bg-white px-2 py-0.5 rounded border border-sky-100">
                  Select
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill('ananya.sharma@aicte-india.org', 'officer123', 'officer')}
                className="w-full p-2.5 rounded-xl bg-[#F4F9FF] border border-sky-100 hover:border-sky-300 transition-colors flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 group-hover:text-[#0284C7]">
                      AICTE Scrutiny Officer
                    </div>
                    <div className="text-[10px] text-slate-400">ananya.sharma@aicte-india.org</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-100">
                  Select
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin.verify@aicte-india.org', 'admin123', 'admin')}
                className="w-full p-2.5 rounded-xl bg-[#F4F9FF] border border-sky-100 hover:border-sky-300 transition-colors flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 group-hover:text-[#0284C7]">
                      Systems Administrator
                    </div>
                    <div className="text-[10px] text-slate-400">admin.verify@aicte-india.org</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-100">
                  Select
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer help link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setActiveTab('landing')}
            className="text-xs text-slate-500 hover:text-[#0284C7] font-semibold transition-colors"
          >
            ← Back to National Landing Overview
          </button>
        </div>
      </div>
    </div>
  );
};
