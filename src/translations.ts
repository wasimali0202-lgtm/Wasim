import { Language } from './types';

const enTranslations = {
  appTitle: 'Tax Return PRO',
  appSubtitle: 'Income Tax Department, Govt. of India • Instant ITR Filing, UPI & Net Banking',
  govtHeader: 'Government of India • Income Tax Department • e-Filing 2.0 Portal',
  
  // Nav & Menu
  dashboard: 'Dashboard',
  itrForm: 'ITR Form (ITR-1/4)',
  mySubmissions: 'My Submissions',
  consultantDesk: 'Consultant Desk',
  fileReturn: 'File Return',
  taxCalculator: 'Tax Calculator',
  filingHistory: 'Filing History',
  documents: 'Documents & Form 16',
  taxGuide: 'Tax Guide & Support',
  login: 'Sign In',
  signup: 'Create Account',
  logout: 'Log Out',
  welcome: 'Welcome',
  profile: 'Profile',
  notifications: 'Notifications',
  settings: 'Settings',
  
  // Auth
  loginTitle: 'Taxpayer Login',
  loginSubtitle: 'Enter using your 10-character PAN or registered email address',
  signupTitle: 'New Taxpayer Registration',
  signupSubtitle: 'Create your account with PAN and Aadhaar to e-file seamlessly',
  emailLabel: 'Email or PAN',
  passwordLabel: 'Password',
  confirmPasswordLabel: 'Confirm Password',
  fullNameLabel: 'Taxpayer Full Name (as per PAN)',
  phoneLabel: 'Mobile Number (linked with Aadhaar)',
  tinLabel: 'PAN Number (10 Alphanumeric)',
  nidLabel: '12-digit Aadhaar Card Number',
  signInBtn: 'Sign In',
  signUpBtn: 'Complete Registration',
  forgotPassword: 'Forgot Password?',
  noAccount: "Don't have an account?",
  alreadyAccount: 'Already have an account?',
  loggedOutNotice: 'You have been logged out successfully.',
  
  // Dashboard widgets
  assessmentYear: 'Assessment Year (AY)',
  taxStatus: 'Return Status',
  totalGrossIncome: 'Gross Total Income',
  taxPayable: 'Net Tax Payable',
  taxPaid: 'Taxes Deducted (TDS / Advance Tax)',
  refundDue: 'Refund Due',
  rebateClaimed: 'Sec 87A & Chapter VI-A Deductions',
  deadlineAlert: 'ITR Filing Deadline: 31st July / 31st December',
  startReturnBtn: 'Start Tax Return',
  continueReturnBtn: 'Continue In-Progress Return',
  payTaxBtn: 'Pay Tax via Challan 280 & UPI',
  viewAckBtn: 'View ITR-V Acknowledgment',
  
  // Wizard Steps
  step1: '1. Personal Profile & PAN/Aadhaar',
  step2: '2. Income Heads & Salary',
  step3: '3. Sec 80C/80D Deductions',
  step4: '4. Tax Computation & Challan 280',
  step5: '5. Form 16 & Document Uploads',
  step6: '6. Review & Aadhaar EVC E-File',
  
  nextStep: 'Next Step',
  prevStep: 'Previous Step',
  saveDraft: 'Save Draft',
  submitReturn: 'Submit & Aadhaar OTP E-Verify',
  
  // Income Sources
  salaryIncome: 'Income from Salary (u/s 17)',
  housePropertyIncome: 'Income from House Property',
  businessIncome: 'Profits from Business & Profession (PGBP)',
  capitalGains: 'Capital Gains (STCG/LTCG)',
  bankInterest: 'Savings & FD Bank Interest (OS)',
  otherSources: 'Income from Other Sources',
  
  // Calculations
  taxComputation: 'Automated Tax Calculation (New vs Old Regime)',
  taxSlabs: 'Applicable Indian Tax Slabs Breakdown',
  taxBeforeRebate: 'Tax Liability before Rebate',
  investmentRebateText: 'Eligible Chapter VI-A Deductions (Sec 80C/80D)',
  netPayableTax: 'Net Payable Tax Liability (Challan 280)',
  alreadyPaidAdvance: 'Advance Tax / TDS Credited (Form 26AS/AIS)',
  zeroLiability: 'Zero Tax Liability (Rebate u/s 87A Applicable)',
  refundMessage: 'Income Tax Refund Due from ITD',
  
  // Payment
  paymentTitle: 'Government Tax Challan ITNS 280 & UPI Payment Gateway',
  paymentDesc: 'Pay your tax securely via UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking (SBI, HDFC, ICICI), RuPay Cards or Challan ITNS 280',
  selectPaymentMethod: 'Select Payment Method',
  mobileBanking: 'Indian UPI (GPay / PhonePe / Paytm / BHIM)',
  cards: 'RuPay / Visa / Mastercard',
  netBanking: 'Indian Internet Banking (SBI, HDFC, ICICI, etc.)',
  payNow: 'Proceed to Pay',
  paymentSuccess: 'Tax Challan 280 Payment Successful!',
  challanNo: 'Challan ITNS 280 Ref No',
  transactionId: 'Transaction ID / UPI Ref',
  downloadChallan: 'Download Challan 280 Counterfoil',
  
  // Acknowledgment
  ackTitle: 'Income Tax Return Verification Form (ITR-V)',
  ackSubtitle: 'Income Tax Department, Government of India • Official Electronic Filing Acknowledgment Slip (ITR-V)',
  printAck: 'Print / Save PDF',
  ackNumber: 'e-Filing Acknowledgment No (15-Digit)',
  submissionDate: 'Submission Date & Time',
  taxCircle: 'Ward / Circle',
  taxZone: 'Jurisdiction Area',
  eVerified: 'E-Verified via Aadhaar OTP (EVC)',
  
  // History
  historyTitle: 'Previous Assessment Years Archive (ITR-V)',
  historyDesc: 'Review and download past returns, tax audit reports, and assessment orders',
  status: 'Status',
  action: 'Action',
  download: 'Download',
  viewDetails: 'View Details',
  
  // Support & FAQ
  helpTitle: 'Indian Tax Guidelines & Helpdesk',
  helpDesc: 'New Tax Regime (Sec 115BAC), Deductions, and ITD Portal FAQs',
};

export const translations = {
  bn: enTranslations,
  en: enTranslations,
};

export const getTranslation = (_lang: Language) => enTranslations;
