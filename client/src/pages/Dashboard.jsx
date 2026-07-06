import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, CheckCircle, Clock, XCircle, Award, 
  MapPin, Phone, Star, DollarSign, PlusCircle, Trash2, 
  Calendar, BookOpen, Volume2, ShieldAlert
} from 'lucide-react';

export default function Dashboard() {
  const { user, token, logout, updateProfile, API_BASE } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Tab selections
  const [activeTab, setActiveTab] = useState('overview');

  // Common stats & lists
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin states
  const [adminStats, setAdminStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  
  // Create announcement state (Admin / Trainer)
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postType, setPostType] = useState('announcement'); // announcement, workshop, story
  const [postVillage, setPostVillage] = useState(user?.village || '');
  const [postSuccess, setPostSuccess] = useState(false);

  // Trainer profile update states
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileVillage, setProfileVillage] = useState(user?.village || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');
  const [profileTimings, setProfileTimings] = useState(user?.timings || '');
  const [profileFee, setProfileFee] = useState(user?.fee || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch bookings data
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  // Fetch admin analytical statistics
  const fetchAdminData = async () => {
    if (user?.role !== 'admin') return;
    try {
      // stats
      const resStats = await fetch(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resStats.ok) {
        const stats = await resStats.json();
        setAdminStats(stats);
      }

      // users list
      const resUsers = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resUsers.ok) {
        const users = await resUsers.json();
        setUsersList(users);
      }
    } catch (err) {
      console.error('Error loading admin dashboard panels:', err);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchBookings(), fetchAdminData()]).then(() => {
        setLoading(false);
      });
    }
  }, [user, token, API_BASE]);

  // Action handlers
  const handleBookingStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        // Refresh bookings
        fetchBookings();
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error modifying booking status:', err);
    }
  };

  const handleVerifyTrainer = async (trainerId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/verify-trainer/${trainerId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        // Refresh admin lists
        fetchAdminData();
      }
    } catch (err) {
      console.error('Trainer verification error:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user profile permanently?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess(false);
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        village: profileVillage,
        bio: profileBio,
        timings: profileTimings,
        fee: profileFee
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPostSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/community/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: postTitle,
          description: postDesc,
          type: postType,
          village: postVillage
        })
      });

      if (res.ok) {
        setPostSuccess(true);
        setPostTitle('');
        setPostDesc('');
        setTimeout(() => setPostSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Announce submit error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine Dashboard layout based on role
  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand-emerald to-brand-sky text-white rounded-3xl p-8 shadow-md mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest opacity-80">
                Dashboard Overview
              </span>
              <h1 className="text-3xl font-extrabold mt-1">
                Hello, {user?.name}!
              </h1>
              <p className="mt-1 text-sm opacity-90">
                Logged in as <span className="font-bold capitalize">{user?.role}</span> from {user?.village || 'Unknown Village'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <span className="px-3 py-1.5 bg-white/20 rounded-xl text-xs font-bold capitalize">
                Language: {localStorage.getItem('language') === 'te' ? 'తెలుగు' : 'English'}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Sidebar Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Menu Sidebar */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm h-fit">
            <nav className="space-y-1">
              
              {/* Overview Tab Button */}
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                  activeTab === 'overview'
                    ? 'bg-brand-emerald text-white shadow-md shadow-brand-emerald/10'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {t('dashOverview')}
              </button>

              {/* Trainer Only tabs */}
              {user?.role === 'trainer' && (
                <>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                      activeTab === 'requests'
                        ? 'bg-brand-emerald text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {t('dashMyRequests')} ({bookings.filter(b => b.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                      activeTab === 'profile'
                        ? 'bg-brand-emerald text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('post')}
                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                      activeTab === 'post'
                        ? 'bg-brand-emerald text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    Publish Post/Event
                  </button>
                </>
              )}

              {/* Admin Only tabs */}
              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('verify')}
                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                      activeTab === 'verify'
                        ? 'bg-brand-emerald text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {t('dashTrainerVerification')} ({usersList.filter(u => u.role === 'trainer' && !u.isVerified).length})
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                      activeTab === 'users'
                        ? 'bg-brand-emerald text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {t('dashManageUsers')}
                  </button>
                  <button
                    onClick={() => setActiveTab('post')}
                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                      activeTab === 'post'
                        ? 'bg-brand-emerald text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {t('dashPublishEvent')}
                  </button>
                </>
              )}

              <hr className="my-2 border-slate-100 dark:border-slate-700" />
              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all"
              >
                {t('navLogout')}
              </button>
            </nav>
          </div>

          {/* Main Dashboard Panel Panel */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* ======================================================== */}
            {/* OVERVIEW PANEL */}
            {/* ======================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Notice for unverified trainers */}
                {user?.role === 'trainer' && !user.isVerified && (
                  <div className="p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-3xl flex items-start space-x-3 text-sm text-amber-700 dark:text-amber-400">
                    <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Account Status: Pending Verification</span>
                      Your profile has been created successfully but is currently pending administrator approval. Once verified, you will appear in the public trainer directory for learners to find you.
                    </div>
                  </div>
                )}

                {/* Trainer overview counters */}
                {user?.role === 'trainer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-semibold text-slate-400">Total Bookings</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1 block">
                          {bookings.length}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
                        <Calendar size={18} />
                      </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-semibold text-slate-400">Pending Requests</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1 block">
                          {bookings.filter(b => b.status === 'pending').length}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Clock size={18} />
                      </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-semibold text-slate-400">{t('dashEarnings')}</span>
                        <span className="text-2xl font-bold text-brand-emerald mt-1 block">
                          {user.fee === 'Free' ? 'Free' : `₹${bookings.filter(b => b.status === 'completed').length * parseInt(user.fee || 0) || 0}`}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <DollarSign size={18} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Learner Overview Lists */}
                {user?.role === 'learner' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                      {t('dashRequestedTrainings')}
                    </h3>
                    {bookings.length > 0 ? (
                      <div className="space-y-3">
                        {bookings.map((booking) => (
                          <div 
                            key={booking.id}
                            className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <span className="px-2 py-0.5 bg-brand-emerald/10 text-brand-emerald text-xs font-bold rounded-md">
                                {booking.skillName}
                              </span>
                              <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-1">
                                Trainer: {booking.trainerName}
                              </h4>
                              <div className="flex items-center text-xs text-slate-400 mt-0.5 space-x-3">
                                <span className="flex items-center"><Calendar size={10} className="mr-1" /> {booking.date}</span>
                                <span className="flex items-center"><Clock size={10} className="mr-1" /> {booking.time}</span>
                              </div>
                            </div>

                            <div className="mt-3 sm:mt-0 flex items-center">
                              {booking.status === 'pending' && (
                                <span className="flex items-center space-x-1 px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 text-xs font-bold rounded-xl">
                                  <Clock size={12} />
                                  <span>{t('statusPending')}</span>
                                </span>
                              )}
                              {booking.status === 'approved' && (
                                <span className="flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 text-xs font-bold rounded-xl">
                                  <CheckCircle size={12} />
                                  <span>{t('statusApproved')}</span>
                                </span>
                              )}
                              {booking.status === 'rejected' && (
                                <span className="flex items-center space-x-1 px-3 py-1 bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 text-xs font-bold rounded-xl">
                                  <XCircle size={12} />
                                  <span>{t('statusRejected')}</span>
                                </span>
                              )}
                              {booking.status === 'completed' && (
                                <span className="flex items-center space-x-1 px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl">
                                  <Award size={12} />
                                  <span>{t('statusCompleted')}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
                        <Calendar className="mx-auto text-slate-300 mb-3" size={32} />
                        <span className="text-slate-500 dark:text-slate-400 text-sm">
                          You haven't requested any skill training sessions yet.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Overview stats panels */}
                {user?.role === 'admin' && adminStats && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                        <span className="block text-xs font-semibold text-slate-400">{t('dashStatsTrainers')}</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1 block">{adminStats.trainersCount}</span>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                        <span className="block text-xs font-semibold text-slate-400">{t('dashStatsLearners')}</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1 block">{adminStats.learnersCount}</span>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                        <span className="block text-xs font-semibold text-slate-400">{t('dashStatsBookings')}</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1 block">{adminStats.bookingStats.total}</span>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                        <span className="block text-xs font-semibold text-slate-400">Impacted Villages</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1 block">{adminStats.villagesCount}</span>
                      </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                      <h4 className="font-bold text-slate-800 dark:text-white mb-4">Bookings Analytical Breakdown</h4>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-2xl">
                          <span className="font-bold block text-lg">{adminStats.bookingStats.pending}</span>
                          Pending
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                          <span className="font-bold block text-lg">{adminStats.bookingStats.approved}</span>
                          Approved
                        </div>
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl">
                          <span className="font-bold block text-lg">{adminStats.bookingStats.rejected}</span>
                          Declined
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-350 rounded-2xl">
                          <span className="font-bold block text-lg">{adminStats.bookingStats.completed}</span>
                          Completed
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ======================================================== */}
            {/* TRAINER: REQUESTS MANAGEMENT PANEL */}
            {/* ======================================================== */}
            {activeTab === 'requests' && user?.role === 'trainer' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Incoming Skill Training Requests
                </h3>

                {bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <span className="px-2 py-0.5 bg-brand-emerald/10 text-brand-emerald text-xs font-bold rounded-md">
                              {booking.skillName}
                            </span>
                            <h4 className="text-md font-bold text-slate-800 dark:text-white mt-1">
                              Student Name: {booking.learnerName}
                            </h4>
                            <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                              <span className="flex items-center"><Calendar size={12} className="mr-1" /> {booking.date}</span>
                              <span className="flex items-center"><Clock size={12} className="mr-1" /> {booking.time}</span>
                            </div>
                          </div>

                          {/* Action Buttons depending on status */}
                          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleBookingStatus(booking.id, 'rejected')}
                                  className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleBookingStatus(booking.id, 'approved')}
                                  className="px-3 py-1.5 bg-brand-emerald text-white hover:bg-brand-emerald-dark text-xs font-bold rounded-xl transition-colors"
                                >
                                  Approve
                                </button>
                              </>
                            )}
                            {booking.status === 'approved' && (
                              <button
                                onClick={() => handleBookingStatus(booking.id, 'completed')}
                                className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-650 text-xs font-bold rounded-xl transition-colors"
                              >
                                Mark Completed
                              </button>
                            )}
                            {booking.status === 'completed' && (
                              <span className="px-3 py-1.5 bg-slate-100 text-slate-500 dark:bg-slate-900/50 text-xs font-semibold rounded-xl">
                                Completed ✓
                              </span>
                            )}
                            {booking.status === 'rejected' && (
                              <span className="px-3 py-1.5 bg-rose-50 text-rose-500 dark:bg-rose-950/20 text-xs font-semibold rounded-xl">
                                Declined
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">No student requests submitted yet.</span>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TRAINER: PROFILE EDIT PANEL */}
            {/* ======================================================== */}
            {activeTab === 'profile' && user?.role === 'trainer' && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  Manage Public Profile Settings
                </h3>

                {profileSuccess && (
                  <div className="p-3 mb-4 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl text-xs font-semibold">
                    Profile updated successfully!
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
                      <input
                        type="text"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Village</label>
                      <input
                        type="text"
                        required
                        value={profileVillage}
                        onChange={(e) => setProfileVillage(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Available Timings</label>
                      <input
                        type="text"
                        value={profileTimings}
                        onChange={(e) => setProfileTimings(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Training Fee Structure</label>
                      <input
                        type="text"
                        value={profileFee}
                        onChange={(e) => setProfileFee(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 font-semibold">Short Bio / Bio Summary</label>
                    <textarea
                      rows={4}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* PUBLISH POST/EVENT PANEL (ADMIN & TRAINER) */}
            {/* ======================================================== */}
            {activeTab === 'post' && (user?.role === 'admin' || user?.role === 'trainer') && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  Publish Village Workshop or Community Announcement
                </h3>

                {postSuccess && (
                  <div className="p-3 mb-4 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl text-xs font-semibold">
                    Post published successfully on the Community Board!
                  </div>
                )}

                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Post Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Free Organic Composting Class"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Post Category</label>
                      <select
                        value={postType}
                        onChange={(e) => setPostType(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                      >
                        <option value="announcement">Announcement</option>
                        <option value="workshop">Workshop & Event</option>
                        <option value="story">Success Story</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Village Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Penugonda"
                        value={postVillage}
                        onChange={(e) => setPostVillage(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Content Details</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write your announcement details, venue directions, dates, timings or success stories text here..."
                      value={postDesc}
                      onChange={(e) => setPostDesc(e.target.value)}
                      className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-800 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Publish to Community Center
                  </button>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* ADMIN: VERIFICATION PANEL */}
            {/* ======================================================== */}
            {activeTab === 'verify' && user?.role === 'admin' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Trainers Awaiting Verification
                </h3>

                {usersList.filter(u => u.role === 'trainer' && !u.isVerified).length > 0 ? (
                  <div className="space-y-3">
                    {usersList.filter(u => u.role === 'trainer' && !u.isVerified).map((trainer) => (
                      <div 
                        key={trainer.id}
                        className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={trainer.photo} 
                            alt={trainer.name} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                              {trainer.name}
                            </h4>
                            <span className="block text-xs text-slate-400">
                              {trainer.village} Village &bull; Phone: {trainer.phone}
                            </span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {trainer.skills?.map((sk, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-brand-emerald/10 text-brand-emerald text-[10px] rounded">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleVerifyTrainer(trainer.id)}
                          className="mt-3 sm:mt-0 px-4 py-2 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold text-xs rounded-xl shadow transition-colors"
                        >
                          Verify & Approve
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 text-slate-500">
                    All trainers are currently verified. No pending approval requests.
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* ADMIN: USER MANAGEMENT PANEL */}
            {/* ======================================================== */}
            {activeTab === 'users' && user?.role === 'admin' && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  Manage Platform Users
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-semibold text-xs">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Village</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((usr) => (
                        <tr key={usr.id} className="border-b border-slate-50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200">
                          <td className="py-3 font-bold">{usr.name}</td>
                          <td className="py-3">{usr.email}</td>
                          <td className="py-3 capitalize">
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                              usr.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400' :
                              usr.role === 'trainer' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/20 dark:text-sky-400' :
                              'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                              {usr.role}
                            </span>
                          </td>
                          <td className="py-3">{usr.village || 'N/A'}</td>
                          <td className="py-3 text-right">
                            {usr.id !== user.id && (
                              <button
                                onClick={() => handleDeleteUser(usr.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
