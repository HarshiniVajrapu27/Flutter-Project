import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Sprout, BookOpen, Users, Landmark, ArrowRight, Quote } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const { API_BASE } = useAuth();
  const navigate = useNavigate();

  // Statistics state
  const [stats, setStats] = useState({
    trainers: 12,
    learners: 45,
    skills: 18,
    villages: 6
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            trainers: data.verifiedTrainersCount || 12,
            learners: data.learnersCount || 45,
            skills: data.skillsCount || 18,
            villages: data.villagesCount || 6
          });
        }
      } catch (err) {
        console.error('Error fetching landing page stats:', err);
      }
    };

    fetchStats();
  }, [API_BASE]);

  // Premium testimonials list
  const testimonials = [
    {
      quote: "నేను కుట్టుపని నేర్చుకున్నాను. ఇప్పుడు నా స్వంత ఊరిలోనే బట్టలు కుడుతూ రోజుకి ₹300 వరకు సంపాదిస్తున్నాను. ఈ ప్లాట్‌ఫారమ్ నాకు నిజంగా వరప్రసాదం!",
      author: "Sravani (స్వరావణి)",
      role: "Learner, Penugonda",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "Teaching farming techniques to youngsters gives me immense satisfaction. Sharing my 15 years of agricultural experience to build a chemical-free organic village is my life goal.",
      author: "Satyanarayana Murthy",
      role: "Organic Farmer & Trainer",
      avatar: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "టెక్నాలజీ మరియు కంప్యూటర్ల గురించి మా గ్రామ యువతకు బోధించడం నాకు చాలా సంతోషంగా ఉంది. ప్లాట్‌ఫారమ్ ద్వారా అనుసంధానం కావడం చాలా సులభం అయింది.",
      author: "Anand Rao (ఆనంద్ రావు)",
      role: "Computer Science Student & Trainer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-300 overflow-hidden">
      
      {/* ======================================================== */}
      {/* HERO SECTION */}
      {/* ======================================================== */}
      <header className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-tr from-brand-emerald-hover to-slate-900 text-white">
        {/* Abstract background vector overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-emerald/20 via-transparent to-transparent opacity-60" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Title / Description */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-slide-up">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-brand-emerald/20 text-brand-emerald-light uppercase tracking-wider">
                Community Service Project (CSP)
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-lg sm:text-xl text-slate-350 font-medium">
                {t('heroSubtitle')}
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('heroIntro')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-brand-emerald hover:bg-brand-emerald-light text-white font-extrabold rounded-2xl shadow-lg shadow-brand-emerald/20 hover:shadow-brand-emerald/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-1"
                >
                  <span>{t('heroBtnGetStarted')}</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/skills')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-650 font-extrabold rounded-2xl transition-all"
                >
                  {t('heroBtnExplore')}
                </button>
              </div>
            </div>

            {/* Visual illustration image container */}
            <div className="lg:col-span-5 relative animate-fade-in flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-emerald to-brand-sky rounded-full filter blur-3xl opacity-20 animate-pulse-slow" />
              <img 
                src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=500"
                alt="Villagers Learning"
                className="w-full max-w-md rounded-[2.5rem] object-cover shadow-2xl border-4 border-slate-800 hover:rotate-2 transition-transform duration-500 animate-float"
              />
            </div>

          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* STATISTICS COUNTER SECTION */}
      {/* ======================================================== */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-850 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Trainers stat */}
            <div className="p-4 flex items-center space-x-4 border-r border-slate-100 dark:border-slate-800 last:border-0 justify-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.trainers}+
                </span>
                <span className="text-xs text-slate-500 font-semibold">{t('statsTrainers')}</span>
              </div>
            </div>

            {/* Learners stat */}
            <div className="p-4 flex items-center space-x-4 border-r border-slate-100 dark:border-slate-800 last:border-0 justify-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-sky/10 text-brand-sky flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.learners}+
                </span>
                <span className="text-xs text-slate-500 font-semibold">{t('statsLearners')}</span>
              </div>
            </div>

            {/* Skills stat */}
            <div className="p-4 flex items-center space-x-4 border-r border-slate-100 dark:border-slate-800 last:border-0 justify-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <BookOpen size={22} />
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.skills}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{t('statsSkills')}</span>
              </div>
            </div>

            {/* Villages stat */}
            <div className="p-4 flex items-center space-x-4 last:border-0 justify-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Landmark size={22} />
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.villages}+
                </span>
                <span className="text-xs text-slate-500 font-semibold">{t('statsVillages')}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* BRIEF INTRODUCTION SECTION */}
      {/* ======================================================== */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Why Skill Sharing Matters in Our Villages
            </h2>
            <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-sm sm:text-base">
              Many rural communities possess incredible traditional skills like tailoring, handcrafting, and organic cultivation, alongside modern expertise like digital literacy, mobile repair, and graphics design. Unfortunately, there is no structured way to connect people who wish to teach with neighbors who want to learn.
            </p>
            <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-sm sm:text-base">
              The **"Skill Sharing Among Villagers"** platform resolves this gap by providing a digital coordination registry. Young learners can master vocational trades locally, and experienced practitioners can generate supplemental income right from their home villages.
            </p>
            
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded bg-brand-emerald text-white flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">100% Affordable & Local</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded bg-brand-emerald text-white flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Supports Telugu & English</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded bg-brand-emerald text-white flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Empowers Local Women</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded bg-brand-emerald text-white flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Zero-Config Online System</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 grid grid-cols-2 gap-4 relative">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-brand-emerald text-white flex items-center justify-center mb-3">
                <Sprout size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Agriculture Focus</h4>
              <span className="text-xs text-slate-400 mt-1 block">Organic techniques & water management.</span>
            </div>
            
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-center mt-6">
              <div className="w-10 h-10 mx-auto rounded-xl bg-brand-sky text-white flex items-center justify-center mb-3">
                <BookOpen size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Vocational Skills</h4>
              <span className="text-xs text-slate-400 mt-1 block">Tailoring, computers, mobile repairing.</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-center -mt-6">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500 text-white flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Community Led</h4>
              <span className="text-xs text-slate-400 mt-1 block">Coordinated village workshops & stories.</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3">
                <Landmark size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Telugu Heritage</h4>
              <span className="text-xs text-slate-400 mt-1 block">Traditional handicrafts & music.</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* TESTIMONIALS SECTION */}
      {/* ======================================================== */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold text-brand-emerald tracking-wider">
              Success Stories
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 sm:text-4xl">
              Hear from our Trainers & Learners
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Read how this skill sharing initiative is fostering local employment and rural transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-150/40 dark:border-slate-700/50 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <Quote size={32} className="absolute right-6 top-6 text-slate-100 dark:text-slate-700" />
                <p className="text-slate-600 dark:text-slate-350 italic text-sm leading-relaxed relative z-10">
                  "{test.quote}"
                </p>
                <div className="mt-6 flex items-center space-x-3">
                  <img 
                    src={test.avatar} 
                    alt={test.author} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-brand-emerald/20"
                  />
                  <div>
                    <span className="block font-bold text-xs text-slate-800 dark:text-white">
                      {test.author}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {test.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* BOTTOM CTA CALL-TO-ACTION */}
      {/* ======================================================== */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Ready to Grow Your Village Community?
        </h2>
        <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">
          Whether you want to learn a skill or teach one, registration is completely free. Set up your profile in 2 minutes.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-extrabold rounded-2xl shadow transition-all"
          >
            Create an Account
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold rounded-2xl transition-all"
          >
            Read Our Vision
          </Link>
        </div>
      </section>

    </div>
  );
}
