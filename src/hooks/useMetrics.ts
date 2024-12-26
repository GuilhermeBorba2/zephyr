import { useState, useEffect } from 'react';
import { metricsService } from '../lib/analytics/metrics';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';

export const useMetrics = () => {
  const user = useAuthStore(state => state.user);
  const addToast = useToastStore(state => state.addToast);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadMetrics();
    }
  }, [user]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await metricsService.getPerformanceMetrics(user?.id);
      setMetrics(data);
    } catch (err: any) {
      setError(err.message);
      addToast('Erro ao carregar métricas', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, refresh: loadMetrics };
};