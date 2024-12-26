import { consultantAnalytics } from './consultant';
import { revenueAnalytics } from './revenue';
import { leadAnalytics } from './leads';

export const analytics = {
  getConsultantPerformance: consultantAnalytics.getPerformance,
  getRevenueData: revenueAnalytics.getData,
  getLeadConversionRate: leadAnalytics.getConversionRate,
  getAverageOpportunityValue: revenueAnalytics.getAverageValue,
  getSalesCycle: revenueAnalytics.getSalesCycle,
  getConversionData: leadAnalytics.getConversionData,
  getPerformanceData: consultantAnalytics.getTeamPerformance
};