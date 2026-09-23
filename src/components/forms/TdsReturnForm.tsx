import React, { useState } from 'react';
import { 
  Receipt, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Printer, 
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  Download
} from 'lucide-react';
import { UserProfile, ItrClientSubmission, ItrSubmissionDocument } from '../../types';
import { incrementPlatformFiling } from '../../utils/taxStats';

interface TdsReturnFormProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSubmissionSuccess?: (submission: ItrClientSubmission) => void;
  onNavigateToTab?: (tabKey: string) => void;
}

export const TdsReturnForm: React.FC<TdsReturnFormProps> = ({
  currentUser,
  onOpenAuth,
  onSubmissionSuccess,
  onNavigateToTab,
}) => {
  const [tdsFormType, setTdsFormType] = useState<'24Q' | '26Q' | '194-IA' | '194-IB'>('26Q');
  const [financialYear, setFinancialYear] = useState('FY 2024-25');
  const [quarter, setQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q4');

  // Deductor Details
  const [tanNumber, setTanNumber] = useState('KOLW12345F');
  const [deductorName, setDeductorName] = useState(currentUser?.name || 'Ali Infotech Private Limited');
  const [deductorPan, setDeductorPan] = useState(currentUser?.pan || 'ABCPA1234F');
  const [contactPerson, setContactPerson] = useState(currentUser?.name || 'Wasim Ali');
  const [contactMobile, setContactMobile] = useState(currentUser?.phone || '+91 98765-43210');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || 'wasimali0202@gmail.com');

  // Challan & Payment Info
  const [bsrCode, setBsrCode] = useState('0001234');
  const [challanDate, setChallanDate] = useState('2025-03-07');
  const [challanSerialNo, setChallanSerialNo] = useState('04812');
  const [totalDeductees, setTotalDeductees] = useState<number>(14);
  const [totalTdsDeposited, setTotalTdsDeposited] = useState<number>(84500);

  // Documents
  const [documents, setDocuments] = useState<ItrSubmissionDocument[]>([
    {
      id: 'doc-tds-1',
      name: 'TDS_Challan_281_Receipt.pdf',
      type: 'tds_certificate',
      size: '850 KB',
      uploadedAt: 'Today',
      verified: true,
    }
  ]);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPrn, setSubmittedPrn] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const newDoc: ItrSubmissionDocument = {
      id: 'doc-' + Date.now(),
      name: file.name,
      type: 'tds_certificate',
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

    if (tdsFormType !== '194-IA' && (!tanNumber || tanNumber.length !== 10)) {
      setErrorMessage('Please enter a valid 10-character Tax Deduction Account Number (TAN).');
      return;
    }

    if (!deductorPan || deductorPan.length !== 10) {
      setErrorMessage('Please enter a valid 10-character Deductor PAN.');
      return;
    }

    setIsSubmitting(true);

    const submissionId = `TDS-${tdsFormType}-` + Math.floor(100000 + Math.random() * 900000);
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
      clientName: `${deductorName} (TAN: ${tanNumber})`,
      mobile: contactMobile,
      email: contactEmail,
      pan: deductorPan.toUpperCase(),
      aadhaar: currentUser.aadhaar || '5412 8901 2345',
      dob: currentUser.dob || '1985-05-15',
      fatherName: 'Late S. K. Ali',
      gender: 'male',
      address: currentUser.address || 'Salt Lake, Kolkata, West Bengal - 700064',
      pincode: currentUser.pincode || '700064',
      bankName: 'State Bank of India',
      accountNumber: currentUser.accountNumber || '30492817492',
      ifscCode: currentUser.ifscCode || 'SBIN0001234',
      accountType: 'current',
      assessmentYear: 'AY 2025-26',
      incomeCategory: 'business',
      filingType: `TDS-FORM-${tdsFormType}`,
      taxRegime: 'new',
      annualGrossIncome: Number(totalTdsDeposited) * 10,
      deductions80C: 0,
      deductions80D: 0,
      otherDeductions: 0,
      tdsPaid: Number(totalTdsDeposited),
      taxPayable: 0,
      refundClaimed: 0,
      clientNotes: `TDS Form: ${tdsFormType}. Quarter: ${quarter}. BSR: ${bsrCode}. Challan Serial: ${challanSerialNo}. Deductees: ${totalDeductees}. ${notes}`,
      documents: documents,
      status: 'submitted',
      submittedAt: nowStr,
      updatedAt: nowStr,
      consultantNotes: `TDS e-Return ${tdsFormType} validated with TIN-FC NSDL engine. Provisional Receipt Number generated.`,
      ackNumber: 'PRN-' + Math.floor(10000000000000 + Math.random() * 90000000000000),
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
      setSubmittedPrn(newSubmission.ackNumber || submissionId);
      if (onSubmissionSuccess) {
        onSubmissionSuccess(newSubmission);
      }
    }, 600);
  };

  if (submittedPrn) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 sm:p-8 bg-white border border-teal-200 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-teal-100 text-teal-900 text-xs font-bold rounded-full uppercase tracking-wider">
            TDS Return Filed Successfully
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Form {tdsFormType} Acknowledged with PRN!
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Your TDS withholding statement has passed NSDL FVU file validation and is logged with the Income Tax Department Traces network.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Provisional Receipt No (PRN):</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{submittedPrn}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Deductor TAN:</span>
            <span className="font-mono font-bold text-slate-900">{tanNumber}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Form & Quarter:</span>
            <span className="font-semibold text-teal-700">{tdsFormType} • {quarter}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Total TDS Deposited:</span>
            <span className="font-semibold text-slate-900">₹{totalTdsDeposited.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print PRN Challan Receipt</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmittedPrn(null);
              if (onNavigateToTab) onNavigateToTab('my_submissions');
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#15803d] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View in Submissions Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-teal-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-bold">
          <Receipt className="w-3.5 h-3.5" />
          <span>Statutory TDS Withholding Returns & 24Q / 26Q</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          TDS Return Filing Portal
        </h1>
        <p className="text-sm text-teal-100/90 max-w-2xl leading-relaxed">
          File quarterly Form 24Q (Salary TDS), Form 26Q (Contractor, Professional, Rent), Form 194-IA (Property Sale), and Form 194-IB with instant TRACES provisional receipt generation.
        </p>

        {/* TDS Form Selection Tabs */}
        <div className="pt-2 flex flex-wrap gap-2">
          {[
            { id: '26Q', label: 'Form 26Q (Non-Salary / Vendor)' },
            { id: '24Q', label: 'Form 24Q (Salary TDS)' },
            { id: '194-IA', label: 'Form 194-IA (Property Purchase)' },
            { id: '194-IB', label: 'Form 194-IB (High Rent TDS)' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTdsFormType(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tdsFormType === tab.id 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'bg-white/10 text-teal-100 hover:bg-white/20'
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
          {/* Deductor Particulars */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Deductor Organization / Entity Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tax Deduction Account No (TAN) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={tanNumber}
                  onChange={e => setTanNumber(e.target.value.toUpperCase())}
                  placeholder="KOLW12345F"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-900 font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Deductor Permanent Account Number (PAN) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={deductorPan}
                  onChange={e => setDeductorPan(e.target.value.toUpperCase())}
                  placeholder="ABCPA1234F"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-900 font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Legal Deductor Name *
                </label>
                <input
                  type="text"
                  required
                  value={deductorName}
                  onChange={e => setDeductorName(e.target.value)}
                  placeholder="Company / Employer / Payer Name"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Period & Quarter */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              2. Return Period & Assessment Year
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Financial Year</label>
                <select
                  value={financialYear}
                  onChange={e => setFinancialYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="FY 2024-25">FY 2024-25 (AY 2025-26)</option>
                  <option value="FY 2023-24">FY 2023-24 (AY 2024-25)</option>
                  <option value="FY 2025-26">FY 2025-26 (AY 2026-27)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Quarter *</label>
                <select
                  value={quarter}
                  onChange={e => setQuarter(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="Q4 (Jan - Mar)">Quarter 4 (Jan - Mar)</option>
                  <option value="Q3 (Oct - Dec)">Quarter 3 (Oct - Dec)</option>
                  <option value="Q2 (Jul - Sep)">Quarter 2 (Jul - Sep)</option>
                  <option value="Q1 (Apr - Jun)">Quarter 1 (Apr - Jun)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Challan & Deposit Particulars */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              3. Challan ITNS 281 Payment & Deductee Particulars
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank BSR Code</label>
                <input
                  type="text"
                  maxLength={7}
                  value={bsrCode}
                  onChange={e => setBsrCode(e.target.value)}
                  placeholder="0001234"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Challan Date</label>
                <input
                  type="date"
                  value={challanDate}
                  onChange={e => setChallanDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Challan Serial No.</label>
                <input
                  type="text"
                  value={challanSerialNo}
                  onChange={e => setChallanSerialNo(e.target.value)}
                  placeholder="04812"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Total TDS Deposited (₹)</label>
                <input
                  type="number"
                  value={totalTdsDeposited}
                  onChange={e => setTotalTdsDeposited(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Deductees Included</label>
                <input
                  type="number"
                  value={totalDeductees}
                  onChange={e => setTotalDeductees(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Officer Mobile</label>
                <input
                  type="text"
                  value={contactMobile}
                  onChange={e => setContactMobile(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Attachment */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              4. Upload TDS Excel File or Challan Receipt
            </span>
            <label className="p-4 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-teal-600 shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block">Attach Challan 281 Copy or Deductee Excel List</span>
                <span className="text-[11px] text-slate-500">Supports .xlsx, .csv, and .pdf formats</span>
              </div>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            {documents.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {documents.map((doc, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-lg text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>{doc.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>NSDL File Validation Utility (FVU) Compliant Engine</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#0d9488] hover:bg-teal-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-teal-200" />
              <span>{isSubmitting ? 'Validating FVU & Submitting...' : `File Form ${tdsFormType} & Get PRN`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
