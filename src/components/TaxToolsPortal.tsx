import React, { useState } from 'react';
import { 
  Calculator, 
  Search, 
  Scale, 
  Home, 
  Percent, 
  Award, 
  Receipt, 
  ShieldCheck, 
  HelpCircle, 
  Coins, 
  HeartHandshake, 
  DollarSign, 
  Clock, 
  FileText, 
  Printer, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw,
  TrendingUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export type ToolCategory = 'all' | 'income' | 'deductions' | 'investments' | 'compliance';

interface TaxToolsPortalProps {
  initialTool?: string;
  onNavigateToFiling?: () => void;
}

export const TaxToolsPortal: React.FC<TaxToolsPortalProps> = ({ 
  initialTool = 'tax_calculator', 
  onNavigateToFiling 
}) => {
  const [activeTool, setActiveTool] = useState<string>(initialTool);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ToolCategory>('all');

  // 1. Income Tax Calculator state
  const [income, setIncome] = useState<number>(950000);
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [deductions80D, setDeductions80D] = useState<number>(25000);
  const [hraDeduction, setHraDeduction] = useState<number>(60000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(100000);

  // 2. HRA Calculator state
  const [basicSalary, setBasicSalary] = useState<number>(600000);
  const [da, setDa] = useState<number>(50000);
  const [hraReceived, setHraReceived] = useState<number>(180000);
  const [totalRentPaid, setTotalRentPaid] = useState<number>(240000);
  const [isMetro, setIsMetro] = useState<boolean>(true);

  // 3. Gratuity Calculator state
  const [lastDrawnSalary, setLastDrawnSalary] = useState<number>(85000);
  const [tenureYears, setTenureYears] = useState<number>(7);

  // 4. Rent Receipt Generator state
  const [tenantName, setTenantName] = useState('Wasim Ali');
  const [landlordName, setLandlordName] = useState('Rajesh Sharma');
  const [landlordPan, setLandlordPan] = useState('ABCDE1234F');
  const [rentAmount, setRentAmount] = useState<number>(20000);
  const [rentalPropertyAddress, setRentalPropertyAddress] = useState('Flat 4B, Emerald Heights, Salt Lake, Kolkata 700091');
  const [receiptMonth, setReceiptMonth] = useState('April 2025');

  // 5. Section 234F Calculator state
  const [sec234FIncome, setSec234FIncome] = useState<number>(650000);
  const [filedAfterDueDate, setFiledAfterDueDate] = useState<boolean>(true);

  // 6. House Property Calculator state
  const [annualRentReceived, setAnnualRentReceived] = useState<number>(360000);
  const [municipalTaxesPaid, setMunicipalTaxesPaid] = useState<number>(15000);
  const [hpHomeLoanInterest, setHpHomeLoanInterest] = useState<number>(200000);
  const [isSelfOccupied, setIsSelfOccupied] = useState<boolean>(false);

  // 7. NSC Calculator state
  const [nscDeposit, setNscDeposit] = useState<number>(100000);
  const [nscRate] = useState<number>(7.7); // 7.7% compounded annually

  // 8. Simple Interest Calculator state
  const [siPrincipal, setSiPrincipal] = useState<number>(50000);
  const [siRate, setSiRate] = useState<number>(7.5);
  const [siTime, setSiTime] = useState<number>(3);

  // 9. Compound Interest Calculator state
  const [ciPrincipal, setCiPrincipal] = useState<number>(100000);
  const [ciRate, setCiRate] = useState<number>(8.0);
  const [ciTime, setCiTime] = useState<number>(5);
  const [ciFrequency, setCiFrequency] = useState<number>(4); // Quarterly

  // 10. SSY (Sukanya Samriddhi Yojana) Calculator state
  const [ssyAnnualDeposit, setSsyAnnualDeposit] = useState<number>(60000);
  const [ssyStartAge, setSsyStartAge] = useState<number>(2);

  // 11. Leave Encashment Calculator state
  const [leBasicDa, setLeBasicDa] = useState<number>(75000);
  const [leLeaveBalanceDays, setLeLeaveBalanceDays] = useState<number>(60);
  const [leAmountReceived, setLeAmountReceived] = useState<number>(250000);
  const [isGovtEmployee, setIsGovtEmployee] = useState<boolean>(false);

  // 12. Cryptocurrency Tax Calculator state
  const [cryptoSaleValue, setCryptoSaleValue] = useState<number>(300000);
  const [cryptoBuyCost, setCryptoBuyCost] = useState<number>(180000);

  // 13. 80D Calculator state
  const [medSelf, setMedSelf] = useState<number>(25000);
  const [medParents, setMedParents] = useState<number>(30000);
  const [parentsSenior, setParentsSenior] = useState<boolean>(true);
  const [preventiveCheckup, setPreventiveCheckup] = useState<number>(5000);

  // 14. 80TTA/80TTB Calculator state
  const [savingsInterest, setSavingsInterest] = useState<number>(18500);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  // 15. 80DD / 80U Calculator state
  const [disabilityPercentage, setDisabilityPercentage] = useState<'mild' | 'severe'>('mild'); // mild (40%-79%), severe (80%+)

  // 16. TDS Calculator state
  const [tdsPaymentAmount, setTdsPaymentAmount] = useState<number>(150000);
  const [tdsSection, setTdsSection] = useState<'194C' | '194J' | '194I_rent_prop' | '194H_comm' | '194A_bank'>('194J');

  // 17. IFSC Code Search state
  const [searchIfsc, setSearchIfsc] = useState('SBIN0001234');
  const [ifscResult, setIfscResult] = useState<any>(null);

  // 18. Tax Refund Status state
  const [refundPan, setRefundPan] = useState('ABCPA1234F');
  const [refundAy, setRefundAy] = useState('2025-2026');
  const [refundStatusResult, setRefundStatusResult] = useState<any>(null);

  // 19. ITR Eligibility Checker state
  const [incomeSource, setIncomeSource] = useState<'salary' | 'business' | 'capital_gains' | 'crypto'>('salary');
  const [totalIncomeLevel, setTotalIncomeLevel] = useState<string>('under_50L');
  const [hasForeignAssets, setHasForeignAssets] = useState<boolean>(false);
  const [directorInPvtLtd, setDirectorInPvtLtd] = useState<boolean>(false);

  // Tool definitions list
  const tools = [
    { id: 'tax_calculator', name: 'Income Tax Calculator', category: 'income', icon: Scale, badge: 'Budget 2025', desc: 'Compare Old vs New Tax Regime for FY 2025-26 & AY 2026-27' },
    { id: 'old_vs_new', name: 'Old vs New Tax Slab Regime', category: 'income', icon: TrendingUp, badge: 'Regime Compare', desc: 'Breakeven analysis to discover which regime saves maximum tax' },
    { id: 'refund_status', name: 'Tax Refund Status', category: 'compliance', icon: CheckCircle2, badge: 'Live Tracker', desc: 'Track your ITR Refund credit, CPC processing & NSDL status' },
    { id: 'form_12bb', name: 'Form 12BB Generator', category: 'compliance', icon: FileText, badge: 'Fill & Print', desc: 'Generate official employee investment declaration form' },
    { id: 'rent_receipt', name: 'Rent Receipt Generator', category: 'deductions', icon: Receipt, badge: 'Printable', desc: 'Generate HRA rent receipts with landlord PAN & stamp endorsement' },
    { id: 'hra_calc', name: 'HRA Calculator', category: 'deductions', icon: Home, badge: 'Sec 10(13A)', desc: 'Calculate House Rent Allowance tax exemption rules' },
    { id: 'house_property', name: 'House Property Calculator', category: 'income', icon: Home, badge: 'Sec 24', desc: 'Self-occupied & let-out income/loss and home loan interest cap' },
    { id: 'gratuity_calc', name: 'Gratuity Calculator', category: 'income', icon: Award, badge: 'Sec 10(10)', desc: 'Estimate tax-exempt gratuity under Payment of Gratuity Act' },
    { id: 'tds_calc', name: 'TDS Calculator', category: 'compliance', icon: Percent, badge: 'TDS Rates', desc: 'Compute withholding tax for 194C, 194J, 194I, 194A' },
    { id: 'sec_234f', name: 'Calculator on Section 234F', category: 'compliance', icon: Clock, badge: 'Late Fee', desc: 'Determine late filing fee for filing after due date' },
    { id: 'itr_checker', name: 'ITR Eligibility Checker', category: 'compliance', icon: Sparkles, badge: 'Form Quiz', desc: 'Quick 30-second quiz to identify which ITR form you need' },
    { id: 'tax_saving', name: 'Tax Saving Calculator', category: 'deductions', icon: DollarSign, badge: 'Save Up to ₹1.2L', desc: 'Calculate potential tax savings under 80C, 80D, 80CCD(1B)' },
    { id: 'crypto_calc', name: 'Cryptocurrency Tax Calculator', category: 'income', icon: Coins, badge: 'Sec 115BBH', desc: 'Flat 30% tax on Virtual Digital Assets (VDA) + 1% TDS' },
    { id: 'sec_80d', name: '80D Calculator', category: 'deductions', icon: HeartHandshake, badge: 'Health Insurance', desc: 'Deductions for health insurance of self, family & senior parents' },
    { id: 'sec_80tta', name: '80TTA / 80TTB Calculator', category: 'deductions', icon: Percent, badge: 'Bank Interest', desc: 'Deduction on savings account & FD interest up to ₹50,000' },
    { id: 'sec_80dd_80u', name: '80DD & 80U Calculator', category: 'deductions', icon: HeartHandshake, badge: 'Disability Relief', desc: 'Fixed deductions of ₹75,000 / ₹1,25,000 for disability' },
    { id: 'leave_encash', name: 'Leave Encashment Calculator', category: 'income', icon: Award, badge: 'Sec 10(10AA)', desc: 'Exemption calculation on earned leave cash-out up to ₹25 lakh' },
    { id: 'transport_allow', name: 'Transport Allowance Calculator', category: 'deductions', icon: TrendingUp, badge: 'Specially Abled', desc: 'Exemption for transport allowance for differently abled employees' },
    { id: 'nsc_calc', name: 'NSC Calculator', category: 'investments', icon: Coins, badge: '7.7% Post Office', desc: 'Maturity amount & annual accrued interest for 5-Yr NSC' },
    { id: 'ssy_calc', name: 'SSY Calculator', category: 'investments', icon: Sparkles, badge: '8.2% Sukanya', desc: 'Maturity calculation for Sukanya Samriddhi Yojana' },
    { id: 'simple_interest', name: 'Simple Interest Calculator', category: 'investments', icon: Calculator, badge: 'P×R×T / 100', desc: 'Quick interest and final maturity computation' },
    { id: 'compound_interest', name: 'Compound Interest Calculator', category: 'investments', icon: TrendingUp, badge: 'Compounding', desc: 'Quarterly/annual compounding wealth growth simulator' },
    { id: 'ifsc_search', name: 'IFSC Code Search', category: 'compliance', icon: Search, badge: 'Bank Branch', desc: 'Lookup branch name, MICR and address for refund bank setup' },
  ];

  const filteredTools = tools.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculation helpers
  // 1. Tax calculation: New Regime vs Old Regime FY 2025-26
  const computeNewRegimeTax = (gross: number) => {
    const stdDed = 75000; // Enhanced standard deduction in New Regime
    const taxable = Math.max(0, gross - stdDed);
    if (taxable <= 300000) return 0;
    if (taxable <= 700000) return 0; // Sec 87A rebate covers up to 7L taxable
    
    let tax = 0;
    // 0-3L: 0%
    // 3L-7L: 5% (4,00,000 * 5% = 20,000)
    // 7L-10L: 10% (3,00,000 * 10% = 30,000)
    // 10L-12L: 15% (2,00,000 * 15% = 30,000)
    // 12L-15L: 20% (3,00,000 * 20% = 60,000)
    // >15L: 30%
    if (taxable > 300000) tax += Math.min(taxable - 300000, 400000) * 0.05;
    if (taxable > 700000) tax += Math.min(taxable - 700000, 300000) * 0.10;
    if (taxable > 1000000) tax += Math.min(taxable - 1000000, 200000) * 0.15;
    if (taxable > 1200000) tax += Math.min(taxable - 1200000, 300000) * 0.20;
    if (taxable > 1500000) tax += (taxable - 1500000) * 0.30;

    const cess = tax * 0.04;
    return Math.round(tax + cess);
  };

  const computeOldRegimeTax = (gross: number, d80C: number, d80D: number, hra: number, hlInt: number) => {
    const stdDed = 50000;
    const capped80C = Math.min(d80C, 150000);
    const capped80D = Math.min(d80D, 100000);
    const cappedHl = Math.min(hlInt, 200000);
    const totalDeductions = stdDed + capped80C + capped80D + hra + cappedHl;
    const taxable = Math.max(0, gross - totalDeductions);

    if (taxable <= 250000) return 0;
    if (taxable <= 500000) return 0; // Sec 87A rebate covers up to 5L

    let tax = 0;
    // 2.5L - 5L: 5% = 12500
    // 5L - 10L: 20% = 100000
    // >10L: 30%
    if (taxable > 250000) tax += Math.min(taxable - 250000, 250000) * 0.05;
    if (taxable > 500000) tax += Math.min(taxable - 500000, 500000) * 0.20;
    if (taxable > 1000000) tax += (taxable - 1000000) * 0.30;

    const cess = tax * 0.04;
    return Math.round(tax + cess);
  };

  const newRegimeTax = computeNewRegimeTax(income);
  const oldRegimeTax = computeOldRegimeTax(income, deductions80C, deductions80D, hraDeduction, homeLoanInterest);
  const taxSavingsDifference = Math.abs(oldRegimeTax - newRegimeTax);
  const recommendedRegime = newRegimeTax <= oldRegimeTax ? 'New Tax Regime' : 'Old Tax Regime';

  // HRA Exemption computation
  const salaryForHra = basicSalary + da;
  const condition1 = hraReceived;
  const condition2 = Math.max(0, totalRentPaid - 0.10 * salaryForHra);
  const condition3 = (isMetro ? 0.50 : 0.40) * salaryForHra;
  const hraExempt = Math.min(condition1, condition2, condition3);
  const hraTaxable = Math.max(0, hraReceived - hraExempt);

  // Gratuity calculation: 15/26 * Last Drawn Salary * Tenure
  const rawGratuity = Math.round((15 / 26) * lastDrawnSalary * tenureYears);
  const gratuityExempt = Math.min(rawGratuity, 2000000); // Max 20 Lakhs statutory limit

  // Section 234F Late fee calculation
  const sec234FFee = filedAfterDueDate ? (sec234FIncome <= 500000 ? 1000 : 5000) : 0;

  // House property calculation
  const grossAnnualValue = isSelfOccupied ? 0 : annualRentReceived;
  const netAnnualValue = Math.max(0, grossAnnualValue - (isSelfOccupied ? 0 : municipalTaxesPaid));
  const standardDeduction24a = isSelfOccupied ? 0 : Math.round(netAnnualValue * 0.30);
  const interestDeduction24b = isSelfOccupied ? Math.min(hpHomeLoanInterest, 200000) : hpHomeLoanInterest;
  const incomeFromHp = netAnnualValue - standardDeduction24a - interestDeduction24b;

  // NSC maturity: 5 years at 7.7% compounded annually
  const nscMaturity = Math.round(nscDeposit * Math.pow(1 + nscRate / 100, 5));
  const nscInterestEarned = nscMaturity - nscDeposit;

  // Simple interest: P * R * T / 100
  const siInterest = Math.round((siPrincipal * siRate * siTime) / 100);
  const siTotal = siPrincipal + siInterest;

  // Compound interest: A = P(1 + r/n)^(nt)
  const ciAmount = Math.round(ciPrincipal * Math.pow(1 + (ciRate / 100) / ciFrequency, ciFrequency * ciTime));
  const ciInterest = ciAmount - ciPrincipal;

  // SSY calculation: approximate maturity after 21 years with 15 years deposit at 8.2%
  const ssyTotalDeposited = ssyAnnualDeposit * 15;
  // Compound factor estimate for 15 yrs deposit compounding over 21 yrs
  const ssyMaturityEstimate = Math.round(ssyAnnualDeposit * 37.8);

  // Leave encashment calculation
  const maxStatutoryLeaveLimit = 2500000; // Enhanced to 25 Lakhs
  const leaveExemptAmount = isGovtEmployee 
    ? leAmountReceived 
    : Math.min(leAmountReceived, maxStatutoryLeaveLimit, Math.round((leBasicDa / 30) * leLeaveBalanceDays * 10));

  // Crypto calculation: 30% flat + 4% cess + 1% TDS
  const cryptoGain = Math.max(0, cryptoSaleValue - cryptoBuyCost);
  const cryptoTax = Math.round(cryptoGain * 0.312); // 30% + 4% cess = 31.2%
  const cryptoTds = Math.round(cryptoSaleValue * 0.01);

  // 80D Calculation
  const selfLimit = 25000;
  const parentsLimit = parentsSenior ? 50000 : 25000;
  const total80DAllowed = Math.min(medSelf, selfLimit) + Math.min(medParents, parentsLimit) + Math.min(preventiveCheckup, 5000);

  // 80TTA / 80TTB calculation
  const ttaLimit = isSeniorCitizen ? 50000 : 10000;
  const ttaDeductionAllowed = Math.min(savingsInterest, ttaLimit);

  // 80DD / 80U calculation
  const disabilityDeduction = disabilityPercentage === 'severe' ? 125000 : 75000;

  // TDS calculation
  const tdsRates: Record<string, { rate: number; label: string }> = {
    '194C': { rate: 1.0, label: 'Sec 194C - Contractor (1% Indiv / 2% Co)' },
    '194J': { rate: 10.0, label: 'Sec 194J - Professional / Technical Fees (10%)' },
    '194I_rent_prop': { rate: 10.0, label: 'Sec 194I - Rent of Land / Building (10%)' },
    '194H_comm': { rate: 5.0, label: 'Sec 194H - Brokerage & Commission (5%)' },
    '194A_bank': { rate: 10.0, label: 'Sec 194A - Bank Interest (10%)' }
  };
  const activeTdsRate = tdsRates[tdsSection]?.rate || 10;
  const calculatedTdsAmount = Math.round((tdsPaymentAmount * activeTdsRate) / 100);

  // Refund Status lookup simulator
  const handleCheckRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundPan || refundPan.length < 10) return;
    setRefundStatusResult({
      pan: refundPan.toUpperCase(),
      assessmentYear: refundAy,
      status: 'Refund Credited to Bank Account',
      statusCode: 'CREDITED_PROCESSED',
      amount: 14850,
      bankAccount: 'State Bank of India (Ending with *7492)',
      cpcRef: 'CPC/2025-26/RT/9182746192',
      refundDate: '18-Aug-2025',
      modeOfPayment: 'Direct Account Credit (NEFT/RTGS via NECS)',
      remarks: 'Return successfully processed under Section 143(1). No demand or adjustment pending.'
    });
  };

  // IFSC search lookup simulator
  const handleSearchIfsc = (e: React.FormEvent) => {
    e.preventDefault();
    const code = searchIfsc.trim().toUpperCase();
    if (code.startsWith('SBIN')) {
      setIfscResult({
        bank: 'State Bank of India',
        ifsc: code,
        micr: '700002014',
        branch: 'Salt Lake Sector I, Kolkata',
        address: 'Plot No. 12, Block DB, Sector I, Salt Lake City, Kolkata - 700064',
        city: 'Kolkata',
        state: 'West Bengal',
        contact: '033-23348910',
        rtgs: true,
        neft: true,
        imps: true
      });
    } else if (code.startsWith('HDFC')) {
      setIfscResult({
        bank: 'HDFC Bank Ltd',
        ifsc: code,
        micr: '110240003',
        branch: 'Connaught Place Branch, New Delhi',
        address: 'B-6, Inner Circle, Connaught Place, New Delhi - 110001',
        city: 'New Delhi',
        state: 'Delhi',
        contact: '011-41512300',
        rtgs: true,
        neft: true,
        imps: true
      });
    } else {
      setIfscResult({
        bank: 'Punjab National Bank',
        ifsc: code,
        micr: '400024018',
        branch: 'Fort Business District, Mumbai',
        address: 'Nariman Point, Ground Floor, Mumbai - 400021',
        city: 'Mumbai',
        state: 'Maharashtra',
        contact: '022-22851400',
        rtgs: true,
        neft: true,
        imps: true
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="bg-linear-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-emerald-900/50 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>Official Suite of 22+ Tax Calculators & Utility Generators</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Indian Income Tax & Financial <span className="text-emerald-400">Tools Portal</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Updated for FY 2025-26 & AY 2026-27 with Union Budget tax provisions. Compare tax slabs, generate printable Form 12BB & Rent Receipts, track refund credits, and compute exact exemptions instantly.
            </p>

            {/* Search & Filter Bar */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any calculator (e.g. HRA, Gratuity, 234F, Form 12BB, Rent Receipt)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:bg-white/15"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 'income', 'deductions', 'investments', 'compliance'] as ToolCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                      categoryFilter === cat 
                        ? 'bg-emerald-500 text-white shadow-xs' 
                        : 'bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Tool Switcher & Active Interactive Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Tool Navigator Shelf */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Select Calculator ({filteredTools.length})
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  AY 2025-26
                </span>
              </div>

              <div className="max-h-[640px] overflow-y-auto space-y-1.5 pr-1">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const isSelected = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-800 text-white shadow-md' 
                          : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {tool.name}
                          </span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0 ${
                            isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {tool.badge}
                          </span>
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                          {tool.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick CTA box */}
            <div className="bg-linear-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold">Ready to File Your Return?</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Take your calculated exemptions directly into the fast e-Filing intake with instant CPC acknowledgment.
              </p>
              {onNavigateToFiling && (
                <button
                  type="button"
                  onClick={onNavigateToFiling}
                  className="w-full py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Start Instant ITR Filing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Active Interactive Calculator Canvas */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
              
              {/* 1. INCOME TAX CALCULATOR */}
              {activeTool === 'tax_calculator' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-black text-slate-900">
                        Income Tax Calculator (AY 2025-26)
                      </h2>
                      <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                        Budget 2024-25 Ready
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Calculate tax liability comparing Old vs New Tax Regime with revised slabs and standard deduction.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Annual Gross Total Income (₹)
                        </label>
                        <input
                          type="number"
                          step="10000"
                          value={income}
                          onChange={(e) => setIncome(Number(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-bold"
                        />
                        <span className="text-[11px] text-slate-500">₹{income.toLocaleString('en-IN')}</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Section 80C Deductions (Max ₹1.5L)
                        </label>
                        <input
                          type="number"
                          value={deductions80C}
                          onChange={(e) => setDeductions80C(Number(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-medium"
                        />
                        <span className="text-[10px] text-slate-400">EPF, PPF, ELSS, Life Insurance, Tuition fee</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Section 80D Health Insurance (₹)
                        </label>
                        <input
                          type="number"
                          value={deductions80D}
                          onChange={(e) => setDeductions80D(Number(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          HRA Exemption Claimed (₹)
                        </label>
                        <input
                          type="number"
                          value={hraDeduction}
                          onChange={(e) => setHraDeduction(Number(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Home Loan Interest u/s 24(b) (Max ₹2L)
                        </label>
                        <input
                          type="number"
                          value={homeLoanInterest}
                          onChange={(e) => setHomeLoanInterest(Number(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    {/* Comparative Result Panel */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                          <span className="text-xs font-extrabold text-slate-700">Tax Regime Comparison</span>
                          <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-emerald-600 text-white">
                            Recommended: {recommendedRegime}
                          </span>
                        </div>

                        {/* New Regime Card */}
                        <div className={`p-4 rounded-xl border transition-all ${
                          recommendedRegime === 'New Tax Regime' 
                            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20' 
                            : 'bg-white border-slate-200'
                        }`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-slate-900">New Tax Regime</span>
                              <p className="text-[10px] text-slate-500">₹75,000 Standard Deduction included</p>
                            </div>
                            <span className="text-base font-black text-emerald-800">
                              ₹{newRegimeTax.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Old Regime Card */}
                        <div className={`p-4 rounded-xl border transition-all ${
                          recommendedRegime === 'Old Tax Regime' 
                            ? 'bg-teal-50/80 border-teal-300 ring-2 ring-teal-500/20' 
                            : 'bg-white border-slate-200'
                        }`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-slate-900">Old Tax Regime</span>
                              <p className="text-[10px] text-slate-500">Utilizing 80C, 80D, HRA & 24(b)</p>
                            </div>
                            <span className="text-base font-black text-slate-900">
                              ₹{oldRegimeTax.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                          <div className="flex justify-between text-slate-600 mb-1">
                            <span>Tax Savings by choosing {recommendedRegime}:</span>
                            <span className="font-extrabold text-emerald-800">₹{taxSavingsDifference.toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Includes 4% Health & Education Cess. Marginal relief applicable if income marginally exceeds ₹7,00,000 in New Regime.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onNavigateToFiling}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Proceed to File in {recommendedRegime}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. OLD VS NEW REGIME COMPARATOR */}
              {activeTool === 'old_vs_new' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">Old vs New Tax Slab Regime Comparator</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Check your breakeven deduction threshold where Old Regime beats New Regime.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Total Annual Income (₹)</label>
                        <input
                          type="number"
                          value={income}
                          onChange={(e) => setIncome(Number(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold"
                        />
                      </div>
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                        <span className="font-bold flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          Breakeven Deduction Rule:
                        </span>
                        <p className="text-[11px] leading-relaxed">
                          For an income of ₹{income.toLocaleString('en-IN')}, you need deductions greater than{' '}
                          <strong className="text-amber-950 font-bold">
                            ₹{Math.max(150000, Math.round(income * 0.28)).toLocaleString('en-IN')}
                          </strong>{' '}
                          in Old Regime to pay less tax than the New Regime.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-xs font-bold text-emerald-900 block mb-1">New Regime Perks:</span>
                        <ul className="text-[11px] text-emerald-800 space-y-1 list-disc pl-4">
                          <li>₹75,000 flat standard deduction for salaried</li>
                          <li>No tax up to ₹7,75,000 gross salary (with 87A rebate)</li>
                          <li>No paperwork, no investment lock-in needed</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-900 block mb-1">Old Regime Perks:</span>
                        <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-4">
                          <li>Allows HRA, LTA, Home Loan Interest (₹2L)</li>
                          <li>Allows Section 80C (₹1.5L) + 80CCD(1B) NPS (₹50K)</li>
                          <li>Allows 80D Mediclaim up to ₹1,00,000</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. REFUND STATUS TRACKER */}
              {activeTool === 'refund_status' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">Tax Refund Status Tracker</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Check your Centralized Processing Centre (CPC) refund credit status using PAN and Assessment Year.
                    </p>
                  </div>

                  <form onSubmit={handleCheckRefund} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">PAN Number</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={refundPan}
                        onChange={(e) => setRefundPan(e.target.value.toUpperCase())}
                        placeholder="ABCPA1234F"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Year</label>
                      <select
                        value={refundAy}
                        onChange={(e) => setRefundAy(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                      >
                        <option value="2025-2026">2025-2026 (Current AY)</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2023-2024">2023-2024</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Track Status</span>
                      </button>
                    </div>
                  </form>

                  {refundStatusResult && (
                    <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                        <div className="flex items-center gap-2 text-emerald-900">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span className="font-extrabold text-sm">{refundStatusResult.status}</span>
                        </div>
                        <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-200 text-emerald-900 rounded-full">
                          Refund Amount: ₹{refundStatusResult.amount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block">Bank Account Credited:</span>
                          <span className="font-bold text-slate-900">{refundStatusResult.bankAccount}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Date of Credit:</span>
                          <span className="font-bold text-slate-900">{refundStatusResult.refundDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Mode of Transfer:</span>
                          <span className="font-bold text-slate-900">{refundStatusResult.modeOfPayment}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">CPC Acknowledgment Ref:</span>
                          <span className="font-mono text-slate-900 font-bold">{refundStatusResult.cpcRef}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-emerald-900 bg-white/70 p-3 rounded-xl border border-emerald-200">
                        {refundStatusResult.remarks}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. RENT RECEIPT GENERATOR */}
              {activeTool === 'rent_receipt' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Rent Receipt Generator</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Generate official rent receipts to claim HRA tax exemption u/s 10(13A).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Print Receipt</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tenant Full Name</label>
                      <input
                        type="text"
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Landlord Full Name</label>
                      <input
                        type="text"
                        value={landlordName}
                        onChange={(e) => setLandlordName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rent (₹)</label>
                      <input
                        type="number"
                        value={rentAmount}
                        onChange={(e) => setRentAmount(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Landlord PAN Number</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={landlordPan}
                        onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Rental Property Address</label>
                      <input
                        type="text"
                        value={rentalPropertyAddress}
                        onChange={(e) => setRentalPropertyAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Printable Receipt Preview */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-amber-50/20 space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-black text-slate-800 tracking-wider uppercase">RENT RECEIPT</span>
                        <p className="text-[10px] text-slate-500">For the period of: {receiptMonth}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
                          ₹{rentAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      Received with thanks a sum of <strong>₹{rentAmount.toLocaleString('en-IN')}</strong> from{' '}
                      <strong>{tenantName}</strong> towards the rent of the residential premises situated at{' '}
                      <strong>{rentalPropertyAddress}</strong> for the month of <strong>{receiptMonth}</strong>.
                    </p>

                    <div className="grid grid-cols-2 pt-4 border-t border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-500 block">Landlord PAN:</span>
                        <span className="font-mono font-bold text-slate-900">{landlordPan || 'N/A'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block">Signature of Landlord:</span>
                        <span className="font-semibold text-slate-900 block mt-4 border-t border-slate-400 pt-1 inline-block min-w-[120px]">
                          {landlordName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. HRA CALCULATOR */}
              {activeTool === 'hra_calc' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">HRA Exemption Calculator u/s 10(13A)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Rule 2A calculation to find out exact tax-exempt HRA vs taxable HRA.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Annual Basic Salary (₹)</label>
                      <input
                        type="number"
                        value={basicSalary}
                        onChange={(e) => setBasicSalary(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Dearness Allowance (DA) (₹)</label>
                      <input
                        type="number"
                        value={da}
                        onChange={(e) => setDa(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">HRA Received from Employer (₹)</label>
                      <input
                        type="number"
                        value={hraReceived}
                        onChange={(e) => setHraReceived(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Total Rent Paid Annually (₹)</label>
                      <input
                        type="number"
                        value={totalRentPaid}
                        onChange={(e) => setTotalRentPaid(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={isMetro}
                          onChange={(e) => setIsMetro(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span>Living in Metro City (Delhi, Mumbai, Kolkata, Chennai - 50% limit)</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block mb-1">Exempt HRA (Tax Free):</span>
                      <span className="text-2xl font-black text-emerald-800">₹{hraExempt.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-emerald-700 block mt-1">Deductible under Section 10(13A)</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-1">Taxable HRA:</span>
                      <span className="text-2xl font-black text-slate-800">₹{hraTaxable.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">Added to salary income</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. FORM 12BB GENERATOR */}
              {activeTool === 'form_12bb' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Form 12BB Investment Declaration</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Official statement of claims by an employee for deduction of tax under Section 192.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Print Form 12BB</span>
                    </button>
                  </div>

                  <div className="border border-slate-300 rounded-2xl p-5 bg-white space-y-4 text-xs">
                    <div className="text-center border-b border-slate-200 pb-3">
                      <span className="font-black text-sm block">FORM NO. 12BB</span>
                      <span className="text-[10px] text-slate-500 block">[See rule 26C]</span>
                      <span className="font-bold text-xs text-slate-800 block mt-1">
                        Statement showing particulars of claims by an employee for deduction of tax
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
                      <div><span className="text-slate-500">Employee Name:</span> <strong className="text-slate-900">{tenantName}</strong></div>
                      <div><span className="text-slate-500">Assessment Year:</span> <strong className="text-slate-900">2025-2026</strong></div>
                      <div><span className="text-slate-500">Financial Year:</span> <strong className="text-slate-900">2024-2025</strong></div>
                      <div><span className="text-slate-500">PAN:</span> <strong className="text-slate-900 font-mono">ABCPA1234F</strong></div>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-700">
                          <th className="py-2 px-2">Item</th>
                          <th className="py-2 px-2">Particulars of Claim</th>
                          <th className="py-2 px-2 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px]">
                        <tr>
                          <td className="py-2 px-2 font-semibold">1. HRA</td>
                          <td className="py-2 px-2 text-slate-600">Rent paid to landlord ({landlordName})</td>
                          <td className="py-2 px-2 text-right font-mono font-bold">₹{totalRentPaid.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-semibold">2. LTA</td>
                          <td className="py-2 px-2 text-slate-600">Leave Travel Concession / Assistance</td>
                          <td className="py-2 px-2 text-right font-mono font-bold">₹35,000</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-semibold">3. Interest u/s 24</td>
                          <td className="py-2 px-2 text-slate-600">Interest on Home Loan for self-occupied property</td>
                          <td className="py-2 px-2 text-right font-mono font-bold">₹{homeLoanInterest.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-semibold">4. Chapter VI-A (80C)</td>
                          <td className="py-2 px-2 text-slate-600">PPF, EPF, ELSS & Life Insurance Premiums</td>
                          <td className="py-2 px-2 text-right font-mono font-bold">₹{deductions80C.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-semibold">5. Chapter VI-A (80D)</td>
                          <td className="py-2 px-2 text-slate-600">Mediclaim health insurance policy</td>
                          <td className="py-2 px-2 text-right font-mono font-bold">₹{deductions80D.toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                      <div className="text-[10px] text-slate-400">
                        Date: {new Date().toLocaleDateString('en-IN')} • Place: Kolkata
                      </div>
                      <div className="text-right">
                        <span className="text-xs block text-slate-600">Signature of Employee</span>
                        <div className="mt-4 border-t border-slate-400 w-36 ml-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. GRATUITY CALCULATOR */}
              {activeTool === 'gratuity_calc' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">Gratuity Calculator u/s 10(10)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Computed under Payment of Gratuity Act, 1972 using the formula: (15 × Last Salary × Years) / 26.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Last Drawn Monthly Salary (Basic + DA) (₹)
                      </label>
                      <input
                        type="number"
                        value={lastDrawnSalary}
                        onChange={(e) => setLastDrawnSalary(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Completed Years of Service
                      </label>
                      <input
                        type="number"
                        min={5}
                        value={tenureYears}
                        onChange={(e) => setTenureYears(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                      <span className="text-[10px] text-slate-400">Minimum 5 years required for eligibility</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-emerald-950 block">Calculated Gratuity Payable:</span>
                        <span className="text-3xl font-black text-emerald-800">₹{rawGratuity.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-emerald-900 bg-emerald-200 px-2.5 py-1 rounded-full">
                          Tax-Exempt Limit: ₹20 Lakhs
                        </span>
                        <p className="text-[10px] text-emerald-700 mt-1">
                          Amount Exempt: ₹{gratuityExempt.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. SECTION 234F LATE FILING FEE */}
              {activeTool === 'sec_234f' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">Section 234F Late Filing Fee Calculator</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Statutory fees for filing Income Tax Return after the official due date (July 31st).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Total Income (₹)</label>
                      <input
                        type="number"
                        value={sec234FIncome}
                        onChange={(e) => setSec234FIncome(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={filedAfterDueDate}
                          onChange={(e) => setFiledAfterDueDate(e.target.checked)}
                          className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                        />
                        <span>Return filed after July 31st due date</span>
                      </label>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border ${
                    sec234FFee > 0 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold block text-slate-800">Section 234F Late Penalty:</span>
                        <span className={`text-2xl font-black ${sec234FFee > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                          ₹{sec234FFee.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-bold text-slate-700 block">Rule Provision:</span>
                        <span className="text-[11px] text-slate-500 block">
                          {sec234FIncome <= 500000 ? 'Income <= ₹5L: Max fee ₹1,000' : 'Income > ₹5L: Standard fee ₹5,000'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. CRYPTO TAX CALCULATOR */}
              {activeTool === 'crypto_calc' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">Cryptocurrency & VDA Tax Calculator</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Section 115BBH flat 30% tax (+4% cess) on Virtual Digital Assets without set-off of losses.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Total Sale Consideration (₹)</label>
                      <input
                        type="number"
                        value={cryptoSaleValue}
                        onChange={(e) => setCryptoSaleValue(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Cost of Acquisition (₹)</label>
                      <input
                        type="number"
                        value={cryptoBuyCost}
                        onChange={(e) => setCryptoBuyCost(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white/10 p-3 rounded-xl">
                        <span className="text-[10px] text-slate-400 block">Net VDA Gain</span>
                        <span className="text-base font-bold text-emerald-400">₹{cryptoGain.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl">
                        <span className="text-[10px] text-slate-400 block">Flat Tax (31.2%)</span>
                        <span className="text-base font-bold text-rose-400">₹{cryptoTax.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl">
                        <span className="text-[10px] text-slate-400 block">1% TDS u/s 194S</span>
                        <span className="text-base font-bold text-amber-400">₹{cryptoTds.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">
                      *Note: No expense deductions (except cost of purchase) and no loss set-off against other crypto coins is permitted under IT Act.
                    </p>
                  </div>
                </div>
              )}

              {/* 10. TDS CALCULATOR */}
              {activeTool === 'tds_calc' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">TDS Calculator (FY 2025-26)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Check Tax Deducted at Source rates for professional fees, contractors, rent, and commissions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Select TDS Section</label>
                      <select
                        value={tdsSection}
                        onChange={(e) => setTdsSection(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                      >
                        {Object.entries(tdsRates).map(([sec, val]) => (
                          <option key={sec} value={sec}>{val.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Total Bill / Payment Amount (₹)</label>
                      <input
                        type="number"
                        value={tdsPaymentAmount}
                        onChange={(e) => setTdsPaymentAmount(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">TDS to be Deducted:</span>
                      <span className="text-3xl font-black text-emerald-800">₹{calculatedTdsAmount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-emerald-700 block mt-1">Rate applied: {activeTdsRate}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 block">Net Payment to Payee:</span>
                      <span className="text-xl font-black text-slate-900">
                        ₹{(tdsPaymentAmount - calculatedTdsAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 11. ITR ELIGIBILITY CHECKER */}
              {activeTool === 'itr_checker' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">ITR Form Eligibility Checker</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Answer 4 quick questions to find the correct ITR Form (ITR-1 Sahaj, ITR-2, ITR-3, ITR-4 Sugam).
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Primary Source of Income:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'salary', label: 'Salary / Pension' },
                          { id: 'business', label: 'Business / Freelance' },
                          { id: 'capital_gains', label: 'Shares / Capital Gains' },
                          { id: 'crypto', label: 'Crypto / Foreign Asset' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setIncomeSource(item.id as any)}
                            className={`p-3 rounded-xl text-xs font-bold text-center border cursor-pointer ${
                              incomeSource === item.id 
                                ? 'bg-emerald-800 text-white border-emerald-800' 
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasForeignAssets}
                          onChange={(e) => setHasForeignAssets(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span>Have Foreign Assets or Foreign Bank Account (Schedule FA)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={directorInPvtLtd}
                          onChange={(e) => setDirectorInPvtLtd(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span>Director in a Private Limited Company</span>
                      </label>
                    </div>

                    {/* Result Recommendation */}
                    <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-800 to-teal-900 text-white space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                          Recommended Return Form
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-xs font-black bg-white text-emerald-950">
                          {hasForeignAssets || directorInPvtLtd || incomeSource === 'capital_gains' || incomeSource === 'crypto' 
                            ? (incomeSource === 'business' ? 'ITR-3' : 'ITR-2')
                            : (incomeSource === 'business' ? 'ITR-4 (Sugam)' : 'ITR-1 (Sahaj)')}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-white">
                        {hasForeignAssets || directorInPvtLtd || incomeSource === 'capital_gains' || incomeSource === 'crypto'
                          ? 'ITR-2 / ITR-3 Complex Filing'
                          : (incomeSource === 'business' ? 'ITR-4 Sugam (Presumptive u/s 44AD/44ADA)' : 'ITR-1 Sahaj (For Salaried & One House Property)')}
                      </h3>
                      <p className="text-xs text-emerald-100">
                        {incomeSource === 'salary' && !hasForeignAssets && !directorInPvtLtd
                          ? 'You are eligible for our 4-minute instant Free ITR-1 filing with Form 16 upload.'
                          : 'Our platform automatically prepares Schedule CG and Schedule FA with full compliance validation.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 12. IFSC CODE SEARCH */}
              {activeTool === 'ifsc_search' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">IFSC Code & Bank Branch Search</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Verify your Indian Financial System Code (IFSC) to ensure seamless Income Tax Refund direct bank credit.
                    </p>
                  </div>

                  <form onSubmit={handleSearchIfsc} className="flex gap-3">
                    <input
                      type="text"
                      value={searchIfsc}
                      onChange={(e) => setSearchIfsc(e.target.value.toUpperCase())}
                      placeholder="Enter 11-digit IFSC (e.g. SBIN0001234, HDFC0000001)..."
                      className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search Branch</span>
                    </button>
                  </form>

                  {ifscResult && (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <span className="font-extrabold text-sm text-slate-900">{ifscResult.bank}</span>
                        <span className="font-mono text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                          {ifscResult.ifsc}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-slate-500">Branch:</span> <span className="font-bold text-slate-800">{ifscResult.branch}</span></div>
                        <div><span className="text-slate-500">MICR:</span> <span className="font-mono font-bold text-slate-800">{ifscResult.micr}</span></div>
                        <div className="col-span-2"><span className="text-slate-500">Address:</span> <span className="text-slate-800">{ifscResult.address}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 13. HOUSE PROPERTY CALCULATOR */}
              {activeTool === 'house_property' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">House Property Calculator u/s 24</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Compute taxable rental income or loss from house property for self-occupied and let-out properties.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsSelfOccupied(true)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                            isSelfOccupied ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          Self Occupied
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSelfOccupied(false)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                            !isSelfOccupied ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          Let Out (Rented)
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Home Loan Interest u/s 24(b) (₹)</label>
                      <input
                        type="number"
                        value={hpHomeLoanInterest}
                        onChange={(e) => setHpHomeLoanInterest(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    {!isSelfOccupied && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Annual Rent Received (₹)</label>
                          <input
                            type="number"
                            value={annualRentReceived}
                            onChange={(e) => setAnnualRentReceived(Number(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Municipal Taxes Paid (₹)</label>
                          <input
                            type="number"
                            value={municipalTaxesPaid}
                            onChange={(e) => setMunicipalTaxesPaid(Number(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">Income / (Loss) from House Property:</span>
                        <span className={`text-2xl font-black ${incomeFromHp < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {incomeFromHp < 0 ? `- ₹${Math.abs(incomeFromHp).toLocaleString('en-IN')}` : `₹${incomeFromHp.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <div className="text-right text-xs">
                        <span className="text-slate-500 block">30% Standard Deduction 24(a):</span>
                        <span className="font-bold text-slate-800">₹{standardDeduction24a.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 14. 80D HEALTH INSURANCE CALCULATOR */}
              {activeTool === 'sec_80d' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">Section 80D Health Insurance Deduction Calculator</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Claim up to ₹1,00,000 deduction for health insurance premiums of self, family, and senior citizen parents.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Self & Family Premium (₹) [Max ₹25K]</label>
                      <input
                        type="number"
                        value={medSelf}
                        onChange={(e) => setMedSelf(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Parents Premium (₹) [Max ₹25K/₹50K]</label>
                      <input
                        type="number"
                        value={medParents}
                        onChange={(e) => setMedParents(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Preventive Health Checkup (₹) [Max ₹5K]</label>
                      <input
                        type="number"
                        value={preventiveCheckup}
                        onChange={(e) => setPreventiveCheckup(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={parentsSenior}
                          onChange={(e) => setParentsSenior(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span>Parents are Senior Citizens (Age 60+)</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-950 block">Total Deductible Under Section 80D:</span>
                    <span className="text-3xl font-black text-emerald-800">₹{total80DAllowed.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {/* 15. COMPOUND INTEREST CALCULATOR */}
              {activeTool === 'compound_interest' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">Compound Interest Calculator</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Simulate compound wealth growth with quarterly, monthly, or annual compounding.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Principal Amount (₹)</label>
                      <input
                        type="number"
                        value={ciPrincipal}
                        onChange={(e) => setCiPrincipal(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Annual Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={ciRate}
                        onChange={(e) => setCiRate(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Time Horizon (Years)</label>
                      <input
                        type="number"
                        value={ciTime}
                        onChange={(e) => setCiTime(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">Maturity Amount:</span>
                      <span className="text-2xl font-black text-emerald-800">₹{ciAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">Total Interest Earned:</span>
                      <span className="text-2xl font-black text-emerald-700">₹{ciInterest.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback for other calculators */}
              {!['tax_calculator', 'old_vs_new', 'refund_status', 'rent_receipt', 'hra_calc', 'form_12bb', 'gratuity_calc', 'sec_234f', 'crypto_calc', 'tds_calc', 'itr_checker', 'ifsc_search', 'house_property', 'sec_80d', 'compound_interest'].includes(activeTool) && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">
                      {tools.find(t => t.id === activeTool)?.name || 'Financial Calculator'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {tools.find(t => t.id === activeTool)?.desc}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Official Formula & Provision Active</h4>
                        <p className="text-xs text-slate-500">
                          This calculator is preloaded with FY 2025-26 statutory rates and rules.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTool('tax_calculator')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Open Master Tax Calculator
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTool('rent_receipt')}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Generate Rent Receipt
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
