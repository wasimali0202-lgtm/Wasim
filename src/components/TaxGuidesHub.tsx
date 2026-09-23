import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  Percent, 
  Home, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Receipt, 
  AlertCircle, 
  Calendar, 
  ExternalLink,
  HelpCircle,
  Clock
} from 'lucide-react';

interface TaxGuidesHubProps {
  initialGuide?: string;
  onNavigateToFiling?: () => void;
}

export const TaxGuidesHub: React.FC<TaxGuidesHubProps> = ({ 
  initialGuide = 'itr_complete_guide', 
  onNavigateToFiling 
}) => {
  const [activeGuide, setActiveGuide] = useState<string>(initialGuide);
  const [searchQuery, setSearchQuery] = useState('');

  const guidesList = [
    {
      id: 'itr_complete_guide',
      title: 'Income Tax Return (ITR) Complete Guide',
      category: 'Filing',
      readTime: '6 min read',
      badge: 'Core Guide',
      summary: 'Complete overview of ITR forms (ITR-1 to ITR-4), mandatory filing conditions, and due dates for FY 2024-25 / AY 2025-26.',
      content: {
        intro: 'Filing an Income Tax Return (ITR) is the annual formal declaration of all your incomes, deductions, taxes paid, and refund claims to the Income Tax Department of India.',
        whoMustFile: [
          'Individuals whose Gross Total Income exceeds basic exemption limit (₹3,00,000 in New Regime, ₹2,50,000 in Old Regime)',
          'Individuals having foreign assets, bank accounts, or financial interests abroad (Schedule FA)',
          'Electricity consumption exceeding ₹1,00,000 in a financial year',
          'Travel expenditure on foreign trips exceeding ₹2,00,000 for self or any other person',
          'Deposited more than ₹1 Crore in one or more current accounts during the year',
          'TDS / TCS deducted exceeds ₹25,000 (₹50,000 for senior citizens)'
        ],
        whichForm: [
          { name: 'ITR-1 (Sahaj)', desc: 'For salaried individuals having income up to ₹50 Lakhs from salary, one house property, and other sources (interest, etc.).' },
          { name: 'ITR-2', desc: 'For individuals and HUFs having capital gains, more than one house property, foreign assets, or crypto gains.' },
          { name: 'ITR-3', desc: 'For individuals and HUFs having income from proprietary business or profession, partnership firms.' },
          { name: 'ITR-4 (Sugam)', desc: 'For presumptive business income under Section 44AD, 44ADA (professionals), or 44AE with turnover up to ₹2-3 Crores.' }
        ],
        deadlines: 'July 31, 2025 for non-audit individuals; October 31, 2025 for corporate / audit cases; December 31, 2025 for Belated / Revised returns.'
      }
    },
    {
      id: 'deductions_guide',
      title: 'Chapter VI-A Tax Deductions (80C, 80D, 80G, 80E)',
      category: 'Tax Savings',
      readTime: '7 min read',
      badge: 'Save ₹1.5L+',
      summary: 'Comprehensive list of eligible deductions under the Old Tax Regime to legally lower your taxable income.',
      content: {
        intro: 'Chapter VI-A of the Income Tax Act allows eligible taxpayers under the Old Tax Regime to claim deductions across investments, healthcare, education, and charitable donations.',
        keySections: [
          { sec: 'Section 80C', limit: '₹1,50,000', items: 'EPF, PPF, ELSS Mutual Funds, Life Insurance Premium, 5-Year Tax Saver FDs, Children Tuition Fees, Home Loan Principal repayment.' },
          { sec: 'Section 80CCD(1B)', limit: '₹50,000', items: 'Additional deduction for voluntary contributions to National Pension System (NPS) Tier-1 account over and above 80C.' },
          { sec: 'Section 80D', limit: '₹25,000 - ₹1,00,000', items: 'Health insurance premiums for self, spouse, children (₹25K) + senior citizen parents (₹50K) + preventive health checkup (₹5K).' },
          { sec: 'Section 80E', limit: 'No Upper Limit', items: 'Interest paid on higher education loan for self, spouse, or children for up to 8 consecutive assessment years.' },
          { sec: 'Section 80G', limit: '50% or 100%', items: 'Donations to eligible charitable trusts and relief funds (PM CARES, PM National Relief Fund) with Form 10BE.' }
        ]
      }
    },
    {
      id: 'form16_guide',
      title: 'Form 16 Decoded: Part A & Part B Explained',
      category: 'Salary',
      readTime: '5 min read',
      badge: 'Salary Tax',
      summary: 'Understand TRACES Certificate Part A (TDS summary) and Part B (salary breakup, allowances, and 80C declarations).',
      content: {
        intro: 'Form 16 is a certificate issued by an employer under Section 203 of the Income Tax Act showing the total salary paid and TDS deducted during the financial year.',
        parts: [
          { title: 'Part A (Generated via TRACES portal)', detail: 'Contains Employer TAN, Employee PAN, quarterly TDS deposited with Govt Challan numbers, and Book Identification Numbers (BIN).' },
          { title: 'Part B (Annexure prepared by Employer)', detail: 'Details Gross Salary under Section 17(1), Value of Perquisites u/s 17(2), Exemptions u/s 10 (HRA, LTA), Standard Deduction of ₹50,000/₹75,000, and Chapter VI-A deductions.' }
        ],
        tip: 'Our portal auto-extracts your Form 16 PDF in seconds, populating all salary lines without manual typing.'
      }
    },
    {
      id: 'rent_receipt_guide',
      title: 'Rent Receipts & HRA Rules u/s 10(13A)',
      category: 'Deductions',
      readTime: '4 min read',
      badge: 'HRA Rules',
      summary: 'When is Landlord PAN mandatory? How to structure rental receipts for HR submission and tax exemption verification.',
      content: {
        intro: 'Employees living in rented accommodation can claim House Rent Allowance (HRA) exemption under Section 10(13A) read with Rule 2A.',
        rules: [
          'Landlord PAN is mandatory if annual rent exceeds ₹1,00,000 (approx. ₹8,333 per month) as per CBDT Circular.',
          'Revenue stamp (₹1) is required on physical cash receipts exceeding ₹5,000.',
          'Rent paid to parents is permitted if genuine rental agreement and bank transfer paper trail exist, and parents declare rental income.',
          'Rent paid to spouse is generally disallowed by tax tribunals due to joint matrimonial cohabitation.'
        ]
      }
    },
    {
      id: 'house_property_guide',
      title: 'House Property Tax & Home Loan Benefits',
      category: 'Property',
      readTime: '6 min read',
      badge: 'Sec 24(b)',
      summary: 'Interest deductions up to ₹2,00,000 on home loans, 30% statutory repair allowance, and joint home ownership tax splits.',
      content: {
        intro: 'Income or loss from House Property includes residential and commercial buildings owned by the taxpayer.',
        breakdown: [
          'Self-Occupied Property: Net Annual Value is NIL. Deduction for interest on borrowed capital u/s 24(b) is capped at ₹2,00,000 per financial year.',
          'Let-Out Property (Rented): Actual rent received minus municipal taxes paid gives Net Annual Value (NAV). Flat 30% statutory deduction u/s 24(a) is deducted from NAV, plus unlimited interest deduction (loss capped at ₹2 Lakhs for set-off).',
          'Joint Home Loan: Both co-borrowers and co-owners can each independently claim up to ₹2,00,000 interest u/s 24(b) and ₹1,50,000 principal u/s 80C.'
        ]
      }
    },
    {
      id: 'link_pan_aadhaar_guide',
      title: 'How to Link Aadhaar with PAN Step-by-Step',
      category: 'Compliance',
      readTime: '4 min read',
      badge: 'Mandatory',
      summary: 'Official procedure to link PAN and Aadhaar on e-Filing portal, pay ₹1,000 challan fee u/s 234H, and activate inoperative PAN.',
      content: {
        intro: 'Under Section 139AA of the Income Tax Act, linking PAN with Aadhaar is mandatory for all Indian citizens to prevent duplicate PAN cards.',
        steps: [
          '1. Visit the e-Filing Portal (incometax.gov.in) and click "Link Aadhaar".',
          '2. Enter 10-digit PAN and 12-digit Aadhaar Number.',
          '3. If not linked, click to pay ₹1,000 penalty fee via e-Pay Tax under Minor Head 500 (Other Receipts) Challan No. ITNS 280.',
          '4. After payment reflection (usually 24-48 hours), submit the linking request with Aadhaar OTP.',
          '5. Status will show: "Your PAN is linked to Aadhaar number XXXXXXXXXXXX".'
        ],
        consequences: 'An inoperative PAN cannot receive pending tax refunds, cannot earn interest on refunds, and attracts higher TDS deduction (up to 20%).'
      }
    },
    {
      id: 'slab_rates_guide',
      title: 'Income Tax Slab Rates for FY 2025-26 & AY 2026-27',
      category: 'Rates',
      readTime: '5 min read',
      badge: 'Union Budget',
      summary: 'Latest revised tax slab structures under Section 115BAC New Regime vs Old Tax Slabs.',
      content: {
        intro: 'The Union Budget revised the New Tax Regime slabs to offer greater relief to salaried taxpayers and middle-class professionals.',
        newRegimeSlabs: [
          'Up to ₹3,00,000: Nil (0%)',
          '₹3,00,001 to ₹7,00,000: 5%',
          '₹7,00,001 to ₹10,00,000: 10%',
          '₹10,00,001 to ₹12,00,000: 15%',
          '₹12,00,001 to ₹15,00,000: 20%',
          'Above ₹15,00,000: 30%'
        ],
        rebate87A: 'Under New Regime, Section 87A rebate is available for taxable income up to ₹7,00,000 (tax rebate up to ₹25,000). Combined with the ₹75,000 standard deduction, salary income up to ₹7,75,000 pays zero tax!'
      }
    },
    {
      id: 'pan_card_guide',
      title: 'PAN Card Services: Instant e-PAN, Corrections & New Application',
      category: 'ID Proof',
      readTime: '4 min read',
      badge: 'e-PAN in 10 Min',
      summary: 'Guidelines for Form 49A (New PAN), Form 49AA (NRIs), Instant paperless e-PAN via Aadhaar, and PAN data corrections.',
      content: {
        intro: 'Permanent Account Number (PAN) is a 10-character alphanumeric identity issued by the Income Tax Department under Section 139A.',
        keyPoints: [
          'Instant e-PAN: Free digital PAN generated within 10 minutes using Aadhaar-based e-KYC (for taxpayers who never had a PAN).',
          'Reprint / Correction (Changes in name, DOB, signature): Submit request via NSDL (Protean) or UTIITSL with supporting gazette / ID proof.',
          'PAN Structure: 4th character indicates status (P = Individual, C = Company, H = HUF, F = Partnership Firm, T = Trust).'
        ]
      }
    },
    {
      id: 'aadhaar_guide',
      title: 'Aadhaar Tax Integration & Biometric Auth',
      category: 'ID Proof',
      readTime: '3 min read',
      badge: 'UIDAI',
      summary: 'How Aadhaar enables paperless e-verification of returns, instant e-KYC, and pre-filled ITR XML data.',
      content: {
        intro: 'Aadhaar serves as the primary biometric authentication backbone for e-Filing 2.0 portal, replacing physical paper verification.',
        benefits: [
          'Instant 10-second Return e-Verification via 6-digit Aadhaar OTP sent to mobile registered with UIDAI.',
          'Automatic retrieval of bank accounts pre-validated through Aadhaar linkage.',
          'Prevents identity theft and bogus PAN generation.'
        ]
      }
    },
    {
      id: 'tds_guide',
      title: 'TDS (Tax Deducted at Source), Form 26AS & AIS / TIS',
      category: 'TDS & AIS',
      readTime: '6 min read',
      badge: 'Form 26AS',
      summary: 'Reconciling Annual Information Statement (AIS), Taxpayer Information Summary (TIS), and claiming full credit for TDS deposited.',
      content: {
        intro: 'TDS is collected at the source of income by employers, banks, buyers, and deductors under various sections (192, 194A, 194C, 194J).',
        reconciliationSteps: [
          'Check Form 26AS: Contains tax deducted and deposited by deductors with matching TAN.',
          'Review AIS (Annual Information Statement): Displays high-value transactions, mutual fund purchases, stock trading, dividend credits, and savings interest reported by SFT reporting entities.',
          'Verify TIS: Aggregated summary value used for pre-filling your ITR form.',
          'Claiming TDS Refund: If total TDS deducted exceeds your calculated tax liability, the surplus is refunded to your validated bank account with 0.5% monthly interest u/s 244A.'
        ]
      }
    },
    {
      id: 'capital_gains_guide',
      title: 'Capital Gains Tax (Budget 2024 Revised Rates)',
      category: 'Investments',
      readTime: '7 min read',
      badge: 'Budget 2024 Rates',
      summary: 'New 12.5% Long Term Capital Gains (LTCG) tax, removal of indexation on real estate, and 20% Short Term Capital Gains (STCG).',
      content: {
        intro: 'Union Budget 2024 substantially revamped Capital Gains taxation across listed equities, mutual funds, unlisted shares, and real estate.',
        rates: [
          { asset: 'Listed Equity & Equity Mutual Funds', ltcg: '12.5% (Exempt up to ₹1.25 Lakhs per year)', stcg: '20% (Increased from 15%)', holding: '12 Months' },
          { asset: 'Real Estate / Land & Building', ltcg: '12.5% without indexation (or 20% with indexation for properties acquired before 23-Jul-2024)', stcg: 'Slab Rates', holding: '24 Months' },
          { asset: 'Unlisted Shares & Private Securities', ltcg: '12.5% without indexation', stcg: 'Applicable Slab Rates', holding: '24 Months' },
          { asset: 'Debt Mutual Funds & Market Linked Debentures', ltcg: 'Slab Rates (Treated as STCG regardless of holding)', stcg: 'Slab Rates', holding: 'N/A' }
        ]
      }
    },
    {
      id: 'everify_guide',
      title: 'How to e-Verify Income Tax Return within 30 Days',
      category: 'Filing',
      readTime: '4 min read',
      badge: 'Mandatory Step',
      summary: 'Methods to e-verify your submitted ITR: Aadhaar OTP, Net Banking, Bank EVC, Demat Account, and DSC.',
      content: {
        intro: 'An ITR filed without verification is treated as INVALID (never filed). Verification must be completed within 30 days of submission.',
        methods: [
          { method: '1. Aadhaar OTP (Most Popular)', desc: 'Generate 6-digit OTP sent to the mobile linked with Aadhaar. Verification completes in 10 seconds.' },
          { method: '2. Net Banking', desc: 'Log in to your bank account (SBI, HDFC, ICICI, etc.) and click "e-Verify ITR" to authenticate without OTP.' },
          { method: '3. Electronic Verification Code (EVC) via Bank Account', desc: 'Generate EVC through your pre-validated bank account or Demat account.' },
          { method: '4. Digital Signature Certificate (DSC)', desc: 'Mandatory for tax audit cases and corporate returns.' },
          { method: '5. Physical ITR-V by Speed Post', desc: 'Sign physical ITR-V in blue ink and mail to CPC Bangalore within 30 days.' }
        ]
      }
    },
    {
      id: 'revised_return_guide',
      title: 'Revised Return (139(5)) & Updated Return (ITR-U 139(8A))',
      category: 'Compliance',
      readTime: '5 min read',
      badge: 'Rectifications',
      summary: 'Correct mistakes, missed deductions, or omitted income by filing Revised ITR before Dec 31st or ITR-U up to 24 months later.',
      content: {
        intro: 'If you discover any omission or wrong statement in your originally filed return, the law provides provisions to rectify without penalty.',
        types: [
          {
            title: 'Revised Return under Section 139(5)',
            detail: 'Can be filed if the original return was filed on or before the due date. Can be revised any number of times up to December 31st of the Assessment Year. No penalty or fee.'
          },
          {
            title: 'Updated Return (ITR-U) under Section 139(8A)',
            detail: 'Can be filed within 24 months from the end of relevant Assessment Year. Requires payment of additional tax (25% extra within 12 months, 50% extra within 13-24 months). Cannot be filed to claim a refund or increase refund.'
          }
        ]
      }
    }
  ];

  const filteredGuides = guidesList.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedGuideData = guidesList.find(g => g.id === activeGuide) || guidesList[0];

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-linear-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-800">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Taxpayer Knowledge Base & Legal Library</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Income Tax <span className="text-emerald-400">Guides & Law Decoded</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Step-by-step authoritative walkthroughs, statutory provisions, and compliance guides curated by Chartered Accountants and tax advocates.
            </p>

            <div className="pt-2">
              <div className="relative max-w-lg">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guides (e.g. Form 16, Capital Gains, e-Verify, Deductions)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Guide Navigator */}
          <div className="lg:col-span-4 space-y-2">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 py-1 block">
                All Tax Guides ({filteredGuides.length})
              </span>
              <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
                {filteredGuides.map((guide) => {
                  const isCurrent = activeGuide === guide.id;
                  return (
                    <button
                      key={guide.id}
                      onClick={() => setActiveGuide(guide.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-1 ${
                        isCurrent 
                          ? 'bg-emerald-800 text-white shadow-sm' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                          {guide.title}
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0 ${
                          isCurrent ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {guide.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className={isCurrent ? 'text-emerald-200' : 'text-slate-400'}>{guide.category}</span>
                        <span className={isCurrent ? 'text-emerald-300' : 'text-slate-300'}>•</span>
                        <span className={isCurrent ? 'text-emerald-200' : 'text-slate-400'}>{guide.readTime}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Reader Canvas */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    {selectedGuideData.category}
                  </span>
                  <span className="text-xs text-slate-400">• {selectedGuideData.readTime}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedGuideData.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedGuideData.summary}
                </p>
              </div>

              {/* Dynamic Content Sections */}
              <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p className="font-medium text-slate-800 text-sm">
                  {selectedGuideData.content.intro}
                </p>

                {/* Who must file check */}
                {selectedGuideData.content.whoMustFile && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Mandatory Conditions for Filing:
                    </h3>
                    <ul className="space-y-2 text-xs">
                      {selectedGuideData.content.whoMustFile.map((cond, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                          <span>{cond}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Which form */}
                {selectedGuideData.content.whichForm && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">ITR Forms Breakdown:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedGuideData.content.whichForm.map((f, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-emerald-50/30">
                          <span className="font-bold text-xs text-emerald-900 block mb-1">{f.name}</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deadlines */}
                {selectedGuideData.content.deadlines && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                    <strong className="block font-bold mb-1">Key Statutory Filing Due Dates:</strong>
                    <span>{selectedGuideData.content.deadlines}</span>
                  </div>
                )}

                {/* Key Sections for Deductions */}
                {selectedGuideData.content.keySections && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Major Chapter VI-A Sections:</h3>
                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                      {selectedGuideData.content.keySections.map((sec, idx) => (
                        <div key={idx} className="p-3.5 bg-white text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-slate-900">{sec.sec}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Max: {sec.limit}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{sec.items}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Capital Gains rates table */}
                {selectedGuideData.content.rates && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Union Budget 2024 Capital Gain Rates:</h3>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                          <tr>
                            <th className="p-3">Asset Class</th>
                            <th className="p-3">LTCG Tax Rate</th>
                            <th className="p-3">STCG Tax Rate</th>
                            <th className="p-3">Holding Period</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {selectedGuideData.content.rates.map((r, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-3 font-semibold text-slate-900">{r.asset}</td>
                              <td className="p-3 font-mono font-bold text-emerald-700">{r.ltcg}</td>
                              <td className="p-3 font-mono text-slate-700">{r.stcg}</td>
                              <td className="p-3 text-slate-500">{r.holding}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Steps */}
                {selectedGuideData.content.steps && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Step-by-Step Instructions:</h3>
                    <ol className="space-y-2 text-xs">
                      {selectedGuideData.content.steps.map((st, idx) => (
                        <li key={idx} className="text-slate-700">
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* e-Verify methods */}
                {selectedGuideData.content.methods && (
                  <div className="space-y-2.5">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">5 Ways to Verify Your Return:</h3>
                    {selectedGuideData.content.methods.map((m, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="font-bold text-slate-900 block mb-0.5">{m.method}</span>
                        <p className="text-[11px] text-slate-600">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* New regime slabs */}
                {selectedGuideData.content.newRegimeSlabs && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                    <strong className="block text-emerald-950 font-bold">New Tax Regime Slabs (FY 2025-26):</strong>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedGuideData.content.newRegimeSlabs.map((s, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-lg border border-emerald-200 font-mono text-[11px] font-bold text-emerald-800">
                          {s}
                        </div>
                      ))}
                    </div>
                    {selectedGuideData.content.rebate87A && (
                      <p className="text-[11px] text-emerald-900 pt-2 border-t border-emerald-200/60">
                        {selectedGuideData.content.rebate87A}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Banner */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Need personalized advice from a Chartered Accountant?
                </span>
                {onNavigateToFiling && (
                  <button
                    type="button"
                    onClick={onNavigateToFiling}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>File Return Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
