import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building, 
  User, 
  ExternalLink, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Language, UserProfile, ItrClientSubmission, ItrStatus } from '../types';

interface MyItrSubmissionsProps {
  currentUser: UserProfile | null;
  language: Language;
  onNewSubmission: () => void;
  onOpenAuth: () => void;
}

export const MyItrSubmissions: React.FC<MyItrSubmissionsProps> = ({
  currentUser,
  language,
  onNewSubmission,
  onOpenAuth,
}) => {
  // Load from localStorage
  const submissions: ItrClientSubmission[] = (() => {
    try {
      const saved = localStorage.getItem('itr_client_submissions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (currentUser) {
            return parsed.filter(s => s.userId === currentUser.id || s.pan === currentUser.pan || s.mobile === currentUser.phone);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  })();

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <User className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          'Track Your ITR Applications'
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          'Sign in with your mobile or email to track your submitted ITR intake form and download ITR-V.'
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 cursor-pointer transition-colors"
        >
          'Sign In'
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: ItrStatus) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>'Submission Received'</span>
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>'Under Review'</span>
          </span>
        );
      case 'filing_in_progress':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center space-x-1 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>'Govt E-Filing in Progress'</span>
          </span>
        );
      case 'filed':
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>'Filed & ITR-V Issued'</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      {/* Header Banner with Professional Photography */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80" 
            alt="Tax Application Dashboard and Documentation" 
            className="w-full h-full object-cover opacity-30" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/85 to-transparent"></div>
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Taxpayer Desk • AY 2025-26</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  My ITR Filing Applications
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Track your submitted tax particulars, consultant review progress, and download official ITR-V acknowledgements.
                </p>
              </div>
              <button
                onClick={onNewSubmission}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/40 flex items-center space-x-2 cursor-pointer transition-all shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Submit New ITR Form</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            'No ITR Submissions Found'
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            'Submit your PAN, Aadhaar and bank details now for instant tax filing.'
          </p>
          <button
            onClick={onNewSubmission}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            'Fill ITR Intake Form'
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">{sub.assessmentYear}</h3>
                      <span className="text-xs font-mono font-bold text-slate-500">• {sub.id}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      'Submitted on:' {sub.submittedAt}
                    </p>
                  </div>
                </div>

                <div>
                  {getStatusBadge(sub.status)}
                </div>
              </div>

              {/* Status details & Consultant Message */}
              {sub.consultantNotes && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">
                      {"Consultant's Message:"}
                    </span>
                    <p className="text-slate-600">{sub.consultantNotes}</p>
                  </div>
                </div>
              )}

              {/* Acknowledgement Number if filed */}
              {sub.ackNumber && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-emerald-800 font-bold block text-sm flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>'Govt ITR-V Acknowledgement Generated'</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 mt-1 block">
                      ITR-V Ack No: {sub.ackNumber} {sub.filingDate ? `• Filed: ${sub.filingDate}` : ''}
                    </span>
                  </div>

                  <a
                    href="https://eportal.incometax.gov.in/iec/foservices/#/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>'Verify on IT Portal ↗'</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">PAN</span>
                  <span className="font-mono font-bold text-slate-800">{sub.pan}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Aadhaar</span>
                  <span className="font-mono font-bold text-slate-800">{sub.aadhaar}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Bank & A/C</span>
                  <span className="font-semibold text-slate-800 truncate block">{sub.bankName} (..{sub.accountNumber.slice(-4)})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Annual Income</span>
                  <span className="font-mono font-bold text-emerald-800">₹{sub.annualGrossIncome.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
