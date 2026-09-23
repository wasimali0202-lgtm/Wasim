import React from 'react';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  FileText, 
  ArrowLeft,
  Calendar,
  Building,
  User,
  CreditCard
} from 'lucide-react';
import { Language, TaxReturnData } from '../types';
import { getTranslation } from '../translations';

interface AcknowledgmentReceiptProps {
  taxReturn: TaxReturnData;
  language: Language;
  onBack: () => void;
}

export const AcknowledgmentReceipt: React.FC<AcknowledgmentReceiptProps> = ({
  taxReturn,
  language,
  onBack,
}) => {
  const t = getTranslation(language);
  const user = taxReturn.userProfile;
  const calc = taxReturn.calculation;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>'Back to Dashboard'</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printAck}</span>
          </button>
        </div>
      </div>

      {/* Official Government Tax Certificate Slip */}
      <div className="bg-white border-2 border-slate-800 rounded-xl p-8 sm:p-10 shadow-lg relative print:border-none print:shadow-none print:p-0">
        
        {/* Watermark / Digital Seal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none text-center">
          <ShieldCheck className="w-96 h-96 text-slate-900 mx-auto" />
          <span className="text-4xl font-black uppercase tracking-widest block font-mono">
            VERIFIED & PROCESSED
          </span>
        </div>

        {/* Official Header */}
        <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-800 text-white font-black text-lg mb-2 shadow-sm">
            ITD
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            "Government of India • Central Board of Direct Taxes"
          </h1>
          <h2 className="text-sm sm:text-base font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
            'INDIAN INCOME TAX RETURN VERIFICATION FORM (ITR-V)'
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Filed under Section 139(1) of Income Tax Act, 1961 • Assessment Year: {taxReturn.assessmentYear}
          </p>
        </div>

        {/* Verification Strip */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">{t.eVerified}</span>
              <span className="block text-[11px] text-emerald-700">
                'Successfully e-verified via Aadhaar OTP (EVC) and registered at CPC Bengaluru'
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-emerald-300 shadow-2xs">
              {taxReturn.acknowledgmentNumber || '140924901842019'}
            </span>
          </div>
        </div>

        {/* Two-column taxpayer details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
          {/* Column 1 */}
          <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>'Taxpayer Profile'</span>
            </h3>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t.fullNameLabel}:</span>
              <span className="font-bold text-slate-900">{user.name}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t.tinLabel}:</span>
              <span className="font-mono font-bold text-emerald-800">{user.tin}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t.nidLabel}:</span>
              <span className="font-mono text-slate-800">{user.nid}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t.phoneLabel}:</span>
              <span className="text-slate-800">{user.phone}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">'Taxpayer Status':</span>
              <span className="font-semibold capitalize text-slate-700">{user.taxpayerType}</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>'Jurisdiction & Filing'</span>
            </h3>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t.taxZone}:</span>
              <span className="font-medium text-slate-900">{user.taxZone}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t.taxCircle}:</span>
              <span className="font-medium text-slate-900">{user.taxCircle}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t.assessmentYear}:</span>
              <span className="font-bold text-slate-900">{taxReturn.assessmentYear}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t.submissionDate}:</span>
              <span className="text-slate-800">{taxReturn.submissionDate || '18 September 2024'}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-500">'Verification Ref':</span>
              <span className="font-mono text-emerald-700 font-semibold">{taxReturn.verificationCode || 'VRF-99201-NBR'}</span>
            </div>
          </div>
        </div>

        {/* Financial Assessment Summary Table */}
        <div className="mb-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
            <span>'Financial Statement & Tax Settlement Summary'</span>
          </h3>
          
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-300 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">SL</th>
                  <th className="py-2.5 px-3">'Description / Head'</th>
                  <th className="py-2.5 px-3 text-right">'Amount (₹)'</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3 font-mono">01</td>
                  <td className="py-2 px-3 font-medium text-slate-800">'Total Gross Income'</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">₹{calc.grossIncome.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono">02</td>
                  <td className="py-2 px-3 text-slate-600">'Exempted Income'</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700">₹{calc.exemptIncome.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-2 px-3 font-mono">03</td>
                  <td className="py-2 px-3 font-bold text-slate-900">'Total Taxable Income'</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">₹{calc.taxableIncome.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono">04</td>
                  <td className="py-2 px-3 text-slate-600">'Investment Tax Rebate'</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-700">₹{calc.investmentRebate.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono">05</td>
                  <td className="py-2 px-3 text-slate-600">'Advance Tax / TDS Paid'</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700">₹{calc.advanceTaxPaid.toLocaleString()}</td>
                </tr>
                <tr className="bg-emerald-50 font-bold text-emerald-950">
                  <td className="py-2 px-3 font-mono">06</td>
                  <td className="py-2 px-3">
                    {calc.refundAmount > 0 
                      ? ('Government Refund Claimable')
                      : ('Tax Settled via Treasury Challan')}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-800 text-sm">
                    {calc.refundAmount > 0 
                      ? `₹${calc.refundAmount.toLocaleString()}` 
                      : (taxReturn.payment?.amount !== undefined
                          ? `₹${taxReturn.payment.amount.toLocaleString()}`
                          : `₹${calc.netTaxPayable.toLocaleString()}`)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with QR Code & Digital Signature */}
        <div className="pt-6 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-slate-100 p-2 rounded-lg border border-slate-300 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-slate-800" />
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-800">
                'System Generated Digital Receipt'
              </p>
              <p>
                'Scan the QR code to verify validity on official e-Tax portal.'
              </p>
              <p className="font-mono text-[10px] text-slate-400">
                Hash: SHA256-9A81-22BC-44F0-E810
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="inline-block border-b border-slate-400 pb-1 mb-1 px-8 text-center font-serif italic text-slate-700">
              [Digitally Signed By e-Filing Officer]
            </div>
            <p className="font-bold text-slate-800">
              'Assistant Commissioner of Income Tax (CPC, Bengaluru)'
            </p>
            <p className="text-slate-500">
              {user.taxZone}, {user.taxCircle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
