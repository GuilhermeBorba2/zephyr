import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wind, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Input from '../../components/common/Input';
import { useToastStore } from '../../stores/toastStore';

const ForgotPasswordPage = () => {
  const addToast = useToastStore(state => state.addToast);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      setSuccess(true);
      addToast('Email de recuperação enviado com sucesso!', 'success');
    } catch (error: any) {
      setError('Erro ao enviar email de recuperação');
      addToast('Erro ao enviar email de recuperação', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Wind className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Recuperar senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Digite seu email para receber as instruções
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Email enviado! Verifique sua caixa de entrada para redefinir sua senha.
              </p>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
              >
                Voltar para o login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:focus:ring-offset-gray-900"
                >
                  {loading ? 'Enviando...' : 'Enviar email de recuperação'}
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Voltar para o login
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;