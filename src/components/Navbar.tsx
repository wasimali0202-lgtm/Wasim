import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  CreditCard, 
  Receipt, 
  Calculator, 
  History, 
  FolderCheck, 
  HelpCircle, 
  ShieldCheck, 
  User, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X, 
  FileSpreadsheet, 
  FileEdit, 
  Sparkles, 
  FileCheck2, 
  Lock, 
  PhoneCall, 
  Home,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Scale,
  Percent,
  CheckCircle2,
  Check,
  BookOpen,
  Compass,
  Phone,
  Mail,
  Edit3,
  UploadCloud
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { usePageContent } from '../utils/pageContent';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  language?: Language;
  onOpenCustomerAuth?: () => void;
  onOpenAdminAuth?: () => void;
  onOpenAuth?: () => void;
  onOpenPaymentModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  onOpenCustomerAuth,
  onOpenAdminAuth,
  onOpenAuth,
  onOpenPaymentModal,
}) => {
  const pageContent = usePageContent();
  const handleCustomerLogin = onOpenCustomerAuth || onOpenAuth || (() => {});
  const handleAdminLogin = onOpenAdminAuth || onOpenAuth || (() => {});

  const [filingDropdownOpen, setFilingDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [calculatorsDropdownOpen, setCalculatorsDropdownOpen] = useState(false);
  const [gstDropdownOpen, setGstDropdownOpen] = useState(false);
  const [knowledgeDropdownOpen, setKnowledgeDropdownOpen] = useState(false);
  const [guidesDropdownOpen, setGuidesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submissionsCount, setSubmissionsCount] = useState<number>(0);

  const filingRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const calculatorsRef = useRef<HTMLDivElement>(null);
  const gstRef = useRef<HTMLDivElement>(null);
  const knowledgeRef = useRef<HTMLDivElement>(null);
  const guidesRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Read count of submissions for badge
  useEffect(() => {
    try {
      const stored = localStorage.getItem('itr_client_submissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSubmissionsCount(parsed.length);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeTab]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filingRef.current && !filingRef.current.contains(e.target as Node)) {
        setFilingDropdownOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
      if (calculatorsRef.current && !calculatorsRef.current.contains(e.target as Node)) {
        setCalculatorsDropdownOpen(false);
      }
      if (gstRef.current && !gstRef.current.contains(e.target as Node)) {
        setGstDropdownOpen(false);
      }
      if (knowledgeRef.current && !knowledgeRef.current.contains(e.target as Node)) {
        setKnowledgeDropdownOpen(false);
      }
      if (guidesRef.current && !guidesRef.current.contains(e.target as Node)) {
        setGuidesDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAllDropdowns = () => {
    setFilingDropdownOpen(false);
    setServicesDropdownOpen(false);
    setCalculatorsDropdownOpen(false);
    setGstDropdownOpen(false);
    setKnowledgeDropdownOpen(false);
    setGuidesDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavClick = (tabKey: string) => {
    onTabChange(tabKey);
    closeAllDropdowns();
  };

  const handleScrollToSection = (sectionId: string) => {
    if (activeTab !== 'home') {
      onTabChange('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    closeAllDropdowns();
  };

  const isFilingActive = ['itr_form', 'filing_wizard', 'my_submissions', 'history'].includes(activeTab);
  const isToolsActive = ['calculator', 'payment', 'documents', 'guide'].includes(activeTab);
  const isAdminActive = activeTab === 'admin_portal' || activeTab === 'consultant_portal';

  return (
    <header className="sticky top-0 z-40 bg-[#F4FBF7] border-b border-[#E2F1E8] shadow-2xs">
      {/* Top Thin Tax Announcement & Helpline Strip */}
      <div className="bg-[#092917] text-emerald-100 border-b border-emerald-900/80 text-[11px] py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          {/* Tax Information & Live Updates */}
          <div className="flex items-center space-x-2 truncate">
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 shrink-0">
              {pageContent.topBar.badgeText || 'AY 2025-26'}
            </span>
            <span className="text-emerald-100/90 truncate text-[11px] sm:text-xs">
              {pageContent.topBar.announcementText}
            </span>
          </div>

          {/* Contact Details */}
          <div className="flex items-center space-x-3 text-emerald-200 shrink-0 text-[11px] sm:ml-auto">
            <a 
              href={`tel:${pageContent.topBar.helplinePhoneLink || '+919876543210'}`} 
              className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
              title="Call Tax Helpline"
            >
              <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="font-medium">{pageContent.topBar.helplinePhone}</span>
            </a>
            <span className="text-emerald-700/80 hidden xs:inline">•</span>
            <a 
              href={`mailto:${pageContent.topBar.supportEmail}`} 
              className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
              title="Email Tax Support Desk"
            >
              <Mail className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="font-medium">{pageContent.topBar.supportEmail}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17">
          
          <div className="flex items-center space-x-3 xl:space-x-6">
            {/* Tax Returns PRO Brand Logo & Name (Clean, Professional, No redundant tags) */}
            <div 
              onClick={() => handleNavClick('home')} 
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('home'); }}
              aria-label="Tax Returns PRO Home"
              title="Go to Tax Returns PRO Homepage"
              className="flex items-center space-x-2.5 cursor-pointer group select-none shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Inter',sans-serif]">
                  Tax Returns <span className="text-[#059669]">PRO</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links matching Capture.PNG */}
            <nav className="hidden lg:flex items-center space-x-1.5">

              {/* 1. Products Dropdown */}
              <div className="relative" ref={filingRef}>
                <button
                  type="button"
                  onClick={() => {
                    setFilingDropdownOpen(!filingDropdownOpen);
                    setServicesDropdownOpen(false);
                    setCalculatorsDropdownOpen(false);
                    setGstDropdownOpen(false);
                    setKnowledgeDropdownOpen(false);
                    setGuidesDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    filingDropdownOpen || activeTab === 'products'
                      ? 'text-[#15803d] bg-emerald-50/90'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <span>Products</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-500 ${filingDropdownOpen ? 'rotate-180 text-[#15803d]' : ''}`} />
                </button>

                {filingDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        ITR & Tax Filing Products
                      </span>
                    </div>

                    <button
                      onClick={() => { handleNavClick('itr_form'); setFilingDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 text-slate-700 transition-colors cursor-pointer"
                    >
                      <FileEdit className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">File Income Tax Return (ITR)</span>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">Instant</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Form 16 OCR & 4-min CPC filing</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('gst_form'); setFilingDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-teal-50/70 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">GST Portal (Reg & Returns)</span>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-teal-100 text-teal-800 rounded">ARN</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">New GST registration & GSTR-1/3B filing</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('tds_form'); setFilingDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-blue-50/70 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">TDS Return Filing (24Q / 26Q)</span>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-blue-100 text-blue-800 rounded">TRACES</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Salary, contractor & rent withholding PRN</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('notice_form'); setFilingDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-amber-50/70 text-slate-700 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">Income Tax Notices (143/139)</span>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-800 rounded">Legal</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Defective return & demand notice reply</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('capital_gains_form'); setFilingDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-indigo-50/70 text-slate-700 transition-colors cursor-pointer"
                    >
                      <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">Capital Gain Tax Filing</span>
                        <p className="text-[11px] text-slate-500 truncate">Stocks, mutual funds, crypto & property</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('company_dsc_form'); setFilingDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-slate-700 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">Company Reg & Class 3 DSC</span>
                        <p className="text-[11px] text-slate-500 truncate">Pvt Ltd, LLP incorporation & USB token</p>
                      </div>
                    </button>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => { handleNavClick('forms_portal'); setFilingDropdownOpen(false); }}
                        className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Open All Forms & Filing Portal →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Tools Dropdown (22+ Calculators) */}
              <div className="relative" ref={calculatorsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setCalculatorsDropdownOpen(!calculatorsDropdownOpen);
                    setFilingDropdownOpen(false);
                    setServicesDropdownOpen(false);
                    setGstDropdownOpen(false);
                    setKnowledgeDropdownOpen(false);
                    setGuidesDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    calculatorsDropdownOpen || activeTab === 'tax_tools'
                      ? 'text-[#15803d] bg-emerald-50/90'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <span>Tax Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-500 ${calculatorsDropdownOpen ? 'rotate-180 text-[#15803d]' : ''}`} />
                </button>

                {calculatorsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        22+ Interactive Tax Calculators
                      </span>
                    </div>

                    <button
                      onClick={() => { handleNavClick('tax_tools'); setCalculatorsDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">Income Tax Calculator</span>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-800 rounded">AY 25-26</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Old vs New Regime comparison</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('tax_tools'); setCalculatorsDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-teal-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">Rent Receipt Generator</span>
                        <p className="text-[11px] text-slate-500 truncate">Generate printable HRA receipts with PAN</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('tax_tools'); setCalculatorsDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">Form 12BB Generator</span>
                        <p className="text-[11px] text-slate-500 truncate">Printable employee investment declaration</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('tax_tools'); setCalculatorsDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">Tax Refund Status</span>
                        <p className="text-[11px] text-slate-500 truncate">Live CPC refund credit tracker</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Services Dropdown (Individuals & Businesses) */}
              <div className="relative" ref={servicesRef}>
                <button
                  type="button"
                  onClick={() => {
                    setServicesDropdownOpen(!servicesDropdownOpen);
                    setFilingDropdownOpen(false);
                    setCalculatorsDropdownOpen(false);
                    setGstDropdownOpen(false);
                    setKnowledgeDropdownOpen(false);
                    setGuidesDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    servicesDropdownOpen || activeTab === 'services_individuals' || activeTab === 'services_businesses'
                      ? 'text-[#15803d] bg-emerald-50/90'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-500 ${servicesDropdownOpen ? 'rotate-180 text-[#15803d]' : ''}`} />
                </button>

                {servicesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => { handleNavClick('services_individuals'); setServicesDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/60 text-slate-700 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">Services for Individuals</span>
                        <p className="text-[11px] text-slate-500 truncate">ITR, TDS, DSC, PAN & Tax Planning</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('services_businesses'); setServicesDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">Services for Businesses</span>
                        <p className="text-[11px] text-slate-500 truncate">GST, Company Inc, MCA & Corporate ITR</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Guides Dropdown */}
              <div className="relative" ref={guidesRef}>
                <button
                  type="button"
                  onClick={() => {
                    setGuidesDropdownOpen(!guidesDropdownOpen);
                    setFilingDropdownOpen(false);
                    setServicesDropdownOpen(false);
                    setCalculatorsDropdownOpen(false);
                    setGstDropdownOpen(false);
                    setKnowledgeDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    guidesDropdownOpen || activeTab === 'tax_guides'
                      ? 'text-[#15803d] bg-emerald-50/90'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <span>Tax Guides</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-500 ${guidesDropdownOpen ? 'rotate-180 text-[#15803d]' : ''}`} />
                </button>

                {guidesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        13 Authoritative Tax Guides
                      </span>
                    </div>

                    <button
                      onClick={() => { handleNavClick('tax_guides'); setGuidesDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">ITR Complete Guide</span>
                        <p className="text-[11px] text-slate-500 truncate">Forms, conditions & deadlines</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('tax_guides'); setGuidesDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">Chapter VI-A Deductions</span>
                        <p className="text-[11px] text-slate-500 truncate">80C, 80D, 80CCD & 80G decoded</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleNavClick('tax_guides'); setGuidesDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap block">How to Link Aadhaar with PAN</span>
                        <p className="text-[11px] text-slate-500 truncate">Step-by-step ₹1,000 challan guide</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 5. Pricing */}
              <button
                onClick={() => handleNavClick('pricing')}
                className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'pricing' ? 'text-[#15803d] bg-emerald-50/90' : 'text-slate-700 hover:text-slate-900 hover:bg-emerald-50/60'
                }`}
              >
                <span>Pricing</span>
              </button>

              {/* 6. Quick Links Dropdown: About, Contact, FAQ, Glossary */}
              <div className="relative" ref={knowledgeRef}>
                <button
                  type="button"
                  onClick={() => {
                    setKnowledgeDropdownOpen(!knowledgeDropdownOpen);
                    setFilingDropdownOpen(false);
                    setServicesDropdownOpen(false);
                    setCalculatorsDropdownOpen(false);
                    setGstDropdownOpen(false);
                    setGuidesDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    knowledgeDropdownOpen || activeTab === 'about' || activeTab === 'contact' || activeTab === 'faq' || activeTab === 'glossary'
                      ? 'text-[#15803d] bg-emerald-50/90'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <span>Quick Links</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-500 ${knowledgeDropdownOpen ? 'rotate-180 text-[#15803d]' : ''}`} />
                </button>

                {knowledgeDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => { handleNavClick('about'); setKnowledgeDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                    >
                      <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>About Us</span>
                    </button>
                    <button
                      onClick={() => { handleNavClick('contact'); setKnowledgeDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                    >
                      <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>Contact Helpdesk</span>
                    </button>
                    <button
                      onClick={() => { handleNavClick('faq'); setKnowledgeDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                    >
                      <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Frequently Asked Questions</span>
                    </button>
                    <button
                      onClick={() => { handleNavClick('glossary'); setKnowledgeDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                    >
                      <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Tax Glossary (A - Z)</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action: Log In / Sign Up OR User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {currentUser ? (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setFilingDropdownOpen(false);
                    setServicesDropdownOpen(false);
                    setCalculatorsDropdownOpen(false);
                    setGstDropdownOpen(false);
                    setKnowledgeDropdownOpen(false);
                    setGuidesDropdownOpen(false);
                  }}
                  className="flex items-center space-x-2 p-1.5 pl-2.5 rounded-xl hover:bg-emerald-100/50 border border-emerald-200/60 transition-colors cursor-pointer"
                >
                  <div className="hidden sm:flex flex-col text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[120px] whitespace-nowrap">
                        {currentUser.name}
                      </span>
                      {currentUser.role === 'admin' && (
                        <span className="px-1 py-0.2 bg-slate-900 text-amber-300 text-[9px] font-bold rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold whitespace-nowrap">
                      PAN: {currentUser.pan || currentUser.tin || 'ABCPA1234F'}
                    </span>
                  </div>

                  <div className={`w-8 h-8 rounded-full ${currentUser.role === 'admin' ? 'bg-slate-900 text-amber-300' : 'bg-[#15803d] text-white'} flex items-center justify-center font-bold text-xs shadow-xs`}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 bg-slate-50 rounded-xl mb-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                        {currentUser.role === 'admin' && (
                          <span className="px-1.5 py-0.2 bg-slate-900 text-amber-300 text-[9px] font-bold rounded">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-emerald-700 font-mono font-bold mt-1">
                        PAN: {currentUser.pan || currentUser.tin || 'ABCPA1234F'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => handleNavClick('admin_portal')}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs bg-slate-900 text-amber-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer font-bold mb-1"
                        >
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Admin Portal</span>
                          </div>
                          {submissionsCount > 0 && (
                            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[9px] font-black rounded-full">
                              {submissionsCount}
                            </span>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Customer Dashboard</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Taxpayer Profile</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('my_submissions')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <FolderCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>My Submissions</span>
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Capture.PNG: Distinct Log In and Sign Up buttons */
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => handleCustomerLogin()}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-[#15803d] transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomerLogin()}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] rounded-full shadow-xs transition-transform hover:scale-102 cursor-pointer whitespace-nowrap"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-emerald-100/50 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {currentUser ? (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-xl ${currentUser.role === 'admin' ? 'bg-slate-900 text-amber-300' : 'bg-emerald-600 text-white'} flex items-center justify-center font-bold text-sm`}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-emerald-700 font-mono font-semibold">
                    PAN: {currentUser.pan || currentUser.tin || 'ABCPA1234F'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleNavClick('profile')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Profile
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleCustomerLogin();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <User className="w-4 h-4" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Mobile Group: Returns & Services */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5 block">
              Portals & Services
            </span>

            <button
              onClick={() => handleNavClick('products')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'products' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileEdit className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Products & Solutions (11)</span>
            </button>

            <button
              onClick={() => handleNavClick('tax_tools')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'tax_tools' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tax Tools & 22+ Calculators</span>
            </button>

            <button
              onClick={() => handleNavClick('services_individuals')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'services_individuals' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Services for Individuals</span>
            </button>

            <button
              onClick={() => handleNavClick('services_businesses')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'services_businesses' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Services for Businesses</span>
            </button>

            <button
              onClick={() => handleNavClick('tax_guides')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'tax_guides' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
              <span>13 Income Tax Guides</span>
            </button>

            <button
              onClick={() => handleNavClick('pricing')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'pricing' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Pricing Plans</span>
            </button>

            <button
              onClick={() => handleNavClick('itr_form')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'itr_form' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>File Return / Upload Form 16</span>
            </button>

            <button
              onClick={() => handleNavClick('my_submissions')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'my_submissions' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FolderCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Track Return & Refund Status</span>
            </button>
          </div>

          {/* Mobile Group 3: Quick Links & Support */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5 block">
              Quick Links & Support
            </span>

            <button
              onClick={() => handleNavClick('about')}
              className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
              <span>About Us</span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Phone className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Contact Helpdesk</span>
            </button>

            <button
              onClick={() => handleNavClick('faq')}
              className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Frequently Asked Questions</span>
            </button>

            <button
              onClick={() => handleNavClick('glossary')}
              className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileText className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tax Glossary (A - Z)</span>
            </button>
          </div>

          {currentUser && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
