import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BookingModal from '../components/BookingModal';
import { MapPin, Star, Calendar, Clock, MessageSquare, ChevronLeft, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function TrainerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { API_BASE, user, token, toggleFavorite } = useAuth();

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Favorites state
  const isFavorite = user?.favorites?.includes(id);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const res = await fetch(`${API_BASE}/trainers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTrainer(data);
        } else {
          navigate('/directory');
        }
      } catch (err) {
        console.error('Error fetching trainer details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id, API_BASE, navigate]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await toggleFavorite(id);
    } catch (err) {
      console.error('Error toggling favorites:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setReviewError('');
    setReviewSuccess(false);

    try {
      const res = await fetch(`${API_BASE}/trainers/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, text: reviewText })
      });

      const data = await res.json();

      if (res.ok) {
        setReviewSuccess(true);
        setReviewText('');
        // Update local trainer state with new average rating and reviews list
        setTrainer((prev) => ({
          ...prev,
          rating: data.rating,
          reviews: data.reviews
        }));
      } else {
        setReviewError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to submit review. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!trainer) {
    return <div className="text-center py-20">Trainer not found.</div>;
  }

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1 text-slate-500 hover:text-brand-emerald text-sm font-semibold mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Directory</span>
        </button>

        {/* Profile Card Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-md mb-8 relative overflow-hidden">
          
          {/* Favorite button icon */}
          <button
            onClick={handleFavoriteToggle}
            className={`absolute right-6 top-6 p-3 rounded-2xl shadow-sm border transition-all ${
              isFavorite 
                ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900' 
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 dark:bg-slate-900 dark:border-slate-700'
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart size={20} className={isFavorite ? "fill-rose-500" : ""} />
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
            {/* Profile Avatar */}
            <img 
              src={trainer.photo} 
              alt={trainer.name} 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-50 dark:border-slate-900 shadow-md shrink-0 mb-6 md:mb-0"
            />

            {/* Profile Details */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 justify-center md:justify-start">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {trainer.name}
                </h1>
                {trainer.isVerified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 w-fit mx-auto md:mx-0">
                    <CheckCircle2 size={12} className="mr-1" />
                    Verified Partner
                  </span>
                )}
              </div>

              {/* Village Location */}
              <div className="flex items-center justify-center md:justify-start text-slate-500 dark:text-slate-400 mt-2">
                <MapPin size={16} className="text-brand-emerald mr-1" />
                <span>{trainer.village} Village</span>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center justify-center md:justify-start mt-3 space-x-2">
                <div className="flex items-center text-amber-500">
                  <Star size={16} className="fill-amber-500" />
                  <span className="font-bold text-slate-800 dark:text-white ml-1 text-sm">{trainer.rating || "5.0"}</span>
                </div>
                <span className="text-slate-400 text-sm">|</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  {trainer.reviews?.length || 0} reviews
                </span>
              </div>

              {/* Skill Badges */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {trainer.skills?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-brand-emerald/10 text-brand-emerald dark:bg-brand-emerald/20 text-xs font-semibold rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-100 dark:border-slate-700" />

          {/* Detailed stats grids */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <Award className="text-brand-emerald" size={24} />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Experience</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  {trainer.experience} {t('profExperience')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <Clock className="text-brand-emerald" size={24} />
              <div>
                <span className="block text-xs font-semibold text-slate-400">{t('profTimings')}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  {trainer.timings || "Flexible Schedule"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <span className="text-lg font-bold text-brand-emerald shrink-0">₹</span>
              <div>
                <span className="block text-xs font-semibold text-slate-400">{t('profFee')}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  {trainer.fee || "Free Education"}
                </span>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Trainer Biography</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {trainer.bio || "This trainer has not written their biography details yet."}
            </p>
          </div>

          {/* Languages */}
          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t('profLanguages')}: </span>
            {trainer.languages ? trainer.languages.join(', ') : 'Telugu'}
          </div>

          {/* Booking Button */}
          {user?.role === 'learner' && (
            <div className="mt-8">
              <button
                onClick={() => setShowBookModal(true)}
                className="w-full sm:w-auto px-8 py-3 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-extrabold rounded-2xl shadow-lg shadow-brand-emerald/10 hover:shadow-brand-emerald/20 transition-all active:scale-[0.98]"
              >
                {t('profBookingBtn')}
              </button>
            </div>
          )}
          {!user && (
            <div className="mt-8">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 text-white font-extrabold rounded-2xl shadow-md transition-all"
              >
                Login to Book Skill Training
              </button>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <MessageSquare className="text-brand-emerald mr-2" size={24} />
            {t('profReviews')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Reviews display block */}
            <div className="lg:col-span-2 space-y-4">
              {trainer.reviews && trainer.reviews.length > 0 ? (
                trainer.reviews.map((review, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800 dark:text-white">{review.learnerName}</span>
                      <span className="text-xs text-slate-400">{review.date}</span>
                    </div>
                    <div className="flex items-center text-amber-500 mt-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx} 
                          size={12} 
                          className={idx < review.rating ? "fill-amber-500" : "text-slate-200 dark:text-slate-700"} 
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {review.text || "No review content provided."}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 dark:text-slate-500 text-sm py-6">
                  {t('profNoReviews')}
                </div>
              )}
            </div>

            {/* Write a review block (for learners only) */}
            {user?.role === 'learner' && (
              <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                  {t('profAddReview')}
                </h3>
                
                {reviewSuccess && (
                  <div className="p-3 mb-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold">
                    Review submitted successfully!
                  </div>
                )}
                {reviewError && (
                  <div className="p-3 mb-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
                    {reviewError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      {t('profRatingLabel')}
                    </label>
                    <div className="flex items-center space-x-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setReviewRating(idx + 1)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star 
                            size={20} 
                            className={idx < reviewRating ? "fill-amber-500" : "text-slate-200 dark:text-slate-700"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Your Comments
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={t('profReviewTextPlaceholder')}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full p-3 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald text-slate-800 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-brand-emerald dark:bg-slate-700 dark:hover:bg-brand-emerald text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    {t('profSubmitReview')}
                  </button>

                </form>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Booking Dialog Overlay */}
      {showBookModal && (
        <BookingModal 
          trainer={trainer} 
          onClose={() => setShowBookModal(false)} 
        />
      )}

    </div>
  );
}
