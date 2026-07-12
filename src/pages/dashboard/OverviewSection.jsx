// src/pages/dashboard/OverviewSection.jsx
import { useState, useEffect } from 'react';
import {
  BedDouble,
  Star,
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  ArrowRight,
  Home,
  Loader2,
  AlertCircle,
  MessageCircle,
  Image,
  Layout,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api").replace(/\/$/, "");
const APP_URL = API_URL.replace(/\/api$/, "");

const getToken = () => {
  return sessionStorage.getItem("token") || localStorage.getItem("token") || localStorage.getItem("auth_token");
};

const statusMap = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

// ─── Color Scheme ──────────────────────────────────────────────────────────
const COLORS = {
  primary: '#0d2b1a',
  primaryLight: '#1a4f33',
  secondary: '#235825',
  accent: '#f59e0b',
  accentLight: '#fbbf24',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  cream: '#f5f0eb',
  stone: '#78716c',
};

export default function OverviewSection() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ─── Dashboard Data ──────────────────────────────────────────────────────────
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalSections: { value: 0, change: 0 },
      totalReviews: { value: 0, change: 0 },
      totalGallery: { value: 0, change: 0 },
      averageRating: { value: 0, change: 0 },
    },
    recentReviews: [],
    sectionStatus: [],
    quickActions: [],
  });

  // ─── Fetch Dashboard Data ──────────────────────────────────────────────────
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Please login to view dashboard');
      }

      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // Fetch only data that exists in your database
      const [reviewsRes, galleryRes, sectionsRes] = await Promise.all([
        fetch(`${API_URL}/reviews`, { headers }).catch(() => ({ ok: false, json: () => ({}) })),
        fetch(`${API_URL}/gallery`, { headers }).catch(() => ({ ok: false, json: () => ({}) })),
        fetch(`${API_URL}/homepage`, { headers }).catch(() => ({ ok: false, json: () => ({}) })),
      ]);

      const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { success: false, data: {} };
      const galleryData = galleryRes.ok ? await galleryRes.json() : { success: false, data: {} };
      const sectionsData = sectionsRes.ok ? await sectionsRes.json() : { success: false, data: {} };

      // Process the data
      processDashboardData(reviewsData, galleryData, sectionsData);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      setDashboardData({
        stats: {
          totalSections: { value: 0, change: 0 },
          totalReviews: { value: 0, change: 0 },
          totalGallery: { value: 0, change: 0 },
          averageRating: { value: 0, change: 0 },
        },
        recentReviews: [],
        sectionStatus: [],
        quickActions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Helper: Safely get array from data ────────────────────────────────────
  const safeGetArray = (data, path, fallback = []) => {
    if (!data) return fallback;
    const parts = path.split('.');
    let current = data;
    for (const part of parts) {
      if (current === null || current === undefined) return fallback;
      current = current[part];
    }
    if (Array.isArray(current)) return current;
    return fallback;
  };

  // ─── Process Dashboard Data ────────────────────────────────────────────────
  const processDashboardData = (reviewsData, galleryData, sectionsData) => {
    // ─── Reviews Data ──────────────────────────────────────────────────────
    let reviews = [];
    
    // Try different possible structures
    if (reviewsData.data && Array.isArray(reviewsData.data)) {
      reviews = reviewsData.data;
    } else if (reviewsData.data && reviewsData.data.reviews && Array.isArray(reviewsData.data.reviews)) {
      reviews = reviewsData.data.reviews;
    } else if (reviewsData.data && reviewsData.data.data && Array.isArray(reviewsData.data.data)) {
      reviews = reviewsData.data.data;
    } else if (Array.isArray(reviewsData)) {
      reviews = reviewsData;
    } else if (reviewsData.reviews && Array.isArray(reviewsData.reviews)) {
      reviews = reviewsData.reviews;
    } else {
      // Try to extract from any array property
      for (const key of Object.keys(reviewsData)) {
        if (Array.isArray(reviewsData[key])) {
          reviews = reviewsData[key];
          break;
        }
      }
    }

    const reviewCount = reviews.length || 0;
    
    // Calculate average rating from reviews that have rating
    let avgRating = 0;
    let totalRating = 0;
    let ratedCount = 0;
    if (Array.isArray(reviews)) {
      reviews.forEach(r => {
        const rating = r.rating || r.rating_value || r.stars || 0;
        if (rating > 0) {
          totalRating += rating;
          ratedCount++;
        }
      });
    }
    avgRating = ratedCount > 0 ? totalRating / ratedCount : 0;

    // ─── Gallery Data ──────────────────────────────────────────────────────
    let images = [];
    if (galleryData.data && galleryData.data.gallery && Array.isArray(galleryData.data.gallery.images)) {
      images = galleryData.data.gallery.images;
    } else if (galleryData.data && Array.isArray(galleryData.data)) {
      images = galleryData.data;
    } else if (galleryData.gallery && Array.isArray(galleryData.gallery.images)) {
      images = galleryData.gallery.images;
    } else if (galleryData.images && Array.isArray(galleryData.images)) {
      images = galleryData.images;
    }
    const galleryCount = images.length || 0;

    // ─── Sections Data ──────────────────────────────────────────────────────
    let sections = {};
    if (sectionsData.data && sectionsData.data.content) {
      sections = sectionsData.data.content;
    } else if (sectionsData.content) {
      sections = sectionsData.content;
    } else if (sectionsData.data) {
      sections = sectionsData.data;
    }
    const sectionCount = Object.keys(sections).length || 0;

    // ─── Recent Reviews ────────────────────────────────────────────────────
    const recentReviews = (Array.isArray(reviews) ? reviews.slice(0, 5) : []).map(r => ({
      id: r.id || Math.random().toString(36).substr(2, 9),
      name: r.name || r.guest_name || r.user?.name || 'Guest',
      review: r.review || r.comment || r.feedback || 'No review text',
      rating: r.rating || r.rating_value || r.stars || 5,
      date: r.date || r.created_at || r.createdAt || new Date().toISOString(),
      avatar: r.avatar || r.avatar_image || null,
    }));

    // ─── Section Status ────────────────────────────────────────────────────
    const sectionStatus = Object.keys(sections).map(name => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      status: sections[name] ? 'Active' : 'Inactive',
      fields: Object.keys(sections[name] || {}).length,
    }));

    // ─── Quick Actions ──────────────────────────────────────────────────────
    const quickActions = [
      { label: 'Manage Reviews', icon: MessageCircle, href: '/dashboard/reviews', color: 'text-emerald-600' },
      { label: 'Manage Gallery', icon: Image, href: '/dashboard/gallery', color: 'text-blue-600' },
      { label: 'Manage Sections', icon: Layout, href: '/dashboard/home', color: 'text-amber-600' },
    ];

    setDashboardData({
      stats: {
        totalSections: { value: sectionCount, change: 0 },
        totalReviews: { value: reviewCount, change: 0 },
        totalGallery: { value: galleryCount, change: 0 },
        averageRating: { value: avgRating.toFixed(1), change: 0 },
      },
      recentReviews,
      sectionStatus,
      quickActions,
    });
  };

  // ─── Helper Functions ──────────────────────────────────────────────────────
  const formatDate = (date) => {
    try {
      if (!date) return '--';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '--';
      return d.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '--';
    }
  };

  const getStars = (rating) => {
    const num = parseFloat(rating) || 0;
    const full = Math.round(num);
    const empty = 5 - full;
    return '⭐'.repeat(full > 0 ? full : 0) + '☆'.repeat(empty > 0 ? empty : 0);
  };

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="mt-4 text-sm text-stone-500">Loading dashboard data...</p>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
        <p className="mt-2 text-sm text-rose-700">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentReviews, sectionStatus, quickActions } = dashboardData;

  return (
    <div className="space-y-6">
      {/* ─── Green Header ─────────────────────────────────────────────────────── */}
      <div 
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 40%, ${COLORS.secondary} 70%, ${COLORS.primaryLight} 100%)`
        }}
      >
        {/* Decorative pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-300" />
                <span className="text-xs font-medium text-emerald-300/80">
                  {new Date().toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <span className="h-1 w-1 rounded-full bg-emerald-400/30" />
              <span className="text-xs font-medium text-emerald-300/60">
                {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Admin'} 👋
            </h1>
            <p className="mt-1 text-sm text-emerald-200/70">
              Welcome to Akagera Park Inn Admin Dashboard
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
              <Home className="h-4 w-4 text-emerald-300" />
              <span className="text-xs text-emerald-200/80">Akagera Park Inn</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-lg px-4 py-2 text-sm text-white border border-white/10 flex items-center gap-2"
            >
              <span>View Website</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ─── Stats ────────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { 
            id: 'sections', 
            label: 'Active Sections', 
            value: stats.totalSections.value, 
            change: stats.totalSections.change, 
            icon: Layout, 
            bg: 'bg-emerald-50', 
            iconColor: 'text-emerald-600',
            subtitle: `${sectionStatus.filter(s => s.status === 'Active').length} active`
          },
          { 
            id: 'reviews', 
            label: 'Guest Reviews', 
            value: stats.totalReviews.value, 
            change: stats.totalReviews.change, 
            icon: MessageCircle, 
            bg: 'bg-amber-50', 
            iconColor: 'text-amber-600',
            subtitle: `${recentReviews.length} recent`
          },
          { 
            id: 'gallery', 
            label: 'Gallery Images', 
            value: stats.totalGallery.value, 
            change: stats.totalGallery.change, 
            icon: Image, 
            bg: 'bg-blue-50', 
            iconColor: 'text-blue-600',
            subtitle: 'In categories'
          },
          { 
            id: 'rating', 
            label: 'Average Rating', 
            value: stats.averageRating.value, 
            change: stats.averageRating.change, 
            icon: Star, 
            bg: 'bg-yellow-50', 
            iconColor: 'text-yellow-600',
            subtitle: getStars(parseFloat(stats.averageRating.value) || 0)
          },
        ].map((s) => (
          <div
            key={s.id}
            className="group rounded-xl border border-stone-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} group-hover:scale-105 transition-transform`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                s.change >= 0 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {s.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(s.change)}%
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="mt-0.5 text-xs text-stone-500">{s.label}</p>
            {s.subtitle && (
              <p className="mt-1 text-[10px] text-stone-400">{s.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* ─── Section Status & Quick Actions ──────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Section Status */}
        <div className="lg:col-span-2 rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-stone-800">Section Status</h2>
              <p className="text-xs text-stone-400 mt-0.5">Content sections and their status</p>
            </div>
            <span className="text-xs text-stone-400 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1">
              {sectionStatus.length} sections
            </span>
          </div>
          
          {sectionStatus.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sectionStatus.map((section, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50/50 px-4 py-3 hover:border-emerald-200 transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium text-stone-700">{section.name}</span>
                    <span className="ml-2 text-xs text-stone-400">({section.fields} fields)</span>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                    section.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-stone-100 text-stone-500'
                  }`}>
                    {section.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 text-sm">
              No sections found
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-stone-100 bg-stone-50/50 px-4 py-3 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
              >
                <action.icon className={`h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="flex-1 text-sm font-medium text-stone-700">{action.label}</span>
                <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Recent Reviews ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="font-semibold text-stone-800">Recent Reviews</h2>
            <p className="text-xs text-stone-400 mt-0.5">Latest guest feedback</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-48 rounded-lg border border-stone-200 py-1.5 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <a
              href="/dashboard/reviews"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              View All
            </a>
          </div>
        </div>

        {recentReviews.length > 0 ? (
          <div className="space-y-3">
            {recentReviews
              .filter(r => 
                !search || 
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.review.toLowerCase().includes(search.toLowerCase())
              )
              .map((review, index) => (
                <div 
                  key={review.id || index}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-stone-100 bg-stone-50/50 p-4 hover:bg-emerald-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {review.avatar ? (
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="h-10 w-10 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-800 text-sm">{review.name}</span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-400">{formatDate(review.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm">{getStars(review.rating)}</span>
                        <span className="text-xs text-stone-400">({review.rating}/5)</span>
                      </div>
                      <p className="text-sm text-stone-600 mt-1 line-clamp-2">{review.review}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                    review.rating >= 4 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : review.rating >= 3 
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {review.rating >= 4 ? 'Positive' : review.rating >= 3 ? 'Neutral' : 'Negative'}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="py-8 text-center text-stone-400 text-sm">
            No reviews found. Reviews will appear here once guests leave feedback.
          </div>
        )}
        
        {recentReviews.length > 0 && recentReviews.filter(r => 
          !search || 
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.review.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && (
          <div className="py-8 text-center text-stone-400 text-sm">
            No reviews found matching your search.
          </div>
        )}
      </div>

      {/* ─── Footer Stats ────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-4">
            <span className="font-medium text-stone-700">System Status</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>v2.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}