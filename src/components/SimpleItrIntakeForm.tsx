import React, { useState, useEffect } from 'react';
import { 
  User, 
  CreditCard, 
  Building, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  Clock, 
  Check, 
  Calendar, 
  Lock, 
  ShieldCheck, 
  Sparkles,
  Printer,
  ChevronRight,
  FileCheck2,
  Trash2,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Calculator,
  Briefcase,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Language, UserProfile, ItrClientSubmission, ItrSubmissionDocument } from '../types';
import { incrementPlatformFiling } from '../utils/taxStats';

interface SimpleItrIntakeFormProps {
  currentUser: UserProfile | null;
  language: Language;
  onOpenAuth: () => void;
  onSubmissionSuccess?: (submission: ItrClientSubmission) => void;
  onViewConsultantPortal?: () => void;
}

export const SimpleItrIntakeForm: React.FC<SimpleItrIntakeFormProps> = ({
  currentUser,
  language,
  onOpenAuth,
  onSubmissionSuccess,
  onViewConsultantPortal,
}) => {
  // Tax Service / Form Selector
  const [filingType, setFilingType] = useState<string>('ITR-1');
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new');

  // Personal Particulars
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [pan, setPan] = useState(currentUser?.pan || '');
  const [aadhaar, setAadhaar] = useState(currentUser?.aadhaar || '');
  const [dob, setDob] = useState(currentUser?.dob || '');
  const [fatherName, setFatherName] = useState(currentUser?.fatherName || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(currentUser?.gender || 'male');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [pincode, setPincode] = useState(currentUser?.pincode || '');

  // Bank Details (Mandatory for refund)
  const [bankName, setBankName] = useState(currentUser?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(currentUser?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(currentUser?.ifscCode || '');
  const [accountType, setAccountType] = useState<'savings' | 'current'>(currentUser?.accountType || 'savings');

  // Income & Tax details
  const [assessmentYear, setAssessmentYear] = useState('AY 2025-26 (FY 2024-25)');
  const [incomeCategory, setIncomeCategory] = useState<'salaried' | 'business' | 'house_property' | 'capital_gains' | 'freelancer' | 'nri' | 'other'>('salaried');
  const [annualGrossIncome, setAnnualGrossIncome] = useState<number>(750000);
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [deductions80D, setDeductions80D] = useState<number>(25000);
  const [tdsPaid, setTdsPaid] = useState<number>(30000);
  const [portalPassword, setPortalPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clientNotes, setClientNotes] = useState('');

  // Specific fields for different forms
  const [stcgAmount, setStcgAmount] = useState<number>(0);
  const [ltcgAmount, setLtcgAmount] = useState<number>(0);
  const [businessName, setBusinessName] = useState<string>('');
  const [businessTurnover, setBusinessTurnover] = useState<number>(0);
  const [gstin, setGstin] = useState<string>('');
  const [noticeRefNumber, setNoticeRefNumber] = useState<string>('');
  const [noticeSection, setNoticeSection] = useState<string>('143(1)');
  const [demandAmount, setDemandAmount] = useState<number>(0);
  const [arrearsAmount, setArrearsAmount] = useState<number>(0);

  // Documents
  const [documents, setDocuments] = useState<ItrSubmissionDocument[]>([
    {
      id: 'doc-pan-sample',
      name: 'PAN_Card_Copy.pdf',
      type: 'pan_card',
      fileSize: '420 KB',
      uploadedAt: 'Today',
    }
  ]);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<ItrClientSubmission | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync with currentUser
  useEffect(() => {
    if (currentUser) {
      if (!clientName) setClientName(currentUser.name);
      if (!mobile) setMobile(currentUser.phone);
      if (!email) setEmail(currentUser.email);
      if (!pan && currentUser.pan) setPan(currentUser.pan);
      if (!aadhaar && currentUser.aadhaar) setAadhaar(currentUser.aadhaar);
      if (!bankName && currentUser.bankName) setBankName(currentUser.bankName);
      if (!accountNumber && currentUser.accountNumber) setAccountNumber(currentUser.accountNumber);
      if (!ifscCode && currentUser.ifscCode) setIfscCode(currentUser.ifscCode);
    }
  }, [currentUser]);

  // When filing type changes, adapt category
  const handleFilingTypeSelect = (type: string) => {
    setFilingType(type);
    if (type === 'ITR-1') setIncomeCategory('salaried');
    else if (type === 'ITR-2') setIncomeCategory('capital_gains');
    else if (type === 'ITR-3' || type === 'ITR-4') setIncomeCategory('business');
    else if (type === 'GST-REG' || type === 'GST-RETURN') setIncomeCategory('business');
    else if (type === 'FORM-10E') setIncomeCategory('salaried');
    else setIncomeCategory('other');
  };

  // Format PAN to uppercase & limit to 10 chars
  const handlePanChange = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPan(clean);
  };

  // Format Aadhaar: 12 digits, spaced every 4 digits
  const handleAadhaarChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digitsOnly.length; i += 4) {
      parts.push(digitsOnly.slice(i, i + 4));
    }
    setAadhaar(parts.join(' '));
  };

  // Format IFSC
  const handleIfscChange = (val: string) => {
    setIfscCode(val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11));
  };

  // Handle Mock File Upload
  const handleFileUpload = (type: 'pan_card' | 'aadhaar_card' | 'form16_salary' | 'bank_statement') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newDoc: ItrSubmissionDocument = {
          id: 'doc_' + Date.now(),
          name: file.name,
          type: type,
          fileSize: (file.size / 1024).toFixed(0) + ' KB',
          uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        };
        setDocuments(prev => [...prev, newDoc]);
      }
    };
    input.click();
  };

  const removeDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Live Tax Calculation logic
  const calculateLiveTax = () => {
    const gross = Number(annualGrossIncome) || 0;
    const standardDeduction = taxRegime === 'new' ? 75000 : 50000;
    const sec80C = taxRegime === 'old' ? Math.min(Number(deductions80C) || 0, 150000) : 0;
    const sec80D = taxRegime === 'old' ? Math.min(Number(deductions80D) || 0, 25000) : 0;
    
    const taxableIncome = Math.max(0, gross - standardDeduction - sec80C - sec80D);
    let computedTax = 0;

    if (taxRegime === 'new') {
      // New Regime AY 2025-26
      if (taxableIncome <= 300000) {
        computedTax = 0;
      } else if (taxableIncome <= 700000) {
        computedTax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        computedTax = 20000 + (taxableIncome - 700000) * 0.10;
      } else if (taxableIncome <= 1200000) {
        computedTax = 50000 + (taxableIncome - 1000000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        computedTax = 80000 + (taxableIncome - 1200000) * 0.20;
      } else {
        computedTax = 140000 + (taxableIncome - 1500000) * 0.30;
      }
      // Section 87A rebate for income up to 7L
      if (taxableIncome <= 700000) {
        computedTax = 0;
      }
    } else {
      // Old Regime
      if (taxableIncome <= 250000) {
        computedTax = 0;
      } else if (taxableIncome <= 500000) {
        computedTax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        computedTax = 12500 + (taxableIncome - 500000) * 0.20;
      } else {
        computedTax = 112500 + (taxableIncome - 1000000) * 0.30;
      }
      if (taxableIncome <= 500000) {
        computedTax = 0;
      }
    }

    const cess = computedTax * 0.04;
    const totalTaxPayable = Math.round(computedTax + cess);
    const tds = Number(tdsPaid) || 0;
    const netRefundOrDue = tds - totalTaxPayable;

    return {
      taxableIncome,
      totalTaxPayable,
      tds,
      netRefundOrDue,
      isRefund: netRefundOrDue >= 0,
    };
  };

  const taxCalculation = calculateLiveTax();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!clientName.trim()) {
      setErrorMessage('Please enter taxpayer full name.');
      return;
    }

    if (!pan || pan.length !== 10) {
      setErrorMessage('Please enter a valid 10-character PAN number.');
      return;
    }

    if (!aadhaar || aadhaar.replace(/\s/g, '').length !== 12) {
      setErrorMessage('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    if (!bankName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
      setErrorMessage('Please fill Bank Name, Account Number, and IFSC code for direct tax refund.');
      return;
    }

    setIsSubmitting(true);

    const prefix = filingType.startsWith('GST') ? 'GST-2025-' : filingType.startsWith('NOTICE') ? 'NOT-2025-' : 'ITR-2025-';
    const submissionId = prefix + Math.floor(1000 + Math.random() * 9000);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newSubmission: ItrClientSubmission = {
      id: submissionId,
      userId: currentUser.id,
      clientName: clientName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      pan: pan.trim(),
      aadhaar: aadhaar.trim(),
      dob: dob.trim(),
      fatherName: fatherName.trim(),
      gender,
      address: address.trim(),
      pincode: pincode.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim(),
      accountType,
      assessmentYear,
      incomeCategory,
      filingType,
      taxRegime,
      annualGrossIncome: Number(annualGrossIncome) || 0,
      deductions80C: Number(deductions80C) || 0,
      deductions80D: Number(deductions80D) || 0,
      otherDeductions: 0,
      tdsPaid: Number(tdsPaid) || 0,
      taxPayable: taxCalculation.isRefund ? 0 : Math.abs(taxCalculation.netRefundOrDue),
      refundClaimed: taxCalculation.isRefund ? taxCalculation.netRefundOrDue : 0,
      turnoverOrCapitalGains: filingType === 'ITR-2' ? (stcgAmount + ltcgAmount) : businessTurnover,
      noticeRefNumber: noticeRefNumber.trim(),
      gstin: gstin.trim(),
      portalPassword: portalPassword.trim(),
      clientNotes: clientNotes.trim(),
      documents,
      status: 'submitted',
      submittedAt: nowStr,
      updatedAt: nowStr,
      consultantNotes: `Filing received for ${filingType}. Assigned to CA Tax Desk for verification and e-filing with Income Tax Department.`,
    };

    // Save to localStorage registry
    try {
      const saved = localStorage.getItem('itr_client_submissions');
      const registry: ItrClientSubmission[] = saved ? JSON.parse(saved) : [];
      registry.unshift(newSubmission);
      localStorage.setItem('itr_client_submissions', JSON.stringify(registry));
      
      // Increment platform filing statistics
      incrementPlatformFiling({
        type: newSubmission.filingType || 'ITR-1',
        city: newSubmission.address || 'India',
        user: newSubmission.clientName,
        refundAmount: newSubmission.refundClaimed || (newSubmission.tdsPaid > 0 ? newSubmission.tdsPaid : 28500)
      });
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData(newSubmission);
      if (onSubmissionSuccess) {
        onSubmissionSuccess(newSubmission);
      }
    }, 600);
  };

  // If already submitted, show confirmation & tracker
  if (submittedData) {
    return (
      <div className="max-w-4xl mx-auto my-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold tracking-wide rounded-full bg-emerald-100 text-emerald-800 mb-1">
                  Submission Successful • Form {submittedData.filingType || 'ITR-1'}
                </span>
                <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Tax Return Filing & Intake Receipt
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Application Ref: <span className="text-emerald-700 font-bold">{submittedData.id}</span> • {submittedData.submittedAt}
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="no-print flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Consultant Hand-off Notice & SMS Notification Status */}
          <div className="my-5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 text-xs leading-relaxed space-y-2">
            <div className="flex items-center space-x-2 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Your application is securely queued for CA Verification & CPC Bengaluru E-Filing.
              </span>
            </div>
            <p className="text-emerald-700 pl-6">
              Your PAN ({submittedData.pan}), Pre-validated refund bank account, and tax calculations are now live in the Admin & Officer Dashboard for instant processing.
            </p>
            <div className="mt-2 flex items-center space-x-2 text-[11px] font-semibold text-emerald-800 bg-white/80 p-2 rounded-xl border border-emerald-200/60">
              <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Direct SMS & Email Alerts active on <strong>{submittedData.mobile}</strong> and <strong>{submittedData.email}</strong>.</span>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Filing Workflow & Department Verification Timeline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-300 shadow-xs flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                <div>
                  <p className="font-bold text-emerald-800">Data Received</p>
                  <p className="text-[10px] text-emerald-600">{submittedData.submittedAt.split(',')[0]}</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-300 shadow-xs flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                <div>
                  <p className="font-bold text-amber-800">Under CA Audit</p>
                  <p className="text-[10px] text-amber-600">Verification Desk</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 opacity-60 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px]">3</span>
                <div>
                  <p className="font-semibold text-slate-600">Govt E-Filing</p>
                  <p className="text-[10px] text-slate-400">incometax.gov.in</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 opacity-60 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px]">4</span>
                <div>
                  <p className="font-semibold text-slate-600">ITR-V / Ack Issued</p>
                  <p className="text-[10px] text-slate-400">Download Ack</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-800 flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Identity & Tax Details</span>
              </h5>
              <div className="space-y-1 text-slate-600">
                <p><span className="text-slate-400">Name:</span> <strong className="text-slate-900">{submittedData.clientName}</strong></p>
                <p><span className="text-slate-400">PAN:</span> <strong className="font-mono text-slate-900">{submittedData.pan}</strong></p>
                <p><span className="text-slate-400">Aadhaar:</span> <strong className="font-mono text-slate-900">{submittedData.aadhaar}</strong></p>
                <p><span className="text-slate-400">Mobile:</span> <span className="font-mono">{submittedData.mobile}</span></p>
                <p><span className="text-slate-400">Email:</span> {submittedData.email}</p>
                <p><span className="text-slate-400">Form:</span> <strong className="text-emerald-800">{submittedData.filingType || 'ITR-1'}</strong></p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-800 flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bank & Refund Particulars</span>
              </h5>
              <div className="space-y-1 text-slate-600">
                <p><span className="text-slate-400">Bank:</span> <strong className="text-slate-900">{submittedData.bankName}</strong></p>
                <p><span className="text-slate-400">A/C No:</span> <strong className="font-mono text-slate-900">{submittedData.accountNumber}</strong></p>
                <p><span className="text-slate-400">IFSC Code:</span> <strong className="font-mono text-emerald-700">{submittedData.ifscCode}</strong></p>
                <p><span className="text-slate-400">AY:</span> {submittedData.assessmentYear}</p>
                <p><span className="text-slate-400">Gross Income:</span> ₹{submittedData.annualGrossIncome.toLocaleString('en-IN')}</p>
                <p><span className="text-slate-400">Estimated Refund:</span> <strong className="font-mono text-emerald-700">₹{submittedData.refundClaimed ? submittedData.refundClaimed.toLocaleString('en-IN') : submittedData.tdsPaid.toLocaleString('en-IN')}</strong></p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="no-print pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={() => setSubmittedData(null)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
            >
              ← Submit Another Return / Form
            </button>

            {onViewConsultantPortal && (
              <button
                type="button"
                onClick={onViewConsultantPortal}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center space-x-2 transition-all"
              >
                <span>View in Admin Dashboard ↗</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-4 space-y-6">
      {/* Top Banner explaining the Self-Application Portal */}
      <div className="bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80" 
          alt="ITR Filing System" 
          className="absolute inset-0 w-full h-full object-cover opacity-25" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-r from-emerald-950 via-teal-950/90 to-slate-900/80"></div>

        <div className="relative z-10 p-6 sm:p-8 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-400/20 border border-emerald-400/30 rounded-full text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Self-Filing & Tax Services Hub (AY 2025-26)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Apply Online for Any Income Tax & GST Filing
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Choose your required form: ITR-1 Sahaj, ITR-2 Capital Gains, ITR-3 Business/Professional, ITR-4 Sugam, Form 10E Arrears, GST Returns, or Notice Resolution. Enter particulars and submit directly.
          </p>
        </div>

        {!currentUser && (
          <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-between">
            <p className="text-xs text-emerald-100">
              Sign in with your email or mobile to track and submit your tax application.
            </p>
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center space-x-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Select Tax Return Form / Service */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                1. Select Tax Return Form or Tax Service
              </h3>
              <p className="text-xs text-slate-500">
                Choose the correct e-filing form according to your income sources and nature of tax work.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'ITR-1', name: 'ITR-1 (Sahaj)', desc: 'Salary, 1 House & Other Sources (< ₹50L)' },
              { id: 'ITR-2', name: 'ITR-2 (Capital Gains)', desc: 'Stocks, Mutual Funds, Property & NRI' },
              { id: 'ITR-3', name: 'ITR-3 (Business & Prof)', desc: 'Freelancers, Doctors, Audited Books' },
              { id: 'ITR-4', name: 'ITR-4 (Sugam)', desc: 'Presumptive Scheme Sec 44AD / 44ADA' },
              { id: 'FORM-10E', name: 'Form 10E (Relief)', desc: 'Salary Arrears Relief under Sec 89' },
              { id: 'GST-RETURN', name: 'GST Returns (GSTR)', desc: 'GSTR-1, GSTR-3B & CMP-08 Filings' },
              { id: 'NOTICE-143', name: 'Tax Notice Defense', desc: 'Section 143(1), 139(9) Rectifications' },
              { id: 'TDS-REFUND', name: 'TDS Refund Claim', desc: 'Direct claim for excess TDS deductions' },
            ].map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => handleFilingTypeSelect(f.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                  filingType === f.id
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{f.name}</span>
                  {filingType === f.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{f.desc}</p>
              </button>
            ))}
          </div>

          {/* Regime Switcher */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700">Preferred Tax Regime for AY 2025-26:</span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setTaxRegime('new')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  taxRegime === 'new'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                New Regime (Standard Deduction ₹75,000)
              </button>
              <button
                type="button"
                onClick={() => setTaxRegime('old')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  taxRegime === 'old'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Old Regime (80C, 80D, HRA deductions)
              </button>
            </div>
          </div>
        </div>

        {/* STEP 2: Personal & Identity Particulars */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-800 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                2. Taxpayer Identity & Contact Information
              </h3>
              <p className="text-xs text-slate-500">
                Details must match your PAN card and Aadhaar records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Taxpayer Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Wasim Ali"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            {/* PAN */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Permanent Account Number (PAN) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={pan}
                onChange={(e) => handlePanChange(e.target.value)}
                placeholder="ABCDE1234F"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono font-bold uppercase tracking-wider"
              />
            </div>

            {/* Aadhaar */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aadhaar Number (12 Digits) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={14}
                value={aadhaar}
                onChange={(e) => handleAadhaarChange(e.target.value)}
                placeholder="5412 8901 2345"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono tracking-wider"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number (for SMS Alerts) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765-43210"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="taxpayer@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth (as per PAN)
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Address & PIN
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat 302, Green Park Avenue, Salt Lake, Kolkata, West Bengal - 700064"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* STEP 3: Bank Details for Tax Refund Credit */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-teal-100 text-teal-800 font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                3. Pre-Validated Refund Bank Account
              </h3>
              <p className="text-xs text-slate-500">
                Income tax refunds are directly credited via ECS/NEFT into this account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="State Bank of India / HDFC / PNB"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\s/g, ''))}
                placeholder="30492817492"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                IFSC Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={11}
                value={ifscCode}
                onChange={(e) => handleIfscChange(e.target.value)}
                placeholder="SBIN0001234"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono font-bold uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 cursor-pointer"
              >
                <option value="savings">Savings Bank Account</option>
                <option value="current">Current Business Account</option>
              </select>
            </div>
          </div>
        </div>

        {/* STEP 4: Income & Dynamic Specifics for the Chosen Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                4. Financials & Particulars for {filingType}
              </h3>
              <p className="text-xs text-slate-500">
                Assessment Year: AY 2025-26 (FY 2024-25)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gross Annual Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gross Annual Income / Salary (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={annualGrossIncome}
                onChange={(e) => setAnnualGrossIncome(Number(e.target.value))}
                placeholder="750000"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono font-bold"
              />
            </div>

            {/* TDS Paid */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                TDS Deducted / Advance Tax Paid (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={tdsPaid}
                onChange={(e) => setTdsPaid(Number(e.target.value))}
                placeholder="30000"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono font-bold text-emerald-700"
              />
            </div>

            {/* 80C Deductions (for old regime) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section 80C Deductions (ELSS, PF, LIC, Tuition) (₹)
              </label>
              <input
                type="number"
                value={deductions80C}
                onChange={(e) => setDeductions80C(Number(e.target.value))}
                placeholder="150000"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            {/* 80D Medical */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section 80D Health Insurance (Self & Parents) (₹)
              </label>
              <input
                type="number"
                value={deductions80D}
                onChange={(e) => setDeductions80D(Number(e.target.value))}
                placeholder="25000"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Contextual form fields */}
          {filingType === 'ITR-2' && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
              <h5 className="font-bold text-xs text-emerald-900">Capital Gains Particulars (ITR-2)</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1">Short Term Capital Gains (Equity @ 20%):</label>
                  <input
                    type="number"
                    value={stcgAmount}
                    onChange={(e) => setStcgAmount(Number(e.target.value))}
                    placeholder="₹50,000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Long Term Capital Gains (Equity @ 12.5%):</label>
                  <input
                    type="number"
                    value={ltcgAmount}
                    onChange={(e) => setLtcgAmount(Number(e.target.value))}
                    placeholder="₹1,20,000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {(filingType === 'ITR-3' || filingType === 'ITR-4' || filingType.startsWith('GST')) && (
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-3">
              <h5 className="font-bold text-xs text-teal-900">Business & Professional Particulars</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1">Business / Firm / Trade Name:</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Tech Solutions"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Gross Annual Business Turnover (₹):</label>
                  <input
                    type="number"
                    value={businessTurnover}
                    onChange={(e) => setBusinessTurnover(Number(e.target.value))}
                    placeholder="₹25,00,000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">GSTIN (Optional):</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="19ABCDE1234F1Z5"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {filingType === 'NOTICE-143' && (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-300 space-y-3">
              <h5 className="font-bold text-xs text-amber-900">Income Tax Notice Information</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1">Notice DIN / Ref Number:</label>
                  <input
                    type="text"
                    value={noticeRefNumber}
                    onChange={(e) => setNoticeRefNumber(e.target.value)}
                    placeholder="DIN-2025-901842"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Notice Section:</label>
                  <select
                    value={noticeSection}
                    onChange={(e) => setNoticeSection(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="143(1)">Section 143(1) Intimation (Demand/Discrepancy)</option>
                    <option value="139(9)">Section 139(9) Defective Return Notice</option>
                    <option value="148">Section 148 Reassessment Notice</option>
                    <option value="142(1)">Section 142(1) Inquiry Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Notice Demand Amount (₹):</label>
                  <input
                    type="number"
                    value={demandAmount}
                    onChange={(e) => setDemandAmount(Number(e.target.value))}
                    placeholder="₹15,000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Live Tax Summary Card */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Tax Calculation Preview ({taxRegime.toUpperCase()} Regime)
              </span>
              <p className="text-xs text-slate-300">
                Taxable Income: <strong className="font-mono text-white">₹{taxCalculation.taxableIncome.toLocaleString('en-IN')}</strong> • Total Tax Payable: <strong className="font-mono text-white">₹{taxCalculation.totalTaxPayable.toLocaleString('en-IN')}</strong>
              </p>
            </div>
            <div className="text-right sm:text-right w-full sm:w-auto">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                {taxCalculation.isRefund ? 'Estimated Direct Tax Refund' : 'Net Tax Payable'}
              </span>
              <span className={`text-xl font-black font-mono ${taxCalculation.isRefund ? 'text-emerald-400' : 'text-amber-400'}`}>
                ₹{Math.abs(taxCalculation.netRefundOrDue).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* STEP 5: Supporting Documents Upload */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-800 font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                5. Upload Supporting Documents
              </h3>
              <p className="text-xs text-slate-500">
                Upload Form 16, PAN card, Aadhaar, Bank Statement or Notice Copy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleFileUpload('pan_card')}
              className="p-4 border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all"
            >
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 mb-1.5 transition-colors" />
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                + Upload PAN Card
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG</span>
            </button>

            <button
              type="button"
              onClick={() => handleFileUpload('aadhaar_card')}
              className="p-4 border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all"
            >
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 mb-1.5 transition-colors" />
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                + Upload Aadhaar Card
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG</span>
            </button>

            <button
              type="button"
              onClick={() => handleFileUpload('form16_salary')}
              className="p-4 border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all"
            >
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 mb-1.5 transition-colors" />
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                + Form 16 / Bank / Notice
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, CSV</span>
            </button>
          </div>

          {documents.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Attached Supporting Files ({documents.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5 truncate">
                      <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-900 truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-500">{doc.fileSize} • {doc.uploadedAt}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDoc(doc.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer ml-2"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STEP 6: Remarks to Officer */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            6. Special Instructions or Notes for Tax Officer (Optional)
          </label>
          <textarea
            rows={2}
            value={clientNotes}
            onChange={(e) => setClientNotes(e.target.value)}
            placeholder="Any specific note regarding exemptions, capital gains broker statement, or refund bank account..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
        </div>

        {/* Submit Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900">
              Ready to submit your {filingType} application?
            </p>
            <p className="text-xs text-slate-500">
              Submission immediately queues into the Admin Dashboard with direct SMS notification.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/20 hover:scale-101 active:scale-99 transition-all cursor-pointer flex items-center justify-center space-x-2 text-sm"
          >
            {isSubmitting ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Tax Application Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
