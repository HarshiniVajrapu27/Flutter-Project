import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-emerald text-white">
                <BookOpen size={16} />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">
                Skill Sharing
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <p className="text-xs text-slate-500">
              Promoting local employment, self-reliance, and sustainable village development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('navSkills')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/skills" className="hover:text-brand-emerald-light transition-colors">
                  {t('skillTailoringName')}
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-brand-emerald-light transition-colors">
                  {t('skillOrganicFarmingName')}
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-brand-emerald-light transition-colors">
                  {t('skillComputerBasicsName')}
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-brand-emerald-light transition-colors">
                  {t('skillSpokenEnglishName')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Site Sections */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-brand-emerald-light transition-colors">
                  {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link to="/directory" className="hover:text-brand-emerald-light transition-colors">
                  {t('navFindTrainer')}
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-brand-emerald-light transition-colors">
                  {t('navCommunity')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-emerald-light transition-colors">
                  {t('navContact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact coordinates */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('contactTitle')}
            </h3>
            <div className="flex items-start space-x-2 text-sm">
              <MapPin size={16} className="text-brand-emerald mt-1 shrink-0" />
              <span>West Godavari District, Andhra Pradesh, India</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone size={16} className="text-brand-emerald shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail size={16} className="text-brand-emerald shrink-0" />
              <span>support@skillsharing.org</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {t('heroTitle')}. {t('footerRights')}
          </p>
          <p className="flex items-center mt-2 md:mt-0">
            Made with <Heart size={12} className="text-rose-500 mx-1 fill-rose-500 animate-pulse" /> for Rural Empowerment.
          </p>
        </div>
      </div>
    </footer>
  );
}
