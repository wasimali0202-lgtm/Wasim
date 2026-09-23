export type Language = 'bn' | 'en';

export type ReturnStatus = 'draft' | 'payment_pending' | 'submitted' | 'verified' | 'processed';

export type ItrStatus = 'submitted' | 'reviewing' | 'filing_in_progress' | 'filed' | 'completed';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan?: string;
  aadhaar?: string;
  dob?: string;
  fatherName?: string;
  gender?: 'male' | 'female' | 'other';
  pincode?: string;
  ifscCode?: string;
  accountType?: 'savings' | 'current';
  portalPassword?: string;
  role?: 'customer' | 'admin' | 'consultant';
  emailNotifications?: boolean;
  submissionAlerts?: boolean;
  emailAlertPaymentConfirmation?: boolean;
  emailAlertFilingStatusUpdate?: boolean;
  emailAlertTaxDeadlineReminders?: boolean;
  // Legacy / optional fields for compatibility
  tin?: string;
  nid?: string;
  taxZone?: string;
  taxCircle?: string;
  assessmentYear?: string;
  taxpayerType?: 'salaried' | 'business' | 'freelancer' | 'senior';
  address?: string;
  bankName?: string;
  accountNumber?: string;
  branchName?: string;
  routingNumber?: string;
}

export interface ItrSubmissionDocument {
  id: string;
  name: string;
  type: 'pan_card' | 'aadhaar_card' | 'form16_salary' | 'bank_statement' | 'tds_certificate' | 'notice_pdf' | 'trading_statement' | 'other' | string;
  fileSize?: string;
  size?: string;
  uploadedAt: string;
  dataUrl?: string;
  verified?: boolean;
}

export interface ItrClientSubmission {
  id: string; // e.g. ITR-2025-4891
  userId?: string;
  clientId?: string;
  clientName: string;
  mobile: string;
  email: string;
  pan: string; // 10 alphanumeric e.g. ABCDE1234F
  aadhaar: string; // 12 digits
  dob: string; // YYYY-MM-DD or DD/MM/YYYY
  fatherName: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  pincode: string;
  
  // Bank Account
  bankName: string;
  accountNumber: string;
  ifscCode: string; // e.g. SBIN0001234
  accountType: 'savings' | 'current';

  // Income & Filing particulars
  assessmentYear: string; // e.g. AY 2025-26 (FY 2024-25)
  incomeCategory: 'salaried' | 'business' | 'house_property' | 'capital_gains' | 'freelancer' | 'nri' | 'other';
  filingType?: 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4' | 'FORM-10E' | 'GST-REG' | 'GST-RETURN' | 'NOTICE-143' | 'TDS-REFUND' | string;
  taxRegime?: 'new' | 'old';
  annualGrossIncome: number;
  deductions80C: number;
  deductions80D: number;
  otherDeductions: number;
  tdsPaid: number;
  taxPayable?: number;
  refundClaimed?: number;
  turnoverOrCapitalGains?: number;
  noticeRefNumber?: string;
  gstin?: string;
  portalPassword?: string; // Optional Income tax portal login password
  clientNotes?: string;

  // Attached proof documents
  documents: ItrSubmissionDocument[];

  // Status maintained by consultant
  status: ItrStatus;
  submittedAt: string;
  updatedAt: string;
  consultantNotes?: string;
  ackNumber?: string; // ITR-V e-filing acknowledgement number
  filingDate?: string;
  smsLogs?: CustomerSmsLog[];
}

export interface CustomerSmsLog {
  id: string;
  submissionId: string;
  recipientName: string;
  recipientMobile: string;
  recipientEmail?: string;
  message: string;
  templateType: string;
  channel: 'sms' | 'whatsapp' | 'email';
  sentAt: string;
  status: 'delivered' | 'sent';
}

export interface IncomeDetails {
  basicSalary: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  festivalBonus: number;
  otherAllowances: number;
  rentalIncome: number;
  rentalExpenses: number; // repairs/interest
  businessRevenue: number;
  businessExpenses: number;
  capitalGains: number;
  bankInterest: number;
  otherIncome: number;
}

export interface DeductionDetails {
  providentFund: number;
  dpsSavings: number; // Deposit Pension Scheme / Retirement annuity
  lifeInsurancePremium: number;
  healthInsurance: number;
  donationApproved: number;
  governmentSecurities: number; // Sanchayapatra / Govt treasury
  otherInvestments: number;
}

export interface TaxCalculationResult {
  grossIncome: number;
  exemptIncome: number;
  taxableIncome: number;
  slabBreakdown: {
    slabName: string;
    rate: number;
    taxableAmount: number;
    taxAmount: number;
  }[];
  grossTaxLiability: number;
  totalInvestment: number;
  investmentRebate: number;
  netTaxAfterRebate: number;
  minimumTax: number;
  finalTaxLiability: number;
  advanceTaxPaid: number; // AIT/TDS
  netTaxPayable: number; // >0 means user has to pay, <0 means refund due
  refundAmount: number;
}

export interface TaxDocument {
  id: string;
  name: string;
  type: 'salary_cert' | 'bank_statement' | 'investment_proof' | 'tin_cert' | 'rent_receipt' | 'other';
  fileSize: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'review_required';
  url?: string;
}

export interface PaymentRecord {
  transactionId: string;
  amount: number;
  method: 'upi' | 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'netbanking' | 'card' | 'challan280' | 'bkash' | 'nagad' | 'rocket' | 'bank';
  upiId?: string;
  bsrCode?: string;
  challanSerial?: string;
  cin?: string;
  bankName?: string;
  majorHead?: string; // e.g. 0021 (Income Tax Other Than Companies)
  minorHead?: string; // e.g. 300 (Self-Assessment Tax) or 100 (Advance Tax)
  status: 'completed' | 'pending' | 'failed';
  paidAt: string;
  challanNumber: string;
  bankRef: string;
}

export interface TaxReturnData {
  id: string;
  assessmentYear: string;
  userProfile: UserProfile;
  income: IncomeDetails;
  deductions: DeductionDetails;
  calculation: TaxCalculationResult;
  documents: TaxDocument[];
  payment?: PaymentRecord;
  status: ReturnStatus;
  acknowledgmentNumber?: string;
  submissionDate?: string;
  verificationCode?: string;
}

export interface PastFilingRecord {
  assessmentYear: string;
  filingDate: string;
  acknowledgmentNumber: string;
  grossIncome: number;
  taxPaid: number;
  refundReceived: number;
  status: 'Processed & Verified' | 'Refund Credited' | 'Completed';
  downloadUrl?: string;
}
