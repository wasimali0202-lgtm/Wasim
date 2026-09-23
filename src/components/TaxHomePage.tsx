import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  Calculator, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  CreditCard, 
  Lock, 
  Clock, 
  HelpCircle, 
  Briefcase, 
  BadgePercent, 
  Sparkles, 
  PhoneCall, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Receipt,
  FileSpreadsheet,
  AlertCircle,
  Home,
  AlertTriangle,
  Scale,
  Percent,
  MessageSquare,
  Mail,
  MapPin,
  Send,
  X,
  User,
  Star,
  FileCheck2,
  FolderCheck,
  Headphones,
  Check,
  DollarSign,
  Award,
  Zap,
  CheckCheck,
  FileEdit,
  ArrowUpRight,
  Laptop,
  MousePointer,
  Users,
  CheckCircle,
  Cpu,
  Layers,
  Scan,
  Binary,
  Server,
  QrCode,
  Network,
  Fingerprint,
  BarChart2,
  Edit3,
  BookOpen
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { usePageContent } from '../utils/pageContent';
import { FilingStatisticsSection } from './FilingStatisticsSection';
import { getPlatformMetrics, subscribePlatformMetrics, PlatformMetrics, incrementPlatformFiling } from '../utils/taxStats';

interface TaxHomePageProps {
  language: Language;
  currentUser: UserProfile | null;
  onStartFiling: () => void;
  onOpenCalculator: () => void;
  onOpenAuth: () => void;
  onOpenPaymentModal: () => void;
  onGoToDashboard: () => void;
  onGoToTrackStatus: () => void;
  onNavigateTab?: (tabKey: string) => void;
}

export const TaxHomePage: React.FC<TaxHomePageProps> = ({
  language,
  currentUser,
  onStartFiling,
  onOpenCalculator,
  onOpenAuth,
  onOpenPaymentModal,
  onGoToDashboard,
  onGoToTrackStatus,
  onNavigateTab,
}) => {
  const pageContent = usePageContent();
  const isBn = language === 'bn';

  // Calculator State
  const [activeCalcTab, setActiveCalcTab] = useState<'regime' | 'hra' | 'slabs'>('regime');
  
  // Old vs New Regime Inputs
  const [grossSalary, setGrossSalary] = useState<number>(950000);
  const [deduction80C, setDeduction80C] = useState<number>(150000);
  const [deduction80D, setDeduction80D] = useState<number>(25000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(50000);
  const [nps80CCD, setNps80CCD] = useState<number>(0);

  // HRA Inputs
  const [basicSalary, setBasicSalary] = useState<number>(500000);
  const [daAmount, setDaAmount] = useState<number>(0);
  const [hraReceived, setHraReceived] = useState<number>(200000);
  const [monthlyRent, setMonthlyRent] = useState<number>(20000);
  const [isMetroCity, setIsMetroCity] = useState<boolean>(true);

  // Dynamic Live Counter for Total Filings Processed - hooked to real user activities
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics>(getPlatformMetrics());
  const [counterPulse, setCounterPulse] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to updates when forms are submitted anywhere in the app
    const unsubscribe = subscribePlatformMetrics((newMetrics) => {
      setPlatformMetrics(newMetrics);
      setCounterPulse(true);
      setTimeout(() => setCounterPulse(false), 700);
    });
    return unsubscribe;
  }, []);

  const totalFilings = platformMetrics.totalFilings;
  const recentFilings = platformMetrics.recentFilings.length > 0 
    ? platformMetrics.recentFilings 
    : [
        { id: 1, type: 'Ready for Submissions', city: 'India', user: 'System Active', refund: '₹0', time: 'Active' }
      ];

  // Modals state
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [gstModalOpen, setGstModalOpen] = useState(false);
  const [tradingModalOpen, setTradingModalOpen] = useState(false);
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);
  const [activeHubTab, setActiveHubTab] = useState<'products' | 'tools' | 'individuals' | 'businesses' | 'guides' | 'quick_links'>('products');

  // Modal forms state
  const [expertForm, setExpertForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    service: 'salaried',
    slot: 'tomorrow_morning',
    notes: '',
  });
  const [expertSuccess, setExpertSuccess] = useState<string | null>(null);

  const [noticeForm, setNoticeForm] = useState({
    noticeNumber: '',
    section: '143_1',
    description: '',
    phone: currentUser?.phone || '',
  });
  const [noticeSuccess, setNoticeSuccess] = useState<string | null>(null);

  const [gstForm, setGstForm] = useState({
    businessName: '',
    entityType: 'proprietorship',
    serviceType: 'new_registration',
    phone: currentUser?.phone || '',
  });
  const [gstSuccess, setGstSuccess] = useState<string | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    topic: 'filing_inquiry',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Calculations: Old vs New Regime (AY 2025-26)
  const calculateNewRegime = (gross: number) => {
    const stdDeduction = 75000;
    const taxable = Math.max(0, gross - stdDeduction);
    let tax = 0;

    if (taxable <= 300000) {
      tax = 0;
    } else if (taxable <= 700000) {
      tax = (taxable - 300000) * 0.05;
    } else if (taxable <= 1000000) {
      tax = 400000 * 0.05 + (taxable - 700000) * 0.10;
    } else if (taxable <= 1200000) {
      tax = 400000 * 0.05 + 300000 * 0.10 + (taxable - 1000000) * 0.15;
    } else if (taxable <= 1500000) {
      tax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (taxable - 1200000) * 0.20;
    } else {
      tax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + 300000 * 0.20 + (taxable - 1500000) * 0.30;
    }

    // Section 87A rebate for New Regime: full rebate if taxable <= 700000
    if (taxable <= 700000) {
      tax = 0;
    }

    const cess = Math.round(tax * 0.04);
    const totalTax = Math.round(tax + cess);

    return {
      taxable,
      tax,
      cess,
      totalTax,
      stdDeduction
    };
  };

  const calculateOldRegime = (
    gross: number,
    c80: number,
    d80: number,
    homeLoan: number,
    nps: number
  ) => {
    const stdDeduction = 50000;
    const capped80C = Math.min(150000, Math.max(0, c80));
    const capped80D = Math.min(50000, Math.max(0, d80));
    const cappedHomeLoan = Math.min(200000, Math.max(0, homeLoan));
    const cappedNps = Math.min(50000, Math.max(0, nps));
    const totalDeductions = stdDeduction + capped80C + capped80D + cappedHomeLoan + cappedNps;

    const taxable = Math.max(0, gross - totalDeductions);
    let tax = 0;

    if (taxable <= 250000) {
      tax = 0;
    } else if (taxable <= 500000) {
      tax = (taxable - 250000) * 0.05;
    } else if (taxable <= 1000000) {
      tax = 12500 + (taxable - 500000) * 0.20;
    } else {
      tax = 12500 + 100000 + (taxable - 1000000) * 0.30;
    }

    // Section 87A rebate for Old Regime: full rebate if taxable <= 500000
    if (taxable <= 500000) {
      tax = 0;
    }

    const cess = Math.round(tax * 0.04);
    const totalTax = Math.round(tax + cess);

    return {
      taxable,
      tax,
      cess,
      totalTax,
      totalDeductions
    };
  };

  const newRegimeData = calculateNewRegime(grossSalary);
  const oldRegimeData = calculateOldRegime(
    grossSalary,
    deduction80C,
    deduction80D,
    homeLoanInterest,
    nps80CCD
  );

  const diffAmount = Math.abs(oldRegimeData.totalTax - newRegimeData.totalTax);
  const recommendedRegime = newRegimeData.totalTax <= oldRegimeData.totalTax ? 'New' : 'Old';

  // HRA Calculations under Section 10(13A)
  const annualRentPaid = monthlyRent * 12;
  const salaryForHra = basicSalary + daAmount;
  const hraCondition1 = hraReceived;
  const hraCondition2 = isMetroCity ? salaryForHra * 0.50 : salaryForHra * 0.40;
  const hraCondition3 = Math.max(0, annualRentPaid - (0.10 * salaryForHra));

  const exemptHra = Math.min(hraCondition1, hraCondition2, hraCondition3);
  const taxableHra = Math.max(0, hraReceived - exemptHra);
  const estimatedHraTaxSavings = Math.round(exemptHra * 0.20); // Average 20% bracket

  // Modal Handlers
  const handleBookExpert = (e: React.FormEvent) => {
    e.preventDefault();
    const token = 'EXP-' + Math.floor(100000 + Math.random() * 900000);
    setExpertSuccess(token);
    incrementPlatformFiling({
      type: 'Expert e-CA Review',
      city: 'India',
      user: expertForm.name || 'Client',
      refundAmount: 42000
    });
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = 'NOT-' + Math.floor(100000 + Math.random() * 900000);
    setNoticeSuccess(token);
    incrementPlatformFiling({
      type: 'ITD Notice Rectification',
      city: 'India',
      user: 'Notice Ref #' + (noticeForm.noticeNumber || 'Client'),
      refundAmount: 25000
    });
  };

  const handleGstSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = 'GST-' + Math.floor(100000 + Math.random() * 900000);
    setGstSuccess(token);
    incrementPlatformFiling({
      type: 'GST / Business Filing',
      city: 'India',
      user: gstForm.businessName || 'Business Taxpayer',
      refundAmount: 65000
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        phone: '',
        topic: 'filing_inquiry',
        message: '',
      });
    }, 2000);
  };

  const faqs = [
    {
      q: "Which tax regime should I choose for AY 2025-26?",
      a: "For AY 2025-26, the New Tax Regime is the default regime with a higher standard deduction of ₹75,000 and 0 tax for taxable income up to ₹7 Lakhs (Gross income up to ₹7.75 Lakhs). If your total chapter VI-A deductions (80C, 80D, HRA, home loan interest) exceed ₹3.75 Lakhs, the Old Regime may still save you more. You can test both right now with our interactive calculator above.",
    },
    {
      q: "What documents are required to file ITR online?",
      a: "The primary documents are: (1) Form 16 provided by your employer, (2) Annual Information Statement (AIS) & Form 26AS, (3) Bank account statements for interest earned, (4) Capital Gains statement from brokers like Zerodha/Groww/AngelOne, and (5) Aadhaar & PAN card. Our system auto-extracts data from Form 16 PDF in seconds.",
    },
    {
      q: "How does the Expert Assisted (e-CA) filing service work?",
      a: "Once you opt for e-CA filing, a dedicated Chartered Accountant is assigned to your case. You upload your documents securely, and the CA calculates all eligible deductions, prepares your ITR-1/2/3/4, shares the computation draft for your approval, and files it directly with the Income Tax Department with zero error guarantee.",
    },
    {
      q: "What happens if I receive an Income Tax Notice under Section 143(1) or 139(9)?",
      a: "Do not panic. Section 143(1) is usually an intimation of tax calculation or demand discrepancy, while Section 139(9) indicates a defective return. Our Tax Notice Assistance team reviews the notice DIN, prepares a rectified calculation or revised return, and submits an official legal response on the ITD portal.",
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. HERO SECTION (Aligned with Capture.PNG with Elevated Tech Aesthetics) */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#F4FBF7] via-[#EBF7F0] to-[#E5F5EC] border border-emerald-200/80 shadow-sm p-6 sm:p-10 lg:p-12">
        
        {/* Abstract Tech Illustration / Blueprint Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="hero-tech-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.15" />
                <circle cx="32" cy="0" r="1.5" fill="#10B981" fillOpacity="0.25" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-tech-grid)" />
          </svg>
        </div>

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Pill, Heading & 4 Trust Badges */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Tag / Category Badge with Live Pulse */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E5F7ED] border border-emerald-300/80 text-[#1B804B] text-xs font-bold tracking-wide shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#1B804B] animate-pulse"></span>
                <span>{pageContent.homeHero.badgeText || 'Income Tax e-Filing • AY 2025-26 Live'}</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black tracking-tight text-slate-900 leading-[1.16] font-['Plus_Jakarta_Sans',sans-serif]">
              {pageContent.homeHero.mainHeadingLine1} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#15803d] via-[#16a34a] to-[#0d9488]">
                {pageContent.homeHero.mainHeadingHighlight}
              </span>
            </h1>

            {/* 4 Trust Badges Grid (2x2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100 shadow-2xs">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 leading-tight">
                    {pageContent.homeHero.ratingText}
                  </div>
                  <div className="text-[11px] text-slate-500">From 50,000+ reviews</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                  <Users className="w-5 h-5 text-[#16a34a]" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 leading-tight">
                    {pageContent.homeHero.trustedUsersCount}
                  </div>
                  <div className="text-[11px] text-slate-500">Trusted Happy Users</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 leading-tight">Authorized by ITD</div>
                  <div className="text-[11px] text-slate-500">Income Tax Dept e-Return</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 shadow-2xs">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 leading-tight">Fast & Secure</div>
                  <div className="text-[11px] text-slate-500">256-Bit SSL Bank-Grade</div>
                </div>
              </div>
            </div>

            {/* Social Proof Bar with Real Taxpayer Photography */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex -space-x-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Verified Indian Taxpayer" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" 
                  alt="Verified Indian Taxpayer" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" 
                  alt="Certified CA Partner" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" 
                  alt="Verified Indian Taxpayer" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs text-slate-700">
                <span className="font-extrabold text-slate-900">2,50,000+ returns filed</span> with <strong className="text-emerald-700 font-bold">100% CPC approval guarantee</strong>
              </div>
            </div>

          </div>

          {/* Right Column: Two Cards + Live Tech Pipeline Visualizer */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              
              {/* Card 1: Self ITR Filing (Green) */}
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#166534] via-[#15803d] to-[#14532d] text-white p-6 shadow-lg flex flex-col justify-between group hover:shadow-xl transition-all border border-emerald-400/30">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" 
                  alt="Self ITR Filing Workstation" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    {/* White Rounded Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#15803d] flex items-center justify-center shadow-md">
                      <Laptop className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-extrabold tracking-wider uppercase text-emerald-100 border border-white/20">
                      OCR Driven
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                    Self ITR Filing
                  </h3>

                  <p className="text-white/95 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    Upload Form 16 PDF, auto-populate all schedules, and e-file in under 4 minutes with maximum refund.
                  </p>
                </div>

                <div className="relative z-10">
                  <button
                    type="button"
                    onClick={onStartFiling}
                    className="w-full sm:w-auto px-6 py-3 bg-white text-[#15803d] font-black text-sm rounded-full inline-flex items-center justify-center gap-2 shadow-md hover:bg-emerald-50 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>File ITR Now</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Card 2: Talk to Tax Expert (Blue) */}
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#1e40af] via-[#2563eb] to-[#1d4ed8] text-white p-6 shadow-lg flex flex-col justify-between group hover:shadow-xl transition-all border border-blue-400/30">
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80" 
                  alt="Chartered Accountant Consultation" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    {/* White Rounded Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#2563eb] flex items-center justify-center shadow-md">
                      <Headphones className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-extrabold tracking-wider uppercase text-blue-100 border border-white/20">
                      1-on-1 CA
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                    Talk to Tax Expert
                  </h3>

                  <p className="text-white/95 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    Get your ITR prepared and filed by a senior Chartered Accountant with notice defense coverage.
                  </p>
                </div>

                <div className="relative z-10">
                  <button
                    type="button"
                    onClick={() => setExpertModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-white text-[#1d4ed8] font-black text-sm rounded-full inline-flex items-center justify-center gap-2 shadow-md hover:bg-blue-50 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Book eCA Now</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>

            {/* Abstract Tech Pipeline / Live Verification Showcase Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#15803d] flex items-center justify-center shrink-0 border border-emerald-200">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>CBDT e-Filing 2.0 Direct Pipeline</span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
                      LIVE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>PDF OCR</span>
                    <span>→</span>
                    <span>AIS / 26AS Match</span>
                    <span>→</span>
                    <span>S.87A Rebate</span>
                    <span>→</span>
                    <span className="text-emerald-700 font-semibold">ITR-V Ack</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>0% Defect Risk</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* NEW: DEDICATED TAX PLATFORM HUB - Products, 22+ Tools, Services & Guides */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full-Stack Compliance Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Our <span className="text-[#15803d]">Products, 22+ Tools & Services</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a category to view specialized software, calculators, guides, and corporate solutions.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {[
              { id: 'products', label: '11 Products', icon: Sparkles },
              { id: 'tools', label: '22+ Tax Tools', icon: Scale },
              { id: 'individuals', label: 'For Individuals', icon: User },
              { id: 'businesses', label: 'For Businesses', icon: Briefcase },
              { id: 'guides', label: '13 Tax Guides', icon: FileText },
              { id: 'quick_links', label: 'Quick Links', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isCurrent = activeHubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveHubTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Products (11 Products) */}
        {activeHubTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
            {[
              { name: 'File Income Tax Return', desc: '4-minute paperless e-Filing with instant CPC acknowledgment.', action: () => onStartFiling(), badge: 'Popular' },
              { name: 'Upload Form 16', desc: 'Drag-and-drop OCR auto-population of salary, 80C & TDS.', action: () => onStartFiling(), badge: 'Fastest' },
              { name: 'CA Assisted ITR Filing', desc: 'Dedicated Chartered Accountant consultation and review.', action: () => onNavigateTab ? onNavigateTab('products') : setExpertModalOpen(true), badge: 'Expert' },
              { name: 'Tax Planning Optimiser', desc: 'Compare Old vs New Tax Regime with breakeven investment insights.', action: () => onOpenCalculator(), badge: 'Free' },
              { name: 'NRI Taxes & ITR Filing', desc: 'Cross-border foreign asset declarations & DTAA tax relief.', action: () => onNavigateTab ? onNavigateTab('products') : null, badge: 'Cross-Border' },
              { name: 'Tax Advisory Services', desc: 'Strategic advisory for HNIs, doctors, ESOP holders, and founders.', action: () => onNavigateTab ? onNavigateTab('products') : null, badge: 'Advisory' },
              { name: 'Capital Gain Tax Filing', desc: 'Stocks, mutual funds, crypto, real estate with 12.5% LTCG.', action: () => onNavigateTab ? onNavigateTab('products') : null, badge: 'Budget 2024' },
              { name: 'Income Tax Notices', desc: 'Resolution for Section 143(1), 139(9), and 148 notices.', action: () => setNoticeModalOpen(true), badge: 'Notice Help' },
              { name: 'HUF Registration', desc: 'Unlock an additional ₹3 Lakh basic tax exemption with HUF entity.', action: () => onNavigateTab ? onNavigateTab('products') : null, badge: 'Tax Shield' },
              { name: 'GST Services Suite', desc: 'New registration with ARN within 3 days and monthly filings.', action: () => setGstModalOpen(true), badge: 'Business' },
              { name: 'TDS Solution', desc: 'Quarterly 24Q, 26Q withholding tax filing and Form 16 issuance.', action: () => onNavigateTab ? onNavigateTab('products') : null, badge: 'Corporate' },
            ].map((prod, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {prod.name}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {prod.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{prod.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={prod.action}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Solution</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: 22+ Tax Tools & Calculators */}
        {activeHubTab === 'tools' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-600">
                22 Statutory Tools & Generators for AY 2025-26:
              </span>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('tax_tools')}
                  className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Tax Tools Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                'Income Tax Calculator', 'Form 12BB Generator', 'Rent Receipt Generator', 'HRA Calculator',
                'Tax Refund Status', 'Gratuity Calculator', 'Section 234F Late Fee', 'House Property Calculator',
                'TDS Calculator', 'Transport Allowance', 'Tax Saving Calculator', 'Old vs New Tax Slabs',
                'NSC Calculator', 'Simple Interest Calculator', 'SSY Calculator', 'ITR Eligibility Checker',
                'Leave Encashment', 'Cryptocurrency Tax', '80D Medical Calculator', '80TTA Interest',
                '80DD Disability Calc', 'Compound Interest'
              ].map((tool, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateTab ? onNavigateTab('tax_tools') : onOpenCalculator()}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 block truncate">
                    {tool}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-700 block mt-0.5">
                    Interactive Calculator →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Services for Individuals */}
        {activeHubTab === 'individuals' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
            {[
              { title: 'Income Tax Returns Filing', desc: 'ITR-1, 2, 4 with standard deduction and automated AIS match.', fee: 'Free / ₹499' },
              { title: 'TDS Returns Filing (194-IB / IA)', desc: 'High-value rent and property purchase TDS withholding filing.', fee: '₹799' },
              { title: 'Tax Planning & Saving', desc: 'Salary restructuring and Section 80C / NPS investment roadmap.', fee: '₹1,199' },
              { title: 'Digital Signature Certificate (DSC)', desc: 'Paperless Class 3 Individual DSC with 2-year USB crypto token.', fee: '₹1,499' },
              { title: 'PAN Card Services', desc: 'Instant paperless e-PAN, reprint, or name/DOB correction.', fee: '₹299' },
            ].map((srv, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-900">{srv.title}</span>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0 ml-1">
                      {srv.fee}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{srv.desc}</p>
                </div>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('services_individuals') : onStartFiling()}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Services for Businesses */}
        {activeHubTab === 'businesses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            {[
              { title: 'GST Registration', desc: 'ARN tracking within 2-4 business days.', fee: '₹999' },
              { title: 'Corporate ITR Filing', desc: 'ITR-3, 5, 6 with balance sheet preparation.', fee: 'From ₹2,499' },
              { title: 'GST Returns Filing', desc: 'Monthly GSTR-1 & 3B with 2B reconciliation.', fee: '₹499/mo' },
              { title: 'Corporate TDS Returns', desc: 'Form 24Q and 26Q quarterly compliance.', fee: '₹899/qtr' },
              { title: 'Corporate Tax Planning', desc: 'Depreciation and business expense structuring.', fee: 'Advisory' },
              { title: 'Class 3 Org DSC', desc: 'Signing certificate for MCA & e-Tenders.', fee: '₹1,999' },
              { title: 'Company PAN & TAN', desc: 'New company PAN and TAN registration.', fee: '₹499' },
              { title: 'Company Registration', desc: 'Pvt Ltd, LLP, OPC incorporation with SPICe+.', fee: 'From ₹5,999' },
            ].map((bs, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-900">{bs.title}</span>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded shrink-0">
                      {bs.fee}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">{bs.desc}</p>
                </div>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('services_businesses') : setGstModalOpen(true)}
                  className="mt-2 text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Inquire Now →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: 13 Tax Guides */}
        {activeHubTab === 'guides' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-600">
                13 Income Tax Guides by Chartered Accountants:
              </span>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('tax_guides')}
                  className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Guides Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                'Income Tax Return', 'Deductions (80C, 80D)', 'Form 16 Explained', 'Rent Receipt Rules',
                'House Property Tax', 'How to Link Aadhaar with PAN', 'Income Tax Slab Rate FY 2025-26',
                'PAN Card Services', 'Aadhaar Tax Integration', 'TDS & Form 26AS', 'Capital Gains Income',
                'e-Verify Income Tax Return', 'Revised Return & ITR-U'
              ].map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateTab ? onNavigateTab('tax_guides') : null}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800">{g}</span>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Quick Links */}
        {activeHubTab === 'quick_links' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-in fade-in duration-200">
            {[
              { name: 'About Us', tab: 'about', desc: 'Our mission & security standards' },
              { name: 'Contact Helpdesk', tab: 'contact', desc: 'Direct helpline & office addresses' },
              { name: 'Transparent Pricing', tab: 'pricing', desc: 'Zero hidden fees plans' },
              { name: 'FAQ', tab: 'faq', desc: 'Common queries on filing & refunds' },
              { name: 'Tax Glossary', tab: 'glossary', desc: 'A - Z Indian tax terminology' }
            ].map((link, idx) => (
              <button
                key={idx}
                onClick={() => onNavigateTab ? onNavigateTab(link.tab) : null}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all cursor-pointer group"
              >
                <span className="text-xs font-black text-slate-900 group-hover:text-emerald-800 block mb-1">
                  {link.name}
                </span>
                <span className="text-[11px] text-slate-500 block leading-tight">{link.desc}</span>
                <span className="text-[10px] font-bold text-emerald-700 block mt-2 group-hover:translate-x-0.5 transition-transform">
                  Open Page →
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 2. HOW IT WORKS: JUST 5 SIMPLE STEPS (Directly from Capture.PNG) */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-[#E5F7ED] text-[#1B804B] text-xs font-bold mb-2">
              How it works
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              File Your ITR with Tax Return PRO in <span className="text-[#15803d]">Just 5 Simple Steps</span>
            </h2>
          </div>
          
          <button
            type="button"
            onClick={onStartFiling}
            className="self-start md:self-auto px-6 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white font-extrabold text-xs rounded-full inline-flex items-center gap-1.5 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <span>File Now</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 5 Steps Grid with Photography Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Step 1 */}
          <div className="bg-[#F8FAFC] hover:bg-[#F0FDF4] rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all group flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xs">
            <div className="relative h-28 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80" 
                alt="Upload Form 16 PDF" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
              <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white text-[#15803d] text-xs font-black flex items-center justify-center shadow-xs">
                01
              </span>
              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-slate-950 font-mono">
                OCR Scanner
              </span>
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-800 transition-colors">
                  Upload Form 16 / Add Details
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upload your Form 16 PDF or enter basic income to auto-populate all schedules in 15 seconds.
                </p>
              </div>
              <div className="pt-2 flex items-center text-[10px] font-semibold text-emerald-700">
                <span>Auto-prefills salary</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#F8FAFC] hover:bg-[#F0FDF4] rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all group flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xs">
            <div className="relative h-28 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" 
                alt="Dual Regime Tax Engine" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
              <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white text-[#15803d] text-xs font-black flex items-center justify-center shadow-xs">
                02
              </span>
              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-teal-400 text-slate-950 font-mono">
                AI Dual Slabs
              </span>
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-800 transition-colors">
                  Auto-Compute & Compare
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Calculates Old vs New Tax Regime side-by-side to highlight your maximum refund.
                </p>
              </div>
              <div className="pt-2 flex items-center text-[10px] font-semibold text-teal-700">
                <span>Budget 2024 rules</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#F8FAFC] hover:bg-[#F0FDF4] rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all group flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xs">
            <div className="relative h-28 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80" 
                alt="Maximize Deductions" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
              <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white text-[#15803d] text-xs font-black flex items-center justify-center shadow-xs">
                03
              </span>
              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-slate-950 font-mono">
                80C • 80D • 87A
              </span>
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-800 transition-colors">
                  Maximize Deductions
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Claim 80C, 80D, HRA, home loan interest, and 87A rebate for ₹0 tax up to ₹7.75 Lakhs.
                </p>
              </div>
              <div className="pt-2 flex items-center text-[10px] font-semibold text-amber-700">
                <span>Zero tax eligibility</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#F8FAFC] hover:bg-[#F0FDF4] rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all group flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xs">
            <div className="relative h-28 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" 
                alt="Expert CA Audit" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
              <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white text-[#15803d] text-xs font-black flex items-center justify-center shadow-xs">
                04
              </span>
              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-400 text-slate-950 font-mono">
                ICAI Audit
              </span>
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-800 transition-colors">
                  Expert CA Review
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Certified Chartered Accountants audit your schedules to ensure 100% statutory compliance.
                </p>
              </div>
              <div className="pt-2 flex items-center text-[10px] font-semibold text-indigo-700">
                <span>Zero notice guarantee</span>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-[#F8FAFC] hover:bg-[#F0FDF4] rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all group flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xs">
            <div className="relative h-28 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" 
                alt="Direct e-Filing and Instant ITR-V" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
              <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white text-[#15803d] text-xs font-black flex items-center justify-center shadow-xs">
                05
              </span>
              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-400 text-slate-950 font-mono">
                Instant ITR-V
              </span>
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-800 transition-colors">
                  e-File & Instant ITR-V
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Direct submission to CBDT servers with instant downloadable acknowledgment and e-verification.
                </p>
              </div>
              <div className="pt-2 flex items-center text-[10px] font-semibold text-blue-700">
                <span>Official DIN issued</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2.1 NEXT-GEN TAX ENGINE ARCHITECTURE SHOWCASE */}
      <section className="bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden space-y-10">
        
        {/* Subtle Tech Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="arch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.3" />
                <circle cx="40" cy="40" r="1.5" fill="#34d399" fillOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#arch-grid)" />
          </svg>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Intelligent Tax Technology Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              Engineered for Speed, Precision & Zero Notices
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Experience the technology that powers millions of compliant filings: proprietary Form 16 OCR, dual-regime tax optimization, and direct cryptographic CBDT handshakes.
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-3">
            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ISO 27001 Certified Infrastructure</span>
            </div>
          </div>
        </div>

        {/* 3 Visual Storytelling Pillars */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Pillar 1: Form 16 OCR & Multi-Source Sync */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all group shadow-md">
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80" 
                alt="Form 16 Optical Extraction and AIS Multi-Source Sync" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              
              {/* Floating Tech Badges */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <Scan className="w-3 h-3" />
                <span>PDF OCR 2.0 • 15 Seconds</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-mono">
                <span className="text-emerald-400 font-bold">Part A + Part B Auto-Parsed</span>
                <span className="text-slate-400">99.8% Precision</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  1. Optical Form 16 & AIS Ingestion
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Drop your employer Form 16 PDF or scan. Our proprietary parser extracts salary breakup, allowances under Section 10, employer TAN, and cross-reconciles with NSDL 26AS & AIS tax credits instantly.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> AIS / TIS Data Matching</span>
                  <span className="font-mono text-[10px] text-emerald-400">Automated</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Employer TAN Validation</span>
                  <span className="font-mono text-[10px] text-emerald-400">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Dual-Regime Optimization Engine */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all group shadow-md">
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
                alt="Dual Regime Tax Optimization and Budget 2024 Slabs" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              
              {/* Floating Tech Badges */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <Scale className="w-3 h-3" />
                <span>Budget 2024 Calibrated</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-mono">
                <span className="text-teal-300 font-bold">New (115BAC) vs Old</span>
                <span className="text-emerald-400 font-bold">Max Savings</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                  2. Dual-Regime Comparison Algorithm
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time mathematical simulator evaluates all permutations of 80C, 80D, HRA, home loan interest, and standard deductions (₹75,000 for New vs ₹50,000 for Old) to guarantee your minimum statutory liability.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" /> Section 87A Rebate Auto-Apply</span>
                  <span className="font-mono text-[10px] text-teal-300">₹0 Tax up to ₹7L</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" /> Surcharge & Cess Precision</span>
                  <span className="font-mono text-[10px] text-teal-300">4% HEC Exact</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Bank-Grade 256-Bit Security & Direct CPC Submission */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all group shadow-md">
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80" 
                alt="Bank Grade 256-Bit Cryptography and Direct CPC Handshake" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              
              {/* Floating Tech Badges */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>256-Bit AES Vault</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-mono">
                <span className="text-blue-300 font-bold">Direct CPC Bengaluru API</span>
                <span className="text-emerald-400 font-bold">Instant ITR-V</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  3. Encrypted Direct CBDT Handshake
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your return payload is packaged with SHA-256 digital integrity, encrypted at rest and in transit, and transmitted directly to the Income Tax Department's Central Processing Centre for instant acknowledgment.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> Zero Data Selling Guarantee</span>
                  <span className="font-mono text-[10px] text-blue-300">Strict Privacy</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> Instant DIN & Ack Number</span>
                  <span className="font-mono text-[10px] text-blue-300">Real-Time</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* DYNAMIC COUNTER SECTION SHOWING TOTAL FILINGS PROCESSED */}
      <section className="bg-linear-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold">
              <span className={`w-2.5 h-2.5 rounded-full bg-emerald-400 ${counterPulse ? 'scale-150 ring-4 ring-emerald-400/40' : ''} transition-all duration-300 animate-pulse`}></span>
              <span>LIVE TAX FILINGS COUNTER • AY 2025-26</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Real-Time Platform Processing Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Live automated telemetry showing taxpayers filing returns, claiming refunds, and securing acknowledgments across India right now.
            </p>
          </div>

          {/* Controls to toggle live feed stream */}
          <div className="flex items-center space-x-3 self-start md:self-auto">
            <div className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 border bg-emerald-950/80 text-emerald-300 border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Dynamic Activity Sync</span>
            </div>
          </div>
        </div>

        {/* 4 Live Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* 1. Dynamic Live Counter for Total Filings Processed */}
          <div className="relative bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileCheck2 className="w-16 h-16 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Filings Processed</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  Live Counter
                </span>
              </div>
              <div className="flex items-baseline space-x-2 my-2">
                <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight transition-all duration-300 ${
                  counterPulse ? 'text-emerald-300 scale-[1.03]' : 'text-white'
                }`}>
                  {totalFilings.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
              <span>{totalFilings > 0 ? '+1 per user submission' : 'Starts at 0 • Live updates'}</span>
              <span className="text-slate-400">AY 2025-26</span>
            </div>
          </div>

          {/* 2. Total Tax Refunds Processed */}
          <div className="relative bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <CreditCard className="w-16 h-16 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tax Refunds Disbursed</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                  Direct Bank ECS
                </span>
              </div>
              <div className="flex items-baseline space-x-2 my-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-teal-400 tracking-tight">
                  ₹{platformMetrics.refundClaimedCrores} Cr
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>{totalFilings > 0 ? 'Accumulated user refunds' : 'Dynamic calculation from ITRs'}</span>
              <span className="text-emerald-400 font-semibold">100% Pre-Validated</span>
            </div>
          </div>

          {/* 3. Average e-Filing Turnaround Time */}
          <div className="relative bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-16 h-16 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg. Filing Time</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                  Form 16 OCR
                </span>
              </div>
              <div className="flex items-baseline space-x-2 my-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-amber-300 tracking-tight">
                  {platformMetrics.avgProcessingMinutes} Mins
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Instant prefill from AIS/TIS</span>
              <span className="text-amber-300 font-semibold">Zero Paperwork</span>
            </div>
          </div>

          {/* 4. CPC Acceptance Rate */}
          <div className="relative bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-16 h-16 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CPC Acceptance Rate</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                  ITD Verified
                </span>
              </div>
              <div className="flex items-baseline space-x-2 my-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-blue-400 tracking-tight">
                  {platformMetrics.cpcAcceptanceRate}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>First-time filing approval</span>
              <span className="text-blue-300 font-semibold">Zero Defect Risk</span>
            </div>
          </div>

        </div>

        {/* Live Submissions Activity Stream Ticker */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md font-bold text-[10px] uppercase tracking-wider shrink-0">
              Recent Activity
            </span>
            <div className="flex items-center space-x-2 text-slate-300 overflow-hidden">
              <span className="font-semibold text-white">{recentFilings[0].user}</span>
              <span>from <strong className="text-emerald-400">{recentFilings[0].city}</strong></span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono">{recentFilings[0].type}</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 font-bold">Refund: {recentFilings[0].refund}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-400 shrink-0">
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CPC Bengaluru Acknowledged</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {recentFilings[0].time}
            </span>
          </div>
        </div>
      </section>

      {/* Live Income Tax Filings Detailed Platform Count Section */}
      <FilingStatisticsSection />

      {/* 2. CORE SERVICES SECTION (GRID LAYOUT) */}
      <section id="core-services-section" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Core Tax & Financial Solutions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Comprehensive Tax Filing & Compliance Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Whether you are a salaried professional, active stock trader, NRI, or business owner, we have the specialized expertise to file your taxes seamlessly.
          </p>
        </div>

        {/* 5 Core Services Grid Layout (as explicitly requested by user) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. DIY ITR Filing */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group">
            <div className="relative h-40 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80" 
                alt="Self Service ITR e-Filing" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded-full shadow-sm">
                Self-Service • 4 Mins
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">DIY ITR Filing</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">Instant</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    File your income tax returns independently in under 4 minutes. Seamlessly upload your Form 16 PDF, auto-populate salary data, claim all eligible 80C/80D deductions, and generate your ITR-V instantly.
                  </p>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instant Form 16 PDF OCR data extraction</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Automatic Section 87A rebate calculation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Direct e-filing & ITR-V acknowledgement</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onStartFiling}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>File on Your Own</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Expert Assisted Filing (e-CA) */}
          <div className="bg-white rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-md relative flex flex-col justify-between group">
            <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-sm">
              Most Popular
            </div>
            <div className="relative h-40 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
                alt="Chartered Accountant Consultation" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] font-bold bg-teal-400 text-slate-950 rounded-full shadow-sm">
                Certified CA • 1-on-1 Review
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Expert Assisted Filing (e-CA)</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-full">Guaranteed</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hire a dedicated Chartered Accountant for complete peace of mind. A personal CA reviews your financial records, optimizes tax deductions, verifies TDS reconciliation, and files your return with zero error liability.
                  </p>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>1-on-1 consultation with a licensed CA</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Maximum refund verification & tax optimization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Free post-filing inquiry support</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setExpertModalOpen(true)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hire a Personal e-CA</span>
              </button>
            </div>
          </div>

          {/* 3. Capital Gains & Trading */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group">
            <div className="relative h-40 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80" 
                alt="Stock Trading and Capital Gains" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] font-bold bg-blue-400 text-slate-950 rounded-full shadow-sm">
                F&O • Equities • Crypto
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Capital Gains & Trading</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">F&O / Stocks</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tailored filing for equity investors, futures & options (F&O) traders, mutual funds, and crypto assets. Accurately report STCG (20%), LTCG (12.5% under Budget 2024), intraday business income, and carry forward trading losses.
                  </p>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Supports Zerodha, Groww, AngelOne, Upstox</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>F&O turnover & loss carry-forward computation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Schedule CG & Schedule 112A automation</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setExpertForm(prev => ({ ...prev, service: 'capital_gains' }));
                  setExpertModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>File Trading Taxes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Tax Notice Assistance */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group">
            <div className="relative h-40 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80" 
                alt="Income Tax Notice Legal Help" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-full shadow-sm">
                143(1) • 139(9) • Litigation
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Tax Notice Assistance</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">Legal Support</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Received an intimation or demand notice from the Income Tax Department? Our litigation specialists and chartered accountants review your notice DIN, prepare factual rectifications, and file official legal responses.
                  </p>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Section 143(1) tax mismatch resolution</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Section 139(9) defective return response</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Section 148 scrutiny & high-value queries</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setNoticeModalOpen(true)}
                className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Get Notice Assistance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 5. GST & Business Services */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group">
            <div className="relative h-44 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
                alt="Corporate Business and GST Filing" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] font-bold bg-purple-400 text-slate-950 rounded-full shadow-sm">
                GSTIN • MSME • Corporate Suite
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">GST & Corporate Solutions</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-full">
                      Business Suite
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    End-to-end commercial tax and regulatory registration for sole proprietorships, partnerships, LLPs, and companies. GSTR-1, GSTR-3B return filing, ITC reconciliation, and MSME Udyam certifications.
                  </p>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Fast 3-day GSTIN registration & verification</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Monthly GSTR-1 & GSTR-3B filing with 2B ITC match</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>MSME Udyam & Municipal trade permissions</span>
                  </li>
                </ul>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setGstModalOpen(true)}
                  className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Apply for GST</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExpertForm(prev => ({ ...prev, service: 'business' }));
                    setExpertModalOpen(true);
                  }}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Consult CA
                </button>
              </div>
            </div>
          </div>

          {/* 6. NRI & International Taxation Desk */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group">
            <div className="relative h-44 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80" 
                alt="NRI International Taxation and Foreign Asset Reporting" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] font-bold bg-emerald-400 text-slate-950 rounded-full shadow-sm">
                DTAA • Foreign Assets • Schedule FA
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">NRI & Global Taxation</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                      Cross-Border
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Specialized tax desk for Non-Resident Indians (NRIs), OCIs, and Indian residents holding foreign stock options (ESOPs/RSUs). Claim relief under Double Tax Avoidance Agreements (DTAA Section 90/91).
                  </p>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>DTAA Form 10F and Tax Residency Certificate (TRC)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Schedule FA (Foreign Assets) and foreign bank accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>NRE / NRO interest and property sale TDS 195</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setExpertForm(prev => ({ ...prev, service: 'nri', notes: 'NRI Cross-border tax filing inquiry' }));
                  setExpertModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Consult NRI Tax Specialist</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE TAX TOOLS & CALCULATORS SECTION */}
      <section id="tax-calculators-section" className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
              <Calculator className="w-3 h-3 text-emerald-700" />
              <span>Free Financial Planning Tools</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Interactive Tax Calculators (AY 2025-26)
            </h2>
            <p className="text-xs text-slate-500 max-w-xl">
              Compare your exact tax liability under the Old vs. New Regime and calculate your exact HRA tax exemption under Section 10(13A).
            </p>
          </div>

          {/* Tab Switcher Buttons */}
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveCalcTab('regime')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCalcTab === 'regime'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Old vs. New Regime
            </button>
            <button
              type="button"
              onClick={() => setActiveCalcTab('hra')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCalcTab === 'hra'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HRA Exemption Calculator
            </button>
            <button
              type="button"
              onClick={() => setActiveCalcTab('slabs')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCalcTab === 'slabs'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tax Slabs AY 2025-26
            </button>
          </div>
        </div>

        {/* Computational Engine Banner with Tech Blueprint Visual */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=300&q=80" 
                alt="Tax Computation Engine" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">Budget 2024–2025 Calibrated</span>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded">v4.2 Engine</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Standard Deduction upgraded to ₹75,000 for New Regime. Sec 87A ₹25,000 full rebate up to ₹7,00,000 taxable income.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-[11px] font-semibold text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Mathematical Accuracy
            </span>
          </div>
        </div>

        {/* TAB 1: OLD VS NEW REGIME CALCULATOR */}
        {activeCalcTab === 'regime' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            
            {/* Inputs Panel */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Income & Deduction Parameters
                </span>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Salaried Individual
                </span>
              </div>

              {/* Gross Annual Income */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="gross-salary-input">Gross Annual Salary / Income</label>
                  <span className="font-mono font-bold text-slate-900">₹{grossSalary.toLocaleString('en-IN')}</span>
                </div>
                <input
                  id="gross-salary-input"
                  type="range"
                  min={300000}
                  max={3000000}
                  step={25000}
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹3 Lakh</span>
                  <span>₹15 Lakh</span>
                  <span>₹30 Lakh</span>
                </div>
              </div>

              {/* Deductions Inputs (Used for Old Regime) */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Chapter VI-A Deductions (Old Regime Only)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Section 80C (PPF, ELSS, EPF)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        max={150000}
                        value={deduction80C}
                        onChange={(e) => setDeduction80C(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 focus:outline-emerald-500"
                        placeholder="Max 1,50,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Section 80D (Health Insurance)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        max={50000}
                        value={deduction80D}
                        onChange={(e) => setDeduction80D(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 focus:outline-emerald-500"
                        placeholder="Max 50,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Home Loan Interest (Sec 24)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        max={200000}
                        value={homeLoanInterest}
                        onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 focus:outline-emerald-500"
                        placeholder="Max 2,00,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      NPS Additional (80CCD 1B)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        max={50000}
                        value={nps80CCD}
                        onChange={(e) => setNps80CCD(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 focus:outline-emerald-500"
                        placeholder="Max 50,000"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Comparison Results Card */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Recommendation Banner */}
              <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                    Smart Recommendation
                  </span>
                  <h3 className="text-base font-extrabold font-['Plus_Jakarta_Sans',sans-serif]">
                    {recommendedRegime === 'New' 
                      ? `New Regime saves you ₹${diffAmount.toLocaleString('en-IN')}` 
                      : `Old Regime saves you ₹${diffAmount.toLocaleString('en-IN')}`}
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    {recommendedRegime === 'New' 
                      ? 'Lower slab rates and enhanced ₹75,000 standard deduction make this optimal.'
                      : 'Your high Chapter VI-A investments overcome the higher tax slab rates.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartFiling}
                  className="px-3.5 py-2 bg-white text-slate-900 hover:bg-emerald-50 text-xs font-extrabold rounded-xl shadow-xs transition-transform hover:scale-103 cursor-pointer shrink-0"
                >
                  File with {recommendedRegime}
                </button>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* New Regime Card */}
                <div className={`bg-white rounded-2xl p-5 border-2 ${recommendedRegime === 'New' ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200'} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">New Regime (Default)</span>
                    {recommendedRegime === 'New' && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-b border-slate-100 pb-3">
                    <div className="flex justify-between">
                      <span>Gross Income:</span>
                      <span className="font-mono font-semibold">₹{grossSalary.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Standard Deduction:</span>
                      <span className="font-mono font-semibold">-₹{newRegimeData.stdDeduction.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                      <span>Taxable Income:</span>
                      <span className="font-mono">₹{newRegimeData.taxable.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Tax Liability (Inc. Cess)</span>
                    <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                      ₹{newRegimeData.totalTax.toLocaleString('en-IN')}
                    </p>
                    {newRegimeData.totalTax === 0 && (
                      <span className="text-[10px] text-emerald-600 font-bold">100% Tax Rebate under Sec 87A</span>
                    )}
                  </div>
                </div>

                {/* Old Regime Card */}
                <div className={`bg-white rounded-2xl p-5 border-2 ${recommendedRegime === 'Old' ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200'} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Old Tax Regime</span>
                    {recommendedRegime === 'Old' && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-b border-slate-100 pb-3">
                    <div className="flex justify-between">
                      <span>Gross Income:</span>
                      <span className="font-mono font-semibold">₹{grossSalary.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Total Deductions:</span>
                      <span className="font-mono font-semibold">-₹{oldRegimeData.totalDeductions.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                      <span>Taxable Income:</span>
                      <span className="font-mono">₹{oldRegimeData.taxable.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Tax Liability (Inc. Cess)</span>
                    <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                      ₹{oldRegimeData.totalTax.toLocaleString('en-IN')}
                    </p>
                    {oldRegimeData.totalTax === 0 && (
                      <span className="text-[10px] text-emerald-600 font-bold">100% Tax Rebate under Sec 87A</span>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: HRA EXEMPTION CALCULATOR */}
        {activeCalcTab === 'hra' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            
            {/* HRA Inputs Form */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Salary & Rent Payment Details
                </span>
                <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
                  Section 10(13A)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Basic Salary (Annual)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                    <input
                      type="number"
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Dearness Allowance / DA (Annual)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                    <input
                      type="number"
                      value={daAmount}
                      onChange={(e) => setDaAmount(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 focus:outline-emerald-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    HRA Received from Employer (Annual)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                    <input
                      type="number"
                      value={hraReceived}
                      onChange={(e) => setHraReceived(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Actual Rent Paid per Month
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 focus:outline-emerald-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    Annual Rent: ₹{(monthlyRent * 12).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* City Selection */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Rental City Category
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMetroCity(true)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isMetroCity 
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs block">Metro City (50%)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Delhi, Mumbai, Kolkata, Chennai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMetroCity(false)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      !isMetroCity 
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs block">Non-Metro City (40%)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Bengaluru, Pune, Hyderabad, etc.</span>
                  </button>
                </div>
              </div>

            </div>

            {/* HRA Results & Calculation Breakdown */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    HRA Exemption Result
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    Tax Saved: ~₹{estimatedHraTaxSavings.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Primary Numbers Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                      Tax-Exempt HRA Amount
                    </span>
                    <p className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                      ₹{Math.round(exemptHra).toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-emerald-600">Deducted from taxable salary</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                      Taxable HRA Balance
                    </span>
                    <p className="text-2xl font-black text-slate-800 font-mono mt-0.5">
                      ₹{Math.round(taxableHra).toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-slate-500">Subject to income tax</span>
                  </div>
                </div>

                {/* Statutory 3-Rule Section 10(13A) Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Statutory Rule (Section 10(13A) Minimum of 3 criteria):
                  </span>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className={`p-2 rounded-lg flex items-center justify-between ${exemptHra === hraCondition1 ? 'bg-emerald-100/70 font-bold text-emerald-900' : 'bg-slate-50'}`}>
                      <span>1. Actual HRA Received:</span>
                      <span className="font-mono">₹{hraCondition1.toLocaleString('en-IN')}</span>
                    </div>

                    <div className={`p-2 rounded-lg flex items-center justify-between ${exemptHra === hraCondition2 ? 'bg-emerald-100/70 font-bold text-emerald-900' : 'bg-slate-50'}`}>
                      <span>2. {isMetroCity ? '50%' : '40%'} of (Basic + DA):</span>
                      <span className="font-mono">₹{Math.round(hraCondition2).toLocaleString('en-IN')}</span>
                    </div>

                    <div className={`p-2 rounded-lg flex items-center justify-between ${exemptHra === hraCondition3 ? 'bg-emerald-100/70 font-bold text-emerald-900' : 'bg-slate-50'}`}>
                      <span>3. Rent Paid minus 10% of (Basic + DA):</span>
                      <span className="font-mono">₹{Math.round(hraCondition3).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onStartFiling}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Claim this HRA in Your Return</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: TAX SLABS OVERVIEW AY 2025-26 */}
        {activeCalcTab === 'slabs' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Income Tax Slab Rates for Assessment Year 2025-26 (Finance Act 2024)
              </h3>
              <p className="text-xs text-slate-500">
                New Tax Regime is the default regime for all individual taxpayers. Standard deduction is increased to ₹75,000 for salaried employees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* New Regime Slabs */}
              <div className="border border-emerald-200 rounded-xl overflow-hidden">
                <div className="bg-emerald-600 text-white px-4 py-2.5 font-bold text-xs flex justify-between items-center">
                  <span>New Tax Regime (Default)</span>
                  <span className="text-[10px] bg-emerald-500 px-2 py-0.5 rounded">Budget 2024 Revision</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-3 flex justify-between">
                    <span className="font-semibold text-slate-800">Up to ₹3,00,000</span>
                    <span className="font-mono font-bold text-emerald-700">NIL</span>
                  </div>
                  <div className="p-3 flex justify-between bg-slate-50/50">
                    <span className="font-semibold text-slate-800">₹3,00,001 to ₹7,00,000</span>
                    <span className="font-mono font-bold text-slate-700">5% (Rebate up to ₹7L under 87A)</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-semibold text-slate-800">₹7,00,001 to ₹10,00,000</span>
                    <span className="font-mono font-bold text-slate-700">10%</span>
                  </div>
                  <div className="p-3 flex justify-between bg-slate-50/50">
                    <span className="font-semibold text-slate-800">₹10,00,001 to ₹12,00,000</span>
                    <span className="font-mono font-bold text-slate-700">15%</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-semibold text-slate-800">₹12,00,001 to ₹15,00,000</span>
                    <span className="font-mono font-bold text-slate-700">20%</span>
                  </div>
                  <div className="p-3 flex justify-between bg-slate-50/50">
                    <span className="font-semibold text-slate-800">Above ₹15,00,000</span>
                    <span className="font-mono font-bold text-slate-700">30%</span>
                  </div>
                </div>
              </div>

              {/* Old Regime Slabs */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-4 py-2.5 font-bold text-xs flex justify-between items-center">
                  <span>Old Tax Regime</span>
                  <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">Optional</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-3 flex justify-between">
                    <span className="font-semibold text-slate-800">Up to ₹2,50,000</span>
                    <span className="font-mono font-bold text-emerald-700">NIL</span>
                  </div>
                  <div className="p-3 flex justify-between bg-slate-50/50">
                    <span className="font-semibold text-slate-800">₹2,50,001 to ₹5,00,000</span>
                    <span className="font-mono font-bold text-slate-700">5% (Rebate up to ₹5L under 87A)</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-semibold text-slate-800">₹5,00,001 to ₹10,00,000</span>
                    <span className="font-mono font-bold text-slate-700">20%</span>
                  </div>
                  <div className="p-3 flex justify-between bg-slate-50/50">
                    <span className="font-semibold text-slate-800">Above ₹10,00,000</span>
                    <span className="font-mono font-bold text-slate-700">30%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </section>

      {/* 4. WHY CHOOSE US / TRUST BADGES SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Why Choose TaxReturn Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Engineered for Maximum Security & Compliance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Trusted by salaried professionals, entrepreneurs, and chartered accountants across India for accurate, secure, and stress-free tax filing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Badge 1: 100% Secure */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">100% Secure</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bank-grade 256-bit SSL encryption and strict ISO 27001 data center security ensure that your credentials and tax documents remain impenetrable.
            </p>
          </div>

          {/* Badge 2: Data Privacy Guaranteed */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Data Privacy Guaranteed</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your PAN, Aadhaar, salary slips, and bank statements are strictly confidential. We never sell, monetize, or disclose your financial records to third parties.
            </p>
          </div>

          {/* Badge 3: Expert CA Support */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Expert CA Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Network of 50+ Certified Chartered Accountants on standby to audit complex trading returns, business balance sheets, and defective notice intimations.
            </p>
          </div>

          {/* Badge 4: Refund Guarantee */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Maximum Refund Guarantee</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our algorithmic validation engine tests over 40 deduction sections and exemptions, ensuring you never leave a single rupee of eligible refund behind.
            </p>
          </div>

        </div>
      </section>

      {/* VERIFIED CUSTOMER REVIEWS & TAXPAYER STORIES */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Real Taxpayer Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Trusted by 2,80,000+ Indian Taxpayers Across All States
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Read verified feedback from salaried techies, business entrepreneurs, stock traders, and freelancers who filed with zero stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Review 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                  alt="Ananya Sharma"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ananya Sharma</h4>
                  <p className="text-[11px] text-slate-500">Staff Architect • Bengaluru</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-[11px] font-bold text-slate-700 ml-1">5.0</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Uploaded my Form 16 and in 3 minutes the AI engine discovered ₹18,000 in additional 80CCD NPS deductions my HR missed. Received my refund in 8 days!"
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">ITR-1 Filed</span>
              <span className="font-mono text-slate-500">Refund: ₹42,500</span>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" 
                  alt="Rajesh Agarwal"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Rajesh Agarwal</h4>
                  <p className="text-[11px] text-slate-500">Managing Director • Kolkata</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-[11px] font-bold text-slate-700 ml-1">5.0</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Filing presumptive tax under Section 44AD and our quarterly GST reconciliation used to take weeks. The dedicated e-CA resolved everything flawlessly."
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">ITR-4 & GST</span>
              <span className="font-mono text-slate-500">Zero Audit Defects</span>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80" 
                  alt="Dr. Priya Sen"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dr. Priya Sen</h4>
                  <p className="text-[11px] text-slate-500">Consultant Surgeon • Mumbai</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-[11px] font-bold text-slate-700 ml-1">5.0</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Had multiple clinic consulting receipts plus mutual fund capital gains. Their tax notice assistance also quickly cleared a lingering 143(1) mismatch for me."
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md">ITR-3 & Legal</span>
              <span className="font-mono text-slate-500">Demand Nullified</span>
            </div>
          </div>

          {/* Review 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" 
                  alt="Vikram Malhotra"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Vikram Malhotra</h4>
                  <p className="text-[11px] text-slate-500">Freelance Designer • New Delhi</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-[11px] font-bold text-slate-700 ml-1">5.0</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "As an independent consultant with US clients, the 44ADA 50% presumptive profit rule saved me over ₹1.4 lakh in taxes. Clean interface with no clutter!"
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">ITR-4 Presumptive</span>
              <span className="font-mono text-slate-500">Saved: ₹1,42,000</span>
            </div>
          </div>

        </div>
      </section>

      {/* CERTIFIED CHARTERED ACCOUNTANT NETWORK BANNER & SENIOR ADVISOR SHOWCASE */}
      <section className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative space-y-8 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-800 pb-10">
          <div className="lg:col-span-7 space-y-5 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified ICAI Tax Advisors & Senior Counsel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Backed by 50+ Certified Chartered Accountants & Tax Advocates
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              From complex F&O and crypto capital gains to GST returns and Section 143(1) mismatch resolutions, our senior tax partners audit every line item before submission.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-[11px] text-slate-400">Notice Protection</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">15 Mins</div>
                <div className="text-[11px] text-slate-400">Expert Callback</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">Zero</div>
                <div className="text-[11px] text-slate-400">Hidden Fees</div>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setExpertModalOpen(true)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-full inline-flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Schedule Consultation with Senior CA</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative h-72 lg:h-80 rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1000&q=80" 
              alt="Senior Chartered Accountant Consultation and Tax Advisory" 
              className="w-full h-full object-cover object-top opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <div className="bg-slate-900/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/10 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>The Institute of Chartered Accountants of India</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">ICAI Registered Institutional Partner Network</div>
              </div>
            </div>
          </div>
        </div>

        {/* Senior Advisory Partner Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-center space-x-3.5 hover:border-emerald-500/40 transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
              alt="CA Rajesh K. Singhania"
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">CA Rajesh Singhania, FCA</div>
              <div className="text-[10px] text-emerald-400 font-mono">ICAI #058291 • 19 Yrs</div>
              <div className="text-[10px] text-slate-400 truncate">Senior Direct Tax Partner</div>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-center space-x-3.5 hover:border-emerald-500/40 transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
              alt="CA Sneha Sengupta"
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">CA Sneha Sengupta, ACA</div>
              <div className="text-[10px] text-emerald-400 font-mono">ICAI #084920 • 12 Yrs</div>
              <div className="text-[10px] text-slate-400 truncate">Corporate & M&A Taxation</div>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-center space-x-3.5 hover:border-emerald-500/40 transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" 
              alt="CA Amitav Bose"
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">CA Amitav Bose, FCA</div>
              <div className="text-[10px] text-emerald-400 font-mono">ICAI #042188 • 22 Yrs</div>
              <div className="text-[10px] text-slate-400 truncate">ITAT Counsel & Litigation</div>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-center space-x-3.5 hover:border-emerald-500/40 transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" 
              alt="CA Meera Krishnan"
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">CA Meera Krishnan, ACA</div>
              <div className="text-[10px] text-emerald-400 font-mono">ICAI #091342 • 14 Yrs</div>
              <div className="text-[10px] text-slate-400 truncate">NRI & Foreign Asset Desk</div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Clear answers to common questions about AY 2025-26 returns and e-filing rules.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {faq.q}
                </span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. CONTACT US SECTION */}
      <section id="contact-us-section" className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
        
        {/* Subtle Corporate Headquarters Photography Backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80" 
            alt="Corporate Headquarters Architecture" 
            className="w-full h-full object-cover opacity-10 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/95 to-slate-950/90"></div>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Helplines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                <Headphones className="w-3.5 h-3.5" />
                <span>24/7 Taxpayer Support</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif]">
                Get in Touch with Our Tax Specialists
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have a query regarding your Form 16, pending refund, or ITD notice? Reach out to our dedicated support team via phone, WhatsApp, or official ticket.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Toll-Free Helpline</span>
                  <span className="text-slate-300 font-mono text-sm">1800 103 0025 / 1800 419 0025</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Official Support Email</span>
                  <span className="text-slate-300 font-mono">support@taxreturn-portal.gov.in</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Response guaranteed within 2 business hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Principal Operating Offices</span>
                  <p className="text-slate-300 leading-relaxed">
                    Aayakar Bhawan, P-7 Chowringhee Square, Kolkata - 700069
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Civic Centre, Minto Road, New Delhi - 110002
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Callback & Query Form */}
          <div className="lg:col-span-7 bg-slate-800/90 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif] mb-1">
              Send an Inquiry or Request a Call Back
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Fill out this quick form and an authorized tax advisor will assist you immediately.
            </p>

            {contactSubmitted ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-center space-y-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Inquiry Submitted Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Ticket #TK-2025-9182 has been created. One of our senior chartered accountants will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Mobile Phone (for OTP / Call) *</label>
                    <input
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Topic / Concern</label>
                    <select
                      value={contactForm.topic}
                      onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 cursor-pointer"
                    >
                      <option value="filing_inquiry">ITR Filing & Form 16 Inquiry</option>
                      <option value="expert_ca">Hire Personal Chartered Accountant</option>
                      <option value="capital_gains">Capital Gains & F&O Trading Taxes</option>
                      <option value="notice_support">Income Tax Notice Defense</option>
                      <option value="gst_services">GST & Business Registration</option>
                      <option value="refund_issue">ITR Refund Status Delay</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Describe Your Issue or Query *</label>
                  <textarea
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Provide details about your salary, capital gains, or notice number so we can assign the best expert..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry for Free CA Review</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </section>

      {/* 7. FOOTER SECTION */}
      <footer className="bg-slate-950 text-slate-400 text-xs pt-12 pb-8 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-xl w-full">
        <div className="w-full space-y-10">
          
          {/* Top Footer: Brand & Link Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Column 1: Brand & Bio */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
                  <ShieldCheck className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-['Inter',sans-serif] text-lg font-black tracking-tight">
                  Tax Returns <span className="text-emerald-400">PRO</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                India's premier digital taxation and financial services platform inspired by modern e-filing fintech architecture. Authorized e-Return intermediary simplifying ITR, GST, and corporate compliance for over 10 Lakh taxpayers.
              </p>
              <div className="pt-2 flex items-center space-x-3 text-slate-400 text-xs">
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold rounded">
                  AY 2025-26 Live
                </span>
                <span>•</span>
                <span>ISO 27001 Certified</span>
                <span>•</span>
                <span>256-Bit SSL</span>
              </div>
            </div>

            {/* Column 2: ITR Filing Links */}
            <div className="space-y-2.5">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider block">
                ITR Filing
              </span>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button onClick={onStartFiling} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    ITR-1 (Salaried Sahaj)
                  </button>
                </li>
                <li>
                  <button onClick={onStartFiling} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    ITR-2 (Capital Gains)
                  </button>
                </li>
                <li>
                  <button onClick={onStartFiling} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    ITR-3 & ITR-4 (Business & Sugam)
                  </button>
                </li>
                <li>
                  <button onClick={onGoToTrackStatus} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    Track ITR-V Status
                  </button>
                </li>
                <li>
                  <button onClick={() => setExpertModalOpen(true)} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    Hire Personal e-CA
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Tax Tools & Calculators */}
            <div className="space-y-2.5">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider block">
                Tax Calculators
              </span>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button onClick={() => setActiveCalcTab('regime')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    Old vs. New Regime AY 25-26
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCalcTab('hra')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    HRA Exemption Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCalcTab('slabs')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    Income Tax Slabs & Rules
                  </button>
                </li>
                <li>
                  <button onClick={onOpenPaymentModal} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    e-Pay Tax Challan 280
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: GST & Legal */}
            <div className="space-y-2.5">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider block">
                GST & Corporate
              </span>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button onClick={() => setGstModalOpen(true)} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    New GST Registration
                  </button>
                </li>
                <li>
                  <button onClick={() => setGstModalOpen(true)} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    GSTR-1 & GSTR-3B Filings
                  </button>
                </li>
                <li>
                  <button onClick={() => setGstModalOpen(true)} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    Trade License & MSME
                  </button>
                </li>
                <li>
                  <button onClick={() => setNoticeModalOpen(true)} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    Tax Notice Dispute Assistance
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Statutory Disclaimer & Copyright Notice */}
          <div className="pt-6 border-t border-slate-800/80 space-y-4">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Statutory Disclaimer:</strong> Tax Returns PRO is an authorized electronic tax-return intermediary platform registered under the Electronic Filing of Returns of Tax Scheme. All tax calculations, rebates, and slabs are strictly calibrated with the Finance Act 2024 and Central Board of Direct Taxes (CBDT) notifications for Assessment Year 2025-26.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <p>© {new Date().getFullYear()} Tax Returns PRO. All rights reserved. Government of India Taxpayer Facilitation System.</p>
              <div className="flex items-center space-x-4">
                <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
                <span>•</span>
                <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
                <span>•</span>
                <span className="hover:text-slate-300 cursor-pointer">Security Certifications</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* MODAL 1: TALK TO A TAX EXPERT (e-CA) */}
      {expertModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Modal Header with CA Photo Banner */}
            <div className="relative h-28 w-full bg-slate-900 shrink-0 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80" 
                alt="Tax Expert Consultation" 
                className="w-full h-full object-cover opacity-30" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-r from-emerald-950 via-slate-950/85 to-transparent"></div>
              
              <button
                onClick={() => {
                  setExpertModalOpen(false);
                  setExpertSuccess(null);
                }}
                className="absolute top-4 right-4 z-20 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase w-fit mb-1">
                  <Briefcase className="w-3 h-3 text-emerald-400" />
                  <span>Chartered Accountant Booking</span>
                </div>
                <h3 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  Talk to a Dedicated Tax Expert (e-CA)
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="text-xs text-slate-500 mb-4">
                Book a confidential 1-on-1 consultation to file your return or resolve complex capital gains & business accounts.
              </p>

            {expertSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Consultation Booked Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Reference Token: <span className="font-mono font-bold text-emerald-700">{expertSuccess}</span>. A senior CA will call you within 15 minutes at {expertForm.phone}.
                </p>
                <button
                  onClick={() => {
                    setExpertModalOpen(false);
                    setExpertSuccess(null);
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl mt-2 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookExpert} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={expertForm.name}
                    onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })}
                    placeholder="e.g. Priya Mukherjee"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={expertForm.phone}
                      onChange={(e) => setExpertForm({ ...expertForm, phone: e.target.value })}
                      placeholder="e.g. 9830123456"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={expertForm.email}
                      onChange={(e) => setExpertForm({ ...expertForm, email: e.target.value })}
                      placeholder="e.g. priya@email.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Service Required *</label>
                  <select
                    value={expertForm.service}
                    onChange={(e) => setExpertForm({ ...expertForm, service: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium cursor-pointer"
                  >
                    <option value="salaried">Salaried ITR Filing (Multiple Form 16 / HRA)</option>
                    <option value="capital_gains">Stock Market Trading, F&O & Crypto</option>
                    <option value="business">Business / Freelancer / Presumptive 44AD</option>
                    <option value="notice">Tax Notice Defense & Rectification</option>
                    <option value="nri">NRI Taxation & DTAA Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Preferred Consultation Slot</label>
                  <select
                    value={expertForm.slot}
                    onChange={(e) => setExpertForm({ ...expertForm, slot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium cursor-pointer"
                  >
                    <option value="asap">Instant Callback (Next 15 Mins)</option>
                    <option value="today_evening">Today Evening (5:00 PM - 8:00 PM)</option>
                    <option value="tomorrow_morning">Tomorrow Morning (10:00 AM - 1:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Specific Queries (Optional)</label>
                  <textarea
                    rows={2}
                    value={expertForm.notes}
                    onChange={(e) => setExpertForm({ ...expertForm, notes: e.target.value })}
                    placeholder="Mention any specific deductions or broker details..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 resize-none font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm CA Consultation
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TAX NOTICE ASSISTANCE */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header with Notice Assistance Photo */}
            <div className="relative h-28 w-full bg-slate-900 shrink-0 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80" 
                alt="Tax Notice Litigation Support" 
                className="w-full h-full object-cover opacity-25" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-r from-amber-950 via-slate-950/90 to-transparent"></div>
              
              <button
                onClick={() => {
                  setNoticeModalOpen(false);
                  setNoticeSuccess(null);
                }}
                className="absolute top-4 right-4 z-20 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase w-fit mb-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Notice Resolution Desk</span>
                </div>
                <h3 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  Income Tax Notice Assistance
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="text-xs text-slate-500 mb-4">
                Submit notice details for a free preliminary evaluation by our legal litigation team.
              </p>

            {noticeSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Notice Registered for CA Evaluation!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Case File: <span className="font-mono font-bold text-amber-800">{noticeSuccess}</span>. An authorized tax advocate will review the DIN and contact you.
                </p>
                <button
                  onClick={() => {
                    setNoticeModalOpen(false);
                    setNoticeSuccess(null);
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl mt-2 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleNoticeSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Notice DIN / Reference Number *</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.noticeNumber}
                    onChange={(e) => setNoticeForm({ ...noticeForm, noticeNumber: e.target.value })}
                    placeholder="e.g. ITBA/AST/S/143(1)/2024-25/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Section of Notice *</label>
                  <select
                    value={noticeForm.section}
                    onChange={(e) => setNoticeForm({ ...noticeForm, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium cursor-pointer"
                  >
                    <option value="143_1">Sec 143(1) - Intimation of Tax Demand or Mismatch</option>
                    <option value="139_9">Sec 139(9) - Defective Return Notice</option>
                    <option value="142_1">Sec 142(1) - Inquiry Before Assessment</option>
                    <option value="148">Sec 148 - Income Escaping Assessment / Scrutiny</option>
                    <option value="other">Other / High-Value Transaction Query</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={noticeForm.phone}
                    onChange={(e) => setNoticeForm({ ...noticeForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Brief Description of Discrepancy</label>
                  <textarea
                    rows={3}
                    value={noticeForm.description}
                    onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                    placeholder="e.g. TDS mismatch between 26AS and return, or unclaimed deduction..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 resize-none font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Submit for Free Preliminary Analysis
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: GST & BUSINESS SERVICES */}
      {gstModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header with GST Photo */}
            <div className="relative h-28 w-full bg-slate-900 shrink-0 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                alt="GST Filing and Business Compliance" 
                className="w-full h-full object-cover opacity-25" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-r from-blue-950 via-slate-950/90 to-transparent"></div>
              
              <button
                onClick={() => {
                  setGstModalOpen(false);
                  setGstSuccess(null);
                }}
                className="absolute top-4 right-4 z-20 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold uppercase w-fit mb-1">
                  <Receipt className="w-3 h-3 text-blue-400" />
                  <span>GST & Business Desk</span>
                </div>
                <h3 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  GST Registration & Business Filing
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="text-xs text-slate-500 mb-4">
                Fast GSTIN allotment, monthly return filing, and Trade License processing.
              </p>

            {gstSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Application Received!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Application ID: <span className="font-mono font-bold text-emerald-700">{gstSuccess}</span>. Our corporate relationship manager will reach out with the document checklist.
                </p>
                <button
                  onClick={() => {
                    setGstModalOpen(false);
                    setGstSuccess(null);
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl mt-2 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleGstSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Business Name / Trade Name *</label>
                  <input
                    type="text"
                    required
                    value={gstForm.businessName}
                    onChange={(e) => setGstForm({ ...gstForm, businessName: e.target.value })}
                    placeholder="e.g. Apex Consulting & Logistics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Entity Type *</label>
                    <select
                      value={gstForm.entityType}
                      onChange={(e) => setGstForm({ ...gstForm, entityType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium cursor-pointer"
                    >
                      <option value="proprietorship">Sole Proprietorship</option>
                      <option value="partnership">Partnership Firm</option>
                      <option value="llp">LLP (Limited Liability)</option>
                      <option value="pvt_ltd">Private Limited Company</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Service Type *</label>
                    <select
                      value={gstForm.serviceType}
                      onChange={(e) => setGstForm({ ...gstForm, serviceType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium cursor-pointer"
                    >
                      <option value="new_registration">New GST Registration</option>
                      <option value="return_filing">GSTR-1 & 3B Monthly Filing</option>
                      <option value="trade_license">Trade License & MSME</option>
                      <option value="lut_filing">GST LUT (for Exporters)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Phone Number for Verification *</label>
                  <input
                    type="tel"
                    required
                    value={gstForm.phone}
                    onChange={(e) => setGstForm({ ...gstForm, phone: e.target.value })}
                    placeholder="e.g. 9830123456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Request Business Callback
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Support Button & Widget (Matching Capture.PNG bottom right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {floatingChatOpen && (
          <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  CA
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tax Help Desk</h4>
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online & Ready to Assist
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFloatingChatOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-3 text-xs text-slate-600 space-y-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] leading-relaxed">
                👋 Hello! Need help filing your ITR or choosing between Old vs New tax regimes?
              </div>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setFloatingChatOpen(false);
                    onStartFiling();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-[#15803d] bg-emerald-50 hover:bg-emerald-100/70 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Start Self ITR Filing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFloatingChatOpen(false);
                    setExpertModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100/70 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Talk to Chartered Accountant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="tel:+9118001030009"
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-between block cursor-pointer"
                >
                  <span>Call Toll-Free: 1800-103-0009</span>
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setFloatingChatOpen(!floatingChatOpen)}
          aria-label="Open Tax Support"
          className="w-14 h-14 rounded-full bg-linear-to-tr from-blue-700 to-blue-500 text-white shadow-xl hover:shadow-blue-500/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer relative group"
        >
          {floatingChatOpen ? (
            <X className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <MessageSquare className="w-6 h-6 fill-white/20 stroke-[2]" />
          )}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </button>
      </div>

    </div>
  );
};
