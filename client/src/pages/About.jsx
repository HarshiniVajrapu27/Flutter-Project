import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, Landmark, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark py-16 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold text-brand-emerald tracking-wider">
            Our Vision
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1 sm:text-5xl">
            {t('aboutTitle')}
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">
            Learn Locally. Earn Locally. Grow Together.
          </p>
        </div>

        {/* Introduction Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-md mb-8">
          <div className="space-y-6 text-slate-650 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              {t('aboutPara1')}
            </p>
            <p>
              {t('aboutPara2')}
            </p>
            <p>
              Through this portal, local tailors, computer literates, organic farmers, and carpentry experts can list their contact hours. Young boys and girls, school dropouts, and housewives can register as learners, request training, schedule classes, and acquire new skills right within their own villages without commuting to expensive urban centers.
            </p>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base">Local Employment</h4>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Empowering skilled workers, homemakers, and farmers to monetize their talents locally and build supplemental income sources.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-brand-sky/10 text-brand-sky flex items-center justify-center shrink-0">
              <Landmark size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base">Rural Economic Growth</h4>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Retaining human resources within rural segments by matching available regional mentorship expertise to local study demands.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base">Vocational Literacy</h4>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Promoting high-fidelity literacy programs, spoken communication classes, coding lessons, and basic MS Office learning.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <Heart size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base">Social Collaboration</h4>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Strengthening neighborhood bonds through workshops, success announcement boards, and collective community agricultural campaigns.
              </p>
            </div>
          </div>

        </div>

        {/* Project Context */}
        <div className="p-8 bg-slate-550/5 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl text-center">
          <h3 className="text-xl font-bold text-slate-855 dark:text-white mb-2">
            Final Year Community Service Project (CSP)
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
            This platform represents the software implementation of the student Community Service Project. It has been developed to highlight the role of digital portals in fostering rural literacy, organizing vocational registries, and increasing employment opportunities.
          </p>
          <button
            onClick={() => navigate('/directory')}
            className="mt-6 inline-flex items-center space-x-1 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-dark transition-all shadow-sm"
          >
            <span>Explore Trainer Directory</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
