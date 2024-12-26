import { supabase } from './supabase';

export const reports = {
  async generateCustomReport(params: {
    startDate: Date;
    endDate: Date;
    metrics: string[];
    groupBy?: string;
    filters?: Record<string, any>;
  }) {
    try {
      const queries = params.metrics.map(metric => {
        let query = supabase
          .from('analytics')
          .select('*')
          .eq('metric_type', metric)
          .gte('date', params.startDate.toISOString())
          .lte('date', params.endDate.toISOString());

        if (params.filters) {
          Object.entries(params.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        return query;
      });

      const results = await Promise.all(queries);
      const data = results.map((result, index) => ({
        metric: params.metrics[index],
        data: result.data
      }));

      if (params.groupBy) {
        return groupReportData(data, params.groupBy);
      }

      return data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  async exportData(format: 'csv' | 'json', data: any[]) {
    try {
      if (format === 'csv') {
        return convertToCSV(data);
      }
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
};

function groupReportData(data: any[], groupBy: string) {
  return data.reduce((grouped, item) => {
    const key = item[groupBy];
    grouped[key] = grouped[key] || [];
    grouped[key].push(item);
    return grouped;
  }, {});
}

function convertToCSV(data: any[]) {
  const headers = Object.keys(data[0]);
  const rows = data.map(item =>
    headers.map(header => JSON.stringify(item[header])).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}