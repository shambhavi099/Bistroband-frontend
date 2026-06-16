/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */
import { useState } from 'react';
import api from "../services/api";
import { 
  Lock, 
  User, 
  ChefHat, 
  Utensils, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Info
} from 'lucide-react';


export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset accounts for frictionless testing
  const presets = [
    {
      name: "Vedanshi",
      username: "vedanshi",
      role: "Manager" ,
      passcode: "1234",
      description: "Full access to Admin, Reports, and Operational controls",
      color: "border-amber-400 hover:border-amber-500 bg-amber-500/5 text-amber-600",
      icon: ShieldCheck
    },
    {
      name: "Chef Marcus Vance",
      username: "marcus_chef",
      role: "Chef" ,
      passcode: "chef123",
      description: "Kitchen Orders, Menu editing, and Raw Stocks",
      color: "border-sky-400 hover:border-sky-500 bg-sky-500/5 text-sky-600",
      icon: ChefHat
    },
    {
      name: "Jessica Lee",
      username: "jessica_server",
      role: "Server",
      passcode: "server123",
      description: "Table allocation, CRM, and POS cash registers",
      color: "border-emerald-400 hover:border-emerald-500 bg-emerald-500/5 text-emerald-600",
      icon: Utensils
    }
  ];

  const handleApplyPreset = (preset) => {
    setUsername(preset.username);
    setPasscode(preset.passcode);
    setError(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setIsSubmitting(true);
  setError(null);

  try {
    const response = await api.post("/auth/login", {
      email: username,
      password: passcode,
    });

    const { token, data } = response.data;

    // Save for future API calls
    localStorage.setItem("token", token);
    localStorage.setItem("employee", JSON.stringify(data));

    console.log("Logged In User:", data);

    onLoginSuccess(data);
  } catch (error) {
    console.error(error);

    setError(
      error.response?.data?.message ||
      "Login failed"
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div id="login-container" className="min-h-screen w-screen flex flex-col lg:flex-row bg-slate-50 items-stretch select-none font-sans overflow-x-hidden">
      
      {/* Left side panel: Decorative Brand Splash */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        
        {/* Subtle background overlay mask */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#334155,transparent)] opacity-40" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide leading-none text-white">BISTROBOARD</h1>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mt-1">Operational OS</span>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-sm space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Staff Register Terminal
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white font-sans leading-tight">
            Simplify your gourmet kitchen & front-of-house operations.
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Synchronize direct table lists, cash payment checkouts, ingredients tracking, and back-office promo codes in one cohesive dashboard.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-4">
          <span>Active Session Node: 0.1a</span>
          <span>Bistroboard Terminal OS</span>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-16 lg:px-24 xl:px-32 py-12 bg-white relative">
        <div className="mx-auto w-full max-w-md space-y-8">
          
          {/* Header text */}
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
                <ShieldCheck className="h-4.5 w-4.5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-extrabold text-slate-900 font-mono tracking-wider uppercase">BistroBoard</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to your register</h3>
            <p className="text-xs text-slate-500 font-medium">Enter your credentials to manage active floor tables & cooking tickets</p>
          </div>

          {/* Interactive Customer Mode Portal Card */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="space-y-1 text-left">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider">
                <Sparkles className="h-2.5 w-2.5" /> Self-Serve Client Mode
              </span>
              <h4 className="text-xs font-bold text-indigo-950">Bistro Customer Portal</h4>
              <p className="text-[10px] text-indigo-700 leading-relaxed font-semibold">
                Settle up bills online, allocate dining salon tables, lookup fresh menu lists, and trigger immediate kitchen cooking tickets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onLoginSuccess({
                name: "Guest Patron",
                role: "Customer",
                username: "guest_patron"
              })}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-755 hover:bg-indigo-700 text-white font-bold rounded-xl text-[10.5px] transition-all flex items-center gap-1 shadow-md shadow-indigo-650/15 cursor-pointer shrink-0"
            >
              <span>Enter Portal</span>
              <ArrowRight className="h-3 w-3 stroke-[2.5]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-pulse">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Employee Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. vedanshi"
                  className="w-full text-xs p-3 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-medium text-slate-800"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Security Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••"
                  className="w-full text-xs p-3 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-medium text-slate-800"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10 hover:shadow-slate-900/15"
            >
              {isSubmitting ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping mr-1" />
                  Authenticating profile...
                </>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Accounts selector for evaluation convenience */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Quick-select role profiles (Evaluation Playground)</span>
            
            <div className="grid grid-cols-1 gap-2">
              {presets.map((p) => {
                const PresetIcon = p.icon;
                return (
                  <button
                    key={p.username}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`p-3 border rounded-xl text-left transition-all ${p.color} flex items-center justify-between border-slate-100`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white rounded-lg shrink-0 border border-slate-205/65">
                        <PresetIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 leading-none">{p.name}</span>
                          <span className="text-[9px] font-mono font-bold uppercase leading-none px-1 py-0.2 bg-white rounded border">
                            {p.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 font-normal">{p.description}</p>
                      </div>
                    </div>
                    
                    <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 select-all font-bold">
                      {p.passcode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
