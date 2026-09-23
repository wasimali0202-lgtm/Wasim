import React, { useState } from 'react';
import { 
  FolderCheck, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Download, 
  ShieldCheck 
} from 'lucide-react';
import { Language, TaxDocument } from '../types';
import { getTranslation } from '../translations';
import { sampleDocuments } from '../initialData';

interface DocumentManagerProps {
  language: Language;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ language }) => {
  const t = getTranslation(language);
  const [docs, setDocs] = useState<TaxDocument[]>(sampleDocuments);
  const [filterType, setFilterType] = useState<string>('all');

  const handleAddDoc = () => {
    const docNames = language === 'bn' ? [
      'Govt Savings Certificate (Tax Cert).pdf',
      'House Rent Agreement (Tenancy).pdf',
      'Medical Receipts & Insurance Claim.pdf',
    ] : [
      'Sanchayapatra Profit & Tax Certificate.pdf',
      'House Rent Tenancy Agreement.pdf',
      'Medical Expense & Insurance Claim Receipts.pdf',
    ];
    const picked = docNames[Math.floor(Math.random() * docNames.length)];
    const newDoc: TaxDocument = {
      id: 'doc_' + Date.now(),
      name: picked,
      type: 'other',
      fileSize: '1.8 MB',
      uploadedAt: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'verified',
    };
    setDocs((prev) => [newDoc, ...prev]);
  };

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold mb-1">
            <FolderCheck className="w-4 h-4" />
            <span>'Secure Tax Document Vault'</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {t.documents}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            'All supporting income slips, investment receipts, and certificates stored securely.'
          </p>
        </div>

        <button
          onClick={handleAddDoc}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>'Upload Document'</span>
        </button>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <div 
            key={doc.id}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-center space-x-3 truncate mr-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <span className="font-bold text-xs text-slate-900 block truncate">{doc.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">{doc.fileSize} • {doc.uploadedAt}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle className="w-3 h-3" />
                <span>'Verified'</span>
              </span>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
