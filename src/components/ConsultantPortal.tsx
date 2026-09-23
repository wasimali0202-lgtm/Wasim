import React from 'react';
import { AdminDashboard } from './AdminDashboard';
import { Language, UserProfile } from '../types';

interface ConsultantPortalProps {
  language?: Language;
  onNavigateToForm?: () => void;
  currentUser?: UserProfile | null;
  onSwitchToCustomerView?: () => void;
}

export const ConsultantPortal: React.FC<ConsultantPortalProps> = (props) => {
  return <AdminDashboard {...props} />;
};
