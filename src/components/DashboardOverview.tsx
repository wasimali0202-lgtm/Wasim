import React from 'react';
import { 
  Building2, 
  FileText, 
  CreditCard, 
  Receipt, 
  Calculator, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  FolderCheck,
  Bell
} from 'lucide-react';
import { Language, TaxReturnData } from '../types';
import { getTranslation } from '../translations';
import { TaxSavingTips } from './TaxSavingTips';

interface DashboardOverviewProps {
  taxReturn: TaxReturnData;
  currentUser: any;
  language: Language;
  onStartFiling: () => void;
  onOpenPaymentModal: () => void;
  onViewAcknowledgment: () => void;
  onOpenCalculator: () => void;
  onOpenAuth: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  taxReturn,
  currentUser,
  language,
  onStartFiling,
  onOpenPaymentModal,
  onViewAcknowledgment,
  onOpenCalculator,
  onOpenAuth,
}) => {
  const t = getTranslation(language);
  const user = currentUser || taxReturn.userProfile;
  const calc = taxReturn.calculation;

  const isSubmitted = taxReturn.status === 'submitted' || taxReturn.status === 'verified';
  const isPaid = taxReturn.payment?.status === 'completed' || calc.netTaxPayable === 0;

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner with Taxpayer Overview */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.assessmentYear}: {taxReturn.assessmentYear}</span>
              <span>•</span>
              <span>{user.taxZone}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              {currentUser ? `${t.welcome}, ${user.name}` : ('Welcome to e-Tax Return Portal')}
            </h1>

            <p className="text-sm text-emerald-100/90 mt-1 max-w-xl">
              {currentUser ? (
                'Welcome to your AY 2025-2026 online income tax return dashboard. File timely under Section 139(1) of the Income Tax Act.'
              ) : (
                'You are currently signed out. Please sign in with your PAN or register to access full filing and tax features.'
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono">
              <span className="px-3 py-1 bg-white/10 rounded-lg border border-white/15">
                PAN: <strong>{user.tin}</strong>
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-lg border border-white/15">
                Ward/Circle: <strong>{user.taxCircle}</strong>
              </span>
              <span className="px-3 py-1 bg-emerald-500/25 text-emerald-300 rounded-lg border border-emerald-400/30 font-semibold">
                Status: {taxReturn.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            {!currentUser ? (
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.login}</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/20 transition-all flex items-center justify-center space-x-2 cursor-pointer text-xs"
                >
                  <span>{t.signup}</span>
                </button>
              </div>
            ) : isSubmitted ? (
              <button
                type="button"
                onClick={onViewAcknowledgment}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>{t.viewAckBtn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartFiling}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{taxReturn.status === 'draft' ? t.continueReturnBtn : t.startReturnBtn}</span>
              </button>
            )}

            {currentUser && calc.netTaxPayable > 0 && !isPaid && (
              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>{t.payTaxBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tax Deadline Notice Bar */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center space-x-2.5">
          <Calendar className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <span className="font-bold">{t.deadlineAlert}</span>
            <span className="hidden sm:inline text-amber-800 ml-1.5">
              '— File before National Tax Day to avoid late penalty interest.'
            </span>
          </div>
        </div>
        <span className="font-bold bg-amber-200/80 px-2.5 py-1 rounded-md text-amber-950 shrink-0">
          '73 Days Left'
        </span>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Income */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.totalGrossIncome}</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ₹{calc.grossIncome.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>'Taxable:'</span>
            <span className="font-bold text-slate-700 font-mono">₹{calc.taxableIncome.toLocaleString()}</span>
          </div>
        </div>

        {/* Investment Rebate */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.rebateClaimed}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            ₹{calc.investmentRebate.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-emerald-800 font-medium">
            '15% directly reduced from tax liability'
          </div>
        </div>

        {/* Advance Tax / TDS */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.taxPaid}</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800 font-mono">
            ₹{calc.advanceTaxPaid.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            'Adjusted at source / bank TDS'
          </div>
        </div>

        {/* Net Tax Payable / Refund */}
        <div className={`p-5 rounded-2xl border shadow-xs transition-colors ${
          calc.refundAmount > 0 
            ? 'bg-blue-50/60 border-blue-200' 
            : 'bg-emerald-50/60 border-emerald-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">
              {calc.refundAmount > 0 ? t.refundDue : t.taxPayable}
            </span>
            <div className={`p-2 rounded-xl ${calc.refundAmount > 0 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-800'}`}>
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-900">
            ₹{(calc.refundAmount > 0 ? calc.refundAmount : calc.netTaxPayable).toLocaleString()}
          </div>
          <div className="mt-2 text-xs font-semibold flex items-center justify-between">
            {isPaid ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                ✓ 'Paid in Full'
              </span>
            ) : calc.netTaxPayable > 0 ? (
              <button
                onClick={onOpenPaymentModal}
                className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>'Pay Challan →'</span>
              </button>
            ) : (
              <span className="text-slate-600">{t.zeroLiability}</span>
            )}
          </div>
        </div>
      </div>

      {/* Rotating Daily Tax Saving Tips Component (Gemini API Integration) */}
      <TaxSavingTips 
        onOpenCalculator={onOpenCalculator} 
        onStartFiling={onStartFiling} 
      />

      {/* Two Column Section: Action Portals & Recent Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Portal Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>'Key Tax Services & Quick Actions'</span>
              <span className="text-xs font-normal text-slate-500">FY 2024-2025</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: File Return */}
              <div 
                onClick={onStartFiling}
                className="p-4 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  'Prepare & Submit Return'
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  'Step-by-step guided filing with automated calculations.'
                </p>
              </div>

              {/* Card 2: Challan Payment */}
              <div 
                onClick={onOpenPaymentModal}
                className="p-4 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  'e-Pay Tax & Challan 280'
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  'Direct e-payment via Indian UPI, Net Banking or Challan 280.'
                </p>
              </div>

              {/* Card 3: Acknowledgment Slip */}
              <div 
                onClick={onViewAcknowledgment}
                className="p-4 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  'Official Acknowledgment (ITR-V)'
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  'Download Aadhaar e-verified digital acknowledgment slip.'
                </p>
              </div>

              {/* Card 4: Tax Calculator */}
              <div 
                onClick={onOpenCalculator}
                className="p-4 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  'Interactive Tax Calculator'
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  'Compare New vs Old Tax Regimes and calculate 80C/80D.'
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Filing Status & Notifications */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>'Filing Lifecycle Tracker'</span>
            </h2>

            <div className="space-y-4 text-xs">
              {/* Step 1 */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">
                    'PAN & Aadhaar Profile Active'
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {language === 'bn' ? 'Ward 15(1), Kolkata' : `${user.taxCircle}, ${user.taxZone}`}
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">
                    'Income & Proofs Attached'
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    '4 certificates uploaded & verified'
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                  isPaid ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isPaid ? '✓' : ('3')}
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">
                    'Tax Payment Settlement'
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {isPaid 
                      ? ('Challan Settled: TR-9482103') 
                      : ('Pending Payment')}
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                  isSubmitted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {isSubmitted ? '✓' : ('4')}
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">
                    'Final Return E-Filed'
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {isSubmitted ? 'ACK-2024-NBR-948271' : ('Awaiting Final Submission')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-xs">
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold mb-1">
              <Bell className="w-4 h-4" />
              <span>'Official NBR Advisory'</span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed mt-2">
              'Filing online generates an instant verifiable digital tax certificate valid across banks and state agencies.'
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
