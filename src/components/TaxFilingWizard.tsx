import React, { useState } from 'react';
import { 
  User, 
  DollarSign, 
  ShieldCheck, 
  Calculator, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  CreditCard, 
  FileText, 
  Building, 
  TrendingUp, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { 
  Language, 
  TaxReturnData, 
  IncomeDetails, 
  DeductionDetails, 
  TaxDocument 
} from '../types';
import { getTranslation } from '../translations';
import { calculateIncomeTax } from '../taxCalculator';

interface TaxFilingWizardProps {
  initialData: TaxReturnData;
  language: Language;
  onSaveReturn: (updated: TaxReturnData) => void;
  onOpenPaymentModal: () => void;
  onViewAcknowledgment: () => void;
}

export const TaxFilingWizard: React.FC<TaxFilingWizardProps> = ({
  initialData,
  language,
  onSaveReturn,
  onOpenPaymentModal,
  onViewAcknowledgment,
}) => {
  const t = getTranslation(language);
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState(initialData.userProfile);
  const [income, setIncome] = useState<IncomeDetails>(initialData.income);
  const [deductions, setDeductions] = useState<DeductionDetails>(initialData.deductions);
  const [documents, setDocuments] = useState<TaxDocument[]>(initialData.documents);
  const [declarationAgreed, setDeclarationAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Dynamically calculate tax result as user types!
  const calculation = calculateIncomeTax(
    income,
    deductions,
    'metro_city',
    userProfile.taxpayerType
  );

  const steps = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Income Sources', icon: DollarSign },
    { num: 3, title: 'Rebates & Deductions', icon: TrendingUp },
    { num: 4, title: 'Tax Computation', icon: Calculator },
    { num: 5, title: 'Upload Proofs', icon: Upload },
    { num: 6, title: 'Review & E-File', icon: FileCheck },
  ];

  const handleIncomeChange = (field: keyof IncomeDetails, value: number) => {
    setIncome((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeductionChange = (field: keyof DeductionDetails, value: number) => {
    setDeductions((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    const updated: TaxReturnData = {
      ...initialData,
      userProfile,
      income,
      deductions,
      calculation,
      documents,
      status: 'draft',
    };
    onSaveReturn(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleSubmitReturn = () => {
    if (!declarationAgreed) {
      alert('Please check the declaration box before submitting.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const updated: TaxReturnData = {
        ...initialData,
        userProfile,
        income,
        deductions,
        calculation,
        documents,
        status: 'submitted',
        acknowledgmentNumber: '14092490' + Math.floor(1000000 + Math.random() * 9000000),
        submissionDate: new Date().toLocaleString(language === 'bn' ? 'en-IN' : 'en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        verificationCode: 'EVC-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-ITD',
      };
      onSaveReturn(updated);
      onViewAcknowledgment();
    }, 1200);
  };

  const handleAddDummyDocument = (type: TaxDocument['type'], name: string) => {
    const newDoc: TaxDocument = {
      id: 'doc_' + Date.now(),
      name,
      type,
      fileSize: '1.2 MB',
      uploadedAt: 'Uploaded just now',
      status: 'verified',
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-800 text-white rounded-xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-semibold">
            'Tax Return draft saved successfully!'
          </span>
        </div>
      )}

      {/* Wizard Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs mb-6 overflow-hidden">
        {/* Professional Header Photo Banner */}
        <div className="relative h-28 sm:h-32 bg-slate-900 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" 
            alt="Official E-Filing Tax Preparation" 
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/85 to-transparent"></div>
          
          <div className="absolute inset-0 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>CBDT Compliance Engine</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Income Tax E-Filing Return Wizard
              </h1>
              <p className="text-xs text-slate-300">
                {t.assessmentYear}: <strong className="text-emerald-400">{userProfile.assessmentYear}</strong> • {userProfile.taxZone} • Fast Track Processing
              </p>
            </div>

            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={handleSaveDraft}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.saveDraft}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Step Circles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;

            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center space-x-2 p-2 rounded-xl text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-900'
                    : isCompleted
                    ? 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-transparent border border-transparent text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isCurrent
                      ? 'bg-emerald-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <div className="truncate">
                  <span className="text-[11px] font-bold block truncate leading-tight">
                    {st.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        </div>
      </div>

      {/* Main Wizard Step Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* STEP 1: Personal Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>{t.step1}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                'Verify your registered PAN, Aadhaar and e-refund bank account details.'
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.fullNameLabel}</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.tinLabel}</label>
                <input
                  type="text"
                  value={userProfile.tin}
                  onChange={(e) => setUserProfile({ ...userProfile, tin: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.nidLabel}</label>
                <input
                  type="text"
                  value={userProfile.nid}
                  onChange={(e) => setUserProfile({ ...userProfile, nid: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.phoneLabel}</label>
                <input
                  type="text"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.taxZone}</label>
                <input
                  type="text"
                  value={userProfile.taxZone}
                  onChange={(e) => setUserProfile({ ...userProfile, taxZone: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.taxCircle}</label>
                <input
                  type="text"
                  value={userProfile.taxCircle}
                  onChange={(e) => setUserProfile({ ...userProfile, taxCircle: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  'Address'
                </label>
                <input
                  type="text"
                  value={userProfile.address}
                  onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            </div>

            {/* Bank details for refund */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-700" />
                <span>'Bank Account Information for Tax Refund'</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <span className="block text-[11px] text-slate-600 mb-1">'Bank Name'</span>
                  <input
                    type="text"
                    value={userProfile.bankName}
                    onChange={(e) => setUserProfile({ ...userProfile, bankName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-600 mb-1">'Account Number'</span>
                  <input
                    type="text"
                    value={userProfile.accountNumber}
                    onChange={(e) => setUserProfile({ ...userProfile, accountNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-medium"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-600 mb-1">'Branch'</span>
                  <input
                    type="text"
                    value={userProfile.branchName}
                    onChange={(e) => setUserProfile({ ...userProfile, branchName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-600 mb-1">'IFSC Code'</span>
                  <input
                    type="text"
                    value={userProfile.routingNumber}
                    onChange={(e) => setUserProfile({ ...userProfile, routingNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="e.g. SBIN0001234"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Income Breakdown */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>{t.step2}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                'Enter your gross annual income across various heads.'
              </p>
            </div>

            {/* Salaried Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>{t.salaryIncome} '(Section 32)'</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    'Basic Salary'
                  </label>
                  <input
                    type="number"
                    value={income.basicSalary || ''}
                    onChange={(e) => handleIncomeChange('basicSalary', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    'House Rent Allowance'
                  </label>
                  <input
                    type="number"
                    value={income.houseRentAllowance || ''}
                    onChange={(e) => handleIncomeChange('houseRentAllowance', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-400">
                    'Exempt up to 50% or ₹3,00,000'
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    'Medical Allowance'
                  </label>
                  <input
                    type="number"
                    value={income.medicalAllowance || ''}
                    onChange={(e) => handleIncomeChange('medicalAllowance', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-400">
                    'Exempt up to 10% or ₹1,20,000'
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    'Conveyance Allowance'
                  </label>
                  <input
                    type="number"
                    value={income.conveyanceAllowance || ''}
                    onChange={(e) => handleIncomeChange('conveyanceAllowance', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-400">
                    'Exempt up to ₹30,000'
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    'Festival Bonus'
                  </label>
                  <input
                    type="number"
                    value={income.festivalBonus || ''}
                    onChange={(e) => handleIncomeChange('festivalBonus', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    'Other Allowances'
                  </label>
                  <input
                    type="number"
                    value={income.otherAllowances || ''}
                    onChange={(e) => handleIncomeChange('otherAllowances', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Other Heads of Income */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* House property */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-700" />
                  <span>{t.housePropertyIncome}</span>
                </h3>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">'Gross Annual Rent'</label>
                  <input
                    type="number"
                    value={income.rentalIncome || ''}
                    onChange={(e) => handleIncomeChange('rentalIncome', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">'Repairs & Municipal Tax'</label>
                  <input
                    type="number"
                    value={income.rentalExpenses || ''}
                    onChange={(e) => handleIncomeChange('rentalExpenses', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Business or Profession */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>{t.businessIncome}</span>
                </h3>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">'Business Turnover / Revenue'</label>
                  <input
                    type="number"
                    value={income.businessRevenue || ''}
                    onChange={(e) => handleIncomeChange('businessRevenue', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">'Allowable Business Expenses'</label>
                  <input
                    type="number"
                    value={income.businessExpenses || ''}
                    onChange={(e) => handleIncomeChange('businessExpenses', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Bank Interest & Capital Gains */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t.bankInterest} & {t.capitalGains}
                </h3>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">'Bank Interest & Savings Certificates'</label>
                  <input
                    type="number"
                    value={income.bankInterest || ''}
                    onChange={(e) => handleIncomeChange('bankInterest', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">'Capital Gains'</label>
                  <input
                    type="number"
                    value={income.capitalGains || ''}
                    onChange={(e) => handleIncomeChange('capitalGains', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Live Gross Summary Widget */}
              <div className="p-4 bg-emerald-900 text-white rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs text-emerald-300 uppercase tracking-wider font-semibold block">
                    'Live Gross Total Estimate'
                  </span>
                  <span className="text-3xl font-black font-mono mt-1 block">
                    ₹{calculation.grossIncome.toLocaleString()}
                  </span>
                </div>
                <div className="pt-3 border-t border-emerald-800 text-xs text-emerald-200 flex justify-between">
                  <span>'Taxable Income:'</span>
                  <span className="font-mono font-bold text-white">₹{calculation.taxableIncome.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Deductions & Rebates */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>{t.step3}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                'Claim tax rebates and deductions under Section 80C, 80CCD, 80D, and 80G of the Income Tax Act.'
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  'Provident Fund (EPF / PPF 80C)'
                </label>
                <input
                  type="number"
                  value={deductions.providentFund || ''}
                  onChange={(e) => handleDeductionChange('providentFund', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  placeholder="0"
                />
                <span className="text-[10px] text-slate-400">
                  'Public Provident Fund / EPF'
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  'NPS / ELSS Mutual Funds'
                </label>
                <input
                  type="number"
                  value={deductions.dpsSavings || ''}
                  onChange={(e) => handleDeductionChange('dpsSavings', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  placeholder="0"
                />
                <span className="text-[10px] text-slate-400">
                  'Section 80CCD NPS & 80C ELSS'
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  'Life Insurance Premium (80C)'
                </label>
                <input
                  type="number"
                  value={deductions.lifeInsurancePremium || ''}
                  onChange={(e) => handleDeductionChange('lifeInsurancePremium', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  placeholder="0"
                />
                <span className="text-[10px] text-slate-400">
                  'LIC or approved term plans'
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  'Govt Securities & Sovereign Gold'
                </label>
                <input
                  type="number"
                  value={deductions.governmentSecurities || ''}
                  onChange={(e) => handleDeductionChange('governmentSecurities', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  placeholder="0"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  'Charitable Donations (80G)'
                </label>
                <input
                  type="number"
                  value={deductions.donationApproved || ''}
                  onChange={(e) => handleDeductionChange('donationApproved', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  placeholder="0"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  'Health Insurance / Mediclaim (80D)'
                </label>
                <input
                  type="number"
                  value={deductions.healthInsurance || ''}
                  onChange={(e) => handleDeductionChange('healthInsurance', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  placeholder="0"
                />
                <span className="text-[10px] text-slate-400">
                  'Self, family & senior parents'
                </span>
              </div>
            </div>

            {/* Rebate computation summary card */}
            <div className="p-5 bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  'Total Eligible Investment'
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono block">
                  ₹{calculation.totalInvestment.toLocaleString()}
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  '15% flat rebate is calculated on allowable investment caps.'
                </p>
              </div>

              <div className="bg-emerald-600 text-white px-5 py-3 rounded-xl text-center shadow-md">
                <span className="text-[11px] uppercase font-semibold text-emerald-100 block">
                  {t.investmentRebateText}
                </span>
                <span className="text-2xl font-black font-mono">
                  -₹{calculation.investmentRebate.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Tax Computation Engine */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <span>{t.step4}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  'Progressive tax liability computation based on official fiscal rates.'
                </p>
              </div>
              
              {/* Payment Quick CTA if payable */}
              {calculation.netTaxPayable > 0 && (
                <button
                  onClick={onOpenPaymentModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t.payTaxBtn}</span>
                </button>
              )}
            </div>

            {/* Slabs breakdown table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-700 uppercase tracking-wider">
                {t.taxSlabs}
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">'Slab Tier'</th>
                    <th className="py-2.5 px-4 text-center">'Rate'</th>
                    <th className="py-2.5 px-4 text-right">'Taxable Chunk'</th>
                    <th className="py-2.5 px-4 text-right">'Tax Amount'</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {calculation.slabBreakdown.map((sl, idx) => (
                    <tr key={idx} className={sl.taxAmount > 0 ? 'bg-emerald-50/30' : ''}>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {sl.slabName}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-700">{sl.rate}%</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-600">₹{sl.taxableAmount.toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">₹{sl.taxAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">{t.taxBeforeRebate}</span>
                <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                  ₹{calculation.grossTaxLiability.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-800 block font-semibold">{t.rebateClaimed}</span>
                <span className="text-lg font-bold font-mono text-emerald-700 mt-1 block">
                  -₹{calculation.investmentRebate.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">{t.alreadyPaidAdvance}</span>
                <span className="text-lg font-bold font-mono text-slate-800 mt-1 block">
                  ₹{calculation.advanceTaxPaid.toLocaleString()}
                </span>
              </div>
              <div className={`p-3.5 rounded-xl border ${
                calculation.refundAmount > 0 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-emerald-600 text-white border-emerald-700'
              }`}>
                <span className={`block font-semibold ${calculation.refundAmount > 0 ? 'text-blue-800' : 'text-emerald-100'}`}>
                  {calculation.refundAmount > 0 ? t.refundDue : t.taxPayable}
                </span>
                <span className="text-xl font-black font-mono mt-1 block">
                  ₹{(calculation.refundAmount > 0 ? calculation.refundAmount : calculation.netTaxPayable).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Indian New Regime Statutory Notification */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>
                Income Tax Act 1961 (New Tax Regime u/s 115BAC): Full rebate u/s 87A applies if taxable income is up to ₹7,00,000. Standard Deduction of ₹50,000 u/s 16(ia) is automatically factored.
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: Documents Vault */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" />
                  <span>{t.step5}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  'Attach your Form 16, salary slips, bank tax statements, and investment proofs.'
                </p>
              </div>

              {/* Quick sample upload buttons */}
              <button
                onClick={() => handleAddDummyDocument('rent_receipt', 'House Tenancy Rent Receipt.pdf')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                + 'Add Document'
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-8 text-center hover:bg-emerald-50 transition-colors">
              <Upload className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                'Drag & drop files here or click to browse'
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF, JPG, PNG '(Max 10 MB)'
              </p>
              <button
                type="button"
                onClick={() => handleAddDummyDocument('other', 'Tax Assessment & Audit Proof.pdf')}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                'Select Files'
              </button>
            </div>

            {/* Uploaded Documents List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {language === 'bn' ? `Attached Documents (${documents.length} Files)` : `Attached Documents (${documents.length} files)`}
              </span>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3.5 flex items-center justify-between bg-white text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{doc.name}</span>
                        <span className="text-[11px] text-slate-400">{doc.fileSize} • {doc.uploadedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>'Verified'</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Review & Final Submission */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>{t.step6}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                'Review all particulars and complete e-filing submission.'
              </p>
            </div>

            {/* Final Overview Card */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pb-4 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block">{t.fullNameLabel}</span>
                  <span className="font-bold text-slate-900 text-sm">{userProfile.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t.tinLabel}</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">{userProfile.tin}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t.assessmentYear}</span>
                  <span className="font-bold text-slate-900 text-sm">{userProfile.assessmentYear}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">{t.totalGrossIncome}</span>
                  <span className="font-mono font-bold text-slate-900">₹{calculation.grossIncome.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">'Taxable Income'</span>
                  <span className="font-mono font-bold text-slate-900">₹{calculation.taxableIncome.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t.rebateClaimed}</span>
                  <span className="font-mono font-bold text-emerald-700">₹{calculation.investmentRebate.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">
                    {calculation.refundAmount > 0 ? t.refundDue : t.taxPayable}
                  </span>
                  <span className="font-mono font-black text-emerald-800 text-sm">
                    ₹{(calculation.refundAmount > 0 ? calculation.refundAmount : calculation.netTaxPayable).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Taxpayer Declaration Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="declaration_checkbox"
                  checked={declarationAgreed}
                  onChange={(e) => setDeclarationAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="declaration_checkbox" className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none">
                  <span>
                    <strong>Solemn Declaration:</strong> I solemnly declare that to the best of my knowledge and belief, the information given in this return (ITR) and the attachments is correct and complete in accordance with the Income Tax Act, 1961.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmitReturn}
                disabled={isSubmitting || !declarationAgreed}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-700/25 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>'Submitting & Digitally Signing Return...'</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-200" />
                    <span>{t.submitReturn}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Step Navigation */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.prevStep}</span>
          </button>

          <span className="text-xs font-semibold text-slate-400">
            {language === 'bn' ? `Step ${currentStep} of 6` : `Step ${currentStep} of 6`}
          </span>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <span>{t.nextStep}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitReturn}
              disabled={isSubmitting || !declarationAgreed}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <span>{t.submitReturn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
