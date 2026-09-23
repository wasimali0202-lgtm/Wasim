// Central state manager for platform filing counts and dynamic metrics

export interface PlatformMetrics {
  totalFilings: number;
  refundClaimedCrores: number;
  activeFilersOnline: number;
  cpcAcceptanceRate: string;
  avgProcessingMinutes: number;
  recentFilings: Array<{
    id: number | string;
    type: string;
    city: string;
    user: string;
    refund: string;
    time: string;
  }>;
}

const STORAGE_KEY = 'tax_platform_metrics_v2';
const METRICS_UPDATE_EVENT = 'tax_metrics_updated';

// Helper to calculate realistic initial metrics from actual stored submissions
function getStoredOrInitialMetrics(): PlatformMetrics {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.totalFilings === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading platform metrics:', e);
  }

  // Count existing client submissions in localStorage if any
  let initialCount = 0;
  let initialRefund = 0;
  try {
    const storedSubmissions = localStorage.getItem('itr_client_submissions');
    if (storedSubmissions) {
      const arr = JSON.parse(storedSubmissions);
      if (Array.isArray(arr)) {
        initialCount = arr.length;
        initialRefund = arr.reduce((acc, item) => acc + (item.tdsPaid || 0), 0);
      }
    }
  } catch (e) {
    console.error('Error reading submissions count:', e);
  }

  // If user reset to 0, start precisely at actual user activity count (0 if brand new)
  const refundInCr = Number((initialRefund / 10000000).toFixed(2));

  return {
    totalFilings: initialCount,
    refundClaimedCrores: refundInCr,
    activeFilersOnline: initialCount > 0 ? 12 : 1,
    cpcAcceptanceRate: initialCount > 0 ? '100%' : '100%',
    avgProcessingMinutes: initialCount > 0 ? 3.5 : 3.8,
    recentFilings: [],
  };
}

export function getPlatformMetrics(): PlatformMetrics {
  return getStoredOrInitialMetrics();
}

export function savePlatformMetrics(metrics: PlatformMetrics): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(METRICS_UPDATE_EVENT, { detail: metrics }));
    }
  } catch (e) {
    console.error('Error saving platform metrics:', e);
  }
}

// Call this function whenever a new ITR is submitted, payment completed, or eCA booked
export function incrementPlatformFiling(params?: {
  type?: string;
  city?: string;
  user?: string;
  refundAmount?: number;
}): PlatformMetrics {
  const current = getStoredOrInitialMetrics();
  
  const refundValue = params?.refundAmount || Math.floor(Math.random() * 45000) + 12000;
  const refundCrAdded = Number((refundValue / 10000000).toFixed(4));
  
  const updated: PlatformMetrics = {
    ...current,
    totalFilings: current.totalFilings + 1,
    refundClaimedCrores: Number((current.refundClaimedCrores + refundCrAdded).toFixed(2)),
    activeFilersOnline: Math.max(1, current.activeFilersOnline + 1),
    recentFilings: [
      {
        id: Date.now(),
        type: params?.type || 'ITR-1 (Sahaj)',
        city: params?.city || 'Bengaluru',
        user: params?.user || 'New Taxpayer',
        refund: `₹${refundValue.toLocaleString('en-IN')}`,
        time: 'Just now',
      },
      ...current.recentFilings.slice(0, 4),
    ],
  };

  savePlatformMetrics(updated);
  return updated;
}

// Subscribe to real-time counter changes
export function subscribePlatformMetrics(callback: (metrics: PlatformMetrics) => void): () => void {
  const handler = (event: Event) => {
    const custom = event as CustomEvent<PlatformMetrics>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getPlatformMetrics());
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(METRICS_UPDATE_EVENT, handler);
    window.addEventListener('storage', handler);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener(METRICS_UPDATE_EVENT, handler);
      window.removeEventListener('storage', handler);
    }
  };
}
