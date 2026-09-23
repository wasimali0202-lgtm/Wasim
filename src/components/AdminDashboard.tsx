import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Filter, 
  Building, 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Download, 
  Save, 
  RefreshCw, 
  FileEdit, 
  Sparkles,
  UserCheck,
  Eye,
  PlusCircle,
  TrendingUp,
  FileCheck2,
  Trash2,
  MessageSquare,
  Send,
  Smartphone,
  Table,
  LayoutGrid,
  CheckCircle,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Receipt,
  Edit3,
  Layout,
  UserPlus,
  UserX,
  Key,
  EyeOff
} from 'lucide-react';
import { ItrClientSubmission, ItrStatus, Language, UserProfile, CustomerSmsLog } from '../types';
import { sampleItrSubmissions } from '../initialData';
import { incrementPlatformFiling } from '../utils/taxStats';

interface AdminDashboardProps {
  language?: Language;
  onNavigateToForm?: () => void;
  currentUser?: UserProfile | null;
  onSwitchToCustomerView?: () => void;
  onNavigateToTab?: (tabKey: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToForm,
  currentUser,
  onSwitchToCustomerView,
  onNavigateToTab,
}) => {
  // Top Level Navigation Tab: Submissions vs Registered Users vs SMS Ledger
  const [adminTab, setAdminTab] = useState<'submissions' | 'registered_users' | 'sms_ledger'>('submissions');

  const [submissions, setSubmissions] = useState<ItrClientSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'table'>('split');
  const [previewDoc, setPreviewDoc] = useState<{ name: string; type: string } | null>(null);

  // Floating Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customer Submission Deletion Modal State
  const [submissionToDelete, setSubmissionToDelete] = useState<ItrClientSubmission | null>(null);

  // Registered Customer Accounts Management State
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Registered User Edit Form
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    pan: '',
    aadhaar: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    role: 'customer',
  });

  // Registered User Create Form
  const [newUserAccountForm, setNewUserAccountForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    pan: '',
  });

  // Form edit states for selected submission
  const [editStatus, setEditStatus] = useState<ItrStatus>('submitted');
  const [editAckNumber, setEditAckNumber] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Manual Add Customer Modal State
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [newCustForm, setNewCustForm] = useState({
    clientName: '',
    mobile: '',
    email: '',
    pan: '',
    aadhaar: '',
    dob: '1990-01-01',
    fatherName: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    pincode: '',
    bankName: 'State Bank of India',
    accountNumber: '',
    ifscCode: '',
    accountType: 'savings' as 'savings' | 'current',
    filingType: 'ITR-1',
    assessmentYear: 'AY 2025-26 (FY 2024-25)',
    annualGrossIncome: 750000,
    deductions80C: 150000,
    deductions80D: 25000,
    tdsPaid: 25000,
    status: 'submitted' as ItrStatus,
    clientNotes: '',
  });

  // SMS Modal State
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [smsTarget, setSmsTarget] = useState<ItrClientSubmission | null>(null);
  const [smsTemplate, setSmsTemplate] = useState<string>('itr_filed');
  const [smsMessage, setSmsMessage] = useState<string>('');
  const [smsChannel, setSmsChannel] = useState<'sms' | 'whatsapp' | 'email'>('sms');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);

  // Global SMS Logs stored in state/localStorage
  const [smsLogs, setSmsLogs] = useState<CustomerSmsLog[]>(() => {
    try {
      const stored = localStorage.getItem('customer_sms_logs');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Load submissions from localStorage or sample data
  const loadSubmissions = () => {
    try {
      const stored = localStorage.getItem('itr_client_submissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubmissions(parsed);
          if (!selectedId) {
            setSelectedId(parsed[0].id);
          }
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback to sample data and seed localStorage
    setSubmissions(sampleItrSubmissions);
    setSelectedId(sampleItrSubmissions[0].id);
    try {
      localStorage.setItem('itr_client_submissions', JSON.stringify(sampleItrSubmissions));
    } catch (e) {
      console.error(e);
    }
  };

  // Load registered user accounts from localStorage
  const loadRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem('etax_users_registry');
      if (saved) {
        setRegisteredUsers(JSON.parse(saved));
      } else {
        const defaultDemos = [
          {
            id: 'usr_demo_1',
            name: 'Rahul Sharma',
            email: 'rahul.sharma@example.com',
            phone: '+91 9876543210',
            password: 'password123',
            pan: 'ABCPS1234F',
            aadhaar: '5412 8901 2345',
            bankName: 'State Bank of India',
            accountNumber: '30492817492',
            ifscCode: 'SBIN0001234',
            role: 'customer',
            createdAt: '2024-09-15T10:00:00.000Z'
          },
          {
            id: 'usr_demo_2',
            name: 'Priya Patel',
            email: 'priya.patel@example.com',
            phone: '+91 9876543211',
            password: 'password123',
            pan: 'ABCPA5678G',
            aadhaar: '5412 8901 6789',
            bankName: 'HDFC Bank',
            accountNumber: '5010023456789',
            ifscCode: 'HDFC0001234',
            role: 'customer',
            createdAt: '2024-09-16T12:30:00.000Z'
          }
        ];
        setRegisteredUsers(defaultDemos);
        localStorage.setItem('etax_users_registry', JSON.stringify(defaultDemos));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSubmissions();
    loadRegisteredUsers();
  }, []);

  const currentSubmission = submissions.find(s => s.id === selectedId) || submissions[0];

  // Update form states when selected submission changes
  useEffect(() => {
    if (currentSubmission) {
      setEditStatus(currentSubmission.status);
      setEditAckNumber(currentSubmission.ackNumber || '');
      setEditNotes(currentSubmission.consultantNotes || '');
    }
  }, [currentSubmission]);

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1800);
  };

  // Copy full profile as clean formatted text
  const copyFullProfile = () => {
    if (!currentSubmission) return;
    const s = currentSubmission;
    const text = `=== INCOME TAX DEPARTMENT • CLIENT DOSSIER ===
Submission Ref: ${s.id}
Assessment Year: ${s.assessmentYear}
Tax Form: ${s.filingType || 'ITR-1 Sahaj'}
Client Full Name: ${s.clientName}
PAN: ${s.pan}
Aadhaar Number: ${s.aadhaar.replace(/\s/g, '')}
Date of Birth: ${s.dob}
Father's Name: ${s.fatherName}
Gender: ${s.gender}
Mobile: ${s.mobile}
Email: ${s.email}
Residential Address: ${s.address}, PIN: ${s.pincode}

BANK ACCOUNT (PRE-VALIDATED FOR REFUND):
Bank: ${s.bankName}
Account Number: ${s.accountNumber}
IFSC Code: ${s.ifscCode}
Account Type: ${s.accountType.toUpperCase()}

INCOME & TAX DETAILS:
Category: ${s.incomeCategory}
Gross Annual Income: ₹${s.annualGrossIncome.toLocaleString('en-IN')}
Section 80C Deductions: ₹${s.deductions80C.toLocaleString('en-IN')}
Section 80D Medical: ₹${s.deductions80D.toLocaleString('en-IN')}
TDS Deducted / Paid: ₹${s.tdsPaid.toLocaleString('en-IN')}
Status: ${s.status.toUpperCase()}
Ack DIN: ${s.ackNumber || 'Pending'}
Notes: ${s.consultantNotes || 'None'}
`;
    copyToClipboard(text, 'full_profile');
  };

  // Save changes to current submission
  const handleSaveChanges = () => {
    if (!currentSubmission) return;

    const nowStr = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const updated = submissions.map(s => {
      if (s.id === currentSubmission.id) {
        return {
          ...s,
          status: editStatus,
          ackNumber: editAckNumber.trim(),
          consultantNotes: editNotes.trim(),
          filingDate: editStatus === 'filed' ? nowStr.split(',')[0] : s.filingDate,
          updatedAt: nowStr,
        };
      }
      return s;
    });

    setSubmissions(updated);
    try {
      localStorage.setItem('itr_client_submissions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  // Full Customer Edit Modal State
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<ItrClientSubmission | null>(null);
  const [editCustForm, setEditCustForm] = useState({
    clientName: '',
    mobile: '',
    email: '',
    pan: '',
    aadhaar: '',
    dob: '',
    fatherName: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    pincode: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'savings' as 'savings' | 'current',
    filingType: 'ITR-1',
    assessmentYear: 'AY 2025-26 (FY 2024-25)',
    annualGrossIncome: 0,
    deductions80C: 0,
    deductions80D: 0,
    tdsPaid: 0,
    status: 'submitted' as ItrStatus,
    ackNumber: '',
    consultantNotes: '',
  });

  const handleOpenEditCustomer = (sub: ItrClientSubmission, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCustomerToEdit(sub);
    setEditCustForm({
      clientName: sub.clientName,
      mobile: sub.mobile,
      email: sub.email,
      pan: sub.pan,
      aadhaar: sub.aadhaar,
      dob: sub.dob,
      fatherName: sub.fatherName,
      gender: sub.gender,
      address: sub.address,
      pincode: sub.pincode,
      bankName: sub.bankName,
      accountNumber: sub.accountNumber,
      ifscCode: sub.ifscCode,
      accountType: sub.accountType,
      filingType: sub.filingType || 'ITR-1',
      assessmentYear: sub.assessmentYear,
      annualGrossIncome: sub.annualGrossIncome,
      deductions80C: sub.deductions80C,
      deductions80D: sub.deductions80D,
      tdsPaid: sub.tdsPaid,
      status: sub.status,
      ackNumber: sub.ackNumber || '',
      consultantNotes: sub.consultantNotes || '',
    });
    setIsEditCustomerModalOpen(true);
  };

  const handleSaveCustomerDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerToEdit) return;

    const nowStr = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const updated = submissions.map((s) => {
      if (s.id === customerToEdit.id) {
        return {
          ...s,
          ...editCustForm,
          updatedAt: nowStr,
          filingDate:
            editCustForm.status === 'filed' && s.filingDate === 'Pending'
              ? nowStr.split(',')[0]
              : s.filingDate,
        };
      }
      return s;
    });

    setSubmissions(updated);
    try {
      localStorage.setItem('itr_client_submissions', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    // Sync changes to registered user account if user exists
    try {
      const savedReg = localStorage.getItem('etax_users_registry');
      if (savedReg) {
        const regList: any[] = JSON.parse(savedReg);
        const updatedReg = regList.map(u => {
          if (
            (customerToEdit.email && u.email?.toLowerCase() === customerToEdit.email.toLowerCase()) ||
            (customerToEdit.mobile && u.phone === customerToEdit.mobile)
          ) {
            return {
              ...u,
              name: editCustForm.clientName,
              email: editCustForm.email.toLowerCase(),
              phone: editCustForm.mobile,
              pan: editCustForm.pan,
              aadhaar: editCustForm.aadhaar,
              bankName: editCustForm.bankName,
              accountNumber: editCustForm.accountNumber,
              ifscCode: editCustForm.ifscCode,
            };
          }
          return u;
        });
        localStorage.setItem('etax_users_registry', JSON.stringify(updatedReg));
        setRegisteredUsers(updatedReg);
      }
    } catch (err) {
      console.error(err);
    }

    setIsEditCustomerModalOpen(false);
    setSaveSuccess(true);
    setToastMessage(`Customer record for "${editCustForm.clientName}" updated successfully.`);
    setTimeout(() => {
      setSaveSuccess(false);
      setToastMessage(null);
    }, 3500);
  };

  // Handle Manual Add Customer by Admin
  const handleCreateNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustForm.clientName.trim() || !newCustForm.pan.trim() || !newCustForm.mobile.trim()) {
      alert('Please fill at least Customer Name, PAN, and Mobile number.');
      return;
    }

    const newId = (newCustForm.filingType.startsWith('GST') ? 'GST-2025-' : 'ITR-2025-') + Math.floor(1000 + Math.random() * 9000);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newCustomer: ItrClientSubmission = {
      id: newId,
      userId: 'admin_created_' + Date.now(),
      clientName: newCustForm.clientName.trim(),
      mobile: newCustForm.mobile.trim(),
      email: newCustForm.email.trim() || `${newCustForm.clientName.toLowerCase().replace(/\s/g, '.')}@gmail.com`,
      pan: newCustForm.pan.toUpperCase().trim(),
      aadhaar: newCustForm.aadhaar.trim() || '5412 8901 2345',
      dob: newCustForm.dob,
      fatherName: newCustForm.fatherName.trim() || 'Not specified',
      gender: newCustForm.gender,
      address: newCustForm.address.trim() || 'Kolkata, West Bengal',
      pincode: newCustForm.pincode.trim() || '700001',
      bankName: newCustForm.bankName.trim() || 'State Bank of India',
      accountNumber: newCustForm.accountNumber.trim() || '30492817492',
      ifscCode: newCustForm.ifscCode.toUpperCase().trim() || 'SBIN0001234',
      accountType: newCustForm.accountType,
      assessmentYear: newCustForm.assessmentYear,
      incomeCategory: newCustForm.filingType.includes('ITR-4') || newCustForm.filingType.includes('GST') ? 'business' : 'salaried',
      filingType: newCustForm.filingType,
      annualGrossIncome: Number(newCustForm.annualGrossIncome) || 0,
      deductions80C: Number(newCustForm.deductions80C) || 0,
      deductions80D: Number(newCustForm.deductions80D) || 0,
      otherDeductions: 0,
      tdsPaid: Number(newCustForm.tdsPaid) || 0,
      clientNotes: newCustForm.clientNotes.trim() || 'Created directly by Admin Officer.',
      status: newCustForm.status,
      submittedAt: nowStr,
      updatedAt: nowStr,
      consultantNotes: 'Client added directly by Admin Officer.',
      documents: [
        {
          id: 'doc_' + Date.now(),
          name: 'PAN_Aadhaar_Dossier.pdf',
          type: 'pan_card',
          fileSize: '512 KB',
          uploadedAt: nowStr.split(',')[0],
        }
      ]
    };

    const updated = [newCustomer, ...submissions];
    setSubmissions(updated);
    setSelectedId(newId);
    try {
      localStorage.setItem('itr_client_submissions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    incrementPlatformFiling({
      type: newCustomer.filingType || 'ITR-1',
      city: newCustomer.address || 'India',
      user: newCustomer.clientName,
      refundAmount: newCustomer.tdsPaid > 0 ? newCustomer.tdsPaid : 25000,
    });

    setIsAddCustomerModalOpen(false);
    // Reset form
    setNewCustForm({
      clientName: '',
      mobile: '',
      email: '',
      pan: '',
      aadhaar: '',
      dob: '1990-01-01',
      fatherName: '',
      gender: 'male',
      address: '',
      pincode: '',
      bankName: 'State Bank of India',
      accountNumber: '',
      ifscCode: '',
      accountType: 'savings',
      filingType: 'ITR-1',
      assessmentYear: 'AY 2025-26 (FY 2024-25)',
      annualGrossIncome: 750000,
      deductions80C: 150000,
      deductions80D: 25000,
      tdsPaid: 25000,
      status: 'submitted',
      clientNotes: '',
    });
  };

  // 1. Delete Customer Filing Record (Interactive modal - no window.confirm)
  const handlePromptDeleteCustomer = (sub: ItrClientSubmission, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSubmissionToDelete(sub);
  };

  const handleConfirmDeleteCustomer = () => {
    if (!submissionToDelete) return;
    const id = submissionToDelete.id;
    const clientName = submissionToDelete.clientName;
    const updated = submissions.filter(s => s.id !== id);
    setSubmissions(updated);
    if (selectedId === id) {
      setSelectedId(updated.length > 0 ? updated[0].id : null);
    }
    try {
      localStorage.setItem('itr_client_submissions', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setSubmissionToDelete(null);
    setToastMessage(`Taxpayer filing dossier for "${clientName}" (${id}) has been permanently deleted.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 2. Registered Taxpayer Accounts CRUD Handlers
  const handleOpenEditUser = (user: any) => {
    setUserToEdit(user);
    setEditUserForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: user.password || '',
      pan: user.pan || '',
      aadhaar: user.aadhaar || '',
      bankName: user.bankName || 'State Bank of India',
      accountNumber: user.accountNumber || '',
      ifscCode: user.ifscCode || '',
      role: user.role || 'customer',
    });
  };

  const handleSaveUserAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;

    const updated = registeredUsers.map(u => {
      if (u.id === userToEdit.id) {
        return {
          ...u,
          name: editUserForm.name.trim(),
          email: editUserForm.email.trim().toLowerCase(),
          phone: editUserForm.phone.trim(),
          password: editUserForm.password.trim(),
          pan: editUserForm.pan.toUpperCase().trim(),
          aadhaar: editUserForm.aadhaar.trim(),
          bankName: editUserForm.bankName.trim(),
          accountNumber: editUserForm.accountNumber.trim(),
          ifscCode: editUserForm.ifscCode.toUpperCase().trim(),
          role: editUserForm.role,
          updatedAt: new Date().toISOString(),
        };
      }
      return u;
    });

    setRegisteredUsers(updated);
    try {
      localStorage.setItem('etax_users_registry', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    const userName = editUserForm.name;
    setUserToEdit(null);
    setToastMessage(`Customer account "${userName}" updated successfully in authentication registry.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePromptDeleteUser = (user: any) => {
    setUserToDelete(user);
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    const targetId = userToDelete.id;
    const targetName = userToDelete.name;
    const updated = registeredUsers.filter(u => u.id !== targetId);
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('etax_users_registry', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setUserToDelete(null);
    setToastMessage(`Customer account "${targetName}" deleted from authentication registry.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateUserAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserAccountForm.name.trim() || !newUserAccountForm.email.trim() || !newUserAccountForm.password.trim()) {
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: newUserAccountForm.name.trim(),
      email: newUserAccountForm.email.trim().toLowerCase(),
      phone: newUserAccountForm.phone.trim() || '+91 9876543210',
      password: newUserAccountForm.password.trim(),
      pan: (newUserAccountForm.pan || 'ABCPA' + Math.floor(1000 + Math.random() * 9000) + 'F').toUpperCase(),
      aadhaar: '5412 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000),
      bankName: 'State Bank of India',
      accountNumber: '30492817492',
      ifscCode: 'SBIN0001234',
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    const updated = [newUser, ...registeredUsers];
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('etax_users_registry', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setIsAddUserModalOpen(false);
    setNewUserAccountForm({ name: '', email: '', phone: '', password: '', pan: '' });
    setToastMessage(`New customer account for "${newUser.name}" successfully created.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Backwards compatibility alias
  const handleDeleteCustomer = (id: string, e?: React.MouseEvent) => {
    const sub = submissions.find(s => s.id === id);
    if (sub) {
      handlePromptDeleteCustomer(sub, e);
    }
  };

  // Prepare SMS Modal for a specific customer
  const handleOpenSmsModal = (sub: ItrClientSubmission, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSmsTarget(sub);
    setSmsTemplate('itr_filed');
    const defaultMsg = `Dear ${sub.clientName}, your Income Tax Return for AY 2025-26 has been successfully filed with Acknowledgement DIN: ${sub.ackNumber || '150925901842099'}. Verified by CPC Bengaluru. - Income Tax Cell`;
    setSmsMessage(defaultMsg);
    setSmsSentSuccess(false);
    setIsSmsModalOpen(true);
  };

  // Update SMS text based on template
  const handleTemplateChange = (tmpl: string) => {
    setSmsTemplate(tmpl);
    if (!smsTarget) return;

    switch (tmpl) {
      case 'itr_filed':
        setSmsMessage(`Dear ${smsTarget.clientName}, your Income Tax Return (${smsTarget.filingType || 'ITR-1'}) for AY 2025-26 has been filed. DIN: ${smsTarget.ackNumber || '150925901842099'}. Download your ITR-V from portal.`);
        break;
      case 'doc_missing':
        setSmsMessage(`Dear ${smsTarget.clientName}, your tax e-filing for PAN ${smsTarget.pan} requires Form 16 Part B / Broker P&L. Please upload at earliest to complete submission.`);
        break;
      case 'refund_approved':
        setSmsMessage(`Dear ${smsTarget.clientName}, tax refund of ₹${smsTarget.tdsPaid.toLocaleString('en-IN')} for PAN ${smsTarget.pan} has been approved by CPC and credited to your bank (${smsTarget.bankName}).`);
        break;
      case 'notice_rectification':
        setSmsMessage(`Dear ${smsTarget.clientName}, Section 143(1) intimation for PAN ${smsTarget.pan} has been reviewed and rectified reply submitted to Income Tax Department.`);
        break;
      case 'custom':
        setSmsMessage(`Dear ${smsTarget.clientName}, `);
        break;
      default:
        break;
    }
  };

  // Dispatch SMS
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsTarget || !smsMessage.trim()) return;

    setIsSendingSms(true);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newLog: CustomerSmsLog = {
      id: 'sms_' + Date.now(),
      submissionId: smsTarget.id,
      recipientName: smsTarget.clientName,
      recipientMobile: smsTarget.mobile,
      recipientEmail: smsTarget.email,
      message: smsMessage.trim(),
      templateType: smsTemplate,
      channel: smsChannel,
      sentAt: nowStr,
      status: 'delivered',
    };

    setTimeout(() => {
      const updatedLogs = [newLog, ...smsLogs];
      setSmsLogs(updatedLogs);
      try {
        localStorage.setItem('customer_sms_logs', JSON.stringify(updatedLogs));
      } catch (err) {
        console.error(err);
      }

      // Also append to the target submission's own smsLogs
      const updatedSubmissions = submissions.map(s => {
        if (s.id === smsTarget.id) {
          const currentLogs = s.smsLogs || [];
          return {
            ...s,
            smsLogs: [newLog, ...currentLogs]
          };
        }
        return s;
      });
      setSubmissions(updatedSubmissions);
      try {
        localStorage.setItem('itr_client_submissions', JSON.stringify(updatedSubmissions));
      } catch (err) {
        console.error(err);
      }

      setIsSendingSms(false);
      setSmsSentSuccess(true);
      setTimeout(() => {
        setIsSmsModalOpen(false);
        setSmsSentSuccess(false);
      }, 1800);
    }, 800);
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = 
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mobile.includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesType = filterType === 'all' || (s.filingType && s.filingType.includes(filterType)) || (filterType === 'ITR-1' && !s.filingType);

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: ItrStatus) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>New Submission</span>
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span>Under Review</span>
          </span>
        );
      case 'filing_in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            <span>Filing in Progress</span>
          </span>
        );
      case 'filed':
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Filed & Verified</span>
          </span>
        );
      default:
        return null;
    }
  };

  const totalGrossIncome = submissions.reduce((acc, s) => acc + (s.annualGrossIncome || 0), 0);
  const totalTdsManaged = submissions.reduce((acc, s) => acc + (s.tdsPaid || 0), 0);

  const filteredRegisteredUsers = registeredUsers.filter(user => {
    const q = userSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phone?.includes(q) ||
      user.pan?.toLowerCase().includes(q) ||
      user.bankName?.toLowerCase().includes(q)
    );
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Admin Dashboard Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            The Admin Dashboard contains confidential taxpayer e-filing dossiers and requires verified administrator login credentials.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onSwitchToCustomerView && (
            <button
              type="button"
              onClick={onSwitchToCustomerView}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  // Get SMS logs for currently selected submission
  const currentCustomerSms = smsLogs.filter(log => log.submissionId === currentSubmission?.id);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" 
          alt="Financial Administration Center" 
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/90 to-slate-950/70 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Income Tax Officer & Official Admin Portal (AY 2025-26)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              Tax Administration Dashboard • All Customer Filings & SMS Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Full control over all customer profiles, PAN credentials, refund bank accounts, ITR-1/2/3/4 forms, direct SMS client dispatches, and adding new customer filings manually.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Direct Add New Customer Button */}
            <button
              onClick={() => setIsAddCustomerModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Customer Manually</span>
            </button>

            {/* Direct Forms Portal Button */}
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('forms_portal')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-2 transition-all cursor-pointer"
                title="Launch and test all statutory filing forms"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>All Filing Desks & Forms</span>
              </button>
            )}

            {/* Direct Send SMS to Current Customer */}
            {currentSubmission && (
              <button
                onClick={() => handleOpenSmsModal(currentSubmission)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-700/20 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Send SMS to Customer</span>
              </button>
            )}

            <a
              href="https://eportal.incometax.gov.in/iec/foservices/#/login"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Govt IT Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {onSwitchToCustomerView && (
              <button
                onClick={onSwitchToCustomerView}
                className="px-4 py-2.5 bg-teal-800/60 hover:bg-teal-700/60 text-teal-200 rounded-xl text-xs font-semibold border border-teal-600/40 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Taxpayer View</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <p className="text-slate-400">Total Customer Filings</p>
            <p className="text-xl font-bold text-white mt-0.5">{submissions.length}</p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <p className="text-slate-400">Pending Review</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">
              {submissions.filter(s => s.status === 'submitted' || s.status === 'reviewing').length}
            </p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <p className="text-slate-400">Filing in Progress</p>
            <p className="text-xl font-bold text-purple-400 mt-0.5">
              {submissions.filter(s => s.status === 'filing_in_progress').length}
            </p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <p className="text-slate-400">Filed & Verified</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">
              {submissions.filter(s => s.status === 'filed' || s.status === 'completed').length}
            </p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <p className="text-slate-400">Registered Users</p>
            <p className="text-xl font-bold text-teal-400 mt-0.5">
              {registeredUsers.length} Accounts
            </p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <p className="text-slate-400">SMS / Alerts Sent</p>
            <p className="text-xl font-bold text-indigo-400 mt-0.5 font-mono">
              {smsLogs.length} Logs
            </p>
          </div>
        </div>
      </div>

      {/* Floating Administrative Action Toast */}
      {toastMessage && (
        <div className="p-4 bg-slate-900 text-white border border-emerald-500/50 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-emerald-100">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        <button
          onClick={() => setAdminTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            adminTab === 'submissions'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Taxpayer Filing Dossiers ({submissions.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('registered_users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            adminTab === 'registered_users'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Users className="w-4 h-4 text-teal-400" />
          <span>Registered Taxpayer Accounts ({registeredUsers.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('sms_ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            adminTab === 'sms_ledger'
              ? 'bg-indigo-700 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Smartphone className="w-4 h-4 text-indigo-200" />
          <span>SMS & Alerts Dispatch History ({smsLogs.length})</span>
        </button>
      </div>

      {/* SECTION 1: TAXPAYER FILING DOSSIERS & INBOX */}
      {adminTab === 'submissions' && (
      <>
      {/* Control Bar: View Toggle, Search, Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dossier View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-indigo-600" />
              <span>All Customers Table ({submissions.length})</span>
            </button>
          </div>

          {/* Form Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Form Types</option>
            <option value="ITR-1">ITR-1 (Sahaj)</option>
            <option value="ITR-2">ITR-2 (Capital Gains)</option>
            <option value="ITR-3">ITR-3 (Business/Prof)</option>
            <option value="ITR-4">ITR-4 (Sugam)</option>
            <option value="GST">GST Registration & Return</option>
            <option value="NOTICE">Notice Rectification</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, PAN, mobile, email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
        </div>
      </div>

      {/* VIEW MODE 1: MASTER TABLE VIEW (Showing all customer details at a glance) */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Complete Customer Filing Ledger & Registry
              </h3>
              <p className="text-xs text-slate-500">
                Detailed table displaying identity, bank accounts, income brackets, tax forms, and quick SMS dispatch.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              Showing {filteredSubmissions.length} of {submissions.length} Taxpayers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-2.5 whitespace-nowrap">Ref ID</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">Customer Name</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">PAN / Aadhaar</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">Contact (Mobile & Email)</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">Bank A/C & IFSC</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">Tax Form</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">Income & TDS</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">Status</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No customer records match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr 
                      key={sub.id} 
                      className={`hover:bg-emerald-50/40 transition-colors ${selectedId === sub.id ? 'bg-emerald-50/60 font-semibold' : ''}`}
                    >
                      <td className="py-2.5 px-2.5 font-mono font-bold text-emerald-800 whitespace-nowrap">
                        {sub.id}
                      </td>
                      <td className="py-2.5 px-2.5">
                        <div className="font-bold text-slate-900 leading-tight">{sub.clientName}</div>
                        <div className="text-[10px] text-slate-500">{sub.fatherName ? `S/O ${sub.fatherName}` : 'Individual'}</div>
                      </td>
                      <td className="py-2.5 px-2.5 font-mono">
                        <div className="font-bold text-slate-800 text-[11px]">{sub.pan}</div>
                        <div className="text-[10px] text-slate-500">{sub.aadhaar}</div>
                      </td>
                      <td className="py-2.5 px-2.5">
                        <div className="text-slate-900 font-medium text-[11px] whitespace-nowrap">{sub.mobile}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{sub.email}</div>
                      </td>
                      <td className="py-2.5 px-2.5">
                        <div className="text-slate-900 font-medium text-[11px] leading-tight">{sub.bankName}</div>
                        <div className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">{sub.accountNumber} • {sub.ifscCode}</div>
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded-md text-[10px]">
                          {sub.filingType || 'ITR-1 Sahaj'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap font-mono">
                        <div className="font-bold text-slate-900">₹{sub.annualGrossIncome.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-emerald-700 font-bold">TDS: ₹{sub.tdsPaid.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap text-right space-x-1">
                        <button
                          onClick={() => { setSelectedId(sub.id); setViewMode('split'); }}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          title="View Full Dossier"
                        >
                          Dossier
                        </button>
                        <button
                          onClick={(e) => handleOpenEditCustomer(sub, e)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          title="Edit Customer Profile & Financials"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={(e) => handleOpenSmsModal(sub, e)}
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          title="Send SMS to customer"
                        >
                          📱 SMS
                        </button>
                        <button
                          onClick={(e) => handlePromptDeleteCustomer(sub, e)}
                          className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer inline-block align-middle"
                          title="Delete customer record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: SPLIT INBOX + DETAILED DOSSIER VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Customer Submissions List (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Customer Submissions Inbox</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={loadSubmissions}
                    title="Refresh customer submissions"
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                    {filteredSubmissions.length}
                  </span>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1 pb-1 text-xs">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'submitted', label: 'New' },
                  { key: 'reviewing', label: 'Review' },
                  { key: 'filing_in_progress', label: 'Filing' },
                  { key: 'filed', label: 'Done' }
                ].map(st => (
                  <button
                    key={st.key}
                    onClick={() => setFilterStatus(st.key)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      filterStatus === st.key 
                        ? 'bg-slate-900 text-white font-bold' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Submissions List */}
              <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                {filteredSubmissions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No submissions match your query.
                  </div>
                ) : (
                  filteredSubmissions.map(sub => {
                    const isSelected = sub.id === currentSubmission?.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedId(sub.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                          isSelected 
                            ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-2 ring-emerald-500/20' 
                            : 'bg-slate-50/60 hover:bg-slate-100/90 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 truncate">{sub.clientName}</span>
                          {getStatusBadge(sub.status)}
                        </div>
                        <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                          <span>PAN: <strong className="text-slate-800">{sub.pan}</strong></span>
                          <span className="text-emerald-800 font-bold">₹{(sub.annualGrossIncome / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono text-emerald-700 font-semibold">{sub.id}</span>
                            <span className="px-1.5 py-0.2 bg-slate-200/70 text-slate-700 rounded text-[9px] font-semibold">
                              {sub.filingType || 'ITR-1'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => handleOpenSmsModal(sub, e)}
                              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                              title="Send SMS"
                            >
                              SMS
                            </button>
                            <span>{sub.submittedAt.split(',')[0]}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Customer Dossier & Actions Panel (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            {currentSubmission ? (
              <>
                {/* Header Box of Selected Customer */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                        {currentSubmission.clientName}
                      </h2>
                      {getStatusBadge(currentSubmission.status)}
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md">
                        {currentSubmission.filingType || 'ITR-1 Sahaj'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Ref: <strong className="font-mono text-emerald-800">{currentSubmission.id}</strong> • Submitted: {currentSubmission.submittedAt} • AY: {currentSubmission.assessmentYear}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Edit Customer Profile & Financials */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditCustomer(currentSubmission)}
                      className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Edit customer identity, bank details, and income numbers"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Edit Customer</span>
                    </button>

                    {/* Send SMS Button */}
                    <button
                      onClick={() => handleOpenSmsModal(currentSubmission)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Send SMS or notification to this client"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Send SMS</span>
                    </button>

                    <button
                      onClick={copyFullProfile}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Copy everything to clipboard in clean dossier format"
                    >
                      {copiedKey === 'full_profile' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Copy Dossier</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handlePromptDeleteCustomer(currentSubmission)}
                      className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
                      title="Delete customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Data Cards for Copying into incometax.gov.in */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* 1. PAN, Aadhaar & Personal Particulars */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-slate-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>1. Identity & Contact Details</span>
                    </h4>

                    {/* PAN Field */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Permanent Account Number (PAN)</span>
                        <span className="text-sm font-bold font-mono text-slate-900 tracking-wider">
                          {currentSubmission.pan}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(currentSubmission.pan, 'pan')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        {copiedKey === 'pan' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'pan' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Aadhaar Field */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Aadhaar Number</span>
                        <span className="text-sm font-bold font-mono text-slate-900 tracking-wider">
                          {currentSubmission.aadhaar}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(currentSubmission.aadhaar.replace(/\s/g, ''), 'aadhaar')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        {copiedKey === 'aadhaar' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'aadhaar' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Contact & Address */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Mobile:</span>
                        <span className="font-bold text-slate-900 font-mono">{currentSubmission.mobile}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="font-medium text-slate-900">{currentSubmission.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">DOB / Father:</span>
                        <span className="text-slate-900">{currentSubmission.dob} • {currentSubmission.fatherName || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Address:</span>
                        <span className="text-slate-900 text-right truncate max-w-[200px]" title={currentSubmission.address}>
                          {currentSubmission.address}, {currentSubmission.pincode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Bank Details (Pre-validated refund bank account) */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-slate-100">
                      <Building className="w-4 h-4 text-teal-600" />
                      <span>2. Refund Bank Account Details</span>
                    </h4>

                    {/* Account Number */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Bank Account Number</span>
                        <span className="text-sm font-bold font-mono text-slate-900 tracking-wider">
                          {currentSubmission.accountNumber}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(currentSubmission.accountNumber, 'acct')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        {copiedKey === 'acct' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'acct' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* IFSC Code */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Bank IFSC Code</span>
                        <span className="text-sm font-bold font-mono text-emerald-800 tracking-wider">
                          {currentSubmission.ifscCode}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(currentSubmission.ifscCode, 'ifsc')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        {copiedKey === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'ifsc' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Bank Name & Type */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bank Name & A/C Type</span>
                        <span className="font-bold text-slate-900">{currentSubmission.bankName}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-bold uppercase text-[10px]">
                        {currentSubmission.accountType}
                      </span>
                    </div>
                  </div>

                  {/* 3. Income Particulars & Slabs */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-slate-100">
                      <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                      <span>3. Income & Tax Particulars</span>
                    </h4>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Gross Annual Income</span>
                        <span className="text-sm font-bold font-mono text-slate-900">
                          ₹{currentSubmission.annualGrossIncome.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(String(currentSubmission.annualGrossIncome), 'income')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {copiedKey === 'income' ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">80C Deductions (ELSS, PF, LIC)</span>
                        <span className="text-xs font-bold font-mono text-slate-900">
                          ₹{currentSubmission.deductions80C.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(String(currentSubmission.deductions80C), '80c')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {copiedKey === '80c' ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">TDS Deducted (Form 26AS / AIS)</span>
                        <span className="text-xs font-bold font-mono text-emerald-800">
                          ₹{currentSubmission.tdsPaid.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(String(currentSubmission.tdsPaid), 'tds')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {copiedKey === 'tds' ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    {currentSubmission.clientNotes && (
                      <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                          Taxpayer Message / Note:
                        </span>
                        <p className="text-slate-700 italic">"{currentSubmission.clientNotes}"</p>
                      </div>
                    )}
                  </div>

                  {/* 4. Supporting Documents & Communications */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-slate-100">
                      <Download className="w-4 h-4 text-indigo-600" />
                      <span>4. Uploaded Customer Documents</span>
                    </h4>

                    {currentSubmission.documents && currentSubmission.documents.length > 0 ? (
                      <div className="space-y-2">
                        {currentSubmission.documents.map((doc) => (
                          <div key={doc.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                            <div className="truncate pr-2">
                              <p className="font-semibold text-slate-900 truncate">{doc.name}</p>
                              <span className="text-[10px] text-slate-400 uppercase font-mono">{doc.type} • {doc.fileSize}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer shrink-0 flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3 text-slate-500" />
                              <span>Preview</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No extra documents attached by client.
                      </div>
                    )}

                    {/* Direct SMS Notification button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenSmsModal(currentSubmission)}
                        className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 text-indigo-600" />
                        <span>Send Official SMS / WhatsApp Alert</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 5: Client Communication / SMS History */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <span>SMS & Communication Log for {currentSubmission.clientName}</span>
                    </h3>
                    <button
                      onClick={() => handleOpenSmsModal(currentSubmission)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>+ New Message</span>
                    </button>
                  </div>

                  {currentCustomerSms.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                      No SMS messages dispatched to this customer yet. Click "Send SMS" to notify them of filing status or missing documents.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentCustomerSms.map((log) => (
                        <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 uppercase text-[10px] px-2 py-0.5 bg-slate-200 rounded">
                                {log.channel}
                              </span>
                              <span className="text-slate-500 text-[11px] font-mono">{log.sentAt}</span>
                              <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5">
                                <CheckCircle className="w-3 h-3" /> Delivered
                              </span>
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed">{log.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 6: Admin Status Update Card */}
                <div className="bg-white rounded-3xl p-6 border border-emerald-300 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Update Customer Return Filing Status</span>
                    </h3>
                    {saveSuccess && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center space-x-1 animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Status Updated & Synced with Taxpayer Dashboard!</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {/* Status Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Filing Workflow Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as ItrStatus)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold cursor-pointer"
                      >
                        <option value="submitted">📥 New Submission Received</option>
                        <option value="reviewing">🔍 Under Review & Verification</option>
                        <option value="filing_in_progress">⚙️ Filing in Progress on incometax.gov.in</option>
                        <option value="filed">✅ Filed & Verified by CPC Bengaluru</option>
                      </select>
                    </div>

                    {/* ITR-V Ack Number */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Official 15-Digit ITR-V Acknowledgement Number
                      </label>
                      <input
                        type="text"
                        value={editAckNumber}
                        onChange={(e) => setEditAckNumber(e.target.value)}
                        placeholder="e.g. 150925901842099"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono font-bold"
                      />
                    </div>

                    {/* Notes to Client */}
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Official Remarks to Customer (Shows directly in their "My Filed Returns" portal)
                      </label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="e.g. Your return has been verified by CA. Refund initiated to your pre-validated bank account."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 cursor-pointer flex items-center space-x-1.5 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save & Notify Taxpayer</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
                Select a customer from the inbox to inspect details.
              </div>
            )}
          </div>
        </div>
      )}
      </>
      )}

      {/* SECTION 2: REGISTERED TAXPAYER ACCOUNTS TAB */}
      {adminTab === 'registered_users' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Registered Customer Accounts & Credentials
              </h3>
              <p className="text-xs text-slate-500">
                Manage all taxpayer portal registrations, login credentials, passwords, and taxpayer records.
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search user by name, email, PAN..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-900"
                />
              </div>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-teal-400" />
                <span>+ Add User</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">
                Showing {filteredRegisteredUsers.length} of {registeredUsers.length} Registered Accounts
              </span>
              <span className="text-xs font-medium text-slate-500">
                Click "Edit" to modify credentials or "Delete" to remove customer access.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Taxpayer Account</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Email (Username)</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Mobile</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Password</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">PAN / Aadhaar</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Refund Bank</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Role</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegisteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No registered user accounts match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredRegisteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs uppercase">
                              {user.name ? user.name.slice(0, 2) : 'TX'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap font-medium text-slate-700">
                          {user.email}
                        </td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap font-medium text-slate-700">
                          {user.phone || 'N/A'}
                        </td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5 font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded-lg w-max">
                            <span>
                              {showPasswords[user.id] ? user.password : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                              title={showPasswords[user.id] ? 'Hide password' : 'Show password'}
                            >
                              {showPasswords[user.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <div className="font-mono font-bold text-slate-800 uppercase">{user.pan || 'N/A'}</div>
                          {user.aadhaar && (
                            <div className="text-[10px] text-slate-400 font-mono">{user.aadhaar}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap text-slate-600">
                          <p className="font-medium text-slate-800">{user.bankName || 'State Bank of India'}</p>
                          <p className="text-[10px] font-mono text-slate-400">{user.accountNumber ? `••••${user.accountNumber.slice(-4)}` : 'N/A'}</p>
                        </td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {user.role || 'customer'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditUser(user)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Edit customer account & credentials"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handlePromptDeleteUser(user)}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer inline-block align-middle"
                            title="Delete customer account from registry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SMS & NOTIFICATION LEDGER TAB */}
      {adminTab === 'sms_ledger' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Official SMS, WhatsApp & Email Dispatch Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Audit log of all filing acknowledgements, status alerts, and e-verification messages sent to customers.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
              Total Dispatched: {smsLogs.length} Messages
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-5">
            {smsLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Smartphone className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="font-bold">No SMS or notifications dispatched yet.</p>
                <p className="text-xs mt-1">Send SMS from the customer filings table or dossier view.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-2.5">Log ID</th>
                      <th className="py-2.5 px-2.5">Customer</th>
                      <th className="py-2.5 px-2.5">Recipient</th>
                      <th className="py-2.5 px-2.5">Channel</th>
                      <th className="py-2.5 px-2.5">Message Preview</th>
                      <th className="py-2.5 px-2.5">Dispatched At</th>
                      <th className="py-2.5 px-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {smsLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2.5 font-mono text-slate-400 text-[10px]">{log.id}</td>
                        <td className="py-2.5 px-2.5 font-bold text-slate-900">{log.recipientName}</td>
                        <td className="py-2.5 px-2.5 font-medium text-slate-700 font-mono">{log.recipientMobile}</td>
                        <td className="py-2.5 px-2.5 uppercase font-bold text-[10px] text-indigo-600">
                          {log.channel}
                        </td>
                        <td className="py-2.5 px-2.5 max-w-xs truncate text-slate-600" title={log.message}>
                          {log.message}
                        </td>
                        <td className="py-2.5 px-2.5 text-slate-500 whitespace-nowrap">
                          {new Date(log.sentAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: MANUAL ADD CUSTOMER MODAL */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Add New Taxpayer / Customer Record
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manually register a customer submission directly into the official administration ledger.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustForm.clientName}
                    onChange={(e) => setNewCustForm({ ...newCustForm, clientName: e.target.value })}
                    placeholder="e.g. Rajesh Kumar Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* PAN */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Permanent Account Number (PAN) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={newCustForm.pan}
                    onChange={(e) => setNewCustForm({ ...newCustForm, pan: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustForm.mobile}
                    onChange={(e) => setNewCustForm({ ...newCustForm, mobile: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newCustForm.email}
                    onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                    placeholder="e.g. rajesh.sharma@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Tax Filing Form Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Filing Form / Tax Service
                  </label>
                  <select
                    value={newCustForm.filingType}
                    onChange={(e) => setNewCustForm({ ...newCustForm, filingType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold cursor-pointer focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ITR-1">ITR-1 (Sahaj - Salaried & Pensioners)</option>
                    <option value="ITR-2">ITR-2 (Capital Gains & Multiple Properties)</option>
                    <option value="ITR-3">ITR-3 (Business & Professional Audit)</option>
                    <option value="ITR-4">ITR-4 (Sugam Presumptive 44AD/ADA)</option>
                    <option value="FORM-10E">Form 10E (Salary Arrears Relief u/s 89)</option>
                    <option value="GST-REG">GST Registration (New GSTIN)</option>
                    <option value="GST-RETURN">GST Returns (GSTR-1 & GSTR-3B)</option>
                    <option value="NOTICE-143">Tax Notice Defense u/s 143(1) / 139(9)</option>
                    <option value="TDS-REFUND">TDS Refund Claim</option>
                  </select>
                </div>

                {/* Assessment Year */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assessment Year
                  </label>
                  <select
                    value={newCustForm.assessmentYear}
                    onChange={(e) => setNewCustForm({ ...newCustForm, assessmentYear: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold cursor-pointer focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="AY 2025-26 (FY 2024-25)">AY 2025-26 (FY 2024-25) [Current]</option>
                    <option value="AY 2024-25 (FY 2023-24)">AY 2024-25 (FY 2023-24) [Belated]</option>
                  </select>
                </div>

                {/* Gross Annual Income */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gross Annual Income (₹)
                  </label>
                  <input
                    type="number"
                    value={newCustForm.annualGrossIncome}
                    onChange={(e) => setNewCustForm({ ...newCustForm, annualGrossIncome: Number(e.target.value) })}
                    placeholder="750000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* TDS Paid */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    TDS Paid / Deducted (₹)
                  </label>
                  <input
                    type="number"
                    value={newCustForm.tdsPaid}
                    onChange={(e) => setNewCustForm({ ...newCustForm, tdsPaid: Number(e.target.value) })}
                    placeholder="25000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={newCustForm.bankName}
                    onChange={(e) => setNewCustForm({ ...newCustForm, bankName: e.target.value })}
                    placeholder="State Bank of India"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Bank Account Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={newCustForm.accountNumber}
                    onChange={(e) => setNewCustForm({ ...newCustForm, accountNumber: e.target.value })}
                    placeholder="30492817492"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={newCustForm.ifscCode}
                    onChange={(e) => setNewCustForm({ ...newCustForm, ifscCode: e.target.value.toUpperCase() })}
                    placeholder="SBIN0001234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono uppercase focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Initial Status */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Initial Workflow Status
                  </label>
                  <select
                    value={newCustForm.status}
                    onChange={(e) => setNewCustForm({ ...newCustForm, status: e.target.value as ItrStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold cursor-pointer focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="submitted">📥 New Submission</option>
                    <option value="reviewing">🔍 Under Review</option>
                    <option value="filing_in_progress">⚙️ Filing in Progress</option>
                    <option value="filed">✅ Filed & Verified</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Officer Remarks / Client Notes
                </label>
                <input
                  type="text"
                  value={newCustForm.clientNotes}
                  onChange={(e) => setNewCustForm({ ...newCustForm, clientNotes: e.target.value })}
                  placeholder="e.g. Documents verified from office branch. Ready for CPC e-filing."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Customer Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SEND SMS / WHATSAPP NOTIFICATION MODAL */}
      {isSmsModalOpen && smsTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Send Direct SMS / Tax Alert
                  </h3>
                  <p className="text-xs text-slate-500">
                    Recipient: <strong className="text-slate-900">{smsTarget.clientName}</strong> ({smsTarget.mobile})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSmsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {smsSentSuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in fade-in">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-emerald-950">SMS Dispatched Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  Message delivered to <strong>{smsTarget.mobile}</strong>. Stored in customer communication ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendSms} className="space-y-4 text-xs">
                {/* Channel Selector */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Delivery Gateway Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sms', label: '📱 Govt SMS Gate' },
                      { id: 'whatsapp', label: '💬 WhatsApp' },
                      { id: 'email', label: '✉️ Email Alert' }
                    ].map(ch => (
                      <button
                        type="button"
                        key={ch.id}
                        onClick={() => setSmsChannel(ch.id as any)}
                        className={`py-2 px-2 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                          smsChannel === ch.id
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Selector */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quick Template Selector
                  </label>
                  <select
                    value={smsTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="itr_filed">✅ ITR Filed & Acknowledgement DIN Issued</option>
                    <option value="refund_approved">💰 Tax Refund Approved & Credited to Bank</option>
                    <option value="doc_missing">⚠️ Missing Document Request (Form 16 / AIS)</option>
                    <option value="notice_rectification">📋 Section 143(1) Notice Rectified Reply</option>
                    <option value="custom">✏️ Custom Message</option>
                  </select>
                </div>

                {/* Message Body */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
                      Message Content (Editable)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {smsMessage.length} chars (1 credit)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed focus:ring-2 focus:ring-indigo-500 font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    To: <strong className="font-mono text-slate-800">{smsTarget.mobile}</strong>
                  </span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsSmsModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingSms}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingSms ? 'Transmitting...' : 'Dispatch SMS'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">{previewDoc.name}</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-slate-800">Verified Income Tax Supporting Document</p>
              <p className="text-xs text-slate-500">
                Document Type: <span className="font-semibold text-slate-700">{previewDoc.type}</span>
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
                Encrypted & Stored in ITD Secure Vault
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT FULL CUSTOMER DOSSIER MODAL */}
      {isEditCustomerModalOpen && customerToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Edit Customer Details • {customerToEdit.clientName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modify profile identity, contact number, bank details, tax form, and financials.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditCustomerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomerDetails} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editCustForm.clientName}
                    onChange={(e) => setEditCustForm({ ...editCustForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editCustForm.mobile}
                    onChange={(e) => setEditCustForm({ ...editCustForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editCustForm.email}
                    onChange={(e) => setEditCustForm({ ...editCustForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Permanent Account Number (PAN)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={editCustForm.pan}
                    onChange={(e) => setEditCustForm({ ...editCustForm, pan: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Aadhaar Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    12-Digit Aadhaar Number
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    value={editCustForm.aadhaar}
                    onChange={(e) => setEditCustForm({ ...editCustForm, aadhaar: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editCustForm.dob}
                    onChange={(e) => setEditCustForm({ ...editCustForm, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={editCustForm.fatherName}
                    onChange={(e) => setEditCustForm({ ...editCustForm, fatherName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Filing Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tax Return / Service Type
                  </label>
                  <select
                    value={editCustForm.filingType}
                    onChange={(e) => setEditCustForm({ ...editCustForm, filingType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ITR-1">ITR-1 (Sahaj - Salary & One House)</option>
                    <option value="ITR-2">ITR-2 (Capital Gains & Multiple Houses)</option>
                    <option value="ITR-3">ITR-3 (Business & Professional)</option>
                    <option value="ITR-4">ITR-4 (Sugam - Presumptive 44AD/ADA)</option>
                    <option value="GST">GST Registration & Filing</option>
                    <option value="NOTICE">Income Tax Notice Rectification</option>
                  </select>
                </div>

                {/* Annual Gross Income */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Annual Gross Total Income (₹)
                  </label>
                  <input
                    type="number"
                    value={editCustForm.annualGrossIncome}
                    onChange={(e) => setEditCustForm({ ...editCustForm, annualGrossIncome: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* TDS Paid */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    TDS / Tax Deducted at Source (₹)
                  </label>
                  <input
                    type="number"
                    value={editCustForm.tdsPaid}
                    onChange={(e) => setEditCustForm({ ...editCustForm, tdsPaid: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={editCustForm.bankName}
                    onChange={(e) => setEditCustForm({ ...editCustForm, bankName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={editCustForm.accountNumber}
                    onChange={(e) => setEditCustForm({ ...editCustForm, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={editCustForm.ifscCode}
                    onChange={(e) => setEditCustForm({ ...editCustForm, ifscCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono uppercase focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={editCustForm.gender}
                    onChange={(e) => setEditCustForm({ ...editCustForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bank Account Type
                  </label>
                  <select
                    value={editCustForm.accountType}
                    onChange={(e) => setEditCustForm({ ...editCustForm, accountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                  </select>
                </div>

                {/* Deductions 80C */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Section 80C Deductions (₹)
                  </label>
                  <input
                    type="number"
                    value={editCustForm.deductions80C}
                    onChange={(e) => setEditCustForm({ ...editCustForm, deductions80C: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Deductions 80D */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Section 80D Health Insurance (₹)
                  </label>
                  <input
                    type="number"
                    value={editCustForm.deductions80D}
                    onChange={(e) => setEditCustForm({ ...editCustForm, deductions80D: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Communication / Residential Address
                  </label>
                  <input
                    type="text"
                    value={editCustForm.address}
                    onChange={(e) => setEditCustForm({ ...editCustForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Area Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={editCustForm.pincode}
                    onChange={(e) => setEditCustForm({ ...editCustForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Workflow Status */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={editCustForm.status}
                    onChange={(e) => setEditCustForm({ ...editCustForm, status: e.target.value as ItrStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold cursor-pointer focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="submitted">📥 New Submission Received</option>
                    <option value="reviewing">🔍 Under Review & Verification</option>
                    <option value="filing_in_progress">⚙️ Filing in Progress on incometax.gov.in</option>
                    <option value="filed">✅ Filed & Verified by CPC Bengaluru</option>
                  </select>
                </div>

                {/* Ack Number */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    ITR-V Acknowledgement Number (15 digits)
                  </label>
                  <input
                    type="text"
                    value={editCustForm.ackNumber}
                    onChange={(e) => setEditCustForm({ ...editCustForm, ackNumber: e.target.value })}
                    placeholder="e.g. 150925901842099"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Consultant Notes */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Remarks / Notes to Taxpayer (Visible to Customer)
                  </label>
                  <input
                    type="text"
                    value={editCustForm.consultantNotes}
                    onChange={(e) => setEditCustForm({ ...editCustForm, consultantNotes: e.target.value })}
                    placeholder="e.g. Return filed successfully. CPC intimation expected within 15 days."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditCustomerModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Customer Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: DELETE CUSTOMER FILING CONFIRMATION MODAL */}
      {submissionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-200">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Customer Record</h3>
                <p className="text-xs text-slate-500">Permanent administrative action</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <strong className="text-slate-900">{submissionToDelete.clientName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reference ID:</span>
                <strong className="font-mono text-emerald-700">{submissionToDelete.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PAN Card:</span>
                <strong className="font-mono text-slate-800">{submissionToDelete.pan}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile / Email:</span>
                <span className="text-slate-700">{submissionToDelete.mobile}</span>
              </div>
            </div>

            <p className="text-xs text-rose-600 font-medium">
              ⚠️ Warning: Deleting this record will permanently remove all associated taxpayer dossiers, uploaded documents, and filing history from the portal.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmissionToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCustomer}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: DELETE USER ACCOUNT CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-200">
                <UserX className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete User Account</h3>
                <p className="text-xs text-slate-500">Remove portal authentication access</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <strong className="text-slate-900">{userToDelete.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Login Email:</span>
                <strong className="text-slate-800">{userToDelete.email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile:</span>
                <span className="text-slate-700">{userToDelete.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PAN:</span>
                <span className="font-mono font-bold text-slate-800">{userToDelete.pan || 'N/A'}</span>
              </div>
            </div>

            <p className="text-xs text-rose-600 font-medium">
              ⚠️ Warning: This customer will no longer be able to log in to the portal with this email and password.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: EDIT USER ACCOUNT MODAL */}
      {userToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Edit Taxpayer Account & Credentials
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update customer name, login email, password, and PAN card.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserToEdit(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserAccount} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserForm.name}
                    onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Login Email (Username) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={editUserForm.phone}
                    onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Login Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserForm.password}
                    onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    PAN Card Number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={editUserForm.pan}
                    onChange={(e) => setEditUserForm({ ...editUserForm, pan: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={editUserForm.aadhaar}
                    onChange={(e) => setEditUserForm({ ...editUserForm, aadhaar: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={editUserForm.bankName}
                    onChange={(e) => setEditUserForm({ ...editUserForm, bankName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={editUserForm.accountNumber}
                    onChange={(e) => setEditUserForm({ ...editUserForm, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserToEdit(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: ADD USER ACCOUNT MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Register New Customer Account
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create login credentials for a new taxpayer.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserAccount} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserAccountForm.name}
                    onChange={(e) => setNewUserAccountForm({ ...newUserAccountForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Login Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserAccountForm.email}
                    onChange={(e) => setNewUserAccountForm({ ...newUserAccountForm, email: e.target.value })}
                    placeholder="e.g. ramesh.kumar@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={newUserAccountForm.phone}
                    onChange={(e) => setNewUserAccountForm({ ...newUserAccountForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Initial Login Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserAccountForm.password}
                    onChange={(e) => setNewUserAccountForm({ ...newUserAccountForm, password: e.target.value })}
                    placeholder="e.g. Pass@1234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    PAN Card (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={newUserAccountForm.pan}
                    onChange={(e) => setNewUserAccountForm({ ...newUserAccountForm, pan: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4 text-teal-400" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
