import React, { useState } from 'react';
import { 
  Building2, 
  Receipt, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Printer, 
  CreditCard, 
  Lock, 
  FileSpreadsheet,
  Check,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { UserProfile, ItrClientSubmission, ItrSubmissionDocument } from '../../types';
import { incrementPlatformFiling } from '../../utils/taxStats';

interface GstPortalFormProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSubmissionSuccess?: (submission: ItrClientSubmission) => void;
  onNavigateToTab?: (tabKey: string) => void;
}

export const GstPortalForm: React.FC<GstPortalFormProps> = ({
  currentUser,
  onOpenAuth,
  onSubmissionSuccess,
  onNavigateToTab,
}) => {
  const [formMode, setFormMode] = useState<'registration' | 'return'>('registration');

  // Business Particulars
  const [businessType, setBusinessType] = useState<'proprietorship' | 'partnership' | 'llp' | 'pvt_ltd' | 'individual'>('proprietorship');
  const [legalName, setLegalName] = useState(currentUser?.name || '');
  const [tradeName, setTradeName] = useState('');
  const [pan, setPan] = useState(currentUser?.pan || '');
  const [contactMobile, setContactMobile] = useState(currentUser?.phone || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [state, setState] = useState('West Bengal');
  const [district, setDistrict] = useState('Kolkata');
  const [pincode, setPincode] = useState(currentUser?.pincode || '700064');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [businessActivity, setBusinessActivity] = useState('Retail / Wholesale Trading');
  const [estimatedTurnover, setEstimatedTurnover] = useState<number>(2500000);
  const [hsnCode, setHsnCode] = useState('998311 (Consultancy & IT)');

  // Return Filing Specific Fields
  const [gstin, setGstin] = useState('19AAACA1234F1Z5');
  const [returnPeriod, setReturnPeriod] = useState('August 2025 (FY 2025-26)');
  const [returnType, setReturnType] = useState<'GSTR-1' | 'GSTR-3B' | 'GSTR-4'>('GSTR-3B');
  const [outwardSupplies, setOutwardSupplies] = useState<number>(450000);
  const [itcClaimed, setItcClaimed] = useState<number>(35000);
  const [taxPaidChallan, setTaxPaidChallan] = useState<number>(46000);

  // Bank Particulars
  const [bankName, setBankName] = useState(currentUser?.bankName || 'State Bank of India');
  const [accountNumber, setAccountNumber] = useState(currentUser?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(currentUser?.ifscCode || 'SBIN0001234');

  // Documents attached
  const [documents, setDocuments] = useState<ItrSubmissionDocument[]>([
    {
      id: 'doc-pan',
      name: 'Business_PAN_Card.pdf',
      type: 'pan_card',
      size: '1.2 MB',
      uploadedAt: 'Today',
      verified: true,
    },
    {
      id: 'doc-addr',
      name: 'Electricity_Bill_Proof.pdf',
      type: 'other',
      size: '2.4 MB',
      uploadedAt: 'Today',
      verified: true,
    }
  ]);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedArn, setSubmittedArn] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const newDoc: ItrSubmissionDocument = {
      id: 'doc-' + Date.now(),
      name: file.name,
      type: type as any,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: 'Just now',
      verified: true,
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (formMode === 'registration') {
      if (!tradeName.trim()) {
        setErrorMessage('Please enter the Business Trade Name.');
        return;
      }
      if (!pan || pan.length !== 10) {
        setErrorMessage('Please enter a valid 10-character PAN number.');
        return;
      }
    } else {
      if (!gstin || gstin.length !== 15) {
        setErrorMessage('Please enter a valid 15-character GSTIN number.');
        return;
      }
    }

    setIsSubmitting(true);

    const isReg = formMode === 'registration';
    const prefix = isReg ? 'GST-ARN-2025-' : 'GST-RET-2025-';
    const submissionId = prefix + Math.floor(100000 + Math.random() * 900000);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newSubmission: ItrClientSubmission = {
      id: submissionId,
      clientId: currentUser.id,
      clientName: tradeName ? `${tradeName} (${legalName})` : legalName,
      mobile: contactMobile,
      email: contactEmail,
      pan: pan.toUpperCase(),
      aadhaar: currentUser.aadhaar || '5412 8901 2345',
      dob: currentUser.dob || '1985-05-15',
      fatherName: 'Late S. K. Ali',
      gender: currentUser.gender || 'male',
      address: address ? `${address}, ${district}, ${state} - ${pincode}` : `${district}, ${state} - ${pincode}`,
      pincode: pincode,
      bankName: bankName,
      accountNumber: accountNumber || '30492817492',
      ifscCode: ifscCode,
      accountType: 'current',
      assessmentYear: 'AY 2025-26',
      incomeCategory: 'business',
      filingType: isReg ? 'GST-REGISTRATION' : `GST-RETURN-${returnType}`,
      taxRegime: 'new',
      annualGrossIncome: isReg ? Number(estimatedTurnover) : Number(outwardSupplies),
      deductions80C: 0,
      deductions80D: 0,
      otherDeductions: 0,
      tdsPaid: isReg ? 0 : Number(itcClaimed),
      taxPayable: isReg ? 0 : Math.round(Number(outwardSupplies) * 0.18),
      refundClaimed: 0,
      turnoverOrCapitalGains: isReg ? Number(estimatedTurnover) : Number(outwardSupplies),
      gstin: isReg ? undefined : gstin.toUpperCase(),
      clientNotes: `Business Activity: ${businessActivity}. State: ${state}. HSN: ${hsnCode}. ${notes ? 'Notes: ' + notes : ''}`,
      documents: documents,
      status: 'submitted',
      submittedAt: nowStr,
      updatedAt: nowStr,
      consultantNotes: isReg 
        ? 'Application for New GST Registration submitted to GSTN Portal. Verification ARN assigned.' 
        : `GST Return ${returnType} submitted with Challan reference. Acknowledged by GSTN.`,
      ackNumber: 'GSTN-' + Math.floor(100000000000 + Math.random() * 900000000000),
      filingDate: nowStr,
    };

    try {
      const existing = localStorage.getItem('itr_client_submissions');
      let list: ItrClientSubmission[] = [];
      if (existing) {
        list = JSON.parse(existing);
      }
      list.unshift(newSubmission);
      localStorage.setItem('itr_client_submissions', JSON.stringify(list));
      incrementPlatformFiling();
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedArn(newSubmission.ackNumber || submissionId);
      if (onSubmissionSuccess) {
        onSubmissionSuccess(newSubmission);
      }
    }, 600);
  };

  if (submittedArn) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 sm:p-8 bg-white border border-emerald-200 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full uppercase tracking-wider">
            GST Application Submitted
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            GST Filing Acknowledged Successfully!
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Your application has been logged on the Goods & Services Tax Network (GSTN). An officer will review your documents and process the ARN within 2 to 3 business days.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">GST ARN Reference:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{submittedArn}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Applicant / Entity:</span>
            <span className="font-semibold text-slate-900">{tradeName || legalName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Filing Type:</span>
            <span className="font-semibold text-emerald-700">
              {formMode === 'registration' ? 'New GST Registration (Regular)' : `Monthly Return (${returnType})`}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Jurisdiction State:</span>
            <span className="font-semibold text-slate-900">{state}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print GST Acknowledgment</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmittedArn(null);
              if (onNavigateToTab) onNavigateToTab('my_submissions');
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#15803d] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Track Application Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Official GST Portal Application & Returns</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Goods & Services Tax (GST) Portal
          </h1>
          <p className="text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            File new GST registration with ARN generation within 2-3 days, or file monthly GSTR-1 and GSTR-3B compliance with automated Input Tax Credit (ITC) reconciliation.
          </p>

          {/* Form Mode Selector */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFormMode('registration')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                formMode === 'registration' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-white/10 text-emerald-100 hover:bg-white/20'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>1. New GST Registration (ARN)</span>
            </button>
            <button
              type="button"
              onClick={() => setFormMode('return')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                formMode === 'return' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-white/10 text-emerald-100 hover:bg-white/20'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>2. Monthly GST Return (GSTR-1 / 3B)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {formMode === 'registration' ? (
            /* ================= MODE 1: REGISTRATION ================= */
            <>
              {/* Entity Type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Constitution of Business (Entity Type)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { id: 'proprietorship', label: 'Sole Proprietor' },
                    { id: 'partnership', label: 'Partnership' },
                    { id: 'llp', label: 'LLP' },
                    { id: 'pvt_ltd', label: 'Pvt Ltd Co.' },
                    { id: 'individual', label: 'Freelancer / Pro' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBusinessType(item.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        businessType === item.id 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Legal Name of Business / Applicant *
                  </label>
                  <input
                    type="text"
                    required
                    value={legalName}
                    onChange={e => setLegalName(e.target.value)}
                    placeholder="As appearing on PAN Card"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Trade Name (Doing Business As) *
                  </label>
                  <input
                    type="text"
                    required
                    value={tradeName}
                    onChange={e => setTradeName(e.target.value)}
                    placeholder="e.g. Ali Global Enterprises"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Permanent Account Number (PAN) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={pan}
                    onChange={e => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCPA1234F"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Estimated Annual Turnover (₹)
                  </label>
                  <input
                    type="number"
                    value={estimatedTurnover}
                    onChange={e => setEstimatedTurnover(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Location & Jurisdiction */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value="West Bengal">West Bengal</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi (NCT)</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">District / City</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="Kolkata"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Postal PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="700064"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Principal Place of Business (Full Street Address)
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Plot / House No., Landmark, Road, Area"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              {/* Activity & HSN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Primary Nature of Business Activity
                  </label>
                  <select
                    value={businessActivity}
                    onChange={e => setBusinessActivity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value="Retail / Wholesale Trading">Retail / Wholesale Trading</option>
                    <option value="Information Technology / Software Services">Information Technology / Software Services</option>
                    <option value="Consultancy & Professional Services">Consultancy & Professional Services</option>
                    <option value="Manufacturing & Processing">Manufacturing & Processing</option>
                    <option value="E-Commerce Merchant / Online Selling">E-Commerce Merchant / Online Selling</option>
                    <option value="Logistics, Freight & Transport">Logistics, Freight & Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Top HSN / SAC Code
                  </label>
                  <input
                    type="text"
                    value={hsnCode}
                    onChange={e => setHsnCode(e.target.value)}
                    placeholder="e.g. 998311 for IT consultancy or 6203 for Garments"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-medium"
                  />
                </div>
              </div>
            </>
          ) : (
            /* ================= MODE 2: GST RETURN ================= */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    15-Digit GSTIN *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={gstin}
                    onChange={e => setGstin(e.target.value.toUpperCase())}
                    placeholder="19AAACA1234F1Z5"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Return Period *
                  </label>
                  <select
                    value={returnPeriod}
                    onChange={e => setReturnPeriod(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value="August 2025 (FY 2025-26)">August 2025 (FY 2025-26)</option>
                    <option value="July 2025 (FY 2025-26)">July 2025 (FY 2025-26)</option>
                    <option value="June 2025 (FY 2025-26)">June 2025 (FY 2025-26)</option>
                    <option value="Quarter 1 (Apr-Jun 2025)">Quarter 1 (Apr-Jun 2025)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Return Type
                  </label>
                  <div className="flex gap-2">
                    {(['GSTR-3B', 'GSTR-1', 'GSTR-4'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setReturnType(type)}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl border text-center cursor-pointer transition-all ${
                          returnType === type 
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs' 
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Total Outward Taxable Sales (₹)
                  </label>
                  <input
                    type="number"
                    value={outwardSupplies}
                    onChange={e => setOutwardSupplies(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Input Tax Credit (ITC Claimed) (₹)
                  </label>
                  <input
                    type="number"
                    value={itcClaimed}
                    onChange={e => setItcClaimed(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Net GST Paid via Challan (₹)
                  </label>
                  <input
                    type="number"
                    value={taxPaidChallan}
                    onChange={e => setTaxPaidChallan(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>
              </div>
            </>
          )}

          {/* Bank Details */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Bank Account for GST Refund & Settlement
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  placeholder="30492817492"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={e => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="SBIN0001234"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold uppercase"
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Required Proof Documents (PDF / JPG up to 5MB)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-4 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-900 block">Attach Address Proof / Rent Deed</span>
                  <span className="text-[11px] text-slate-500">Electricity bill, rent agreement, or NOC</span>
                </div>
                <input type="file" onChange={e => handleFileUpload(e, 'address_proof')} className="hidden" />
              </label>

              <label className="p-4 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-900 block">Attach Bank Cheque / Statement</span>
                  <span className="text-[11px] text-slate-500">Cancelled cheque with printed name</span>
                </div>
                <input type="file" onChange={e => handleFileUpload(e, 'bank_statement')} className="hidden" />
              </label>
            </div>

            {documents.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {documents.map((doc, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{doc.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Certified GST Practitioner Review & ARN Generation</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#15803d] hover:bg-emerald-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-300" />
              <span>{isSubmitting ? 'Verifying & Submitting to GSTN...' : formMode === 'registration' ? 'Submit New GST Registration' : 'File GST Return'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
