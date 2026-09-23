import React, { useState } from 'react';
import { 
  Building2, 
  KeyRound, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Printer, 
  Check, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Lock
} from 'lucide-react';
import { UserProfile, ItrClientSubmission, ItrSubmissionDocument } from '../../types';
import { incrementPlatformFiling } from '../../utils/taxStats';

interface CompanyDscFormProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSubmissionSuccess?: (submission: ItrClientSubmission) => void;
  onNavigateToTab?: (tabKey: string) => void;
}

export const CompanyDscForm: React.FC<CompanyDscFormProps> = ({
  currentUser,
  onOpenAuth,
  onSubmissionSuccess,
  onNavigateToTab,
}) => {
  const [serviceType, setServiceType] = useState<'pvt_ltd' | 'llp' | 'opc' | 'dsc_class3'>('pvt_ltd');

  // Incorporation particulars
  const [proposedName1, setProposedName1] = useState('Ali Global Technologies Private Limited');
  const [proposedName2, setProposedName2] = useState('Ali Soft & Cloud Solutions Private Limited');
  const [directorCount, setDirectorCount] = useState<number>(2);
  const [authorizedCapital, setAuthorizedCapital] = useState<number>(1000000);
  const [businessObjective, setBusinessObjective] = useState('Software development, cloud solutions, and IT consultancy services.');
  const [registeredState, setRegisteredState] = useState('West Bengal (ROC Kolkata)');

  // Primary Director / Applicant particulars
  const [applicantName, setApplicantName] = useState(currentUser?.name || 'Wasim Ali');
  const [pan, setPan] = useState(currentUser?.pan || 'ABCPA1234F');
  const [mobile, setMobile] = useState(currentUser?.phone || '+91 98765-43210');
  const [email, setEmail] = useState(currentUser?.email || 'wasimali0202@gmail.com');
  const [aadhaar, setAadhaar] = useState(currentUser?.aadhaar || '5412 8901 2345');
  const [din, setDin] = useState('');

  // DSC specifics
  const [dscValidity, setDscValidity] = useState<'2_years' | '3_years'>('2_years');
  const [dscTokenRequired, setDscTokenRequired] = useState(true);

  // Documents
  const [documents, setDocuments] = useState<ItrSubmissionDocument[]>([
    {
      id: 'doc-dir-pan',
      name: 'Director_PAN_Copy.pdf',
      type: 'pan_card',
      size: '1.1 MB',
      uploadedAt: 'Today',
      verified: true,
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const newDoc: ItrSubmissionDocument = {
      id: 'doc-' + Date.now(),
      name: file.name,
      type: 'other',
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

    if (serviceType !== 'dsc_class3' && !proposedName1.trim()) {
      setErrorMessage('Please enter at least one proposed name for the company.');
      return;
    }

    if (!pan || pan.length !== 10) {
      setErrorMessage('Please enter a valid 10-character PAN.');
      return;
    }

    setIsSubmitting(true);

    const isDsc = serviceType === 'dsc_class3';
    const prefix = isDsc ? 'DSC-TOKEN-' : 'MCA-SRN-';
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
      clientName: isDsc ? applicantName : `${proposedName1} (${applicantName})`,
      mobile: mobile,
      email: email,
      pan: pan.toUpperCase(),
      aadhaar: aadhaar,
      dob: currentUser.dob || '1985-05-15',
      fatherName: 'Late S. K. Ali',
      gender: 'male',
      address: currentUser.address || 'Kolkata, West Bengal - 700064',
      pincode: currentUser.pincode || '700064',
      bankName: 'State Bank of India',
      accountNumber: currentUser.accountNumber || '30492817492',
      ifscCode: currentUser.ifscCode || 'SBIN0001234',
      accountType: 'current',
      assessmentYear: 'AY 2025-26',
      incomeCategory: 'business',
      filingType: isDsc ? 'DSC-CLASS-3-APPLICATION' : `MCA-INCORP-${serviceType.toUpperCase()}`,
      taxRegime: 'new',
      annualGrossIncome: isDsc ? 2500 : Number(authorizedCapital),
      deductions80C: 0,
      deductions80D: 0,
      otherDeductions: 0,
      tdsPaid: 0,
      taxPayable: 0,
      refundClaimed: 0,
      clientNotes: isDsc 
        ? `Class 3 DSC Application. Validity: ${dscValidity}. USB Token: ${dscTokenRequired ? 'Yes' : 'No'}` 
        : `Proposed Name: ${proposedName1}. Alt: ${proposedName2}. ROC: ${registeredState}. Directors: ${directorCount}. Capital: ₹${authorizedCapital}`,
      documents: documents,
      status: 'submitted',
      submittedAt: nowStr,
      updatedAt: nowStr,
      consultantNotes: isDsc 
        ? 'Class 3 DSC video KYC verification link dispatched to applicant mobile & email.' 
        : 'Name reservation SPICe+ Part A submitted to Ministry of Corporate Affairs (MCA).',
      ackNumber: isDsc ? 'DSC-' + Math.floor(100000000 + Math.random() * 900000000) : 'MCA-SRN-' + Math.floor(1000000000 + Math.random() * 9000000000),
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
      setSubmittedRef(newSubmission.ackNumber || submissionId);
      if (onSubmissionSuccess) {
        onSubmissionSuccess(newSubmission);
      }
    }, 600);
  };

  if (submittedRef) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 sm:p-8 bg-white border border-indigo-200 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs font-bold rounded-full uppercase tracking-wider">
            {serviceType === 'dsc_class3' ? 'DSC Application Approved' : 'MCA Incorporation Dossier Logged'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {serviceType === 'dsc_class3' ? 'DSC Video KYC Link Dispatched!' : 'SPICe+ Registration Filed!'}
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            {serviceType === 'dsc_class3' 
              ? 'Complete your 2-minute Aadhaar paperless video verification. Your encrypted USB crypto token will be dispatched to your address.' 
              : 'Your name reservation and charter documents (MoA & AoA) are logged with the Registrar of Companies (ROC). Certificate of Incorporation will follow in 5-7 working days.'}
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">MCA Reference SRN:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{submittedRef}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Service Selected:</span>
            <span className="font-semibold text-indigo-700 uppercase">{serviceType.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Applicant:</span>
            <span className="font-semibold text-slate-900">{applicantName}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Application Docket</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmittedRef(null);
              if (onNavigateToTab) onNavigateToTab('my_submissions');
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#15803d] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Track Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-indigo-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Ministry of Corporate Affairs (MCA) & Digital Signature Services</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Company Incorporation & DSC Form
        </h1>
        <p className="text-sm text-indigo-100/90 max-w-2xl leading-relaxed">
          Incorporate a Private Limited Company, LLP, or One Person Company with PAN, TAN, GSTIN, and Bank Account opening in 7 days, or apply for Class 3 Digital Signature Certificate.
        </p>

        {/* Service Type Selector */}
        <div className="pt-2 flex flex-wrap gap-2">
          {[
            { id: 'pvt_ltd', label: '1. Private Limited Company' },
            { id: 'llp', label: '2. Limited Liability Partnership (LLP)' },
            { id: 'opc', label: '3. One Person Company (OPC)' },
            { id: 'dsc_class3', label: '4. Class 3 DSC Token' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setServiceType(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                serviceType === tab.id 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-white/10 text-indigo-100 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Body */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {serviceType !== 'dsc_class3' ? (
            /* ================= INCORPORATION FIELDS ================= */
            <>
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Proposed Company Names (SPICe+ Part A)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Proposed Name 1 (Primary Choice) *
                    </label>
                    <input
                      type="text"
                      required
                      value={proposedName1}
                      onChange={e => setProposedName1(e.target.value)}
                      placeholder="e.g. Ali Infotech Private Limited"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-700 focus:bg-white text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Proposed Name 2 (Alternative Choice)
                    </label>
                    <input
                      type="text"
                      value={proposedName2}
                      onChange={e => setProposedName2(e.target.value)}
                      placeholder="e.g. Ali Cloud Solutions Private Limited"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-700 focus:bg-white text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Registrar of Companies (ROC) Jurisdiction
                  </label>
                  <select
                    value={registeredState}
                    onChange={e => setRegisteredState(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-700 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value="West Bengal (ROC Kolkata)">West Bengal (ROC Kolkata)</option>
                    <option value="Maharashtra (ROC Mumbai)">Maharashtra (ROC Mumbai)</option>
                    <option value="Delhi (ROC Delhi & Haryana)">Delhi (ROC Delhi & Haryana)</option>
                    <option value="Karnataka (ROC Bangalore)">Karnataka (ROC Bangalore)</option>
                    <option value="Telangana (ROC Hyderabad)">Telangana (ROC Hyderabad)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Authorized Share Capital (₹)
                  </label>
                  <input
                    type="number"
                    value={authorizedCapital}
                    onChange={e => setAuthorizedCapital(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-700 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Number of Directors
                  </label>
                  <select
                    value={directorCount}
                    onChange={e => setDirectorCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-700 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value={1}>1 Director (OPC)</option>
                    <option value={2}>2 Directors (Standard)</option>
                    <option value={3}>3 Directors</option>
                    <option value={4}>4 Directors</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Main Business Activity / Industrial Classification
                </label>
                <textarea
                  rows={2}
                  value={businessObjective}
                  onChange={e => setBusinessObjective(e.target.value)}
                  placeholder="Describe your primary business products or services"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-700 focus:bg-white text-slate-900 font-medium"
                />
              </div>
            </>
          ) : (
            /* ================= DSC SPECIFICS ================= */
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Class 3 Digital Signature Certificate (Individual / Org)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Validity Period</label>
                  <select
                    value={dscValidity}
                    onChange={e => setDscValidity(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-700 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value="2_years">2 Years Validity (Most Popular)</option>
                    <option value="3_years">3 Years Validity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">FIPS Encrypted USB Crypto Token</label>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-slate-700 font-semibold">Include HyperPKI USB Token</span>
                    <input
                      type="checkbox"
                      checked={dscTokenRequired}
                      onChange={e => setDscTokenRequired(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applicant & Director Particulars */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Director / Signatory Contact Particulars
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Permanent Account No (PAN)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={pan}
                  onChange={e => setPan(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile (Linked to Aadhaar)</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Attach Director PAN & Aadhaar (PDF / JPG)
            </span>
            <label className="p-4 border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block">Attach Identity & Address Proof</span>
                <span className="text-[11px] text-slate-500">Attach self-attested PAN and Aadhaar copies</span>
              </div>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Includes PAN, TAN, EPF, ESIC & Corporate Bank Account with SPICe+</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-indigo-200" />
              <span>{isSubmitting ? 'Submitting to MCA...' : serviceType === 'dsc_class3' ? 'Submit DSC Application' : 'File Company Incorporation (SPICe+)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
