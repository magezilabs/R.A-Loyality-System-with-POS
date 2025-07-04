import { COLORS, POINTS_CONFIG } from './constants';

export const formatCurrency = (amount) => {
  return `UGX ${amount.toLocaleString('en-US')}`;
};

export const getOrderStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return COLORS.primary;
    case 'pending':
      return COLORS.accent;
    default:
      return COLORS.text;
  }
};

export const generateAnonymousId = () => {
  return `anon_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export const calculatePoints = (amount) => {
  return Math.floor(amount * POINTS_CONFIG.pointsPerShilling);
};
