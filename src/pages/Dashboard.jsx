import { useState, useEffect } from 'react';
import { useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import {
  LayoutDashboard, BedDouble, UtensilsCrossed, Star, HelpCircle,
  Settings, LogOut, Bell, Menu, X, Leaf, FileText, Wand2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { looLogo } from '../lib/assets';

// CMS sections
import OverviewSection from './dashboard/OverviewSection';
import SiteSettingsSection from './dashboard/SiteSettingsSection';
import HeroSection from './dashboard/HeroSection';
import RoomsSection from './dashboard/RoomsSection';
import ExperiencesSection from './dashboard/ExperiencesSection';
import DiningSection from './dashboard/DiningSection';
import ReviewsSection from './dashboard/ReviewsSection';
import FAQsSection from './dashboard/FAQsSection';
import GallerySection from './dashboard/GallerySection';
import AboutSection from './dashboard/AboutSection';
import { Image, Info } from 'lucide-react';

// ─── Nav structure ────────────────────────────────────────────────────────────
const navGroups = [
  {
    label: 'Operations',
    items: [
      { label: 'Overview', icon: LayoutDashboard, to: '/dashboard' },
    ],
  },
  {
    label: 'Page Content',
    items: [
      { label: 'Site Settings', icon: Settings, to: '/dashboard/site-settings' },
      { label: 'Hero Section', icon: Wand2, to: '/dashboard/hero' },
      { label: 'About Page', icon: Info, to: '/dashboard/about' },
      { label: 'Rooms', icon: BedDouble, to: '/dashboard/rooms' },
      { label: 'Services', icon: FileText, to: '/dashboard/experiences' },
      { label: 'Dining & Menu', icon: UtensilsCrossed, to: '/dashboard/dining' },
      { label: 'Reviews', icon: Star, to: '/dashboard/reviews' },
      { label: 'FAQs', icon: HelpCircle, to: '/dashboard/faqs' },
      { label: 'Gallery', icon: Image, to: '/dashboard/gallery' },
    ],
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ open, onClose, onLogout, user }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/8 transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'rgba(9,31,13,0.98)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/8 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-700/30 border border-forest-500/20">
            <img src={looLogo} alt="Logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-semibold text-sand-50">Akagera Park Inn</span>
            <span className="text-[10px] uppercase tracking-widest text-sand-400/60 mt-0.5">Admin Portal</span>
          </div>
          <button onClick={onClose} className="ml-auto text-sand-400 hover:text-sand-200 lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sand-400/40">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/dashboard'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-forest-700/40 text-sand-50'
                            : 'text-sand-300/70 hover:bg-white/5 hover:text-sand-100'
                        }`
                      }
                    >
                      <item.icon className="shrink-0 opacity-80" style={{ width: 18, height: 18 }} />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* External link */}
          <div className="border-t border-white/8 pt-5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sand-300/70 hover:bg-white/5 hover:text-sand-100 transition-all"
            >
              <Leaf style={{ width: 18, height: 18 }} className="shrink-0 opacity-80" />
              View Website
            </a>
          </div>
        </nav>

        {/* User footer */}
        <div className="shrink-0 border-t border-white/8 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600/50 text-sand-50 text-sm font-bold uppercase">
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sand-100 truncate">{user?.name}</p>
              <p className="text-xs text-sand-400/60 truncate">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              aria-label="Logout"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sand-400/60 hover:bg-red-500/15 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) navigate('/login', { replace: true });
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  if (!user) return null;

  return (
    <div
      className={`flex min-h-screen transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: '#f5f7f5' }}
    >
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main area */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-forest-900/10 bg-white px-4 sm:px-6 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-forest-900/15 text-forest-700 hover:bg-forest-50 lg:hidden transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-forest-900/15 text-forest-700 hover:bg-forest-50 transition-colors"
              aria-label="Notifications"
            >
              <Bell style={{ width: 18, height: 18 }} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-forest-500 ring-2 ring-white" />
            </button>
            <span className="hidden sm:block text-xs text-forest-700/60 font-medium">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-white text-sm font-bold uppercase border border-forest-600">
              {user?.name?.[0] ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<OverviewSection />} />
            <Route path="site-settings" element={<SiteSettingsSection />} />
            <Route path="hero" element={<HeroSection />} />
            <Route path="about" element={<AboutSection />} />
            <Route path="rooms" element={<RoomsSection />} />
            <Route path="experiences" element={<ExperiencesSection />} />
            <Route path="dining" element={<DiningSection />} />
            <Route path="reviews" element={<ReviewsSection />} />
            <Route path="faqs" element={<FAQsSection />} />
            <Route path="gallery" element={<GallerySection />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
