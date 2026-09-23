import React, { useState } from 'react';
import { 
  Calculator, 
  X, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { calculateIncomeTax } from '../taxCalculator';

interface TaxCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onApplyToReturn?: (salary: number, investments: number) => void;
}

export const TaxCalculatorModal: React.FC<TaxCalculatorModalProps> = ({
  isOpen,
  onClose,
  language,
  onApplyToReturn,
}) => {
  const t = getTranslation(language);
  const [taxpayerType, setTaxpayerType] = useState<'salaried' | 'business' | 'senior'>('salaried');
  const [location, setLocation] = useState<'dhaka_ctg_city' | 'other_city' | 'non_city'>('dhaka_ctg_city');
  const [basicSalary, setBasicSalary] = useState(720000);
  const [allowances, setAllowances] = useState(280000);
  const [otherIncome, setOtherIncome] = useState(50000);
  const [investments, setInvestments] = useState(150000);

  if (!isOpen) return null;

  const result = calculateIncomeTax(
    {
      basicSalary,
      houseRentAllowance: allowances * 0.6,
      medicalAllowance: allowances * 0.25,
      conveyanceAllowance: allowances * 0.15,
      festivalBonus: basicSalary / 6,
      otherAllowances: 0,
      rentalIncome: 0,
      rentalExpenses: 0,
      businessRevenue: 0,
      businessExpenses: 0,
      capitalGains: 0,
      bankInterest: otherIncome,
      otherIncome: 0,
    },
    {
      providentFund: investments * 0.4,
      dpsSavings: Math.min(investments * 0.3, 120000),
      lifeInsurancePremium: investments * 0.2,
      healthInsurance: investments * 0.1,
      donationApproved: 0,
      governmentSecurities: 0,
      otherInvestments: 0,
    },
    location,
    taxpayerType
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1000&q=80" 
            alt="Tax Calculator Tools" 
            className="absolute inset-0 w-full h-full object-cover opacity-20" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-emerald-950/90 to-teal-950/80"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative z-10 p-6 flex items-center space-x-3.5">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <Calculator className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                {t.taxCalculator} (AY 2025-26)
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                Simulate annual tax liabilities, progressive slab rates, and 80C/80D investment deductions.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Category & Regime selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                'Taxpayer Category'
              </label>
              <select
                value={taxpayerType}
                onChange={(e: any) => setTaxpayerType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-800"
              >
                <option value="salaried">'General Salaried Individual'</option>
                <option value="senior">'Senior Citizen (60+ Years)'</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                'Income Tax Regime'
              </label>
              <select
                value={location}
                onChange={(e: any) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-800"
              >
                <option value="metro_city">'New Tax Regime u/s 115BAC (Nil Tax up to ₹7 Lakh)'</option>
                <option value="non_metro">'Old Tax Regime (With 80C/80D Deductions)'</option>
              </select>
            </div>
          </div>

          {/* Interactive Sliders & Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Basic Salary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  'Annual Basic Salary'
                </span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  ₹{basicSalary.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="3000000"
                step="50000"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Allowances */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  'Allowances & Bonus'
                </span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  ₹{allowances.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1500000"
                step="25000"
                value={allowances}
                onChange={(e) => setAllowances(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Other Income */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  'Bank Interest / Other'
                </span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  ₹{otherIncome.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="20000"
                value={otherIncome}
                onChange={(e) => setOtherIncome(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Rebate Investment */}
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-emerald-900">
                  'Eligible Investments'
                </span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  ₹{investments.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="25000"
                value={investments}
                onChange={(e) => setInvestments(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-emerald-700 block mt-1">
                '15% tax rebate will be credited'
              </span>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-5 bg-linear-to-r from-emerald-900 to-teal-950 rounded-2xl text-white shadow-lg space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-emerald-800 pb-3">
              <div>
                <span className="text-emerald-300 block">{t.totalGrossIncome}</span>
                <span className="font-mono font-bold text-base mt-0.5 block">
                  ₹{result.grossIncome.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-emerald-300 block">'Taxable Income'</span>
                <span className="font-mono font-bold text-base mt-0.5 block">
                  ₹{result.taxableIncome.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-emerald-300 block">{t.rebateClaimed}</span>
                <span className="font-mono font-bold text-base text-amber-300 mt-0.5 block">
                  -₹{result.investmentRebate.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-emerald-300 block">{t.taxPayable}</span>
                <span className="font-mono font-black text-xl text-amber-300 mt-0.5 block">
                  ₹{result.netTaxPayable.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Slabs list mini */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                'Progressive Slab Breakdown:'
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {result.slabBreakdown.map((sl, i) => (
                  <div key={i} className="p-2.5 bg-white/10 rounded-lg text-[11px]">
                    <span className="text-emerald-200 block font-medium leading-tight">
                      {sl.slabName}
                    </span>
                    <span className="font-mono font-bold text-white mt-1 block">₹{sl.taxAmount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              'Close'
            </button>
            {onApplyToReturn && (
              <button
                type="button"
                onClick={() => {
                  onApplyToReturn(basicSalary, investments);
                  onClose();
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>'Apply to My Return'</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
