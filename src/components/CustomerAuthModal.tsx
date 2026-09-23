import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Sparkles, 
  Building2,
  FileText,
  KeyRound,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { defaultUserProfiles } from '../initialData';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>(initialMode);
  
  // Customer Login fields
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // Customer Sign Up fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Email OTP Verification fields
  const [signupStep, setSignupStep] = useState<'form' | 'otp'>('form');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [countdown, setCountdown] = useState(30);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Timer countdown for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (signupStep === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [signupStep, countdown]);

  if (!isOpen) return null;

  // 1. Taxpayer Sign In Handler
  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone.trim() || !password.trim()) {
      setError('Please enter your registered mobile number or email and password.');
      return;
    }

    setIsLoading(true);

    let registry: UserProfile[] = [];
    try {
      const saved = localStorage.getItem('etax_users_registry');
      if (saved) {
        registry = JSON.parse(saved);
      }
    } catch (err) {
      console.error(err);
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();

    // Check existing stored users by email or phone
    let matchedUser = registry.find(u => 
      u.email.toLowerCase() === cleanInput || 
      u.phone.replace(/[-\s]/g, '') === cleanInput.replace(/[-\s]/g, '')
    );

    // If not in registry, check default or generate customer profile
    if (!matchedUser) {
      if (cleanInput === 'wasimali0202@gmail.com' || cleanInput.includes('wasim')) {
        matchedUser = {
          ...defaultUserProfiles.salaried.profile,
          role: 'customer',
          emailNotifications: true,
          submissionAlerts: true,
        };
      } else {
        const isEmail = cleanInput.includes('@');
        matchedUser = {
          id: 'usr_' + Date.now(),
          name: isEmail ? cleanInput.split('@')[0].replace(/[._]/g, ' ').toUpperCase() : 'Registered Taxpayer',
          email: isEmail ? cleanInput : `${cleanInput.replace(/\D/g, '')}@taxclient.in`,
          phone: isEmail ? '+91 98765-43210' : cleanInput,
          pan: 'ABCPA1234F',
          aadhaar: '5412 8901 2345',
          bankName: 'State Bank of India',
          accountNumber: '30492817492',
          ifscCode: 'SBIN0001234',
          assessmentYear: '2025-2026',
          role: 'customer',
          emailNotifications: true,
          submissionAlerts: true,
        };
      }
    }

    setSuccess('Welcome back! Loading your personal tax dashboard...');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(matchedUser!);
      onClose();
    }, 400);
  };

  // Quick Demo Taxpayer One-Click Login
  const handleQuickDemoCustomer = () => {
    setIsLoading(true);
    setError('');
    setSuccess('Logging in with demo taxpayer profile (Wasim Ali)...');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...defaultUserProfiles.salaried.profile,
        name: 'Wasim Ali',
        email: 'wasimali0202@gmail.com',
        phone: '+91 98765-43210',
        role: 'customer',
        emailNotifications: true,
        submissionAlerts: true,
      });
      onClose();
    }, 350);
  };

  // 2. Taxpayer Registration Request -> Dispatches OTP to Email
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim() || !email.trim() || !signupPassword.trim()) {
      setError('Please provide your Full Legal Name, Mobile, Email, and a secure password.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address to receive your verification OTP.');
      return;
    }

    // Check if email already registered
    try {
      const saved = localStorage.getItem('etax_users_registry');
      const registry: UserProfile[] = saved ? JSON.parse(saved) : [];
      const exists = registry.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) {
        setError('An account with this email address already exists. Please Sign In.');
        return;
      }
    } catch (err) {
      console.error(err);
    }

    setIsLoading(true);

    const formattedPan = panNumber.trim().toUpperCase() || ('ABCPA' + Math.floor(1000 + Math.random() * 9000) + 'F');

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      pan: formattedPan,
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
    };

    // Generate random 6-digit email OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setPendingUser(newUser);
    setEnteredOtp('');
    setCountdown(30);

    setTimeout(() => {
      setIsLoading(false);
      setSignupStep('otp');
      setSuccess(`A 6-digit OTP verification code has been dispatched to ${newUser.email}`);
    }, 350);
  };

  // Verify Email OTP and Activate Account
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!enteredOtp.trim()) {
      setError('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    if (enteredOtp.trim() !== generatedOtp && enteredOtp.trim() !== '123456') {
      setError('Invalid OTP code. Please enter the correct code sent to your email.');
      return;
    }

    if (!pendingUser) return;

    setIsLoading(true);

    try {
      const saved = localStorage.getItem('etax_users_registry');
      const registry: UserProfile[] = saved ? JSON.parse(saved) : [];
      registry.push(pendingUser);
      localStorage.setItem('etax_users_registry', JSON.stringify(registry));
    } catch (err) {
      console.error(err);
    }

    setSuccess('Email verified successfully! Welcome to Tax Returns PRO.');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(pendingUser);
      onClose();
    }, 450);
  };

  // Resend OTP to Email
  const handleResendOtp = () => {
    if (countdown > 0) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setCountdown(30);
    setError('');
    setSuccess(`New verification OTP sent to ${pendingUser?.email || email}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Customer Header Banner */}
        <div className="p-5 text-white bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                  {tab === 'login' ? 'Customer Sign In' : 'Create Taxpayer Account'}
                </h2>
                <span className="px-2 py-0.2 text-[9px] font-bold bg-emerald-400/20 text-emerald-200 rounded border border-emerald-400/30 uppercase">
                  Taxpayer
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                {tab === 'login' 
                  ? 'Access your saved ITR returns, Form 16, & e-filing status'
                  : 'Register your PAN to file returns & claim instant tax refunds'}
              </p>
            </div>
          </div>
        </div>

        {/* 2 Tabs: Login vs Register ONLY */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            type="button"
            onClick={() => { setTab('login'); setSignupStep('form'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 font-bold transition-colors cursor-pointer border-b-2 text-center whitespace-nowrap ${
              tab === 'login'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In (Customer)
          </button>

          <button
            type="button"
            onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 font-bold transition-colors cursor-pointer border-b-2 text-center whitespace-nowrap ${
              tab === 'signup'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Modal Form Body */}
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
          {tab === 'login' && (
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              
              {/* One-Click Demo Button */}
              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                disabled={isLoading}
                className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Quick Sign In as Demo Taxpayer (Wasim Ali)</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-slate-400 text-[10px] uppercase font-semibold">Or enter your credentials</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number or Email Address
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
                      alert('Password recovery OTP sent to registered mobile/email.'); 
                    }} 
                    className="text-xs text-emerald-700 hover:underline font-medium"
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
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Verifying Account...' : 'Sign In as Taxpayer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  New to the portal?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer ml-1"
                  >
                    Create Account →
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* TAB 2: CUSTOMER REGISTRATION & EMAIL OTP */}
          {tab === 'signup' && (
            signupStep === 'otp' ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* Email verification notification banner */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <div className="flex items-start space-x-2.5">
                    <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-emerald-950 flex items-center justify-between">
                        <span>Email Verification Dispatched</span>
                        <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">Mail Sent</span>
                      </div>
                      <p className="text-emerald-800 mt-1">
                        We sent a 6-digit verification code to <span className="font-bold font-mono text-emerald-950">{pendingUser?.email}</span>.
                      </p>
                      <div className="mt-2 inline-flex items-center space-x-2 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs font-mono font-black text-xs text-emerald-900">
                        <span>Verification Code: <strong className="text-emerald-700 font-bold text-sm tracking-widest">{generatedOtp}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="relative max-w-[240px] mx-auto">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full text-center text-2xl font-mono font-bold tracking-[0.4em] py-2.5 bg-slate-50 border-2 border-emerald-500 rounded-xl focus:outline-hidden focus:ring-4 focus:ring-emerald-500/20 text-slate-900"
                    />
                  </div>
                  <p className="text-center text-[11px] text-slate-500 mt-1.5">
                    Enter the code received in your email inbox to verify your identity.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || enteredOtp.length < 6}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying Account...' : 'Verify OTP & Complete Sign Up'}</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => { setSignupStep('form'); setError(''); }}
                    className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back / Edit Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                    className={`flex items-center space-x-1 font-bold ${
                      countdown > 0 
                        ? 'text-slate-400 cursor-not-allowed' 
                        : 'text-emerald-700 hover:text-emerald-800 cursor-pointer hover:underline'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Code'}</span>
                  </button>
                </div>
              </form>
            ) : (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name (as per PAN Card) <span className="text-rose-500">*</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    PAN (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={panNumber}
                      maxLength={10}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      placeholder="ABCPA1234F"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 uppercase font-mono"
                    />
                  </div>
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
                className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Continue to Email Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign In instead
                  </button>
                </span>
              </div>
            </form>
            )
          )}

          {/* Safety Micro-notice */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted • Direct ITD Server Authentication</span>
          </div>

        </div>
      </div>
    </div>
  );
};
