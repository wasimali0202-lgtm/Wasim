import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  RefreshCw, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export interface TaxTip {
  id: string;
  title: string;
  category: string;
  savings: string;
  summary: string;
  action: string;
  applicableRegime: string;
  urgency?: string;
  aiAnalysis?: string;
}

interface TaxSavingTipsProps {
  onOpenCalculator?: () => void;
  onStartFiling?: () => void;
}

export const TaxSavingTips: React.FC<TaxSavingTipsProps> = ({ 
  onOpenCalculator,
  onStartFiling 
}) => {
  const [tips, setTips] = useState<TaxTip[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [todayDateStr, setTodayDateStr] = useState('');
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/tax-saving-tips');
        if (res.ok) {
          const data = await res.json();
          setTodayDateStr(data.date || new Date().toDateString());
          setIsAiGenerated(Boolean(data.isAiGenerated));
          
          if (data.allTips && data.allTips.length > 0) {
            // Put the AI personalized or daily tip first
            const combined = data.tip 
              ? [data.tip, ...data.allTips.filter((t: TaxTip) => t.id !== data.tip.id)]
              : data.allTips;
            setTips(combined);
          } else if (data.tip) {
            setTips([data.tip]);
          }
        }
      } catch (err) {
        console.warn('Failed to load tax tips from server API, using local fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  // Fallback tips if server didn't return any
  const defaultTips: TaxTip[] = [
    {
      id: 'tip-1',
      title: 'Section 80CCD(1B): The ₹50,000 NPS Extra Deduction',
      category: 'Retirement & NPS',
      savings: 'Save up to ₹15,600 in 30% slab',
      summary: 'Invest up to ₹50,000 exclusively in the National Pension System (Tier-1) over and above the ₹1.5 Lakh limit of Section 80C.',
      action: 'Open an e-NPS account with PRAN and contribute ₹50,000 before March 31st to claim the dedicated deduction in ITR.',
      applicableRegime: 'Old Tax Regime',
      urgency: 'High Impact'
    },
    {
      id: 'tip-2',
      title: 'New Tax Regime (u/s 115BAC): Zero Tax up to ₹7.75 Lakhs',
      category: 'Regime Optimization',
      savings: 'Zero Tax Liability',
      summary: 'With the enhanced ₹75,000 Standard Deduction and Section 87A rebate, salaried individuals with gross income up to ₹7,75,000 pay zero income tax.',
      action: 'Calculate whether your itemized deductions exceed ₹3.75 Lakhs; if not, opting for the New Tax Regime provides the highest take-home pay with zero paperwork.',
      applicableRegime: 'New Tax Regime',
      urgency: 'General'
    },
    {
      id: 'tip-3',
      title: 'Section 80D: Health Insurance for Self & Senior Parents',
      category: 'Medical & Healthcare',
      savings: 'Save up to ₹23,400 in 30% slab',
      summary: 'Deduct up to ₹25,000 for self/family and an additional ₹50,000 for senior citizen parents (aged 60+), plus ₹5,000 preventive health check-ups.',
      action: 'Ensure health insurance premiums are paid via banking channels (UPI/Net Banking/Card, not cash) to preserve tax eligibility.',
      applicableRegime: 'Old Tax Regime',
      urgency: 'Medium'
    }
  ];

  const activeList = tips.length > 0 ? tips : defaultTips;
  const currentTip = activeList[currentIndex % activeList.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
  };

  return (
    <div className="w-full bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900/50 shadow-xl relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Daily Tax Saving Strategy
              </h3>
              {isAiGenerated && (
                <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <span>✨ Gemini AI</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{todayDateStr || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">AY 2025-26 Financial Advice</span>
            </p>
          </div>
        </div>

        {/* Tip navigator pagination */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <span className="text-xs text-slate-400 font-mono mr-1">
            Tip {currentIndex + 1} of {activeList.length}
          </span>
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/60 transition cursor-pointer"
            title="Previous Tip"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/60 transition cursor-pointer"
            title="Next Tip"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tip Card */}
      <div className="relative z-10 mt-6 space-y-6">
        {/* Category & Savings Banner */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentTip.category}</span>
          </span>
          <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{currentTip.savings}</span>
          </span>
          <span className="px-3 py-1 bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-medium rounded-lg">
            {currentTip.applicableRegime}
          </span>
          {currentTip.urgency && (
            <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold rounded-md">
              {currentTip.urgency}
            </span>
          )}
        </div>

        {/* Title and Summary */}
        <div className="space-y-2">
          <h4 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
            {currentTip.title}
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {currentTip.summary}
          </p>
        </div>

        {/* Actionable recommendation box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Recommended Tax Action
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentTip.action}
            </p>
          </div>
        </div>

        {/* AI Analysis Insight (if provided by Gemini) */}
        {currentTip.aiAnalysis && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 space-y-1">
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Tax Optimization Perspective:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{currentTip.aiAnalysis}"
            </p>
          </div>
        )}

        {/* Interactive CTA buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
          <div className="flex items-center space-x-2">
            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Calculate My Savings</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
            {onStartFiling && (
              <button
                type="button"
                onClick={onStartFiling}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Apply in My ITR Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleNext}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer transition"
            >
              <span>Next Daily Tip</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
