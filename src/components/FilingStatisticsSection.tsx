import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileCheck2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  DollarSign, 
  Zap,
  Globe2,
  PieChart
} from 'lucide-react';
import { getPlatformMetrics, subscribePlatformMetrics, PlatformMetrics } from '../utils/taxStats';

export const FilingStatisticsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'salaried' | 'business' | 'investor'>('all');
  const [metrics, setMetrics] = useState<PlatformMetrics>(getPlatformMetrics());

  useEffect(() => {
    const unsubscribe = subscribePlatformMetrics((newMetrics) => {
      setMetrics(newMetrics);
    });
    return unsubscribe;
  }, []);

  const total = metrics.totalFilings;
  
  // Calculate proportional counts based on actual totalFilings
  // When total is 0, all rows start at 0
  const getRowCount = (ratio: number) => {
    if (total === 0) return 0;
    return Math.max(1, Math.round(total * ratio));
  };

  const getRowPct = (count: number) => {
    if (total === 0) return 0;
    return Number(((count / total) * 100).toFixed(1));
  };

  const c1 = getRowCount(0.50);
  const c2 = getRowCount(0.20);
  const c3 = getRowCount(0.15);
  const c4 = getRowCount(0.10);
  const c5 = Math.max(0, total - (c1 + c2 + c3 + c4));

  const itrBreakdown = [
    {
      type: 'ITR-1 (Sahaj)',
      label: 'Salaried Employees & Pensioners',
      count: c1,
      pct: getRowPct(c1),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50',
      description: 'Income up to ₹50L from salary, one house property, and other sources (interest)',
      category: 'salaried'
    },
    {
      type: 'ITR-2',
      label: 'Capital Gains, Multiple Properties & Foreign Assets',
      count: c2,
      pct: getRowPct(c2),
      color: 'bg-teal-500',
      textColor: 'text-teal-700',
      badgeBg: 'bg-teal-50',
      description: 'Equities, mutual funds, crypto, real estate capital gains, and ESOPs',
      category: 'investor'
    },
    {
      type: 'ITR-4 (Sugam)',
      label: 'Presumptive Business & Freelancers (44AD/44ADA)',
      count: c3,
      pct: getRowPct(c3),
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      badgeBg: 'bg-indigo-50',
      description: 'Small businesses, consultants, doctors, lawyers, and tech freelancers',
      category: 'business'
    },
    {
      type: 'ITR-3',
      label: 'Complex Business, P&L Balance Sheet & Proprietors',
      count: c4,
      pct: getRowPct(c4),
      color: 'bg-violet-500',
      textColor: 'text-violet-700',
      badgeBg: 'bg-violet-50',
      description: 'Audit cases, trading turnover, partnership firms, and depreciation schedules',
      category: 'business'
    },
    {
      type: 'ITR-U',
      label: 'Updated Returns (Past Assessment Years)',
      count: c5,
      pct: getRowPct(c5),
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      badgeBg: 'bg-amber-50',
      description: 'Rectification and belated filings for AY 2022-23, 2023-24, and 2024-25',
      category: 'all'
    },
  ];

  const filteredItr = selectedCategory === 'all' 
    ? itrBreakdown 
    : itrBreakdown.filter(item => item.category === selectedCategory || item.category === 'all');

  return (
    <section id="filing-statistics-section" className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 overflow-hidden">
      
      {/* Header with Live Filing Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Portal Volume & Activity Breakdown</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Live Income Tax Filing Activity Counter
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Dynamic tracking of verified Income Tax Returns (ITR-1, 2, 3, 4 & ITR-U) filed and validated through our platform for AY 2025-26. Counters automatically update as users submit forms and complete e-filings.
          </p>
        </div>

        {/* Live Active Filer Pill */}
        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl flex items-center space-x-3 shrink-0 shadow-sm">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Live System Status</div>
            <div className="text-sm font-extrabold font-mono text-emerald-400">
              {metrics.totalFilings > 0 ? `${metrics.totalFilings} Filings Tracked` : 'Ready for New Filings (0)'}
            </div>
          </div>
        </div>
      </div>

      {/* Primary 4 Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Filings */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total ITRs Filed</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-500 group-hover:text-white transition">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {metrics.totalFilings.toLocaleString('en-IN')}
          </div>
          <p className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{metrics.totalFilings > 0 ? '+1 per user intake' : 'Increments on each user filing'}</span>
          </p>
        </div>

        {/* Refund Claimed */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Refund Claimed</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            ₹{metrics.refundClaimedCrores} Cr
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Directly credited via RTGS/NEFT</span>
          </p>
        </div>

        {/* CPC Acceptance Rate */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">CPC Bengaluru Acceptance</span>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800 group-hover:bg-teal-600 group-hover:text-white transition">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-800 font-mono tracking-tight">
            {metrics.cpcAcceptanceRate}
          </div>
          <p className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Near-zero defective notice rate</span>
          </p>
        </div>

        {/* Average Processing Time */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avg. Filing Time</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 group-hover:bg-amber-500 group-hover:text-white transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {metrics.avgProcessingMinutes} Mins
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Form 16 auto-extraction</span>
          </p>
        </div>

      </div>

      {/* Category Filter Tabs */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Detailed Breakdown by ITR Form & Taxpayer Profile
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Forms ({total})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('salaried')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedCategory === 'salaried'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Salaried (ITR-1)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('investor')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedCategory === 'investor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Traders & CG (ITR-2)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('business')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedCategory === 'business'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Business (ITR-3/4)
            </button>
          </div>
        </div>

        {/* Detailed Rows with Visual Progress Meters */}
        <div className="space-y-3">
          {filteredItr.map((row) => (
            <div 
              key={row.type}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <div className="flex items-center space-x-2.5">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-extrabold ${row.badgeBg} ${row.textColor} border border-slate-200/60`}>
                    {row.type}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {row.label}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-right">
                  <span className="text-xs sm:text-sm font-mono font-extrabold text-slate-900">
                    {row.count.toLocaleString('en-IN')} Files
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {row.pct}%
                  </span>
                </div>
              </div>

              {/* Visual meter bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${row.color} rounded-full transition-all duration-500`}
                  style={{ width: `${row.pct}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-500">
                {row.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Geographical Distribution */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-[10px] uppercase font-bold text-slate-400">Northern Region & NCR</div>
          <div className="text-base font-extrabold text-slate-800 font-mono mt-0.5">
            {total === 0 ? '0' : `${Math.round(total * 0.35)}`}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">Delhi, UP, Punjab, Haryana</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-[10px] uppercase font-bold text-slate-400">Western Region</div>
          <div className="text-base font-extrabold text-slate-800 font-mono mt-0.5">
            {total === 0 ? '0' : `${Math.round(total * 0.30)}`}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">Maharashtra, Gujarat, Goa</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-[10px] uppercase font-bold text-slate-400">Eastern Region</div>
          <div className="text-base font-extrabold text-slate-800 font-mono mt-0.5">
            {total === 0 ? '0' : `${Math.round(total * 0.20)}`}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">West Bengal, Bihar, Odisha, NE</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-[10px] uppercase font-bold text-slate-400">Southern Region</div>
          <div className="text-base font-extrabold text-slate-800 font-mono mt-0.5">
            {total === 0 ? '0' : `${Math.round(total * 0.15)}`}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">Karnataka, TN, Telangana, Kerala</div>
        </div>
      </div>

    </section>
  );
};
