import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  Receipt, 
  AlertTriangle, 
  TrendingUp, 
  Briefcase, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { Language, UserProfile, ItrClientSubmission } from '../types';
import { SimpleItrIntakeForm } from './SimpleItrIntakeForm';
import { GstPortalForm } from './forms/GstPortalForm';
import { TdsReturnForm } from './forms/TdsReturnForm';
import { TaxNoticeForm } from './forms/TaxNoticeForm';
import { CapitalGainsForm } from './forms/CapitalGainsForm';
import { CompanyDscForm } from './forms/CompanyDscForm';

export type FormCategory = 'itr' | 'gst' | 'tds' | 'notice' | 'capital_gains' | 'company_dsc';

interface FormsPortalProps {
  currentUser: UserProfile | null;
  language: Language;
  onOpenAuth: () => void;
  initialCategory?: FormCategory;
  onSubmissionSuccess?: (submission: ItrClientSubmission) => void;
  onNavigateToTab?: (tabKey: string) => void;
}

export const FormsPortal: React.FC<FormsPortalProps> = ({
  currentUser,
  language,
  onOpenAuth,
  initialCategory = 'itr',
  onSubmissionSuccess,
  onNavigateToTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FormCategory>(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const formTabs = [
    {
      id: 'itr' as FormCategory,
      title: 'ITR Filing (1, 2, 3, 4)',
      shortTitle: 'ITR Filing',
      badge: 'CPC Instant',
      description: 'Salaried, Presumptive Business & Professional ITR with Form 16 autofill',
      icon: FileText,
      color: 'emerald',
      activeClass: 'bg-[#15803d] text-white border-[#15803d] shadow-sm',
      chipColor: 'bg-emerald-100 text-emerald-900',
    },
    {
      id: 'gst' as FormCategory,
      title: 'GST Portal (Reg & Returns)',
      shortTitle: 'GST Portal',
      badge: 'ARN in 3 Days',
      description: 'New GST Registration with ARN or Monthly GSTR-1 & GSTR-3B filings',
      icon: Building2,
      color: 'teal',
      activeClass: 'bg-teal-700 text-white border-teal-700 shadow-sm',
      chipColor: 'bg-teal-100 text-teal-900',
    },
    {
      id: 'tds' as FormCategory,
      title: 'TDS Returns (24Q / 26Q)',
      shortTitle: 'TDS Returns',
      badge: 'TRACES PRN',
      description: 'Salary 24Q, Vendor 26Q & Rent/Property TDS withholding compliance',
      icon: Receipt,
      color: 'blue',
      activeClass: 'bg-blue-700 text-white border-blue-700 shadow-sm',
      chipColor: 'bg-blue-100 text-blue-900',
    },
    {
      id: 'notice' as FormCategory,
      title: 'Notice Reply (143/139/148)',
      shortTitle: 'Tax Notices',
      badge: 'Legal Shield',
      description: 'Resolution for Section 143(1) Intimation, 139(9) Defective & Demand notices',
      icon: AlertTriangle,
      color: 'amber',
      activeClass: 'bg-amber-600 text-white border-amber-600 shadow-sm',
      chipColor: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'capital_gains' as FormCategory,
      title: 'Capital Gains (Schedule CG)',
      shortTitle: 'Capital Gains',
      badge: '12.5% LTCG',
      description: 'Stocks, mutual funds, real estate property & crypto trading taxes',
      icon: TrendingUp,
      color: 'indigo',
      activeClass: 'bg-indigo-700 text-white border-indigo-700 shadow-sm',
      chipColor: 'bg-indigo-100 text-indigo-900',
    },
    {
      id: 'company_dsc' as FormCategory,
      title: 'Company Reg & DSC',
      shortTitle: 'Company & DSC',
      badge: 'MCA SPICe+',
      description: 'Pvt Ltd & LLP Incorporation, Class 3 USB Crypto Token issuance',
      icon: KeyRound,
      color: 'slate',
      activeClass: 'bg-slate-900 text-white border-slate-900 shadow-sm',
      chipColor: 'bg-slate-200 text-slate-900',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Category Selection Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Statutory Filing Desks</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Dedicated Filing & Compliance Forms
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select the specific tax or statutory service below. Each form is completely separated with dedicated validations and acknowledgment generation.
            </p>
          </div>

          {currentUser?.role === 'admin' && (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-amber-300 rounded-2xl text-xs font-bold shrink-0 self-start md:self-auto border border-amber-400/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Master Admin Access Active</span>
            </div>
          )}
        </div>

        {/* 6 Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4">
          {formTabs.map(tab => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? tab.activeClass 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : tab.chipColor
                    }`}>
                      {tab.badge}
                    </span>
                  </div>
                  <h3 className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {tab.shortTitle}
                  </h3>
                </div>
                <span className={`text-[10px] mt-2 block line-clamp-1 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                  {tab.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render the Selected Dedicated Form */}
      <div className="transition-opacity duration-200">
        {selectedCategory === 'itr' && (
          <SimpleItrIntakeForm
            currentUser={currentUser}
            language={language}
            onOpenAuth={onOpenAuth}
            onSubmissionSuccess={onSubmissionSuccess}
            onViewConsultantPortal={() => {
              if (onNavigateToTab) onNavigateToTab('my_submissions');
            }}
          />
        )}

        {selectedCategory === 'gst' && (
          <GstPortalForm
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onSubmissionSuccess={onSubmissionSuccess}
            onNavigateToTab={onNavigateToTab}
          />
        )}

        {selectedCategory === 'tds' && (
          <TdsReturnForm
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onSubmissionSuccess={onSubmissionSuccess}
            onNavigateToTab={onNavigateToTab}
          />
        )}

        {selectedCategory === 'notice' && (
          <TaxNoticeForm
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onSubmissionSuccess={onSubmissionSuccess}
            onNavigateToTab={onNavigateToTab}
          />
        )}

        {selectedCategory === 'capital_gains' && (
          <CapitalGainsForm
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onSubmissionSuccess={onSubmissionSuccess}
            onNavigateToTab={onNavigateToTab}
          />
        )}

        {selectedCategory === 'company_dsc' && (
          <CompanyDscForm
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onSubmissionSuccess={onSubmissionSuccess}
            onNavigateToTab={onNavigateToTab}
          />
        )}
      </div>
    </div>
  );
};
