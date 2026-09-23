import React, { useState } from 'react';
import { 
  History, 
  Download, 
  FileCheck, 
  CheckCircle, 
  Calendar, 
  Search, 
  Eye, 
  ShieldCheck, 
  X,
  QrCode
} from 'lucide-react';
import { Language, PastFilingRecord } from '../types';
import { getTranslation } from '../translations';
import { samplePastFilings } from '../initialData';

interface FilingHistoryProps {
  language: Language;
}

export const FilingHistory: React.FC<FilingHistoryProps> = ({ language }) => {
  const t = getTranslation(language);
  const [records] = useState<PastFilingRecord[]>(samplePastFilings);
  const [selectedRecord, setSelectedRecord] = useState<PastFilingRecord | null>(null);

  const handleDownload = (rec: PastFilingRecord) => {
    alert(
      language === 'bn' 
        ? `${rec.assessmentYear} ITR-V Verification Slip (PDF) is ready for download!` 
        : `Acknowledgment PDF for ${rec.assessmentYear} downloaded!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold mb-1">
            <History className="w-4 h-4" />
            <span>'National e-Tax Historical Archive'</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {t.historyTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.historyDesc}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
            '3 Fiscal Years Registered'
          </span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">{t.assessmentYear}</th>
                <th className="py-3 px-4">{t.submissionDate}</th>
                <th className="py-3 px-4">{t.ackNumber}</th>
                <th className="py-3 px-4 text-right">{t.totalGrossIncome}</th>
                <th className="py-3 px-4 text-right">{t.taxPaid}</th>
                <th className="py-3 px-4 text-center">{t.status}</th>
                <th className="py-3 px-4 text-right">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{rec.assessmentYear}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{rec.filingDate}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">{rec.acknowledgmentNumber}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">₹{rec.grossIncome.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-bold">₹{rec.taxPaid.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      <span>{rec.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title={t.viewDetails}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(rec)}
                        className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title={t.download}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View for Archive Record */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedRecord.assessmentYear} 'Return Record'
                </h3>
                <span className="text-xs font-mono text-emerald-800 font-semibold">
                  {selectedRecord.acknowledgmentNumber}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs mb-4">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">{t.submissionDate}:</span>
                <span className="font-semibold text-slate-800">{selectedRecord.filingDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">{t.totalGrossIncome}:</span>
                <span className="font-mono font-bold text-slate-900">₹{selectedRecord.grossIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">{t.taxPaid}:</span>
                <span className="font-mono font-bold text-emerald-700">₹{selectedRecord.taxPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{t.status}:</span>
                <span className="font-semibold text-emerald-800">{selectedRecord.status}</span>
              </div>
            </div>

            <button
              onClick={() => {
                handleDownload(selectedRecord);
                setSelectedRecord(null);
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>'Download Certified Slip'</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
