import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-bg-light dark:bg-brand-bg-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 border border-slate-100 dark:border-slate-700/50 rounded-3xl shadow-lg animate-slide-up">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('authLoginTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('authLoginSubtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {/* Error display */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center space-x-2 text-xs font-semibold">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Email field */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              {t('authEmail')}
            </label>
            <input
              type="email"
              required
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border transition-all"
            />
            <Mail size={16} className="absolute left-3 top-7.5 text-slate-400" />
          </div>

          {/* Password field */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500">
                {t('authPassword')}
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-brand-emerald hover:underline">
                {t('authForgotPasswordBtn')}
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border transition-all"
            />
            <Lock size={16} className="absolute left-3 top-7.5 text-slate-400" />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-1"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{t('authSubmitLogin')}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Navigation link */}
          <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-700/50 text-xs">
            <Link to="/register" className="text-slate-500 dark:text-slate-400 hover:text-brand-emerald transition-colors font-semibold">
              {t('authNoAcc')}
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}
