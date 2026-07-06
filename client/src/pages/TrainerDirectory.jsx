import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Star, User, BookOpen, MessageSquare, Eye } from 'lucide-react';

export default function TrainerDirectory() {
  const { t } = useLanguage();
  const { API_BASE, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch lists
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filter states
  const [skillInput, setSkillInput] = useState(searchParams.get('skill') || '');
  const [villageInput, setVillageInput] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [liveQuery, setLiveQuery] = useState('');

  // Selected trainer for quick contact modal/details
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // Refetch trainers based on query parameters or input changes
  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (skillInput) queryParams.append('skill', skillInput);
        if (villageInput) queryParams.append('village', villageInput);
        if (langFilter) queryParams.append('language', langFilter);
        if (liveQuery) queryParams.append('query', liveQuery);

        const res = await fetch(`${API_BASE}/trainers?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setTrainers(data);
        }
      } catch (err) {
        console.error('Error fetching trainers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [skillInput, villageInput, langFilter, liveQuery, API_BASE]);

  // Sync skill search params from route if changed
  useEffect(() => {
    const skillParam = searchParams.get('skill');
    if (skillParam) {
      setSkillInput(skillParam);
    }
  }, [searchParams]);

  // Sync village constraint if learner is logged in
  useEffect(() => {
    if (user && user.role === 'learner' && user.village) {
      setVillageInput(user.village);
    }
  }, [user]);

  const handleResetFilters = () => {
    setSkillInput('');
    setVillageInput('');
    setLangFilter('');
    setLiveQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark py-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            {t('directoryTitle')}
          </h1>
          <p className="mt-2 text-md text-slate-600 dark:text-slate-400">
            {t('directorySubtitle')}
          </p>
        </div>

        {/* Same Village Constraint Notice */}
        {user && user.role === 'learner' && user.village && (
          <div className="p-4 mb-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-center space-x-2 text-xs font-bold shadow-sm">
            <span>✓ Skill sharing is restricted to within your village: <strong>{user.village}</strong>. Cross-village listings are disabled.</span>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-md mb-8">
          
          {/* Skill Filter */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              {t('dirSearchSkill')}
            </label>
            <input
              type="text"
              placeholder="e.g. Tailoring"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                setSearchParams(e.target.value ? { skill: e.target.value } : {});
              }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald transition-all"
            />
            <BookOpen size={16} className="absolute left-3 top-7.5 text-slate-400" />
          </div>

          {/* Village Filter */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              {t('dirSearchVillage')}
            </label>
            <input
              type="text"
              placeholder="e.g. Kavitam"
              value={villageInput}
              disabled={user && user.role === 'learner'}
              readOnly={user && user.role === 'learner'}
              onChange={(e) => setVillageInput(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-sm text-slate-800 dark:text-white rounded-xl focus:outline-none border-transparent border ${
                user && user.role === 'learner' 
                  ? 'bg-slate-100 dark:bg-slate-950/40 text-slate-450 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-brand-emerald transition-all'
              }`}
            />
            <MapPin size={16} className="absolute left-3 top-7.5 text-slate-400" />
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              {t('dirFilterLang')}
            </label>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald transition-all"
            >
              <option value="">{t('dirAllLangs')}</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* Live Global Keyword Query & Reset Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>

        </div>

        {/* Global Live Keyword search */}
        <div className="relative mb-6 max-w-md">
          <input
            type="text"
            placeholder="Type keyword (e.g. bio keywords, name)..."
            value={liveQuery}
            onChange={(e) => setLiveQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald text-slate-800 dark:text-white"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
        </div>

        {/* Trainers Directory Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div 
                key={trainer.id}
                className="flex flex-col justify-between p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Profile header */}
                <div>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={trainer.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
                      alt={trainer.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-brand-emerald/20"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                        {trainer.name}
                        {trainer.isVerified && (
                          <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-emerald text-white text-[9px] font-bold" title="Verified Trainer">
                            ✓
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center text-xs text-slate-400 mt-0.5">
                        <MapPin size={12} className="text-brand-emerald mr-1 shrink-0" />
                        <span>{trainer.village || "Unknown Village"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mt-3 text-xs bg-slate-50 dark:bg-slate-900 w-fit px-2 py-1 rounded-lg">
                    <Star size={12} className="text-amber-500 fill-amber-500 mr-1 shrink-0" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">{trainer.rating || "5.0"}</span>
                    <span className="text-slate-400 ml-1">({trainer.reviews?.length || 0} reviews)</span>
                  </div>

                  {/* Skills Tag block */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {trainer.skills && trainer.skills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-brand-emerald/10 text-brand-emerald dark:bg-brand-emerald/20 text-xs font-semibold rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bio summary */}
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {trainer.bio || "No biography provided yet."}
                  </p>

                  {/* Metadata: Languages & timings */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-500 dark:text-slate-400">{t('profLanguages')}:</span> {trainer.languages ? trainer.languages.join(', ') : 'Telugu'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 dark:text-slate-400">{t('profFee')}:</span> <span className="font-bold text-slate-700 dark:text-slate-200">{trainer.fee || 'Free'}</span>
                    </div>
                  </div>
                </div>

                {/* Card footer buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                      } else {
                        setSelectedTrainer(trainer);
                      }
                    }}
                    className="flex items-center justify-center space-x-1 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-900/60 transition-all border border-slate-200 dark:border-slate-700/50"
                  >
                    <MessageSquare size={14} />
                    <span>{t('dirBtnContact')}</span>
                  </button>
                  <button
                    onClick={() => navigate(`/trainer/${trainer.id}`)}
                    className="flex items-center justify-center space-x-1 py-2 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-brand-emerald transition-all"
                  >
                    <Eye size={14} />
                    <span>{t('dirBtnProfile')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && trainers.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-sm border border-slate-100 dark:border-slate-700">
            <User size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4 animate-pulse-slow" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Trainers Found</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
              {t('dirNoTrainers')}
            </p>
          </div>
        )}

      </div>

      {/* Quick Contact Modal (Simple Overlay Box) */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700 animate-slide-up">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Contact {selectedTrainer.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              You can contact this trainer directly or book a structured slot on the profile screen.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="block text-xs font-semibold text-slate-400 mb-0.5">{t('authPhone')}</span>
                <a href={`tel:${selectedTrainer.phone}`} className="text-slate-800 dark:text-white font-bold hover:text-brand-emerald">
                  {selectedTrainer.phone || "Not available"}
                </a>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="block text-xs font-semibold text-slate-400 mb-0.5">{t('authEmail')}</span>
                <a href={`mailto:${selectedTrainer.email}`} className="text-slate-800 dark:text-white font-bold hover:text-brand-emerald">
                  {selectedTrainer.email}
                </a>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="block text-xs font-semibold text-slate-400 mb-0.5">{t('profTimings')}</span>
                <span className="text-slate-800 dark:text-white font-semibold">
                  {selectedTrainer.timings || "Flexible"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedTrainer(null)}
                className="py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedTrainer(null);
                  navigate(`/trainer/${selectedTrainer.id}`);
                }}
                className="py-2.5 rounded-xl text-sm font-bold text-white bg-brand-emerald hover:bg-brand-emerald-dark"
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
