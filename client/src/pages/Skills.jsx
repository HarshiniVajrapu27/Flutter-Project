import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Scissors, Languages, GraduationCap, Monitor, Sprout, Leaf, 
  Paintbrush, ChefHat, Music4, Music, Smartphone, Code, 
  TrendingUp, Palette, Sparkles, Hammer, Zap, Droplet, Search
} from 'lucide-react';

export default function Skills() {
  const { t } = useLanguage();
  const { API_BASE } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [trainerCounts, setTrainerCounts] = useState({});

  // Skill items mapping
  const skillList = [
    { id: "Tailoring", name: t('skillTailoringName'), desc: t('skillTailoringDesc'), icon: Scissors, color: "from-emerald-500 to-teal-600" },
    { id: "Spoken English", name: t('skillSpokenEnglishName'), desc: t('skillSpokenEnglishDesc'), icon: Languages, color: "from-sky-500 to-blue-600" },
    { id: "Tuition Teaching", name: t('skillTuitionTeachingName'), desc: t('skillTuitionTeachingDesc'), icon: GraduationCap, color: "from-purple-500 to-indigo-600" },
    { id: "Computer Basics", name: t('skillComputerBasicsName'), desc: t('skillComputerBasicsDesc'), icon: Monitor, color: "from-slate-600 to-slate-800" },
    { id: "Farming Techniques", name: t('skillFarmingTechniquesName'), desc: t('skillFarmingTechniquesDesc'), icon: Sprout, color: "from-green-600 to-emerald-700" },
    { id: "Organic Farming", name: t('skillOrganicFarmingName'), desc: t('skillOrganicFarmingDesc'), icon: Leaf, color: "from-emerald-600 to-green-700" },
    { id: "Handicrafts", name: t('skillHandicraftsName'), desc: t('skillHandicraftsDesc'), icon: Paintbrush, color: "from-amber-500 to-orange-600" },
    { id: "Cooking", name: t('skillCookingName'), desc: t('skillCookingDesc'), icon: ChefHat, color: "from-rose-500 to-red-600" },
    { id: "Dance", name: t('skillDanceName'), desc: t('skillDanceDesc'), icon: Music4, color: "from-pink-500 to-rose-600" },
    { id: "Music", name: t('skillMusicName'), desc: t('skillMusicDesc'), icon: Music, color: "from-violet-500 to-purple-600" },
    { id: "Mobile Repair", name: t('skillMobileRepairName'), desc: t('skillMobileRepairDesc'), icon: Smartphone, color: "from-cyan-500 to-teal-600" },
    { id: "Coding", name: t('skillCodingName'), desc: t('skillCodingDesc'), icon: Code, color: "from-blue-600 to-indigo-700" },
    { id: "Digital Marketing", name: t('skillDigitalMarketingName'), desc: t('skillDigitalMarketingDesc'), icon: TrendingUp, color: "from-indigo-500 to-purple-600" },
    { id: "Graphic Design", name: t('skillGraphicDesignName'), desc: t('skillGraphicDesignDesc'), icon: Palette, color: "from-fuchsia-500 to-pink-600" },
    { id: "Beauty & Makeup", name: t('skillBeautyMakeupName'), desc: t('skillBeautyMakeupDesc'), icon: Sparkles, color: "from-rose-400 to-pink-500" },
    { id: "Carpentry", name: t('skillCarpentryName'), desc: t('skillCarpentryDesc'), icon: Hammer, color: "from-orange-600 to-amber-700" },
    { id: "Electrical Work", name: t('skillElectricalWorkName'), desc: t('skillElectricalWorkDesc'), icon: Zap, color: "from-yellow-500 to-amber-600" },
    { id: "Plumbing", name: t('skillPlumbingName'), desc: t('skillPlumbingDesc'), icon: Droplet, color: "from-sky-600 to-blue-700" }
  ];

  // Fetch counts from database to show how many active trainers are teaching each skill
  useEffect(() => {
    const fetchTrainerCounts = async () => {
      try {
        const res = await fetch(`${API_BASE}/trainers`);
        if (res.ok) {
          const trainers = await res.json();
          const counts = {};
          
          trainers.forEach(trainer => {
            if (trainer.skills) {
              trainer.skills.forEach(skill => {
                counts[skill] = (counts[skill] || 0) + 1;
              });
            }
          });
          
          setTrainerCounts(counts);
        }
      } catch (err) {
        console.error('Error fetching trainer counts:', err);
      }
    };

    fetchTrainerCounts();
  }, [API_BASE]);

  // Filter skills based on live search
  const filteredSkills = skillList.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark py-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-slide-up">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {t('skillsTitle')}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {t('skillsSubtitle')}
          </p>
          
          {/* Live Search bar */}
          <div className="mt-8 relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder={t('skillsSearchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-md focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredSkills.map((skill, index) => {
            const IconComponent = skill.icon;
            const count = trainerCounts[skill.id] || 0;

            return (
              <div 
                key={skill.id}
                className="group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 overflow-hidden"
              >
                {/* Glow Background Gradient on Hover */}
                <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br ${skill.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />

                <div>
                  {/* Skill Icon Container */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr ${skill.color} text-white shadow-lg transition-transform duration-300 group-hover:rotate-12`}>
                    <IconComponent size={24} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                    {skill.name}
                  </h3>

                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {skill.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-sky-dark dark:text-brand-sky-light">
                    {count} {t('skillsTrainersAvailable')}
                  </span>
                  
                  <button
                    onClick={() => navigate(`/directory?skill=${encodeURIComponent(skill.id)}`)}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-brand-emerald dark:bg-slate-700 dark:hover:bg-brand-emerald rounded-xl transition-all shadow-sm"
                  >
                    {t('skillsLearnMore')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if search doesn't match */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-slate-500 dark:text-slate-400">
              No matching skills found. Try searching something else!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
