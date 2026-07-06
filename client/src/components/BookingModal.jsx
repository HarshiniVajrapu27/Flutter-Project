import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Calendar, Clock, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function BookingModal({ trainer, onClose }) {
  const { t } = useLanguage();
  const { token, API_BASE } = useAuth();
  
  const [selectedSkill, setSelectedSkill] = useState(trainer.skills?.[0] || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [msg, setMsg] = useState('');

  // Sample time slots popular in rural setups
  const timeSlots = [
    "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkill || !date || !time) {
      setStatus('error');
      setMsg('Please fill in all the training request fields.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/bookings/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          trainerId: trainer.id,
          skillName: selectedSkill,
          date,
          time
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMsg(t('bookSuccess'));
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setStatus('error');
        setMsg(data.message || t('bookFail'));
      }
    } catch (err) {
      console.error('Booking request error:', err);
      setStatus('error');
      setMsg(t('bookFail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700 animate-slide-up overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {t('bookTitle')}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          {/* Status alerts */}
          {status === 'success' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center space-x-2 text-sm">
              <CheckCircle size={16} />
              <span>{msg}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center space-x-2 text-sm">
              <AlertCircle size={16} />
              <span>{msg}</span>
            </div>
          )}

          {/* Trainer Summary */}
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
            <img 
              src={trainer.photo} 
              alt={trainer.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="block text-xs font-semibold text-slate-400">Trainer</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">{trainer.name}</span>
            </div>
          </div>

          {/* Skill selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center">
              <BookOpen size={12} className="mr-1 text-brand-emerald" />
              Select Skill to Learn
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
            >
              {trainer.skills?.map((skill, i) => (
                <option key={i} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center">
              <Calendar size={12} className="mr-1 text-brand-emerald" />
              {t('bookDate')}
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center">
              <Clock size={12} className="mr-1 text-brand-emerald" />
              {t('bookTime')}
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-28 overflow-y-auto p-1 border border-slate-100 dark:border-slate-700/50 rounded-xl">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`py-1 text-xs font-semibold rounded-lg border transition-all ${
                    time === slot
                      ? 'bg-brand-emerald text-white border-brand-emerald'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 text-sm font-bold text-white bg-brand-emerald hover:bg-brand-emerald-dark rounded-xl shadow-md transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                t('bookSendBtn')
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
