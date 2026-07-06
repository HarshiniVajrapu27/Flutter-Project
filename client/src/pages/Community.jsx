import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Heart, Volume2, Award, CalendarDays, MapPin } from 'lucide-react';

export default function Community() {
  const { t } = useLanguage();
  const { API_BASE } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all | workshop | announcement | story

  // Mock static gallery images representing rural skill activities
  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300", caption: "Tailoring Classes in Penugonda" },
    { url: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=300", caption: "Organic Composting Demo" },
    { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300", caption: "Computer Literacy Session" },
    { url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=300", caption: "Traditional Pottery Training" }
  ];

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/community/events`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching community feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [API_BASE]);

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/community/events/${postId}/like`, {
        method: 'POST'
      });

      if (res.ok) {
        const data = await res.json();
        // Update local likes list
        setPosts((prev) => 
          prev.map((post) => post.id === postId ? { ...post, likes: data.likes } : post)
        );
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'all') return true;
    return post.type === activeFilter;
  });

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-slide-up">
          <span className="text-xs uppercase font-extrabold text-brand-emerald tracking-wider">
            Village Hub
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('commTitle')}
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">
            {t('commSubtitle')}
          </p>
        </div>

        {/* Categories toggler tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Feed' },
            { id: 'announcement', label: t('commAnnounce') },
            { id: 'workshop', label: t('commWorkshops') },
            { id: 'story', label: t('commStories') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === tab.id
                  ? 'bg-brand-emerald text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feed items list */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 shadow-sm hover:shadow transition-shadow overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {/* Post Category Badge */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        post.type === 'announcement' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400' :
                        post.type === 'workshop' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' :
                        'bg-sky-100 text-sky-850 dark:bg-sky-950/30 dark:text-sky-400'
                      }`}>
                        {post.type === 'story' && <Award size={10} className="mr-1" />}
                        {post.type === 'announcement' && <Volume2 size={10} className="mr-1" />}
                        {post.type === 'workshop' && <CalendarDays size={10} className="mr-1" />}
                        {post.type}
                      </span>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3">
                        {post.title}
                      </h3>
                      
                      <div className="flex items-center text-xs text-slate-400 mt-1 space-x-3">
                        {post.village && <span className="flex items-center"><MapPin size={12} className="mr-1" /> {post.village}</span>}
                        {post.date && <span className="flex items-center"><Calendar size={12} className="mr-1" /> {post.date} {post.time && `at ${post.time}`}</span>}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {post.description}
                  </p>

                  {/* Post Image (optional) */}
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full max-h-64 object-cover rounded-2xl mt-4 border border-slate-100 dark:border-slate-700"
                    />
                  )}

                  {/* Feed Interaction Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <span className="text-xs text-slate-400 italic">
                      {post.author ? `Shared by: ${post.author}` : 'Published by: Coordinator'}
                    </span>

                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-transparent hover:border-rose-100 transition-all hover:scale-105"
                    >
                      <Heart size={14} className="fill-rose-600 dark:fill-rose-400" />
                      <span>{post.likes || 0} Likes</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl text-slate-500 border border-slate-150">
                No feed posts match the selected category filters.
              </div>
            )}
          </div>

          {/* Sidebar Gallery grid */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {t('commGallery')}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((img, i) => (
                  <div key={i} className="group relative rounded-xl overflow-hidden aspect-square border border-slate-100 dark:border-slate-700">
                    <img 
                      src={img.url} 
                      alt={img.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2 text-center text-[10px] text-white font-semibold">
                      {img.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
