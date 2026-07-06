import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function Contact() {
  const { t } = useLanguage();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // FAQ Accordion states
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Who can register as a trainer?",
      a: "Any villager who possesses a vocational, academic, traditional, or artistic skill and wants to teach others can register. All trainer profiles undergo a quick review by the village coordinator before appearing publicly."
    },
    {
      q: "Is there any cost for learning?",
      a: "Many trainers offer training for free as part of community service. Some trainers charging fees will list their rates (e.g. ₹200/month) directly on their profile. Fees are paid directly to trainers."
    },
    {
      q: "How do I request a training slot?",
      a: "Search for a skill or trainer in the directory, open their profile, and click 'Book Training Slot'. Select your preferred date and time, and click send. You can track requests on your Learner Dashboard."
    },
    {
      q: "I forgot my password. What should I do?",
      a: "Go to the Login page and click on 'Forgot Password?'. Enter your email address along with your new desired password to submit a reset request."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    setMsg('');
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold text-brand-emerald tracking-wider">
            Support Center
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('contactTitle')}
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">
            {t('contactSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Contact coordinates list */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Village Coordinators
              </h3>

              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="text-brand-emerald shrink-0 mt-1" size={18} />
                <div>
                  <span className="font-bold block text-slate-800 dark:text-white">Office Address</span>
                  <span className="text-slate-500 dark:text-slate-400">Cooperative Society Building, Penugonda, Andhra Pradesh</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm">
                <Phone className="text-brand-emerald shrink-0 mt-1" size={18} />
                <div>
                  <span className="font-bold block text-slate-800 dark:text-white">Helpdesk Call Support</span>
                  <span className="text-slate-500 dark:text-slate-400">+91 98765 43210 &bull; +91 87654 32109</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm">
                <Mail className="text-brand-emerald shrink-0 mt-1" size={18} />
                <div>
                  <span className="font-bold block text-slate-800 dark:text-white">Support Email</span>
                  <span className="text-slate-500 dark:text-slate-400">coordinator@skillsharing.org</span>
                </div>
              </div>

            </div>

            <div className="p-5 bg-gradient-to-tr from-brand-emerald to-brand-sky text-white rounded-3xl shadow">
              <h4 className="font-bold text-base">Community Values</h4>
              <p className="mt-2 text-xs leading-relaxed opacity-95">
                We believe that every village has hidden talents. Sharing skills raises local income potential, creates closer neighborhood relationships, and builds a sustainable rural ecosystem.
              </p>
            </div>

          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-md">
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Send a Message
            </h3>

            {success && (
              <div className="p-3 mb-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center space-x-2 text-sm font-semibold">
                <CheckCircle size={16} />
                <span>{t('contactSuccess')}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 dark:text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-450 dark:text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 dark:text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 dark:text-slate-400 mb-1">Message Description</label>
                <textarea
                  rows={4}
                  required
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                  placeholder="How can our coordinators help you today?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-extrabold rounded-2xl shadow transition-all active:scale-[0.98]"
              >
                {t('contactSendBtn')}
              </button>

            </form>

          </div>

        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-550 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-900/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
