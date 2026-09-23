import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building, 
  Save, 
  CheckCircle2, 
  Bell, 
  CreditCard, 
  Calendar, 
  FileCheck,
  Clock
} from 'lucide-react';
import { Language, UserProfile } from '../types';

interface UserProfileModalProps {
  currentUser: UserProfile;
  language?: Language;
  onUpdateUser: (updated: UserProfile) => void;
  onClose?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    ...currentUser,
    emailNotifications: currentUser.emailNotifications ?? true,
    submissionAlerts: currentUser.submissionAlerts ?? true,
    emailAlertPaymentConfirmation: currentUser.emailAlertPaymentConfirmation ?? true,
    emailAlertFilingStatusUpdate: currentUser.emailAlertFilingStatusUpdate ?? true,
    emailAlertTaxDeadlineReminders: currentUser.emailAlertTaxDeadlineReminders ?? true,
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const panValue = profile.pan || profile.tin || 'ABCPA1234F';
  const aadhaarValue = profile.aadhaar || profile.nid || '5412 8901 2345';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Professional Header Photo Banner */}
      <div className="relative h-28 sm:h-32 bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80" 
          alt="Verified Taxpayer Profile" 
          className="w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/85 to-transparent"></div>

        <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Income Tax Department • Taxpayer Profile & Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
            Taxpayer Profile ({profile.name})
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            PAN: <strong className="font-mono text-emerald-400">{panValue}</strong> • Aadhaar: <span className="font-mono">{aadhaarValue}</span>
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
          <div>
            <p className="text-xs text-slate-500">
              Manage your personal tax credentials, linked bank account, and e-filing communication preferences.
            </p>
          </div>

          {saved && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings Saved Successfully!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Tax Identity */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Personal & Tax Identity</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Permanent Account Number (PAN)</label>
              <input
                type="text"
                maxLength={10}
                value={panValue}
                onChange={(e) => setProfile({ ...profile, pan: e.target.value.toUpperCase(), tin: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-emerald-800 font-bold uppercase focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Number (12 Digits)</label>
              <input
                type="text"
                maxLength={14}
                value={aadhaarValue}
                onChange={(e) => setProfile({ ...profile, aadhaar: e.target.value, nid: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Year</label>
              <input
                type="text"
                value={profile.assessmentYear || '2025-2026'}
                onChange={(e) => setProfile({ ...profile, assessmentYear: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Bank Details for Refund */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bank Account for Tax Refund (Pre-Validated)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={profile.bankName || 'State Bank of India (SBI)'}
                onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={profile.accountNumber || '30492817492'}
                onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank IFSC Code</label>
              <input
                type="text"
                value={profile.ifscCode || profile.routingNumber || 'SBIN0001234'}
                onChange={(e) => setProfile({ ...profile, ifscCode: e.target.value.toUpperCase(), routingNumber: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase text-emerald-800 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Email Notifications Settings Section */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Email Notifications</span>
            </h2>
            <span className="text-[11px] text-slate-500">
              Notification recipient: <strong className="text-slate-800 font-mono">{profile.email || 'user@taxreturn.in'}</strong>
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            
            {/* 1. Payment Confirmation Alert */}
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900">
                      Payment Confirmation
                    </span>
                    {(profile.emailAlertPaymentConfirmation ?? true) ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-600 rounded-full">
                        Muted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                    Receive instant tax payment receipts, challan ITNS 280/281 counterfoils, and assisted filing payment invoices.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={profile.emailAlertPaymentConfirmation ?? true}
                onClick={() => setProfile((prev) => ({ 
                  ...prev, 
                  emailAlertPaymentConfirmation: !(prev.emailAlertPaymentConfirmation ?? true) 
                }))}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  (profile.emailAlertPaymentConfirmation ?? true) ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    (profile.emailAlertPaymentConfirmation ?? true) ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Filing Status Update Alert */}
            <div className="pt-3 border-t border-slate-200 flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100/90 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900">
                      Filing Status Update
                    </span>
                    {(profile.emailAlertFilingStatusUpdate ?? true) ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-600 rounded-full">
                        Muted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                    Get timely alerts when your ITR is prepared, filed with the Income Tax Department, e-verified, and processed for refund.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={profile.emailAlertFilingStatusUpdate ?? true}
                onClick={() => setProfile((prev) => ({ 
                  ...prev, 
                  emailAlertFilingStatusUpdate: !(prev.emailAlertFilingStatusUpdate ?? true) 
                }))}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  (profile.emailAlertFilingStatusUpdate ?? true) ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    (profile.emailAlertFilingStatusUpdate ?? true) ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Tax Deadline Reminders Alert */}
            <div className="pt-3 border-t border-slate-200 flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900">
                      Tax Deadline Reminders
                    </span>
                    {(profile.emailAlertTaxDeadlineReminders ?? true) ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-600 rounded-full">
                        Muted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                    Early alert reminders before quarterly advance tax installment dates (June 15, Sep 15, Dec 15, Mar 15) and the July 31st annual deadline.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={profile.emailAlertTaxDeadlineReminders ?? true}
                onClick={() => setProfile((prev) => ({ 
                  ...prev, 
                  emailAlertTaxDeadlineReminders: !(prev.emailAlertTaxDeadlineReminders ?? true) 
                }))}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  (profile.emailAlertTaxDeadlineReminders ?? true) ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    (profile.emailAlertTaxDeadlineReminders ?? true) ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Additional: Mobile SMS Dispatch Alert */}
            <div className="pt-3 border-t border-slate-200 flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100/90 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-800">
                      SMS and WhatsApp status alerts
                    </span>
                    {(profile.submissionAlerts ?? true) && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Receive SMS confirmation codes, e-Pay challan CIN, and CPC intimation alerts directly on mobile.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={profile.submissionAlerts ?? true}
                onClick={() => setProfile((prev) => ({ 
                  ...prev, 
                  submissionAlerts: !(prev.submissionAlerts ?? true) 
                }))}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  (profile.submissionAlerts ?? true) ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    (profile.submissionAlerts ?? true) ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-3">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

