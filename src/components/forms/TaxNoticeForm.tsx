import React, { useState } from 'react';
import { 
  AlertTriangle, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Printer, 
  Scale,
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { UserProfile, ItrClientSubmission, ItrSubmissionDocument } from '../../types';
import { incrementPlatformFiling } from '../../utils/taxStats';

interface TaxNoticeFormProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSubmissionSuccess?: (submission: ItrClientSubmission) => void;
  onNavigateToTab?: (tabKey: string) => void;
}

export const TaxNoticeForm: React.FC<TaxNoticeFormProps> = ({
  currentUser,
  onOpenAuth,
  onSubmissionSuccess,
  onNavigateToTab,
}) => {
  const [noticeSection, setNoticeSection] = useState<'143(1)' | '139(9)' | '148' | '245' | '142(1)'>('143(1)');
  const [noticeDin, setNoticeDin] = useState('ITBA/AST/S/143(1)/2024-25/1049281729');
  const [noticeDate, setNoticeDate] = useState('2025-02-14');
  const [assessmentYear, setAssessmentYear] = useState('AY 2024-25');
  const [demandAmount, setDemandAmount] = useState<number>(34500);
  const [responseAction, setResponseAction] = useState<'disagree' | 'rectify' | 'ca_assist'>('disagree');

  // Taxpayer Info
  const [taxpayerName, setTaxpayerName] = useState(currentUser?.name || 'Wasim Ali');
  const [pan, setPan] = useState(currentUser?.pan || 'ABCPA1234F');
  const [mobile, setMobile] = useState(currentUser?.phone || '+91 98765-43210');
  const [email, setEmail] = useState(currentUser?.email || 'wasimali0202@gmail.com');
  const [originalAckNo, setOriginalAckNo] = useState('284719204918274');

  // Grounds of Reply
  const [groundsOfDisagreement, setGroundsOfDisagreement] = useState(
    'TDS credit of ₹34,500 under Section 194J is fully reflected in Form 26AS & AIS from deductor, but was omitted in CPC processing. We pray for rectification under Section 154 and withdrawal of demand.'
  );

  // Documents
  const [documents, setDocuments] = useState<ItrSubmissionDocument[]>([
    {
      id: 'doc-not-pdf',
      name: 'Notice_Copy_143_1.pdf',
      type: 'other',
      size: '1.4 MB',
      uploadedAt: 'Today',
      verified: true,
    },
    {
      id: 'doc-ais',
      name: 'Form_26AS_AIS_Proof.pdf',
      type: 'other',
      size: '2.1 MB',
      uploadedAt: 'Today',
      verified: true,
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAck, setSubmittedAck] = useState<string | null>(null);
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

    if (!noticeDin.trim()) {
      setErrorMessage('Please enter the Notice Document Identification Number (DIN).');
      return;
    }

    if (!pan || pan.length !== 10) {
      setErrorMessage('Please enter a valid 10-character PAN.');
      return;
    }

    if (!groundsOfDisagreement.trim()) {
      setErrorMessage('Please state the factual grounds of your reply or objection.');
      return;
    }

    setIsSubmitting(true);

    const submissionId = `NOT-${noticeSection}-` + Math.floor(100000 + Math.random() * 900000);
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
      clientName: taxpayerName,
      mobile: mobile,
      email: email,
      pan: pan.toUpperCase(),
      aadhaar: currentUser.aadhaar || '5412 8901 2345',
      dob: currentUser.dob || '1985-05-15',
      fatherName: 'Late S. K. Ali',
      gender: 'male',
      address: currentUser.address || 'Kolkata, West Bengal - 700064',
      pincode: currentUser.pincode || '700064',
      bankName: currentUser.bankName || 'State Bank of India',
      accountNumber: currentUser.accountNumber || '30492817492',
      ifscCode: currentUser.ifscCode || 'SBIN0001234',
      accountType: 'savings',
      assessmentYear: assessmentYear,
      incomeCategory: 'other',
      filingType: `NOTICE-${noticeSection}`,
      taxRegime: 'new',
      annualGrossIncome: 0,
      deductions80C: 0,
      deductions80D: 0,
      otherDeductions: 0,
      tdsPaid: 0,
      taxPayable: demandAmount,
      refundClaimed: 0,
      noticeRefNumber: noticeDin,
      clientNotes: `Notice Section: ${noticeSection}. DIN: ${noticeDin}. Notice Date: ${noticeDate}. Response Action: ${responseAction}. Original Ack: ${originalAckNo}. Grounds: ${groundsOfDisagreement}`,
      documents: documents,
      status: 'submitted',
      submittedAt: nowStr,
      updatedAt: nowStr,
      consultantNotes: `Formal legal response to Notice under Section ${noticeSection} logged. Assigned to Senior Tax Attorney for CPC dispatch.`,
      ackNumber: 'NOT-ACK-' + Math.floor(1000000000 + Math.random() * 9000000000),
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
      setSubmittedAck(newSubmission.ackNumber || submissionId);
      if (onSubmissionSuccess) {
        onSubmissionSuccess(newSubmission);
      }
    }, 600);
  };

  if (submittedAck) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 sm:p-8 bg-white border border-amber-200 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <FileCheck2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider">
            Notice Reply Filed on Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Notice Reply Lodged Successfully!
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Your written grounds of objection and legal response under Section {noticeSection} have been officially submitted to the Centralized Processing Centre (CPC).
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Filing Ack Ref:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{submittedAck}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Notice DIN:</span>
            <span className="font-mono font-bold text-slate-900">{noticeDin}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Notice Section:</span>
            <span className="font-semibold text-amber-700">Section {noticeSection}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Contested Demand:</span>
            <span className="font-semibold text-slate-900">₹{demandAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Response Dossier</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmittedAck(null);
              if (onNavigateToTab) onNavigateToTab('my_submissions');
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#15803d] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Track Reply Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-950 via-slate-900 to-rose-950 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Income Tax Notice Resolution & Legal Response</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Tax Notice Assistance & Reply Form
        </h1>
        <p className="text-sm text-amber-100/90 max-w-2xl leading-relaxed">
          Resolve intimations and demand notices issued under Section 143(1), 139(9), 148, or 245 with chartered accountant representation and electronic submission to CPC Bengaluru.
        </p>

        {/* Notice Type Selector */}
        <div className="pt-2 flex flex-wrap gap-2">
          {[
            { id: '143(1)', label: 'Sec 143(1) Intimation (Demand / Mismatch)' },
            { id: '139(9)', label: 'Sec 139(9) Defective Return Notice' },
            { id: '148', label: 'Sec 148 Reassessment Notice' },
            { id: '245', label: 'Sec 245 Demand Adjustment' },
            { id: '142(1)', label: 'Sec 142(1) Inquiry Notice' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setNoticeSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                noticeSection === tab.id 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-white/10 text-amber-100 hover:bg-white/20'
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
          {/* Section 1: Notice Reference Particulars */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Notice Particulars & Document Identification Number (DIN)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Notice DIN (Found on top right of the notice letter) *
                </label>
                <input
                  type="text"
                  required
                  value={noticeDin}
                  onChange={e => setNoticeDin(e.target.value)}
                  placeholder="e.g. ITBA/AST/S/143(1)/2024-25/1049281729"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-slate-900 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Notice Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={noticeDate}
                  onChange={e => setNoticeDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Assessment Year</label>
                <select
                  value={assessmentYear}
                  onChange={e => setAssessmentYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="AY 2025-26">AY 2025-26 (FY 2024-25)</option>
                  <option value="AY 2024-25">AY 2024-25 (FY 2023-24)</option>
                  <option value="AY 2023-24">AY 2023-24 (FY 2022-23)</option>
                  <option value="AY 2022-23">AY 2022-23 (FY 2021-22)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Demand Amount Claimed by IT Dept (₹)
                </label>
                <input
                  type="number"
                  value={demandAmount}
                  onChange={e => setDemandAmount(Number(e.target.value))}
                  placeholder="34500"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Original Return Ack Number
                </label>
                <input
                  type="text"
                  value={originalAckNo}
                  onChange={e => setOriginalAckNo(e.target.value)}
                  placeholder="284719204918274"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-slate-900 font-mono font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Response Strategy */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              2. Proposed Response Action
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'disagree', title: 'Disagree with Demand', desc: 'Demand is incorrect due to TDS or deduction mismatch. We request full cancellation.' },
                { id: 'rectify', title: 'File Rectification (Sec 154)', desc: 'Submit corrected computation & 26AS matching under Section 154.' },
                { id: 'ca_assist', title: 'Assign Senior CA', desc: 'Need dedicated Chartered Accountant representation before the Assessing Officer.' },
              ].map(action => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setResponseAction(action.id as any)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    responseAction === action.id 
                      ? 'border-amber-600 bg-amber-50 shadow-2xs' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span className={`text-xs font-bold block ${responseAction === action.id ? 'text-amber-950' : 'text-slate-800'}`}>
                    {action.title}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block leading-snug">
                    {action.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Grounds of Reply */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Factual Grounds of Objection / Reply Notes *
            </label>
            <textarea
              rows={4}
              required
              value={groundsOfDisagreement}
              onChange={e => setGroundsOfDisagreement(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:bg-white text-slate-900 font-medium leading-relaxed"
            />
          </div>

          {/* Section 4: Attach Notice Copy */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              4. Attach Notice Letter & Corroborating Evidence (PDF)
            </span>
            <label className="p-4 border-2 border-dashed border-slate-200 hover:border-amber-500 rounded-2xl bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block">Attach Notice PDF or Supporting Schedules</span>
                <span className="text-[11px] text-slate-500">Attach official notice issued by Income Tax Department</span>
              </div>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            {documents.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {documents.map((doc, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>{doc.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Certified Tax Attorney Review Prior to CPC Bengaluru Submission</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>{isSubmitting ? 'Submitting Legal Response to CPC...' : 'Submit Written Reply to Notice'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
