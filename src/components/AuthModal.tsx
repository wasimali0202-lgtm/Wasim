import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone, CheckCircle2, ArrowRight, X, Sparkles, Building2, Eye, EyeOff } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { defaultUserProfiles } from '../initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'customer' | 'admin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'customer',
}) => {
  const [authTab, setAuthTab] = useState<'customer' | 'admin' | 'signup'>(initialMode);
  
  // Customer inputs
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);

  // Admin inputs
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Sign up inputs
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Customer Login Handler
  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone.trim() || !password.trim()) {
      setError('Please enter your mobile number or email and password.');
      return;
    }

    setIsLoading(true);

    const PRIMARY_ADMIN_EMAIL = 'wasimali0202@gmail.com';
    const PRIMARY_ADMIN_PASS = '9007105383';

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. If input matches Master Admin credentials, allow Master Admin to log in anytime from customer tab!
    if (
      (cleanInput === PRIMARY_ADMIN_EMAIL.toLowerCase() || cleanInput === 'admin' || cleanInput === 'admin@incometaxindia.gov.in') &&
      (cleanPass === PRIMARY_ADMIN_PASS || cleanPass === 'admin' || cleanPass === 'admin123')
    ) {
      const officialAdminUser: UserProfile = {
        id: 'master_admin_wasim',
        name: 'Wasim Ali (Master Admin)',
        email: PRIMARY_ADMIN_EMAIL,
        phone: '+91 98765-43210',
        pan: 'ABCPA1234F',
        aadhaar: '5412 8901 2345',
        bankName: 'State Bank of India (Admin Treasury)',
        accountNumber: '30492817492',
        ifscCode: 'SBIN0001234',
        role: 'admin',
        assessmentYear: '2025-2026',
        emailNotifications: true,
        submissionAlerts: true,
      };

      setSuccess('Master Admin logged in successfully! Loading Admin Dashboard...');
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(officialAdminUser);
        onClose();
      }, 350);
      return;
    }

    // 2. Load persistent registered users from localStorage
    let registry: any[] = [];
    try {
      const saved = localStorage.getItem('etax_users_registry');
      if (saved) {
        registry = JSON.parse(saved);
      }
    } catch (err) {
      console.error(err);
    }

    // Add demo accounts if registry is empty so users can also test immediately
    if (registry.length === 0) {
      registry = [
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
          assessmentYear: '2025-2026',
          role: 'customer',
          emailNotifications: true,
          submissionAlerts: true,
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
          assessmentYear: '2025-2026',
          role: 'customer',
          emailNotifications: true,
          submissionAlerts: true,
        }
      ];
      try {
        localStorage.setItem('etax_users_registry', JSON.stringify(registry));
      } catch (e) {
        console.error(e);
      }
    }

    // Find user in registry by email or phone
    const matched = registry.find((u: any) => 
      (u.email && u.email.toLowerCase() === cleanInput) ||
      (u.phone && u.phone.replace(/[-\s]/g, '') === cleanInput.replace(/[-\s]/g, ''))
    );

    if (!matched) {
      setTimeout(() => {
        setIsLoading(false);
        setError('No registered account found with this email or mobile. Please click "Create an account" to Sign Up.');
      }, 300);
      return;
    }

    // Validate password for the registered user
    if (matched.password && matched.password !== cleanPass) {
      setTimeout(() => {
        setIsLoading(false);
        setError('Incorrect password! Please enter the exact password you used during Sign Up.');
      }, 300);
      return;
    }

    // Valid customer credentials
    const { password: _p, ...cleanProfile } = matched;
    setSuccess(`Welcome back, ${cleanProfile.name}! Loading dashboard...`);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(cleanProfile as UserProfile);
      onClose();
    }, 350);
  };

  // Official Admin Login Handler
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const PRIMARY_ADMIN_EMAIL = 'wasimali0202@gmail.com';
    const PRIMARY_ADMIN_PASS = '9007105383';
    const FALLBACK_ADMIN_EMAIL = 'admin@incometaxindia.gov.in';

    const emailVal = adminEmail.trim().toLowerCase();
    const passVal = adminPassword.trim();

    if (!emailVal || !passVal) {
      setError('Please enter the designated Master Admin ID and password.');
      return;
    }

    setIsLoading(true);

    const isAuthorizedAdmin = 
      emailVal === PRIMARY_ADMIN_EMAIL.toLowerCase() || 
      emailVal === FALLBACK_ADMIN_EMAIL.toLowerCase() || 
      emailVal === 'admin';

    const isPasswordValid = 
      passVal === PRIMARY_ADMIN_PASS || 
      passVal === 'admin' || 
      passVal === 'admin123' || 
      passVal === 'Admin@2025';

    if (!isAuthorizedAdmin) {
      setTimeout(() => {
        setIsLoading(false);
        setError(`Access Denied! Designated Master Admin ID is "${PRIMARY_ADMIN_EMAIL}".`);
      }, 300);
      return;
    }

    if (!isPasswordValid) {
      setTimeout(() => {
        setIsLoading(false);
        setError('Incorrect Admin Password.');
      }, 300);
      return;
    }

    const officialAdminUser: UserProfile = {
      id: 'master_admin_wasim',
      name: 'Wasim Ali (Master Admin)',
      email: PRIMARY_ADMIN_EMAIL,
      phone: '+91 98765-43210',
      pan: 'ABCPA1234F',
      aadhaar: '5412 8901 2345',
      bankName: 'State Bank of India (Admin Treasury)',
      accountNumber: '30492817492',
      ifscCode: 'SBIN0001234',
      role: 'admin',
      assessmentYear: '2025-2026',
      emailNotifications: true,
      submissionAlerts: true,
    };

    setSuccess('Signed in successfully! Loading Admin Dashboard...');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(officialAdminUser);
      onClose();
    }, 400);
  };

  // Sign Up Handler
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim() || !email.trim() || !signupPassword.trim()) {
      setError('Please fill in Full Name, Mobile Number, Email, and Password.');
      return;
    }

    if (signupPassword.trim().length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    let registry: any[] = [];
    try {
      const saved = localStorage.getItem('etax_users_registry');
      if (saved) {
        registry = JSON.parse(saved);
      }
    } catch (err) {
      console.error(err);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Check if account already exists
    const alreadyExists = registry.some((u: any) => 
      (u.email && u.email.toLowerCase() === cleanEmail) ||
      (u.phone && u.phone.replace(/[-\s]/g, '') === cleanPhone.replace(/[-\s]/g, ''))
    );

    if (alreadyExists) {
      setTimeout(() => {
        setIsLoading(false);
        setError('An account with this Email or Mobile already exists. Please Sign In with your password.');
      }, 300);
      return;
    }

    const newUserRecord: any = {
      id: 'usr_' + Date.now(),
      name: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: signupPassword.trim(), // Persistent password for login verification
      pan: 'ABCPA' + Math.floor(1000 + Math.random() * 9000) + 'F',
      aadhaar: '5412 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000),
      assessmentYear: '2025-2026',
      taxpayerType: 'salaried',
      address: 'Kolkata, West Bengal',
      bankName: 'State Bank of India',
      accountNumber: '30492817492',
      ifscCode: 'SBIN0001234',
      role: 'customer',
      emailNotifications: true,
      submissionAlerts: true,
      createdAt: new Date().toISOString(),
    };

    try {
      registry.push(newUserRecord);
      localStorage.setItem('etax_users_registry', JSON.stringify(registry));
    } catch (err) {
      console.error(err);
    }

    const { password: _p, ...cleanProfile } = newUserRecord;

    setSuccess('Account created successfully! Logging you in...');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(cleanProfile as UserProfile);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className={`p-5 text-white relative ${authTab === 'admin' ? 'bg-linear-to-r from-slate-900 via-slate-800 to-teal-950' : 'bg-linear-to-r from-emerald-800 to-teal-900'}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                {authTab === 'customer' && 'Taxpayer Sign In'}
                {authTab === 'admin' && 'Official Admin & Officer Sign In'}
                {authTab === 'signup' && 'Create Taxpayer Account'}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {authTab === 'customer' && 'File returns, upload Form 16 & track e-filing status'}
                {authTab === 'admin' && 'Inspect customer submissions, verify documents & issue ITR-V'}
                {authTab === 'signup' && 'Register your PAN & email for seamless return filing'}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Way Mode Switch Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            type="button"
            onClick={() => { setAuthTab('customer'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 font-bold transition-colors cursor-pointer border-b-2 text-center whitespace-nowrap ${
              authTab === 'customer'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Login
          </button>

          <button
            type="button"
            onClick={() => { setAuthTab('admin'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 font-bold transition-colors cursor-pointer border-b-2 text-center whitespace-nowrap flex items-center justify-center space-x-1 ${
              authTab === 'admin'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Admin Login</span>
            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 font-extrabold text-[9px] rounded-md">
              OFFICIAL
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthTab('signup'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 font-bold transition-colors cursor-pointer border-b-2 text-center whitespace-nowrap ${
              authTab === 'signup'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* TAB 1: CUSTOMER LOGIN */}
          {authTab === 'customer' && (
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Enter email or 10-digit mobile"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <a 
                    href="#forgot" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      alert('Password reset instructions dispatched to your registered email/phone.'); 
                    }} 
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Verifying...' : 'Sign In as Taxpayer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  Are you an income tax consultant or administrator?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthTab('admin'); setError(''); setSuccess(''); }}
                    className="text-emerald-800 font-bold hover:underline cursor-pointer ml-1"
                  >
                    Switch to Admin Login →
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* TAB 2: ADMIN LOGIN */}
          {authTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Designated Master Admin ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter Admin ID / Email"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-800 focus:bg-white text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin Access Key / Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter Admin Password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-800 focus:bg-white text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title={showAdminPassword ? 'Hide password' : 'Show password'}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>{isLoading ? 'Verifying Admin...' : 'Sign In as Administrator'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  Are you an individual taxpayer?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthTab('customer'); setError(''); setSuccess(''); }}
                    className="text-emerald-800 font-bold hover:underline cursor-pointer ml-1"
                  >
                    Switch to Taxpayer Login →
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* TAB 3: SIGN UP */}
          {authTab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Wasim Ali"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthTab('customer'); setError(''); setSuccess(''); }}
                    className="text-emerald-700 font-semibold hover:underline cursor-pointer ml-1"
                  >
                    Customer Sign In
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
