import React from 'react';
import { 
  Phone, 
  BookOpen, 
  Landmark,
  ShieldCheck,
  FileCheck2,
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface TaxGuideProps {
  language: Language;
}

export const TaxGuide: React.FC<TaxGuideProps> = ({ language }) => {
  const t = getTranslation(language);

  const faqs = [
    {
      q: 'Who is mandatorily required to file an Income Tax Return (ITR) in India?',
      a: 'Any individual with gross total income exceeding the basic exemption limit (₹3,00,000 under New Tax Regime or ₹2,50,000 under Old Regime). Filing is also mandatory if electricity bills exceed ₹1 lakh/year, foreign travel exceeds ₹2 lakh, or TDS/TCS exceeds ₹25,000 in a financial year.'
    },
    {
      q: 'How is income up to ₹7,00,000 completely tax-free under the New Tax Regime?',
      a: 'Under Section 115BAC, income between ₹3L to ₹7L is taxed at 5%, but Section 87A rebate provides up to ₹25,000 relief. Therefore, any resident individual with taxable income up to ₹7,00,000 has zero net tax liability.'
    },
    {
      q: 'What deductions are available under Section 80C and Section 80D?',
      a: 'Under the Old Regime, Section 80C allows deductions up to ₹1,50,000 for investments in EPF, PPF, ELSS, life insurance, and principal home loan repayments. Section 80D provides health insurance premium deductions up to ₹25,000 (and up to ₹50,000 for senior citizen parents).'
    },
    {
      q: 'How do I pay Self-Assessment Tax online via UPI and Challan 280?',
      a: 'Navigate to our e-Pay Tax portal, choose Indian UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking (SBI, HDFC, ICICI, etc.), or generate Challan ITNS 280 directly. Receive immediate BSR Code, Challan Serial, and CIN counterfoil validation.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner with Professional Photography */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80" 
            alt="Tax Guide and Compliance Legal Support" 
            className="w-full h-full object-cover opacity-35" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Govt of India • Income Tax Act 1961 Compliance</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                {t.helpTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
                {t.helpDesc}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified by Senior CAs</span>
              </span>
              <span className="px-3 py-1 bg-slate-800/80 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Toll-Free: 1800 103 0025</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Step Visual Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">1. Pre-Validated AIS/TIS</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Match salary, interest, and dividends reported in your Annual Information Statement.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">2. Regime Optimization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dynamically compare 115BAC New Regime vs. Old Regime to maximize your refund.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">3. Instant e-Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify within 30 days via Aadhaar OTP to initiate instant refund dispatch to your bank.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2">
              <span className="text-emerald-700 font-mono font-bold">Q.</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-5">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Tax Slabs Overview Table Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-700" />
            <span>Indian Tax Slabs for AY 2025-2026 (New Tax Regime u/s 115BAC)</span>
          </h2>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
            Rebate u/s 87A up to ₹7 Lakh
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="py-2.5 px-4">Taxable Income Tier</th>
                <th className="py-2.5 px-4 text-center">Applicable Tax Rate</th>
                <th className="py-2.5 px-4 text-right">Special Provision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900">Up to ₹3,00,000</td>
                <td className="py-2.5 px-4 text-center font-bold text-emerald-700 font-mono">0% (Nil)</td>
                <td className="py-2.5 px-4 text-right text-slate-500">Basic Exemption Limit</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900">₹3,00,001 to ₹7,00,000</td>
                <td className="py-2.5 px-4 text-center font-bold text-slate-800 font-mono">5%</td>
                <td className="py-2.5 px-4 text-right text-emerald-700 font-semibold">Full Rebate u/s 87A</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900">₹7,00,001 to ₹10,00,000</td>
                <td className="py-2.5 px-4 text-center font-bold text-slate-800 font-mono">10%</td>
                <td className="py-2.5 px-4 text-right text-slate-500">After ₹50k Standard Deduction</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900">₹10,00,001 to ₹12,00,000</td>
                <td className="py-2.5 px-4 text-center font-bold text-slate-800 font-mono">15%</td>
                <td className="py-2.5 px-4 text-right text-slate-500">+4% Health & Education Cess</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900">₹12,00,001 to ₹15,00,000</td>
                <td className="py-2.5 px-4 text-center font-bold text-slate-800 font-mono">20%</td>
                <td className="py-2.5 px-4 text-right text-slate-500">+4% Health & Education Cess</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900">Above ₹15,00,000</td>
                <td className="py-2.5 px-4 text-center font-bold text-rose-700 font-mono">30%</td>
                <td className="py-2.5 px-4 text-right text-slate-500">Top Slab Rate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
