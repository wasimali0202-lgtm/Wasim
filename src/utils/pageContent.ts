import { useState, useEffect } from 'react';

export interface SitePageContent {
  topBar: {
    badgeText: string;
    announcementText: string;
    helplinePhone: string;
    helplinePhoneLink: string;
    supportEmail: string;
  };
  homeHero: {
    badgeText: string;
    mainHeadingLine1: string;
    mainHeadingHighlight: string;
    subDescription: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    ratingText: string;
    trustedUsersCount: string;
    authBadgeText: string;
    securityBadgeText: string;
  };
  services: {
    itr1Title: string;
    itr1Price: string;
    itr1Desc: string;
    itr2Title: string;
    itr2Price: string;
    itr2Desc: string;
    itr3Title: string;
    itr3Price: string;
    itr3Desc: string;
    noticeTitle: string;
    noticePrice: string;
    noticeDesc: string;
  };
  contactInfo: {
    officeAddress: string;
    workingHours: string;
    helplinePhone: string;
    supportEmail: string;
    whatsappNumber: string;
  };
  notices: {
    section143Heading: string;
    section143Desc: string;
    section139DefectiveDesc: string;
    refundAssistanceNote: string;
  };
}

export const DEFAULT_PAGE_CONTENT: SitePageContent = {
  topBar: {
    badgeText: 'AY 2025-26',
    announcementText: 'ITR e-Filing Active • Standard Deduction ₹75,000 (New Regime) • Tax-free income up to ₹7,75,000 • Direct refund in 48 hrs',
    helplinePhone: '+91 98765-43210',
    helplinePhoneLink: '+919876543210',
    supportEmail: 'wasimali0202@gmail.com',
  },
  homeHero: {
    badgeText: 'Income Tax e-Filing • AY 2025-26 Live',
    mainHeadingLine1: 'File Income Tax Return Online',
    mainHeadingHighlight: 'Gain Maximum Refund',
    subDescription: 'India\'s fastest, 100% accurate AI-powered tax filing platform with instant ITR-V generation, maximum deduction discovery, and zero notice guarantee.',
    primaryButtonText: 'Start Filing Now - ₹0 Fee',
    secondaryButtonText: 'Calculate Tax & Refund',
    ratingText: '4.8 Google Rating (50,000+ reviews)',
    trustedUsersCount: '3 Million+ Trusted Taxpayers',
    authBadgeText: 'Authorized by ITD (e-Return Intermediary)',
    securityBadgeText: '256-Bit SSL Bank-Grade Security',
  },
  services: {
    itr1Title: 'ITR-1 (Sahaj) Salaried',
    itr1Price: '₹0 (Free)',
    itr1Desc: 'For salaried individuals, pensioners, and single house property income up to ₹50 Lakhs.',
    itr2Title: 'ITR-2 Capital Gains & Crypto',
    itr2Price: '₹999',
    itr2Desc: 'For capital gains from stocks, mutual funds, property sale, foreign income & directorships.',
    itr3Title: 'ITR-3 & ITR-4 (Business & Sugam)',
    itr3Price: '₹1,499',
    itr3Desc: 'For business owners, freelancers, professionals under Sec 44AD/44ADA presumptive taxation.',
    noticeTitle: 'Notice Resolution (Sec 143/139)',
    noticePrice: '₹1,999',
    noticeDesc: 'Certified CA defense response for defective return notices, tax mismatches & Section 148 inquiries.',
  },
  contactInfo: {
    officeAddress: 'Tax Return PRO e-Filing Hub, Sector 24, Cyber City, Gurugram & Park Street, Kolkata, India',
    workingHours: 'Monday - Saturday: 9:00 AM - 8:00 PM (IST)',
    helplinePhone: '+91 98765-43210',
    supportEmail: 'wasimali0202@gmail.com',
    whatsappNumber: '+91 98765-43210',
  },
  notices: {
    section143Heading: 'Income Tax Notice Response Desk',
    section143Desc: 'Received Section 143(1) intimation with tax demand? Our Chartered Accountants analyze 26AS/AIS variance and submit rectified responses.',
    section139DefectiveDesc: 'Section 139(9) defective return rectification submitted within the 15-day statutory timeline.',
    refundAssistanceNote: 'Instant assistance for refund reissue, failed ECS mandate & CPC Bangalore refund tracking.',
  },
};

const STORAGE_KEY = 'site_page_content_v1';
const EVENT_NAME = 'site_page_content_updated';

export const getPageContent = (): SitePageContent => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults in case of missing keys
      return {
        topBar: { ...DEFAULT_PAGE_CONTENT.topBar, ...(parsed.topBar || {}) },
        homeHero: { ...DEFAULT_PAGE_CONTENT.homeHero, ...(parsed.homeHero || {}) },
        services: { ...DEFAULT_PAGE_CONTENT.services, ...(parsed.services || {}) },
        contactInfo: { ...DEFAULT_PAGE_CONTENT.contactInfo, ...(parsed.contactInfo || {}) },
        notices: { ...DEFAULT_PAGE_CONTENT.notices, ...(parsed.notices || {}) },
      };
    }
  } catch (e) {
    console.error('Failed to parse site_page_content', e);
  }
  return DEFAULT_PAGE_CONTENT;
};

export const savePageContent = (content: SitePageContent): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: content }));
  } catch (e) {
    console.error('Failed to save site_page_content', e);
  }
};

export const resetPageContent = (): SitePageContent => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_PAGE_CONTENT }));
  } catch (e) {
    console.error('Failed to reset site_page_content', e);
  }
  return DEFAULT_PAGE_CONTENT;
};

export const usePageContent = (): SitePageContent => {
  const [content, setContent] = useState<SitePageContent>(getPageContent);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SitePageContent>;
      if (customEvent.detail) {
        setContent(customEvent.detail);
      } else {
        setContent(getPageContent());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return content;
};
