import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User, Phone, MapPin, AlertCircle, Sparkles, BookOpen, Clock, Heart } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Core Form states
  const [role, setRole] = useState('learner'); // learner | trainer | admin
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');

  // Trainer Specific states
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experience, setExperience] = useState('0');
  const [languages, setLanguages] = useState([]);
  const [timings, setTimings] = useState('');
  const [fee, setFee] = useState('Free');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');

  // Feedback states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Available skills checklist mapping
  const availableSkills = [
    "Tailoring", "Spoken English", "Tuition Teaching", "Computer Basics",
    "Farming Techniques", "Organic Farming", "Handicrafts", "Cooking",
    "Dance", "Music", "Mobile Repair", "Coding", "Digital Marketing",
    "Graphic Design", "Beauty & Makeup", "Carpentry", "Electrical Work", "Plumbing"
  ];

  const languagesList = ["Telugu", "English", "Hindi"];

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) => 
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleLangToggle = (lang) => {
    setLanguages((prev) => 
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'trainer' && selectedSkills.length === 0) {
      setError('Please select at least one skill that you want to teach.');
      return;
    }

    setLoading(true);

    try {
      const formData = {
        name,
        email,
        password,
        role,
        phone,
        village,
        // Trainer specific
        skills: role === 'trainer' ? selectedSkills : [],
        experience: role === 'trainer' ? experience : '0',
        languages: role === 'trainer' ? languages : [],
        timings: role === 'trainer' ? timings : '',
        fee: role === 'trainer' ? fee : '',
        bio: role === 'trainer' ? bio : '',
        photo: role === 'trainer' ? (photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200') : ''
      };

      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 border border-slate-100 dark:border-slate-700/50 rounded-3xl shadow-lg animate-slide-up">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('authRegisterTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('authRegisterSubtitle')}
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="mt-8">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 text-center uppercase tracking-wider">
            {t('authRoleSelection')}
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('learner')}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                role === 'learner'
                  ? 'bg-brand-emerald text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              Learner
            </button>
            <button
              type="button"
              onClick={() => setRole('trainer')}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                role === 'trainer'
                  ? 'bg-brand-emerald text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                role === 'admin'
                  ? 'bg-brand-emerald text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              Admin Coordinator
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {/* Error message */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center space-x-2 text-xs font-semibold">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Trainer notice */}
          {role === 'trainer' && (
            <div className="p-3 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 rounded-xl text-xs font-semibold flex items-start space-x-2">
              <Sparkles size={16} className="mt-0.5 shrink-0" />
              <span>{t('authVerifyMsg')}</span>
            </div>
          )}

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                {t('authName')}
              </label>
              <input
                type="text"
                required
                placeholder="Ravi Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
              />
              <User size={16} className="absolute left-3 top-7.5 text-slate-400" />
            </div>

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
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
              />
              <Mail size={16} className="absolute left-3 top-7.5 text-slate-400" />
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                {t('authPhone')}
              </label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
              />
              <Phone size={16} className="absolute left-3 top-7.5 text-slate-400" />
            </div>

            {/* Village */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                {t('authVillage')}
              </label>
              <input
                type="text"
                required
                placeholder="Penugonda"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
              />
              <MapPin size={16} className="absolute left-3 top-7.5 text-slate-400" />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                {t('authPassword')}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
              />
              <Lock size={16} className="absolute left-3 top-7.5 text-slate-400" />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                {t('authConfirmPassword')}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
              />
              <Lock size={16} className="absolute left-3 top-7.5 text-slate-400" />
            </div>

          </div>

          {/* DYNAMIC TRAINER FIELDS */}
          {role === 'trainer' && (
            <div className="border-t border-slate-100 dark:border-slate-700/50 mt-6 pt-6 space-y-4">
              
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center">
                <BookOpen size={16} className="mr-2 text-brand-emerald" />
                Trainer Registration Details
              </h3>

              {/* Profile Photo URL */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                  Profile Photo URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/my-photo.jpg"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
                />
              </div>

              {/* Skills multi-check list */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                  Select Skills you want to Teach
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl max-h-48 overflow-y-auto">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1.5 rounded-lg text-left text-xs font-semibold border transition-all ${
                        selectedSkills.includes(skill)
                          ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30'
                          : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {selectedSkills.includes(skill) ? '✓ ' : ''}{skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience, Fee, Timings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                    Training Fee (e.g. Free, ₹200)
                  </label>
                  <input
                    type="text"
                    placeholder="Free"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                    Available Timings
                  </label>
                  <input
                    type="text"
                    placeholder="Morning 8AM - 11AM"
                    value={timings}
                    onChange={(e) => setTimings(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
                  />
                </div>

              </div>

              {/* Languages */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                  Languages Known
                </label>
                <div className="flex space-x-2">
                  {languagesList.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLangToggle(lang)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        languages.includes(lang)
                          ? 'bg-brand-sky/10 text-brand-sky-dark border-brand-sky/20'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-transparent text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                  Short Bio / Description
                </label>
                <textarea
                  rows={3}
                  required={role === 'trainer'}
                  placeholder="Share a short summary about your skill set and background..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald border-transparent border"
                />
              </div>

            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-1"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{t('authSubmitRegister')}</span>
            )}
          </button>

          {/* Navigation link */}
          <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-700/50 text-xs">
            <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-brand-emerald transition-colors font-semibold">
              {t('authAlreadyHaveAcc')}
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}
