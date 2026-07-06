import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to reset password. Please check if the email exists.');
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
            {t('authForgotTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('authForgotSubtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {/* Alerts */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center space-x-2 text-xs font-semibold">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center space-x-2 text-xs font-semibold">
              <CheckCircle size={16} />
              <span>Password reset successfully! Redirecting to login...</span>
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              {t('authEmail')}
            </label>
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
            />
            <Mail size={16} className="absolute left-3 top-7.5 text-slate-400" />
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
            />
            <Lock size={16} className="absolute left-3 top-7.5 text-slate-400" />
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
            />
            <Lock size={16} className="absolute left-3 top-7.5 text-slate-400" />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-6 py-3 px-4 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t('authSubmitReset')
            )}
          </button>

          {/* Navigation link */}
          <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-700/50 text-xs">
            <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-brand-emerald transition-colors font-semibold">
              Back to Login
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}
