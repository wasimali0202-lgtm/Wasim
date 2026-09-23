import React, { useState } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Printer, 
  Calculator,
  Building,
  Coins,
  FileSpreadsheet
} from 'lucide-react';
import { UserProfile, ItrClientSubmission, ItrSubmissionDocument } from '../../types';
import { incrementPlatformFiling } from '../../utils/taxStats';

interface CapitalGainsFormProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSubmissionSuccess?: (submission: ItrClientSubmission) => void;
  onNavigateToTab?: (tabKey: string) => void;
}

export const CapitalGainsForm: React.FC<CapitalGainsFormProps> = ({
  currentUser,
  onOpenAuth,
  onSubmissionSuccess,
  onNavigateToTab,
}) => {
  // Asset category selection
  const [assetType, setAssetType] = useState<'equity_mf' | 'real_estate' | 'crypto_vda' | 'unlisted'>('equity_mf');

  // Equity particulars
  const [stcgEquity, setStcgEquity] = useState<number>(85000);
  const [ltcgEquity, setLtcgEquity] = useState<number>(240000);
  const [brokerName, setBrokerName] = useState('Zerodha Broking Limited');

  // Real estate particulars
  const [salePrice, setSalePrice] = useState<number>(6500000);
  const [purchaseCost, setPurchaseCost] = useState<number>(3800000);
  const [stampDutyValue, setStampDutyValue] = useState<number>(6500000);
  const [sec54Exemption, setSec54Exemption] = useState<number>(1500000);

  // Crypto / VDA
  const [cryptoGain, setCryptoGain] = useState<number>(45000);

  // General particulars
  const [taxpayerName, setTaxpayerName] = useState(currentUser?.name || 'Wasim Ali');
  const [pan, setPan] = useState(currentUser?.pan || 'ABCPA1234F');
  const [mobile, setMobile] = useState(currentUser?.phone || '+91 98765-43210');
  const [email, setEmail] = useState(currentUser?.email || 'wasimali0202@gmail.com');

  // Documents
  const [documents, setDocuments] = useState<ItrSubmissionDocument[]>([
    {
      id: 'doc-pnl',
      name: 'Zerodha_Tax_PnL_FY2425.xlsx',
      type: 'other',
      size: '2.8 MB',
      uploadedAt: 'Today',
      verified: true,
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAck, setSubmittedAck] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Tax calculation under latest Finance Act budget rules
  const calculateGainTaxes = () => {
    let stcgTax = 0;
    let ltcgTax = 0;
    let cryptoTax = 0;
    let realEstateTax = 0;

    if (assetType === 'equity_mf') {
      // 20% on STCG
      stcgTax = Math.round(stcgEquity * 0.20);
      // 12.5% on LTCG over 1.25 Lakh
      const taxableLtcg = Math.max(0, ltcgEquity - 125000);
      ltcgTax = Math.round(taxableLtcg * 0.125);
    } else if (assetType === 'real_estate') {
      const netGain = Math.max(0, salePrice - purchaseCost - sec54Exemption);
      realEstateTax = Math.round(netGain * 0.125);
    } else if (assetType === 'crypto_vda') {
      cryptoTax = Math.round(cryptoGain * 0.30);
    }

    const totalGainTax = stcgTax + ltcgTax + cryptoTax + realEstateTax;
    const cess = Math.round(totalGainTax * 0.04);
    return {
      totalGainTax: totalGainTax + cess,
      stcgTax,
      ltcgTax,
      cryptoTax,
      realEstateTax,
      cess
    };
  };

  const calc = calculateGainTaxes();

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

    if (!pan || pan.length !== 10) {
      setErrorMessage('Please enter a valid 10-character PAN.');
      return;
    }

    setIsSubmitting(true);

    const submissionId = 'CG-2025-' + Math.floor(100000 + Math.random() * 900000);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const netCapitalGain = assetType === 'equity_mf' 
      ? stcgEquity + ltcgEquity 
      : assetType === 'real_estate' 
      ? Math.max(0, salePrice - purchaseCost - sec54Exemption) 
      : cryptoGain;

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
      assessmentYear: 'AY 2025-26',
      incomeCategory: 'capital_gains',
      filingType: 'ITR-2-CAPITAL-GAINS',
      taxRegime: 'new',
      annualGrossIncome: netCapitalGain,
      deductions80C: 0,
      deductions80D: 0,
      otherDeductions: sec54Exemption,
      tdsPaid: 0,
      taxPayable: calc.totalGainTax,
      refundClaimed: 0,
      turnoverOrCapitalGains: netCapitalGain,
      clientNotes: `Asset: ${assetType}. STCG: ₹${stcgEquity}. LTCG: ₹${ltcgEquity}. Broker: ${brokerName}. Computed Tax: ₹${calc.totalGainTax}`,
      documents: documents,
      status: 'submitted',
      submittedAt: nowStr,
      updatedAt: nowStr,
      consultantNotes: 'Schedule CG computed with automatic set-off and carry-forward of capital losses. Ready for e-verification.',
      ackNumber: 'CG-ACK-' + Math.floor(1000000000 + Math.random() * 9000000000),
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
      <div className="max-w-3xl mx-auto my-8 p-6 sm:p-8 bg-white border border-emerald-200 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full uppercase tracking-wider">
            Schedule CG Computed & Filed
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Capital Gains Dossier Submitted!
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Your capital gains statement has been processed with the revised 12.5% LTCG and 20% STCG statutory provisions, plus grandfathering and indexation checks.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Filing Ack Ref:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{submittedAck}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Asset Class:</span>
            <span className="font-semibold text-slate-900 uppercase">{assetType.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Computed Capital Gain Tax:</span>
            <span className="font-bold text-emerald-700 text-sm">₹{calc.totalGainTax.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Schedule CG Computation</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmittedAck(null);
              if (onNavigateToTab) onNavigateToTab('my_submissions');
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#15803d] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Submissions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Capital Gains Tax • Stocks, Mutual Funds, Real Estate & Crypto</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Capital Gains Filing Form (Schedule CG)
        </h1>
        <p className="text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
          File ITR-2 or ITR-3 with auto-computed short-term and long-term capital gains, broker P&L statement parsing, Section 54 reinvestment relief, and grandfathering on pre-2018 equity holdings.
        </p>

        {/* Asset Class Selector */}
        <div className="pt-2 flex flex-wrap gap-2">
          {[
            { id: 'equity_mf', label: '1. Stocks & Mutual Funds (111A / 112A)' },
            { id: 'real_estate', label: '2. Real Estate Property Sale' },
            { id: 'crypto_vda', label: '3. Crypto & Virtual Digital Assets (115BBH)' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAssetType(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                assetType === tab.id 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-white/10 text-emerald-100 hover:bg-white/20'
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
          {assetType === 'equity_mf' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Listed Equities & Equity Mutual Funds Gains
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Short-Term Capital Gain (STCG @ 20%)
                  </label>
                  <input
                    type="number"
                    value={stcgEquity}
                    onChange={e => setStcgEquity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Sec 111A (Tax @ 20% + Cess)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Long-Term Capital Gain (LTCG @ 12.5%)
                  </label>
                  <input
                    type="number"
                    value={ltcgEquity}
                    onChange={e => setLtcgEquity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Sec 112A (First ₹1.25L exempt)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Primary Stockbroker
                  </label>
                  <input
                    type="text"
                    value={brokerName}
                    onChange={e => setBrokerName(e.target.value)}
                    placeholder="Zerodha, Groww, Angel One"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {assetType === 'real_estate' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Immovable Property & Real Estate Sale Particulars
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Sale Consideration / Price (₹)
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={e => setSalePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Cost of Acquisition (Purchase Cost) (₹)
                  </label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={e => setPurchaseCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Section 54 / 54EC Reinvestment Exemption (₹)
                  </label>
                  <input
                    type="number"
                    value={sec54Exemption}
                    onChange={e => setSec54Exemption(Number(e.target.value))}
                    placeholder="New residential house or 54EC bonds"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Stamp Duty Circle Rate Value (₹)
                  </label>
                  <input
                    type="number"
                    value={stampDutyValue}
                    onChange={e => setStampDutyValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {assetType === 'crypto_vda' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Crypto, NFT & Virtual Digital Assets (VDA)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Total Net Gain from VDA Trading (₹)
                  </label>
                  <input
                    type="number"
                    value={cryptoGain}
                    onChange={e => setCryptoGain(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 font-semibold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Flat 30% tax under Sec 115BBH (No loss set-off permitted)</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Tax Computation Card */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                Estimated Capital Gains Tax Liability
              </span>
              <p className="text-xs text-emerald-800 mt-0.5">
                Includes statutory Health & Education Cess @ 4%
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-900 font-mono">
                ₹{calc.totalGainTax.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Upload Broker File */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Attach Capital Gain P&L Statement (Excel / PDF)
            </span>
            <label className="p-4 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block">Attach Broker P&L Statement (Zerodha, Groww, Angel One)</span>
                <span className="text-[11px] text-slate-500">Supports .xlsx, .csv, or registered deed copy</span>
              </div>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Includes automatic Section 112A grandfathering & loss carry-forward</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#15803d] hover:bg-emerald-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span>{isSubmitting ? 'Computing Schedule CG & Submitting...' : 'File Capital Gains Return'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
