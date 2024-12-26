import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Target, 
  Building2, 
  BarChart3,
  Mail,
  HeadphonesIcon,
  Briefcase,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { useToastStore } from '../../stores/toastStore';
import AnimatedLogo from '../common/AnimatedLogo';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const addToast = useToastStore(state => state.addToast);

  const navItems = [
    { to: '/comercial', icon: Briefcase, label: 'Comercial e Vendas' },
    { to: '/marketing', icon: Mail, label: 'Marketing' },
    { to: '/atendimento', icon: HeadphonesIcon, label: 'Atendimento ao Cliente' },
    { to: '/operacional', icon: Settings, label: 'Operacional' },
    { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      addToast('Logout realizado com sucesso!', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      addToast('Erro ao fazer logout', 'error');
    }
  };

  return (
    <aside className="bg-white dark:bg-gray-800 h-screen w-60 border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-8">
          <AnimatedLogo />
          <ThemeToggle />
        </div>

        <div className="mb-8 flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.user_metadata?.name || 'Usuário'}
          </span>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;