import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import Layout from './components/layouts/Layout';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import ForgotPasswordPage from './pages/Auth/ForgotPassword';
import LeadsPage from './pages/Leads';
import OpportunitiesPage from './pages/Opportunities';
import ClientsPage from './pages/Clients';
import MarketingPage from './pages/Marketing';
import ReportsPage from './pages/Reports';
import CustomerServicePage from './pages/CustomerService';
import Toast from './components/common/Toast';
import Chatbot from './components/automation/Chatbot';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore(state => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const isDark = useThemeStore(state => state.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/comercial" replace />} />
            <Route path="comercial" element={<LeadsPage />} />
            <Route path="marketing" element={<MarketingPage />} />
            <Route path="atendimento" element={<CustomerServicePage />} />
            <Route path="operacional" element={<ClientsPage />} />
            <Route path="relatorios" element={<ReportsPage />} />
          </Route>
        </Routes>
        <Toast />
        <Chatbot />
      </BrowserRouter>
    </div>
  );
}

export default App;