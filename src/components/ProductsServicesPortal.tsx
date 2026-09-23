import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Briefcase, 
  HelpCircle, 
  FileText, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  UploadCloud, 
  Receipt, 
  Search, 
  BadgeCheck, 
  AlertTriangle,
  Award,
  Send,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export type PortalSection = 'quick_links' | 'products' | 'services_individuals' | 'services_businesses' | 'pricing' | 'about' | 'contact' | 'faq' | 'glossary';

interface ProductsServicesPortalProps {
  initialSection?: PortalSection;
  initialSubItem?: string;
  onNavigateToFiling?: () => void;
  onOpenAuth?: () => void;
}

export const ProductsServicesPortal: React.FC<ProductsServicesPortalProps> = ({
  initialSection = 'products',
  initialSubItem,
  onNavigateToFiling,
  onOpenAuth,
}) => {
  const [activeSection, setActiveSection] = useState<PortalSection>(initialSection);
  const [activeSubItem, setActiveSubItem] = useState<string>(initialSubItem || '');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', service: 'ITR-1 Filing', message: '' });
  const [faqSearch, setFaqSearch] = useState('');
  const [glossarySearch, setGlossarySearch] = useState('');

  // 1. PRODUCTS LIST (11 Products)
  const products = [
    {
      id: 'file_itr',
      title: 'File Income Tax Return',
      tagline: 'Fast, paperless e-Filing in 4 minutes with instant CPC acknowledgment.',
      badge: 'Most Popular',
      price: 'Free Self-Filing / ₹499 Assisted',
      features: ['Form 16 auto-upload & XML parser', 'Direct e-Filing integration with ITD', 'Instant 15-digit CPC Acknowledgment', 'Free e-Verification guidance'],
      actionText: 'Start ITR Filing'
    },
    {
      id: 'upload_form16',
      title: 'Upload Form 16',
      tagline: 'Drop your employer PDF Form 16 Part A & B for instant automated tax computation.',
      badge: 'Zero Errors',
      price: 'Free Auto-Parse',
      features: ['OCR & PDF structured data extraction', 'Auto-fills salary allowances, 80C, 80D', 'Validates TDS with Form 26AS', 'Takes under 60 seconds'],
      actionText: 'Upload Form 16 PDF'
    },
    {
      id: 'ca_assisted',
      title: 'CA Assisted ITR Filing (e-CA)',
      tagline: 'Dedicated Chartered Accountant reviews your finances, maximizes legal deductions & files your return.',
      badge: 'Expert Review',
      price: 'From ₹999',
      features: ['1-on-1 Certified CA consultation', 'Cross-verification of AIS/TIS data', 'Capital gains & multi-form optimization', 'Post-filing notice protection support'],
      actionText: 'Book Chartered Accountant'
    },
    {
      id: 'tax_optimiser',
      title: 'Tax Planning Optimiser',
      tagline: 'Personalized simulation to maximize legal tax savings under Old vs New Tax Regime.',
      badge: 'Save Up to ₹1.2L',
      price: 'Free Tool',
      features: ['Regime breakeven simulator', 'Section 80CCD(1B) NPS contribution guidance', 'Health insurance 80D structuring', 'Home loan interest tax shield'],
      actionText: 'Launch Optimiser'
    },
    {
      id: 'nri_taxes',
      title: 'NRI Taxes & ITR Filing',
      tagline: 'Specialized cross-border tax advisory for Non-Resident Indians with income in India.',
      badge: 'DTAA Specialist',
      price: 'From ₹2,499',
      features: ['Double Taxation Avoidance Agreement (DTAA) relief', 'NRE / NRO bank interest taxation', 'Capital gains on Indian stocks & real estate', 'Form 10F & Tax Residency Certificate (TRC)'],
      actionText: 'Consult NRI Tax Desk'
    },
    {
      id: 'tax_advisory',
      title: 'Tax Advisory Services',
      tagline: 'Strategic tax structuring for High Net-Worth Individuals (HNIs), doctors, founders, and executives.',
      badge: 'HNI & Corporate',
      price: 'Custom Advisory',
      features: ['Stock options (ESOPs / RSUs) taxation', 'Family trust & wealth structuring', 'Inheritance & gift tax compliance', 'Advance tax quarterly calculations'],
      actionText: 'Schedule Consultation'
    },
    {
      id: 'capital_gains_filing',
      title: 'Capital Gain Tax Filing',
      tagline: 'Comprehensive reporting of equity, mutual funds, real estate, and crypto gains.',
      badge: 'Budget 2024 Ready',
      price: 'From ₹1,499',
      features: ['Direct broker Excel/P&L import (Zerodha, Groww, Upstox)', 'New 12.5% LTCG & 20% STCG calculation', 'Set-off and carry forward of business & capital losses', 'Section 54 & 54EC capital gain exemption planning'],
      actionText: 'File Capital Gains'
    },
    {
      id: 'it_notices',
      title: 'Income Tax Notice Assistance',
      tagline: 'Expert resolution of Section 143(1), 139(9) defective return, and 148 reassessment notices.',
      badge: 'Notice Resolution',
      price: 'From ₹1,299',
      features: ['Detailed diagnostic review of IT notice', 'Drafting formal legal reply by CA / Tax Advocate', 'Rectification request filing on portal', 'Faceless Assessment representation'],
      actionText: 'Resolve Tax Notice'
    },
    {
      id: 'huf_registration',
      title: 'HUF Registration & Tax Filing',
      tagline: 'Create a Hindu Undivided Family (HUF) entity to unlock an additional ₹3,00,000 basic tax exemption.',
      badge: 'Double Exemption',
      price: '₹1,999 All Inclusive',
      features: ['HUF Deed drafting & notary documentation', 'HUF PAN Card application', 'HUF Bank account opening facilitation', 'Annual HUF ITR-2 / ITR-3 filing'],
      actionText: 'Start HUF Setup'
    },
    {
      id: 'gst_services',
      title: 'GST Services Suite',
      tagline: 'End-to-end Goods and Services Tax compliance for businesses and freelancers.',
      badge: 'Business Suite',
      price: 'From ₹499/Month',
      features: ['New GST Registration (with ARN within 3 days)', 'Monthly GSTR-1 & GSTR-3B return filing', 'GSTR-2B Input Tax Credit (ITC) reconciliation', 'Annual GSTR-9 audit compliance'],
      actionText: 'Explore GST Plans'
    },
    {
      id: 'tds_solution',
      title: 'TDS Solution & Returns (24Q/26Q)',
      tagline: 'Corporate and deductor withholding tax software & filing service.',
      badge: 'Deductor Portal',
      price: 'From ₹899/Quarter',
      features: ['Quarterly Form 24Q (Salary) & Form 26Q (Non-Salary)', 'Form 27Q for NRI payments', 'Form 16 / 16A digitally signed generation', 'TDS challan correction & TRACES justify report'],
      actionText: 'Manage TDS Returns'
    }
  ];

  // 2. SERVICES FOR INDIVIDUALS (5 Services)
  const individualServices = [
    {
      title: 'Income Tax Returns Filing',
      desc: 'Salaried, freelancers, consultants, and individuals with rental or interest income.',
      includes: ['ITR-1 / ITR-2 / ITR-4 filing', 'Standard deduction optimization', 'Full refund recovery support'],
      fee: 'Starting at Free / ₹499'
    },
    {
      title: 'TDS Returns Filing',
      desc: 'For individuals required to deduct tax on high-value property rent (194-IB) or property purchase (194-IA).',
      includes: ['Form 26QB (Property purchase TDS)', 'Form 26QC (High rent TDS u/s 194-IB)', 'Instant challan generation'],
      fee: '₹799 per filing'
    },
    {
      title: 'Tax Planning & Saving',
      desc: 'Maximize in-hand salary and plan investments to pay minimal legal income tax.',
      includes: ['Salary restructuring advisory', 'NPS & 80C investment roadmap', 'Mediclaim & health policy allocation'],
      fee: '₹1,199 Comprehensive'
    },
    {
      title: 'Digital Signature Certificate (DSC)',
      desc: 'Paperless Class 3 Individual Digital Signature Certificate with 2-year validity.',
      includes: ['Class 3 Signing Certificate', 'FIPS certified USB crypto token', 'Video e-KYC approval in 30 minutes'],
      fee: '₹1,499 with Token'
    },
    {
      title: 'PAN Card Services',
      desc: 'Instant Aadhaar-based e-PAN, duplicate PAN reprint, or demographic corrections.',
      includes: ['Form 49A application', 'PAN-Aadhaar linking assistance', 'Physical laminated card delivered to doorstep'],
      fee: '₹299 onwards'
    }
  ];

  // 3. SERVICES FOR BUSINESSES (8 Services)
  const businessServices = [
    {
      title: 'GST Registration',
      desc: 'Complete GST registration with ARN tracking for proprietors, LLPs, and companies.',
      timeline: '2 - 4 business days',
      fee: '₹999 All-inclusive'
    },
    {
      title: 'Business Income Tax Returns Filing',
      desc: 'ITR-3, ITR-5 (Partnership/LLP), and ITR-6 (Private Limited Companies) with balance sheet preparation.',
      timeline: 'Annual compliance',
      fee: 'From ₹2,499'
    },
    {
      title: 'GST Returns Filing',
      desc: 'Monthly / Quarterly GSTR-1, GSTR-3B filings with 100% GSTR-2B input tax credit reconciliation.',
      timeline: 'Monthly recurring',
      fee: '₹499 per month'
    },
    {
      title: 'Corporate TDS Returns Filing',
      desc: 'Form 24Q (Employee salaries) and Form 26Q (Vendor contractor, rent, professional fee payments).',
      timeline: 'Quarterly',
      fee: '₹899 per quarter'
    },
    {
      title: 'Corporate Tax Planning & Saving',
      desc: 'Legitimate business expense structuring, depreciation claim u/s 32, and corporate tax rate optimization.',
      timeline: 'Quarterly review',
      fee: 'Custom Quotation'
    },
    {
      title: 'Digital Signature Certificate (Class 3 Org)',
      desc: 'Class 3 Organization DSC for MCA filings, GST portal, and corporate e-Tendering.',
      timeline: 'Same-day issuance',
      fee: '₹1,999 with USB Token'
    },
    {
      title: 'Company PAN & TAN Card Services',
      desc: 'New Company PAN 49A and TAN (Tax Deduction and Collection Account Number) registration.',
      timeline: '2 business days',
      fee: '₹499'
    },
    {
      title: 'Company Registration (Pvt Ltd, LLP, OPC)',
      desc: 'End-to-end incorporation with SPICe+ MCA form, MOA, AOA, PAN, TAN, and DIN allocation.',
      timeline: '7 - 10 business days',
      fee: 'From ₹5,999 + Govt Fees'
    }
  ];

  // 4. PRICING PLANS
  const pricingPlans = [
    {
      name: 'Free Self-Filer',
      price: '₹0',
      period: 'Forever Free',
      desc: 'Ideal for salaried individuals with single employer Form 16 and interest income.',
      features: [
        'Form 16 auto-upload & instant parse',
        'ITR-1 (Sahaj) e-Filing',
        'Old vs New Regime comparison',
        'Official 15-digit CPC Acknowledgment',
        'Community email support'
      ],
      cta: 'Start Free Filing',
      highlight: false
    },
    {
      name: 'Assisted Pro (e-CA)',
      price: '₹899',
      period: 'Per Return',
      desc: 'Dedicated CA prepares, verifies, and optimizes your return with maximum legal refunds.',
      features: [
        'Everything in Free',
        'Dedicated Chartered Accountant',
        'Multiple Form 16s & salary components',
        'HRA, home loan & donation optimization',
        'AIS & Form 26AS reconciliation',
        'Post-filing verification assistance'
      ],
      cta: 'Hire a CA',
      highlight: true
    },
    {
      name: 'Trader & Capital Gains',
      price: '₹1,799',
      period: 'Per Return',
      desc: 'For investors & traders in stocks, mutual funds, F&O, intraday, and crypto.',
      features: [
        'Direct Zerodha, Groww, Upstox import',
        'New 12.5% LTCG & 20% STCG calculation',
        'Schedule CG, CFL loss carry-forward',
        'F&O / Intraday business turnover computation',
        'CA signed and filed return'
      ],
      cta: 'File Capital Gains',
      highlight: false
    },
    {
      name: 'Business & Freelancer',
      price: '₹2,499',
      period: 'Per Return',
      desc: 'For professionals, MSMEs, freelancers, and businesses filing ITR-3 or ITR-4.',
      features: [
        'Section 44AD / 44ADA Presumptive computation',
        'P&L statement & balance sheet drafting',
        'GST & TDS cross-reconciliation',
        'Depreciation schedule on assets',
        'Year-round priority tax support'
      ],
      cta: 'Choose Business Plan',
      highlight: false
    }
  ];

  // 5. TAX GLOSSARY TERMS (A-Z)
  const glossaryTerms = [
    { term: 'AIS (Annual Information Statement)', definition: 'A comprehensive statement displaying financial transactions undertaken by a taxpayer, including savings interest, stock purchases, dividends, mutual funds, and foreign remittances.' },
    { term: 'Assessment Year (AY)', definition: 'The financial year immediately following the financial year in which the income was earned, during which such income is assessed and taxed (e.g. For FY 2024-25, AY is 2025-26).' },
    { term: 'Form 26AS', definition: 'A consolidated tax credit statement showing TDS deposited by deductors, advance tax paid, self-assessment tax, and high-value transactions reported by banks.' },
    { term: 'Section 87A Rebate', definition: 'A tax relief mechanism granting zero tax liability for taxable incomes up to ₹7,00,000 under the New Tax Regime (rebate up to ₹25,000).' },
    { term: 'CPC (Centralized Processing Centre)', definition: 'The modern technology wing of the Income Tax Department located in Bangalore that electronically processes all submitted ITRs and issues intimations u/s 143(1).' },
    { term: 'LTCG (Long Term Capital Gains)', definition: 'Profits earned on sale of capital assets held beyond statutory threshold (12 months for listed equities; 24 months for real estate and unlisted shares).' },
    { term: 'STCG (Short Term Capital Gains)', definition: 'Profits realized on disposal of assets held for less than the long-term threshold, taxed at 20% u/s 111A for listed equities.' },
    { term: 'Presumptive Taxation (Sec 44AD / 44ADA)', definition: 'A simplified scheme allowing small businesses and professionals to declare income at a flat statutory percentage (6%/8% for business; 50% for professionals) without maintaining detailed books of accounts.' },
    { term: 'DTAA (Double Taxation Avoidance Agreement)', definition: 'A bilateral treaty between India and foreign countries preventing identical income from being taxed twice for Non-Resident Indians (NRIs).' },
    { term: 'ITR-V (Verification Form)', definition: 'An acknowledgment slip generated upon filing an unverified return, requiring electronic verification or postal dispatch within 30 days.' }
  ];

  const filteredGlossary = glossaryTerms.filter(t => 
    t.term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
    t.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  // 6. FREQUENTLY ASKED QUESTIONS (FAQ)
  const faqs = [
    { q: 'Is it mandatory to file an ITR if my income is below ₹3,00,000?', a: 'Generally no, unless you meet specific high-value criteria such as spending over ₹2 Lakhs on foreign travel, electricity bill exceeding ₹1 Lakh in a year, or having foreign assets / bank accounts.' },
    { q: 'What happens if I miss the July 31st due date?', a: 'You can still file a Belated Return up to December 31st by paying a late fee under Section 234F (₹1,000 if income <= ₹5L; ₹5,000 if income > ₹5L) along with 1% monthly interest on unpaid taxes u/s 234A.' },
    { q: 'Can I switch between Old and New Tax Regime every year?', a: 'Salaried taxpayers having no business income can switch freely between Old and New Regime every single year at the time of filing. Those with business or professional income (ITR-3/ITR-4) can opt out of New Regime only once in their lifetime.' },
    { q: 'How long does it take to receive the Income Tax Refund?', a: 'Most refunds processed by CPC Bangalore are credited via NECS/RTGS direct account transfer within 10 to 30 days from the date of successful e-Verification.' },
    { q: 'Why is my Form 16 tax different from the portal calculation?', a: 'Employers only calculate tax based on declarations submitted to HR. If you have additional savings bank interest, capital gains, or missed declaring deductions like 80CCD NPS, our system automatically recalculates the optimal figures.' }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', phone: '', service: 'ITR-1 Filing', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Section Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'products', label: 'Products & Solutions', icon: Sparkles },
            { id: 'services_individuals', label: 'Services for Individuals', icon: User },
            { id: 'services_businesses', label: 'Services for Businesses', icon: Briefcase },
            { id: 'pricing', label: 'Transparent Pricing', icon: CreditCard },
            { id: 'about', label: 'About Us', icon: Building2 },
            { id: 'contact', label: 'Contact Helpdesk', icon: Phone },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'glossary', label: 'Tax Glossary', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as PortalSection)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent 
                    ? 'bg-emerald-800 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. PRODUCTS & SOLUTIONS */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                11 Specialized Products
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
                Income Tax, GST & Financial Products
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
                Automated software tools and expert CA-backed solutions engineered for Indian taxpayers, professionals, and enterprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {p.badge}
                      </span>
                      <span className="text-xs font-black text-slate-900 font-mono">
                        {p.price}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{p.tagline}</p>
                    
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (p.id === 'file_itr' || p.id === 'upload_form16') {
                        onNavigateToFiling && onNavigateToFiling();
                      } else {
                        setActiveSection('contact');
                        setContactForm(prev => ({ ...prev, service: p.title }));
                      }
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{p.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SERVICES FOR INDIVIDUALS */}
        {activeSection === 'services_individuals' && (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-emerald-900 to-teal-950 text-white p-8 rounded-3xl shadow-xl">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                Personal Taxation Suite
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Services for Individuals & Salaried Taxpayers
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
                Expert tax assistance tailored for salaried employees, consultants, freelancers, doctors, and senior citizens.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {individualServices.map((srv, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-extrabold text-slate-900">{srv.title}</h3>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {srv.fee}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                    <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                      {srv.includes.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('contact');
                      setContactForm(prev => ({ ...prev, service: srv.title }));
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Request Service / Consultation
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SERVICES FOR BUSINESSES */}
        {activeSection === 'services_businesses' && (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                Enterprise & MSME
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Services for Businesses, Startups & LLPs
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Full-stack corporate statutory compliance from GST and corporate tax filing to Company Incorporation and Class 3 DSC.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {businessServices.map((bs, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{bs.timeline}</span>
                    <h3 className="text-sm font-extrabold text-slate-900">{bs.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{bs.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{bs.fee}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection('contact');
                        setContactForm(prev => ({ ...prev, service: `Business: ${bs.title}` }));
                      }}
                      className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      Inquire →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TRANSPARENT PRICING */}
        {activeSection === 'pricing' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Simple & Transparent Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Plans for Every Indian Taxpayer
              </h2>
              <p className="text-xs text-slate-500">
                Zero hidden charges. No convenience fee. Includes 100% filing accuracy guarantee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
                    plan.highlight 
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-xl' 
                      : 'border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    {plan.highlight && (
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider inline-block">
                        Recommended
                      </span>
                    )}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{plan.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-1">{plan.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-xs text-slate-400 ml-1">/ {plan.period}</span>
                    </div>

                    <div className="space-y-2 pt-2">
                      {plan.features.map((feat, fidx) => (
                        <div key={fidx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToFiling) onNavigateToFiling();
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      plan.highlight
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ABOUT US */}
        {activeSection === 'about' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                About Tax Return PRO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Empowering India with Modern, Painless Tax Filing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tax Return PRO is an authorized e-Return Intermediary (ERI) and leading fintech platform dedicated to simplifying direct and indirect tax compliance across India. Combining bank-grade 256-bit encryption with certified Chartered Accountants, we ensure accurate filings, maximal legitimate tax refunds, and zero notices.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h4 className="font-extrabold text-sm text-slate-900">256-Bit Bank Grade Security</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ISO 27001 certified data pipelines ensure your PAN, Aadhaar, and financial records remain confidential and secure.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <Award className="w-6 h-6 text-emerald-600" />
                <h4 className="font-extrabold text-sm text-slate-900">Certified CA Network</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Over 150+ empanelled Chartered Accountants, tax advocates, and GST practitioners with 15+ years experience.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <Sparkles className="w-6 h-6 text-emerald-600" />
                <h4 className="font-extrabold text-sm text-slate-900">100% Filing Accuracy</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automated validation engines cross-check AIS, TIS, and Form 26AS data to eradicate defective notice risks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. CONTACT HELPDESK */}
        {activeSection === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-linear-to-br from-slate-900 to-emerald-950 text-white p-8 rounded-3xl space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Taxpayer Helpdesk</span>
                <h2 className="text-2xl font-black mt-1">Get in Touch with Our Tax Experts</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Have questions about notice replies, capital gains, or GST registration? Reach out to our dedicated support team.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl text-emerald-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Toll-Free Helpline:</span>
                    <span className="font-bold text-white text-sm">+91 1800 103 0025 / +91 98765-43210</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl text-emerald-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Support Desk Email:</span>
                    <span className="font-bold text-white text-sm">support@taxreturnpro.in</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl text-emerald-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Headquarters:</span>
                    <span className="font-semibold text-slate-200">
                      Sector V, Salt Lake Electronics Complex, Kolkata, West Bengal - 700091
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white">Support Operating Hours:</span>
                <p>Monday - Saturday: 9:00 AM to 8:00 PM IST</p>
                <p>Peak Filing Days (July & Dec): 24/7 Priority Emergency Desk</p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
              <h3 className="text-lg font-black text-slate-900 mb-1">Send a Message / Request Callback</h3>
              <p className="text-xs text-slate-500 mb-6">Our tax associates respond within 2 working hours.</p>

              {contactSubmitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">Message Received Successfully!</h4>
                  <p className="text-xs text-emerald-700">
                    A Chartered Accountant will review your request and contact you at {contactForm.phone || contactForm.email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Wasim Ali"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Service Needed</label>
                      <input
                        type="text"
                        value={contactForm.service}
                        onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Query / Specific Issue</label>
                    <textarea
                      rows={3}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Please specify your query (e.g. Received notice u/s 143(1), need capital gain calculation for shares)..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Query to CA Team</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 7. FAQ */}
        {activeSection === 'faq' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-500 mt-1">Answers to common queries on tax slabs, refunds, and filing deadlines.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search FAQ questions..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold shrink-0">
                      Q
                    </span>
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. TAX GLOSSARY */}
        {activeSection === 'glossary' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">A - Z Indian Tax Glossary</h2>
                <p className="text-xs text-slate-500 mt-1">Key legal terms and definitions defined under the Income Tax Act, 1961.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Search tax terms (e.g. AIS, DTAA, CPC)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlossary.map((g, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="font-extrabold text-xs text-emerald-900 block">{g.term}</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{g.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
