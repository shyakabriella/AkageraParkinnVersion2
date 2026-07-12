import { useState, useEffect } from 'react';
import { useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import {
  LayoutDashboard, BedDouble, UtensilsCrossed, Star, 
  LogOut, Menu, X, Home, Info, Camera, Wifi,
  ChevronRight, Calendar, Bell, User, Sparkles, 
  Layout,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { looLogo } from '../lib/assets';

// ─── Import Sections ──────────────────────────────────────────────────────────
import OverviewSection from './dashboard/OverviewSection';
import HomeSection from './dashboard/HomeSection';
import AboutSection from './dashboard/AboutSection';
import RoomsSection from './dashboard/RoomsSection';
import ServicesSection from './dashboard/ServicesSection';
import RestaurantSection from './dashboard/RestaurantSection';
import GallerySection from './dashboard/GallerySection';
import ReviewsSection from './dashboard/ReviewsSection';
import FooterSection from './dashboard/FooterSection';
import ComingSoon from './dashboard/ComingSoon';

// ─── Nav Structure ────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Overview', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Home', icon: Home, to: '/dashboard/home' },
  { label: 'About', icon: Info, to: '/dashboard/about' },
  { label: 'Rooms', icon: BedDouble, to: '/dashboard/rooms' },
  { label: 'Services', icon: Wifi, to: '/dashboard/services' },
  { label: 'Restaurant', icon: UtensilsCrossed, to: '/dashboard/restaurant' },
  { label: 'Gallery', icon: Camera, to: '/dashboard/gallery' },
  { label: 'Reviews', icon: Star, to: '/dashboard/reviews' },
  { label: 'Footer', icon: Layout, to: '/dashboard/footer' },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ open, onClose, onLogout, user }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0a1a0d 0%, #0f2a12 50%, #0a1a0d 100%)',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          boxShadow: '4px 0 30px rgba(0,0,0,0.3)'
        }}
      >
        {/* Decorative gradient overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(13,43,26,0.4) 0%, transparent 40%, rgba(13,43,26,0.6) 100%)'
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex h-20 shrink-0 items-center gap-3 border-b border-white/8 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/15">
            <img src={looLogo} alt="Logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-semibold text-white tracking-wide">Akagera Park Inn</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/40">Admin Portal</span>
          </div>
          <button 
            onClick={onClose} 
            className="ml-auto text-white/40 hover:text-white lg:hidden transition-colors" 
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
            Main Navigation
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/dashboard'}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredItem(item.to)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/12 text-white shadow-lg shadow-black/10 border border-white/8'
                        : 'text-white/50 hover:bg-white/6 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="shrink-0" style={{ width: 18, height: 18 }} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Bottom section */}
          <div className="mt-6 border-t border-white/8 pt-6">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/30 hover:bg-white/6 hover:text-white/60 transition-all"
            >
              <Sparkles className="shrink-0" style={{ width: 16, height: 16 }} />
              <span>View Website</span>
              <ChevronRight className="ml-auto" style={{ width: 14, height: 14 }} />
            </a>
          </div>
        </nav>

        {/* User Profile */}
        <div className="relative z-10 shrink-0 border-t border-white/8 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 backdrop-blur-sm px-3 py-2.5 border border-white/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-sm font-bold uppercase shadow-lg shadow-emerald-500/20 border border-emerald-400/20">
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-white/40 truncate">{user?.email || 'admin@akageraparkin.com'}</p>
            </div>
            <button
              onClick={onLogout}
              aria-label="Logout"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/30 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Dashboard Shell ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    if (!user) {
      navigate('/login', { replace: true });
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div
      className={`flex min-h-screen transition-opacity duration-500 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ background: '#f0f2f0' }}
    >
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main Content */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-forest-900/5 bg-white/90 backdrop-blur-md px-4 sm:px-6 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-forest-900/10 text-forest-700 hover:bg-forest-50 lg:hidden transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-forest-800">
              {window.location.pathname.split('/').pop() || 'overview'}
            </span>
            <span className="text-xs text-forest-400/60">/</span>
            <span className="text-xs text-forest-500/70 capitalize">
              {window.location.pathname.split('/').pop() || 'overview'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden md:block text-xs text-forest-500/60 font-medium">
              {formatDate(new Date())}
            </span>
            
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-forest-900/10 text-forest-600 hover:bg-forest-50 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>
            
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white text-sm font-medium uppercase shadow-md shadow-emerald-500/20 border border-emerald-400/20">
              {user?.name?.[0] ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<OverviewSection />} />
            <Route path="home" element={<HomeSection />} />
            <Route path="about" element={<AboutSection />} />
            <Route path="rooms" element={<RoomsSection />} />
            <Route path="services" element={<ServicesSection />} />
            <Route path="restaurant" element={<RestaurantSection />} />
            <Route path="gallery" element={<GallerySection />} />
            <Route path="reviews" element={<ReviewsSection />} />
            <Route path="footer" element={<FooterSection />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}