import React, { useState, useEffect } from 'react';
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
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Language, TaxReturnData, UserProfile, PaymentRecord } from './types';
import { getTranslation } from './translations';
import { getInitialTaxReturnData, defaultUserProfiles } from './initialData';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { TaxFilingWizard } from './components/TaxFilingWizard';
import { PaymentModal } from './components/PaymentModal';
import { AcknowledgmentReceipt } from './components/AcknowledgmentReceipt';
import { TaxCalculatorModal } from './components/TaxCalculatorModal';
import { FilingHistory } from './components/FilingHistory';
import { DocumentManager } from './components/DocumentManager';
import { TaxGuide } from './components/TaxGuide';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { SimpleItrIntakeForm } from './components/SimpleItrIntakeForm';
import { ConsultantPortal } from './components/ConsultantPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { MyItrSubmissions } from './components/MyItrSubmissions';
import { TaxHomePage } from './components/TaxHomePage';
import { TaxToolsPortal } from './components/TaxToolsPortal';
import { TaxGuidesHub } from './components/TaxGuidesHub';
import { ProductsServicesPortal } from './components/ProductsServicesPortal';
import { FormsPortal } from './components/FormsPortal';
import { GstPortalForm } from './components/forms/GstPortalForm';
import { TdsReturnForm } from './components/forms/TdsReturnForm';
import { TaxNoticeForm } from './components/forms/TaxNoticeForm';
import { CapitalGainsForm } from './components/forms/CapitalGainsForm';
import { CompanyDscForm } from './components/forms/CompanyDscForm';

export default function App() {
  // Pure English mode per user request
  const [language] = useState<Language>('en');
  useEffect(() => {
    try {
      localStorage.setItem('etax_language', 'en');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const isLoggedOut = localStorage.getItem('etax_logged_out');
      if (isLoggedOut === 'true') {
        return null;
      }
      const saved = localStorage.getItem('etax_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && /[\u0980-\u09FF]/.test(parsed.name)) {
          return defaultUserProfiles.salaried.profile;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const isLoggedOut = localStorage.getItem('etax_logged_out');
      const savedUser = localStorage.getItem('etax_current_user');
      if (savedUser && isLoggedOut !== 'true') {
        return 'dashboard';
      }
    } catch (e) {
      console.error(e);
    }
    return 'home';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);

  const [logoutNotice, setLogoutNotice] = useState(false);

  // Load from local storage or initial data
  const [taxReturn, setTaxReturn] = useState<TaxReturnData>(() => {
    try {
      const saved = localStorage.getItem('etax_return_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Normalize any stale profile info to Indian tax standards
        if (parsed.userProfile?.taxZone?.includes('Dhaka') || parsed.userProfile?.tin?.includes('-') || !parsed.userProfile?.tin) {
          parsed.userProfile = {
            ...parsed.userProfile,
            name: 'Wasim Ali',
            phone: '+91 98765-43210',
            tin: 'ABCPA1234F',
            nid: '5412 8901 2345',
            taxZone: 'Ward 24(1), Kolkata',
            taxCircle: 'Circle 24, Aayakar Bhawan',
            assessmentYear: '2025-2026',
            address: 'Flat 302, Green Park Avenue, Salt Lake, Kolkata, West Bengal - 700064',
            bankName: 'State Bank of India (SBI)',
            accountNumber: '30492817492',
            branchName: 'Salt Lake Sector I Branch',
            routingNumber: 'SBIN0001234',
          };
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return getInitialTaxReturnData();
  });

  useEffect(() => {
    try {
      localStorage.setItem('etax_language', language);
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem('etax_return_data', JSON.stringify(taxReturn));
    } catch (e) {
      console.error(e);
    }
  }, [taxReturn]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('etax_current_user', JSON.stringify(currentUser));
        localStorage.removeItem('etax_logged_out');
      } else {
        localStorage.removeItem('etax_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const t = getTranslation(language);

  const handleLoginSuccess = (user: UserProfile) => {
    try {
      localStorage.removeItem('etax_logged_out');
      localStorage.setItem('etax_current_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(user);
    setLogoutNotice(false);
    setTaxReturn((prev) => ({
      ...prev,
      userProfile: user,
    }));
    if (user.role === 'admin') {
      setActiveTab('admin_portal');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('etax_current_user');
      localStorage.setItem('etax_logged_out', 'true');
    } catch (e) {
      console.error(e);
    }
    setActiveTab('home');
    setLogoutNotice(true);
    setTimeout(() => {
      setLogoutNotice(false);
    }, 4500);
  };

  const handlePaymentSuccess = (payment: PaymentRecord) => {
    setTaxReturn((prev) => ({
      ...prev,
      payment,
      status: prev.status === 'submitted' ? 'verified' : 'draft',
      calculation: {
        ...prev.calculation,
        netTaxPayable: 0,
      }
    }));
  };

  const handleSaveReturn = (updated: TaxReturnData) => {
    setTaxReturn(updated);
  };

  const handleApplyCalculator = (basicSalary: number, investments: number) => {
    setTaxReturn((prev) => ({
      ...prev,
      income: {
        ...prev.income,
        basicSalary,
      },
      deductions: {
        ...prev.deductions,
        dpsSavings: Math.min(investments, 120000),
      }
    }));
    setActiveTab('filing_wizard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'calculator') {
            setCalculatorModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenPaymentModal={() => setPaymentModalOpen(true)}
      />

      {/* Main App Content Area - Responsively expansive for admin portal so all tables fit seamlessly without scrolling */}
      <main className={`flex-1 w-full mx-auto px-3 sm:px-5 lg:px-6 py-6 sm:py-8 ${
        activeTab === 'admin_portal' || activeTab === 'consultant_portal' ? 'max-w-[1560px]' : 'max-w-7xl'
      }`}>
        {/* Master Admin Direct Control Strip: Allows Master Admin (wasimali0202@gmail.com) to access, test and execute every website feature and form directly */}
        {currentUser?.role === 'admin' && (
          <div className="mb-6 p-3 sm:p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg text-white space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-amber-300">Master Admin Active:</span>
                <span className="text-xs font-mono text-slate-300 font-semibold">{currentUser.email}</span>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">Full Access</span>
              </div>
              <span className="text-[11px] text-slate-400">Directly launch, file, test, and manage all site portals below</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {[
                { id: 'admin_portal', label: '🛡️ Admin Dossiers & SMS', color: 'bg-emerald-700 hover:bg-emerald-600 text-white' },
                { id: 'forms_portal', label: '📂 All Forms Portal', color: 'bg-indigo-700 hover:bg-indigo-600 text-white' },
                { id: 'itr_form', label: '📝 ITR-1/2/4 Filing', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
                { id: 'gst_form', label: '🏢 GST Portal', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
                { id: 'tds_form', label: '📑 TDS Returns', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
                { id: 'notice_form', label: '⚠️ Tax Notices', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
                { id: 'capital_gains_form', label: '📈 Capital Gains', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
                { id: 'company_dsc_form', label: '🏛️ Company & DSC', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
                { id: 'tax_tools', label: '🧮 22+ Calculators', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
                { id: 'tax_guides', label: '📖 13 Tax Guides', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
                { id: 'home', label: '🌐 Public Home', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
                { id: 'dashboard', label: '👤 Customer View', color: 'bg-slate-800 hover:bg-slate-700 text-slate-200' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === item.id ? 'ring-2 ring-amber-400 bg-amber-400 text-slate-950 font-black' : item.color
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Compact Logout Notice Banner */}
        {logoutNotice && (
          <div className="mb-4 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-1 shadow-2xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="font-semibold text-emerald-900 text-xs">Signed out</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => { setLogoutNotice(false); setAuthModalOpen(true); }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 cursor-pointer"
              >
                {t.login}
              </button>
              <button
                type="button"
                onClick={() => setLogoutNotice(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer text-xs"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {/* Main Tab Render */}
        {activeTab === 'home' && (
          <TaxHomePage
            language={language}
            currentUser={currentUser}
            onStartFiling={() => setActiveTab('itr_form')}
            onOpenCalculator={() => setActiveTab('tax_tools')}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenPaymentModal={() => setPaymentModalOpen(true)}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onGoToTrackStatus={() => setActiveTab('my_submissions')}
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {/* Dedicated Forms Portal */}
        {activeTab === 'forms_portal' && (
          <FormsPortal
            currentUser={currentUser}
            language={language}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSubmissionSuccess={() => setActiveTab('my_submissions')}
            onNavigateToTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {/* Dedicated Separate Form: GST Registration & Returns */}
        {activeTab === 'gst_form' && (
          <GstPortalForm
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSubmissionSuccess={() => setActiveTab('my_submissions')}
            onNavigateToTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {/* Dedicated Separate Form: TDS Returns (24Q / 26Q) */}
        {activeTab === 'tds_form' && (
          <TdsReturnForm
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSubmissionSuccess={() => setActiveTab('my_submissions')}
            onNavigateToTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {/* Dedicated Separate Form: Income Tax Notice Resolution */}
        {activeTab === 'notice_form' && (
          <TaxNoticeForm
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSubmissionSuccess={() => setActiveTab('my_submissions')}
            onNavigateToTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {/* Dedicated Separate Form: Capital Gains Tax Filing */}
        {activeTab === 'capital_gains_form' && (
          <CapitalGainsForm
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSubmissionSuccess={() => setActiveTab('my_submissions')}
            onNavigateToTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {/* Dedicated Separate Form: Company Incorporation & DSC */}
        {activeTab === 'company_dsc_form' && (
          <CompanyDscForm
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSubmissionSuccess={() => setActiveTab('my_submissions')}
            onNavigateToTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {/* 22+ Interactive Tax Tools & Calculators */}
        {activeTab === 'tax_tools' && (
          <TaxToolsPortal
            onNavigateToFiling={() => setActiveTab('itr_form')}
          />
        )}

        {/* 13 Comprehensive Income Tax Guides */}
        {activeTab === 'tax_guides' && (
          <TaxGuidesHub
            onNavigateToFiling={() => setActiveTab('itr_form')}
          />
        )}

        {/* Products Portal */}
        {activeTab === 'products' && (
          <ProductsServicesPortal
            initialSection="products"
            onNavigateToFiling={() => setActiveTab('itr_form')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* Services for Individuals */}
        {activeTab === 'services_individuals' && (
          <ProductsServicesPortal
            initialSection="services_individuals"
            onNavigateToFiling={() => setActiveTab('itr_form')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* Services for Businesses */}
        {activeTab === 'services_businesses' && (
          <ProductsServicesPortal
            initialSection="services_businesses"
            onNavigateToFiling={() => setActiveTab('itr_form')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* Transparent Pricing */}
        {activeTab === 'pricing' && (
          <ProductsServicesPortal
            initialSection="pricing"
            onNavigateToFiling={() => setActiveTab('itr_form')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* About Us */}
        {activeTab === 'about' && (
          <ProductsServicesPortal
            initialSection="about"
            onNavigateToFiling={() => setActiveTab('itr_form')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* Contact Helpdesk */}
        {activeTab === 'contact' && (
          <ProductsServicesPortal
            initialSection="contact"
            onNavigateToFiling={() => setActiveTab('itr_form')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <ProductsServicesPortal
            initialSection="faq"
            onNavigateToFiling={() => setActiveTab('itr_form')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* Tax Glossary */}
        {activeTab === 'glossary' && (
          <ProductsServicesPortal
            initialSection="glossary"
            onNavigateToFiling={() => setActiveTab('itr_form')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          currentUser ? (
            <DashboardOverview
              taxReturn={taxReturn}
              currentUser={currentUser}
              language={language}
              onStartFiling={() => setActiveTab('itr_form')}
              onOpenPaymentModal={() => setPaymentModalOpen(true)}
              onViewAcknowledgment={() => setActiveTab('my_submissions')}
              onOpenCalculator={() => setCalculatorModalOpen(true)}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          ) : (
            <TaxHomePage
              language={language}
              currentUser={currentUser}
              onStartFiling={() => setActiveTab('itr_form')}
              onOpenCalculator={() => setCalculatorModalOpen(true)}
              onOpenAuth={() => setAuthModalOpen(true)}
              onOpenPaymentModal={() => setPaymentModalOpen(true)}
              onGoToDashboard={() => setActiveTab('dashboard')}
              onGoToTrackStatus={() => setActiveTab('my_submissions')}
            />
          )
        )}

        {activeTab === 'itr_form' && (
          <SimpleItrIntakeForm
            currentUser={currentUser}
            language={language}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSubmissionSuccess={(submission) => {
              // Update local state if needed
            }}
            onViewConsultantPortal={() => setActiveTab('admin_portal')}
          />
        )}

        {(activeTab === 'admin_portal' || activeTab === 'consultant_portal') && (
          currentUser && currentUser.role === 'admin' ? (
            <AdminDashboard
              language={language}
              currentUser={currentUser}
              onNavigateToForm={() => setActiveTab('itr_form')}
              onSwitchToCustomerView={() => setActiveTab('dashboard')}
              onNavigateToTab={(tabKey) => setActiveTab(tabKey)}
            />
          ) : (
            <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Admin Dashboard Access Restricted
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  The Admin Dashboard contains sensitive taxpayer e-filing dossiers and requires verified Income Tax Department administrative credentials. Please sign in as an administrator to proceed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Login as Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'my_submissions' && (
          <MyItrSubmissions
            currentUser={currentUser}
            language={language}
            onNewSubmission={() => setActiveTab('itr_form')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'filing_wizard' && (
          <TaxFilingWizard
            initialData={taxReturn}
            language={language}
            onSaveReturn={handleSaveReturn}
            onOpenPaymentModal={() => setPaymentModalOpen(true)}
            onViewAcknowledgment={() => setActiveTab('acknowledgment')}
          />
        )}

        {activeTab === 'acknowledgment' && (
          <AcknowledgmentReceipt
            taxReturn={taxReturn}
            language={language}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'history' && (
          <FilingHistory language={language} />
        )}

        {activeTab === 'documents' && (
          <DocumentManager language={language} />
        )}

        {activeTab === 'guide' && (
          <TaxGuide language={language} />
        )}

        {activeTab === 'profile' && (
          currentUser ? (
            <UserProfileModal
              currentUser={currentUser}
              language={language}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                setTaxReturn((prev) => ({ ...prev, userProfile: updated }));
              }}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Sign In to View Taxpayer Profile
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Please sign in with your registered Permanent Account Number (PAN) or email to manage your profile, bank accounts, and assessing jurisdiction.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {t.login}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  {t.dashboard}
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        language={language}
        onLoginSuccess={handleLoginSuccess}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        language={language}
        taxReturn={taxReturn}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <TaxCalculatorModal
        isOpen={calculatorModalOpen}
        onClose={() => setCalculatorModalOpen(false)}
        language={language}
        onApplyToReturn={handleApplyCalculator}
      />

      {/* Official Government Footer (shown on inner pages; homepage has dedicated rich portal footer) */}
      {activeTab !== 'home' && (
        <footer className="no-print bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Tax Returns PRO</span>
                </div>
                <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                  Official electronic tax filing and digital treasury challan settlement portal under Central Board of Direct Taxes, Income Tax Department, Government of India.
                </p>
              </div>

              <div>
                <span className="font-semibold text-white block mb-2">
                  Helpline & Support
                </span>
                <ul className="space-y-1 text-slate-400">
                  <li>Tax Helpline: 1800 103 0025 (Toll-Free)</li>
                  <li>Alt. Toll-Free: 1800 419 0025</li>
                  <li>Email: efilingwebmanager@incometax.gov.in</li>
                  <li>Hours: Mon - Sat (9:00 AM - 8:00 PM)</li>
                </ul>
              </div>

              <div>
                <span className="font-semibold text-white block mb-2">
                  Important Links
                </span>
                <ul className="space-y-1">
                  <li>
                    <button onClick={() => setActiveTab('guide')} className="hover:text-emerald-400 cursor-pointer">
                      Tax Slabs & Guidelines
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCalculatorModalOpen(true)} className="hover:text-emerald-400 cursor-pointer">
                      Tax Calculator (AY 2025-26)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setPaymentModalOpen(true)} className="hover:text-emerald-400 cursor-pointer">
                      e-Pay Tax Challan 280
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
              <p>© {new Date().getFullYear()} Tax Returns PRO • All Rights Reserved. Income Tax Department, Government of India.</p>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <span className="text-emerald-400 font-semibold">ISO 27001 Certified Security</span>
                <span>•</span>
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
