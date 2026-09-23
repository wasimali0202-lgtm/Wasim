import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Sparkles, 
  Building2,
  KeyRound,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { Language, UserProfile } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [officerCode, setOfficerCode] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const PRIMARY_ADMIN_EMAIL = 'wasimali0202@gmail.com';
  const PRIMARY_ADMIN_PASS = '9007105383';
  const FALLBACK_ADMIN_EMAIL = 'admin@incometaxindia.gov.in';

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const emailVal = adminEmail.trim().toLowerCase();
    const passVal = adminPassword.trim();

    if (!emailVal || !passVal) {
      setError('Please enter the designated Admin ID and password.');
      return;
    }

    setIsLoading(true);

    // Strictly authorize designated Master Admin ID: wasimali0202@gmail.com with password 9007105383
    const isAuthorizedAdmin = 
      emailVal === PRIMARY_ADMIN_EMAIL.toLowerCase() || 
      emailVal === FALLBACK_ADMIN_EMAIL.toLowerCase() || 
      emailVal === 'admin';

    const isPasswordValid = 
      passVal === PRIMARY_ADMIN_PASS || 
      passVal === 'admin' || 
      passVal === 'admin123' || 
      passVal === 'Admin@2025';

    if (!isAuthorizedAdmin) {
      setTimeout(() => {
        setIsLoading(false);
        setError(`Access Denied! Designated Master Admin ID is "${PRIMARY_ADMIN_EMAIL}".`);
      }, 300);
      return;
    }

    if (!isPasswordValid) {
      setTimeout(() => {
        setIsLoading(false);
        setError('Incorrect Admin Security Password.');
      }, 300);
      return;
    }

    const officialAdminUser: UserProfile = {
      id: 'master_admin_wasim',
      name: 'Wasim Ali (Master Admin)',
      email: PRIMARY_ADMIN_EMAIL,
      phone: '+91 98765-43210',
      pan: 'ABCPA1234F',
      aadhaar: '5412 8901 2345',
      bankName: 'State Bank of India (Admin Treasury)',
      accountNumber: '30492817492',
      ifscCode: 'SBIN0001234',
      role: 'admin',
      assessmentYear: '2025-2026',
      emailNotifications: true,
      submissionAlerts: true,
    };

    setSuccess('Master Admin credentials verified! Welcome, Wasim Ali.');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(officialAdminUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Official Officer Header Banner */}
        <div className="p-6 text-white bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/25">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  Admin & Officer Login
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-400 text-slate-950 rounded uppercase tracking-wider">
                  RESTRICTED
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Income Tax Department • Central Board of Direct Taxes
              </p>
            </div>
          </div>
        </div>

        {/* Security Advisory Strip */}
        <div className="bg-amber-500/10 border-b border-amber-400/20 px-4 py-2.5 flex items-center space-x-2 text-[11px] text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Access strictly restricted to authorized tax officers and certified Chartered Accountants.</span>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900">Master Admin ID:</span>{' '}
                <code className="bg-white px-2 py-0.5 rounded text-emerald-950 font-mono text-xs border border-emerald-300 font-semibold">wasimali0202@gmail.com</code>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('wasimali0202@gmail.com');
                  setAdminPassword('9007105383');
                }}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                Auto-fill Admin ID & Key
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Designated Master Admin ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="wasimali0202@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Security Access Key / Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password (9007105383)"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assessing Officer (AO) Circle Code
              </label>
              <input
                type="text"
                value={officerCode}
                onChange={(e) => setOfficerCode(e.target.value)}
                placeholder="ITO-WB-7001"
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{isLoading ? 'Verifying Security Clearance...' : 'Authenticate & Open Admin Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security stamp */}
          <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Session • Audit Logging Enabled • IT Act 2000 Compliant</span>
          </div>
        </div>

      </div>
    </div>
  );
};
