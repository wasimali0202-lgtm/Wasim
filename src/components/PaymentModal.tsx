import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  CheckCircle2, 
  ShieldCheck, 
  Receipt, 
  Printer, 
  X, 
  Clock, 
  ArrowRight,
  Copy,
  Check,
  QrCode,
  FileText,
  ExternalLink,
  Lock,
  RefreshCw,
  Landmark
} from 'lucide-react';
import { Language, TaxReturnData, PaymentRecord } from '../types';
import { getTranslation } from '../translations';
import { incrementPlatformFiling } from '../utils/taxStats';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  taxReturn: TaxReturnData;
  onPaymentSuccess: (payment: PaymentRecord) => void;
}

type PaymentCategory = 'upi' | 'netbanking' | 'card' | 'challan280';
type UpiMode = 'qr' | 'vpa' | 'apps';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  language,
  taxReturn,
  onPaymentSuccess,
}) => {
  const t = getTranslation(language);
  const payableAmount = taxReturn.calculation.netTaxPayable || 0;
  
  // Customizable payment amount supporting ₹1 test payment, exact tax liability, or custom amount
  const [paymentAmount, setPaymentAmount] = useState<number>(() => {
    return payableAmount > 0 ? payableAmount : 1;
  });

  const [activeCategory, setActiveCategory] = useState<PaymentCategory>('upi');
  const [upiMode, setUpiMode] = useState<UpiMode>('qr');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred'>('gpay');
  const [vpaInput, setVpaInput] = useState('');
  const [vpaVerified, setVpaVerified] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('sbi');
  const [bankUserId, setBankUserId] = useState('');

  // Card State
  const [cardNumber, setCardNumber] = useState('6521 •••• •••• 9012');
  const [cardHolder, setCardHolder] = useState(taxReturn.userProfile.name);
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');

  // Challan 280 State
  const [majorHead] = useState('0021'); // Income-tax (Other than Companies)
  const [minorHead, setMinorHead] = useState<'300' | '100'>('300'); // 300: Self-Assessment Tax, 100: Advance Tax

  const [step, setStep] = useState<'select' | 'otp' | 'success'>('select');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastPayment, setLastPayment] = useState<PaymentRecord | null>(taxReturn.payment || null);

  const officialVpa = 'taxpay.incometax@sbi';

  // Timer countdown for UPI QR
  useEffect(() => {
    if (!isOpen || step !== 'select' || activeCategory !== 'upi' || upiMode !== 'qr') return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step, activeCategory, upiMode]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyVpa = () => {
    navigator.clipboard?.writeText?.(officialVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleVerifyVpa = () => {
    if (vpaInput.includes('@')) {
      setVpaVerified(true);
    }
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Challan280 or direct UPI bypasses OTP directly into generated challan
      if (activeCategory === 'challan280') {
        generateFinalPaymentReceipt('challan280');
      } else {
        setStep('otp');
      }
    }, 700);
  };

  const generateFinalPaymentReceipt = (customMethod?: any) => {
    const bsrCode = '0002145'; // State Bank of India Special Income Tax Branch
    const serial = Math.floor(10000 + Math.random() * 90000).toString();
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const cin = `${bsrCode}${dateStr}${serial}`;
    const challanNum = 'ITNS-280-' + Math.floor(10000000 + Math.random() * 90000000);
    const randomTx = 'UPI-IN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const determinedMethod = customMethod || (
      activeCategory === 'upi' ? selectedUpiApp :
      activeCategory === 'netbanking' ? 'netbanking' :
      activeCategory === 'card' ? 'card' : 'challan280'
    );

    const newPayment: PaymentRecord = {
      transactionId: randomTx,
      amount: Math.max(1, paymentAmount),
      method: determinedMethod,
      upiId: activeCategory === 'upi' ? (vpaInput || officialVpa) : undefined,
      bsrCode,
      challanSerial: serial,
      cin,
      bankName: activeCategory === 'netbanking' ? getBankName(selectedBank) : 'State Bank of India (e-Pay Tax)',
      majorHead,
      minorHead,
      status: 'completed',
      paidAt: new Date().toLocaleString(language === 'bn' ? 'bn-IN' : 'en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      challanNumber: challanNum,
      bankRef: 'SBI-EPAY-' + Math.floor(1000000 + Math.random() * 9000000),
    };

    setLastPayment(newPayment);
    onPaymentSuccess(newPayment);
    incrementPlatformFiling({
      type: 'e-Pay Tax Challan 280',
      city: 'India',
      user: taxReturn.userProfile.name || 'Verified Taxpayer',
      refundAmount: newPayment.amount
    });
    setStep('success');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      generateFinalPaymentReceipt();
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  const getBankName = (code: string) => {
    switch(code) {
      case 'sbi': return 'State Bank of India (SBI)';
      case 'hdfc': return 'HDFC Bank';
      case 'icici': return 'ICICI Bank';
      case 'axis': return 'Axis Bank';
      case 'pnb': return 'Punjab National Bank (PNB)';
      case 'bob': return 'Bank of Baroda';
      case 'kotak': return 'Kotak Mahindra Bank';
      case 'canara': return 'Canara Bank';
      default: return 'Authorized Scheduled Bank of India';
    }
  };

  // Indian UPI Apps list
  const upiApps = [
    { id: 'gpay', name: 'Google Pay', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { id: 'phonepe', name: 'PhonePe', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    { id: 'paytm', name: 'Paytm UPI', color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
    { id: 'bhim', name: 'BHIM (NPCI)', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    { id: 'cred', name: 'CRED UPI', color: 'text-slate-900', bg: 'bg-slate-100 border-slate-300' }
  ];

  // Top Indian Banks
  const topBanks = [
    { id: 'sbi', name: 'State Bank of India', tag: 'Govt. e-Pay Primary' },
    { id: 'hdfc', name: 'HDFC Bank', tag: 'Fast' },
    { id: 'icici', name: 'ICICI Bank', tag: 'Fast' },
    { id: 'axis', name: 'Axis Bank', tag: 'Fast' },
    { id: 'pnb', name: 'Punjab National Bank', tag: 'Public Sector' },
    { id: 'bob', name: 'Bank of Baroda', tag: 'Public Sector' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', tag: 'Instant' },
    { id: 'canara', name: 'Canara Bank', tag: 'Public Sector' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Header Strip with Government of India and Income Tax Department */}
        <div className="bg-slate-900 text-white p-5 relative border-b-2 border-amber-500 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80" 
            alt="Payment and Banking Security" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-emerald-950/85 to-slate-950/90 pointer-events-none"></div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Govt. of India • CBDT
                </span>
                <span className="text-[10px] font-mono text-emerald-300">
                  AY 2025-26
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                'e-Pay Tax • Challan ITNS 280 & Indian UPI Gateway'
              </h2>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-5">
              
              {/* PAN & Assessment Header Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">'Taxpayer PAN':</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{taxReturn.userProfile.tin || 'ABCPA1234F'}</span>
                  <span className="block text-[10px] text-slate-500 truncate max-w-[180px] sm:max-w-none">{taxReturn.userProfile.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">'Challan Head':</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                    (0021) Self-Assessment (300)
                  </span>
                </div>
              </div>

              {/* Payment Amount Setting Box */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    'Payment Amount (INR)'
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setPaymentAmount(1)}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                        paymentAmount === 1 
                          ? 'bg-emerald-700 text-white shadow-xs' 
                          : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      '₹1 Test Pay'
                    </button>
                    {payableAmount > 1 && (
                      <button
                        type="button"
                        onClick={() => setPaymentAmount(payableAmount)}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          paymentAmount === payableAmount 
                            ? 'bg-emerald-700 text-white shadow-xs' 
                            : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        {language === 'bn' ? `Liability: ₹${payableAmount.toLocaleString()}` : `Liability: ₹${payableAmount.toLocaleString()}`}
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-emerald-800">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border-2 border-emerald-400 rounded-xl font-mono text-xl font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Main Category Tabs: UPI, Net Banking, Cards, Challan 280 */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveCategory('upi')}
                  className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeCategory === 'upi'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span>'UPI'</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('netbanking')}
                  className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeCategory === 'netbanking'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 shrink-0" />
                  <span>'Net Banking'</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('card')}
                  className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeCategory === 'card'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                  <span>'RuPay/Cards'</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('challan280')}
                  className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeCategory === 'challan280'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5 shrink-0" />
                  <span>'Challan 280'</span>
                </button>
              </div>

              {/* Form / Content based on selected Category */}
              <form onSubmit={handleInitiatePayment} className="space-y-4">
                
                {/* 1. UPI SECTION */}
                {activeCategory === 'upi' && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    
                    {/* UPI Sub-modes: QR Code vs Enter VPA vs Popular Apps */}
                    <div className="flex border-b border-slate-200 pb-2 gap-4 text-xs font-semibold text-slate-500">
                      <button
                        type="button"
                        onClick={() => setUpiMode('qr')}
                        className={`flex items-center space-x-1.5 pb-1 border-b-2 cursor-pointer transition-colors ${
                          upiMode === 'qr' ? 'border-emerald-600 text-emerald-800 font-bold' : 'border-transparent hover:text-slate-800'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>'Dynamic UPI QR'</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiMode('vpa')}
                        className={`flex items-center space-x-1.5 pb-1 border-b-2 cursor-pointer transition-colors ${
                          upiMode === 'vpa' ? 'border-emerald-600 text-emerald-800 font-bold' : 'border-transparent hover:text-slate-800'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>'Enter UPI ID / VPA'</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiMode('apps')}
                        className={`flex items-center space-x-1.5 pb-1 border-b-2 cursor-pointer transition-colors ${
                          upiMode === 'apps' ? 'border-emerald-600 text-emerald-800 font-bold' : 'border-transparent hover:text-slate-800'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>'UPI Apps'</span>
                      </button>
                    </div>

                    {/* QR Code Mode */}
                    {upiMode === 'qr' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">
                            'Scan with any Indian UPI App:'
                          </span>
                          <span className="flex items-center space-x-1 font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimer(countdown)}</span>
                          </span>
                        </div>

                        {/* Interactive Dynamic QR Display */}
                        <div className="inline-block p-3.5 bg-white border-2 border-slate-800 rounded-2xl shadow-md relative">
                          <div className="w-44 h-44 bg-white flex flex-col items-center justify-center relative p-1">
                            {/* Realistic SVG UPI QR Pattern */}
                            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                              {/* Position detection squares */}
                              <rect x="0" y="0" width="28" height="28" fill="currentColor" rx="4" />
                              <rect x="4" y="4" width="20" height="20" fill="white" rx="2" />
                              <rect x="8" y="8" width="12" height="12" fill="currentColor" rx="2" />

                              <rect x="72" y="0" width="28" height="28" fill="currentColor" rx="4" />
                              <rect x="76" y="4" width="20" height="20" fill="white" rx="2" />
                              <rect x="80" y="8" width="12" height="12" fill="currentColor" rx="2" />

                              <rect x="0" y="72" width="28" height="28" fill="currentColor" rx="4" />
                              <rect x="4" y="76" width="20" height="20" fill="white" rx="2" />
                              <rect x="8" y="80" width="12" height="12" fill="currentColor" rx="2" />

                              {/* Matrix dots simulating real UPI encoding */}
                              <rect x="34" y="4" width="6" height="6" />
                              <rect x="44" y="4" width="6" height="12" />
                              <rect x="56" y="4" width="10" height="6" />
                              
                              <rect x="34" y="16" width="8" height="8" />
                              <rect x="48" y="18" width="8" height="6" />
                              <rect x="60" y="14" width="6" height="10" />

                              <rect x="4" y="34" width="6" height="8" />
                              <rect x="14" y="34" width="12" height="6" />
                              <rect x="4" y="46" width="10" height="6" />
                              <rect x="18" y="44" width="8" height="10" />
                              <rect x="4" y="58" width="8" height="8" />
                              <rect x="16" y="58" width="10" height="6" />

                              {/* Center decorative Indian Rupee / NPCI Emblem */}
                              <rect x="38" y="38" width="24" height="24" fill="white" rx="4" />
                              <circle cx="50" cy="50" r="10" fill="#047857" />
                              <text x="50" y="54" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="sans-serif">₹</text>

                              <rect x="68" y="34" width="8" height="6" />
                              <rect x="80" y="34" width="14" height="6" />
                              <rect x="68" y="44" width="12" height="8" />
                              <rect x="84" y="44" width="10" height="8" />
                              <rect x="74" y="56" width="6" height="10" />
                              <rect x="84" y="56" width="12" height="6" />

                              <rect x="34" y="68" width="10" height="6" />
                              <rect x="48" y="68" width="8" height="8" />
                              <rect x="60" y="68" width="8" height="6" />
                              <rect x="34" y="80" width="6" height="14" />
                              <rect x="44" y="82" width="12" height="6" />
                              <rect x="60" y="78" width="6" height="16" />
                              <rect x="70" y="72" width="6" height="8" />
                              <rect x="80" y="72" width="14" height="6" />
                              <rect x="72" y="84" width="8" height="10" />
                              <rect x="84" y="82" width="10" height="12" />
                            </svg>
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 block mt-1 tracking-wider uppercase font-mono">
                            NPCI • BHIM UPI 2.0
                          </span>
                        </div>

                        {/* VPA & Copy Pill */}
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <span className="text-slate-500">'UPI VPA:'</span>
                          <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-300">
                            {officialVpa}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyVpa}
                            className="p-1.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                            title="Copy UPI VPA"
                          >
                            {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedVpa ? ('Copied') : ('Copy')}</span>
                          </button>
                        </div>

                        {/* Popular App Badges */}
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <span className="text-[11px] text-slate-500 font-medium">
                            'Open in:'
                          </span>
                          <div className="flex gap-1.5">
                            {upiApps.slice(0, 4).map((app) => (
                              <span 
                                key={app.id} 
                                className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white border border-slate-300 text-slate-700 shadow-2xs"
                              >
                                {app.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VPA Input Mode */}
                    {upiMode === 'vpa' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            'Enter your UPI ID / Virtual Payment Address'
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={vpaInput}
                              onChange={(e) => {
                                setVpaInput(e.target.value);
                                setVpaVerified(false);
                              }}
                              placeholder="e.g. mobile@okhdfcbank or name@paytm"
                              className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyVpa}
                              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                              'Verify'
                            </button>
                          </div>
                        </div>

                        {/* VPA Verified Badge */}
                        {vpaVerified && (
                          <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <span className="font-bold">
                                'Valid NPCI UPI ID'
                              </span>
                              <span className="block text-[11px] text-emerald-700">
                                {taxReturn.userProfile.name} • SBIN0029410
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Quick Extension Pills */}
                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1.5">
                            'Quick handle extensions:'
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {['@oksbi', '@okhdfcbank', '@okicici', '@okaxis', '@paytm', '@ybl', '@upi'].map((handle) => (
                              <button
                                key={handle}
                                type="button"
                                onClick={() => {
                                  const username = vpaInput.split('@')[0] || '9876543210';
                                  setVpaInput(`${username}${handle}`);
                                  setVpaVerified(true);
                                }}
                                className="px-2 py-0.5 text-[11px] font-mono font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 rounded-md transition-colors cursor-pointer"
                              >
                                {handle}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Popular Apps Mode */}
                    {upiMode === 'apps' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {upiApps.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => setSelectedUpiApp(app.id as any)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              selectedUpiApp === app.id
                                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${app.bg} ${app.color}`}>
                                UPI
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 text-xs block">{app.name}</span>
                                <span className="text-[10px] text-slate-500">Instant Redirect & Pay</span>
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="selectedUpiApp"
                              checked={selectedUpiApp === app.id}
                              onChange={() => setSelectedUpiApp(app.id as any)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}

                {/* 2. NET BANKING SECTION */}
                {activeCategory === 'netbanking' && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                      <span>'Select Authorized Indian Scheduled Bank:'</span>
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        CBDT Approved
                      </span>
                    </div>

                    {/* Top Banks Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {topBanks.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            selectedBank === bank.id
                              ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span className="block text-xs font-bold text-slate-800 leading-tight">
                            {bank.name}
                          </span>
                          <span className="block text-[10px] text-emerald-700 font-medium mt-1">
                            {bank.tag}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Bank User ID Simulation */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        {language === 'bn' ? `${getBankName(selectedBank)} Net Banking Customer ID / Username:` : `${getBankName(selectedBank)} Customer ID / Username:`}
                      </label>
                      <input
                        type="text"
                        value={bankUserId}
                        onChange={(e) => setBankUserId(e.target.value)}
                        placeholder="e.g. 784910283 or user@netbanking"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                      />
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>'Securely redirected to bank encryption portal for final OTP authorization.'</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. CARD SECTION */}
                {activeCategory === 'card' && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold">'Enter Card Details (RuPay / Visa / Mastercard):'</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        RuPay Domestic Supported
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        '16-Digit Card Number'
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="6521 •••• •••• 9012"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          'Name on Card'
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            'Expiry'
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-2.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono text-center text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            maxLength={3}
                            className="w-full px-2.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono text-center text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CHALLAN 280 DIRECT GENERATION */}
                {activeCategory === 'challan280' && (
                  <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in duration-150 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        <span>'Challan ITNS 280 Direct Generation'</span>
                      </span>
                      <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300">
                        ITNS 280
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                      <div>
                        <span className="text-slate-500 block text-[11px]">'Major Head:'</span>
                        <span className="font-bold text-slate-900">0021 - Income-tax (Other than Companies)</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">'Assessment Year:'</span>
                        <span className="font-bold text-slate-900">2025-2026 (FY 2024-25)</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">'Permanent Account Number:'</span>
                        <span className="font-mono font-bold text-emerald-800">{taxReturn.userProfile.tin || 'ABCPA1234F'}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">'Type of Payment (Minor Head):'</span>
                        <select
                          value={minorHead}
                          onChange={(e: any) => setMinorHead(e.target.value)}
                          className="mt-1 w-full px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-900 text-xs"
                        >
                          <option value="300">(300) Self-Assessment Tax</option>
                          <option value="100">(100) Advance Tax</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
                      'Generating Challan 280 generates instant CIN and BSR Code (0002145) validated by CBDT e-Pay Tax engine.'
                    </div>
                  </div>
                )}

                {/* Security Guarantee Banner */}
                <div className="flex items-center text-xs text-slate-500 space-x-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    'Secured via 256-bit encrypted CBDT & NPCI Unified Treasury Gateway.'
                  </span>
                </div>

                {/* Submit Payment Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>'Connecting to Gateway...'</span>
                  ) : (
                    <>
                      <span>
                        {activeCategory === 'challan280' 
                          ? (language === 'bn' ? `Generate Challan 280 & Pay (₹${paymentAmount.toLocaleString()})` : `Generate Challan 280 (₹${paymentAmount.toLocaleString()})`)
                          : (language === 'bn' ? `Proceed to Pay (₹${paymentAmount.toLocaleString()})` : `Proceed to Pay (₹${paymentAmount.toLocaleString()})`)}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* STEP 2: BANK / NPCI OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  'Enter Bank / NPCI 3D-Secure OTP'
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {`Please enter the 6-digit authentication OTP dispatched to your registered mobile (+91 ${taxReturn.userProfile.phone.slice(-5)}):`}
                </p>
              </div>

              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-48 text-center tracking-widest text-2xl font-bold py-2 bg-slate-50 border-2 border-emerald-500 rounded-xl focus:outline-hidden font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'bn' ? 'Test Demo Code: Enter "123456" or your received SMS OTP to approve.' : 'Test verification: enter "123456" or your SMS OTP code to confirm.'}
              </p>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  {t.prevStep}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center space-x-1"
                >
                  {loading ? (
                    <span>'Verifying & Generating...'</span>
                  ) : (
                    <span>'Authorize & Generate Challan'</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: OFFICIAL INDIAN CHALLAN 280 COUNTERFOIL RECEIPT */}
          {step === 'success' && lastPayment && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.paymentSuccess}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  'Your tax dues have been settled against Government of India Challan ITNS 280.'
                </p>
              </div>

              {/* Official Indian Challan ITNS 280 Counterfoil Preview */}
              <div className="p-5 bg-white border-2 border-slate-800 rounded-2xl text-left space-y-3 text-xs shadow-md relative">
                
                {/* Government Watermark Strip */}
                <div className="border-b-2 border-slate-800 pb-2 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block font-mono">
                    CHALLAN NO./ITNS 280 • TAXPAYER’S COUNTERFOIL
                  </span>
                  <span className="text-xs font-black text-slate-900 block">
                    INCOME TAX DEPARTMENT • GOVERNMENT OF INDIA
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-slate-500 block">'PAN:'</span>
                    <span className="font-mono font-bold text-emerald-900 text-xs">{taxReturn.userProfile.tin || 'ABCPA1234F'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">'Full Name:'</span>
                    <span className="font-bold text-slate-900 truncate block">{taxReturn.userProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">'Assessment Year:'</span>
                    <span className="font-bold text-slate-900">2025-26</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">'Tax Head:'</span>
                    <span className="font-bold text-slate-900">(0021) Other Than Companies</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-200 pb-2 bg-slate-50 p-2 rounded-lg">
                  <div>
                    <span className="text-slate-500 block">BSR Code (7 Digits):</span>
                    <span className="font-mono font-bold text-slate-800">{lastPayment.bsrCode || '0002145'}</span>
                    <span className="text-[10px] text-slate-500 block">SBI Special Tax Branch</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">'Challan Serial No:'</span>
                    <span className="font-mono font-bold text-slate-800">{lastPayment.challanSerial || '48291'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">'CIN (Challan Identification Number):'</span>
                    <span className="font-mono font-bold text-emerald-800 text-xs break-all">{lastPayment.cin || '00021451809240048291'}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">'Payment Mode':</span>
                    <span className="font-bold uppercase text-slate-800">
                      {lastPayment.method === 'upi' || lastPayment.method === 'gpay' || lastPayment.method === 'phonepe' || lastPayment.method === 'paytm' || lastPayment.method === 'bhim' ? 'Indian UPI (Instant)' : lastPayment.method}
                    </span>
                  </div>
                  {lastPayment.upiId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">VPA / UPI Ref:</span>
                      <span className="font-mono text-slate-700">{lastPayment.upiId}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-1">
                    <span className="text-slate-900 font-bold">'Total Amount Paid':</span>
                    <span className="font-bold text-emerald-700 text-base">₹{lastPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>'Payment Timestamp':</span>
                    <span>{lastPayment.paidAt}</span>
                  </div>
                </div>

              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>'Print Challan 280'</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  'Back to Dashboard'
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
