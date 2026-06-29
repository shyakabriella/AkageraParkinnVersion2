import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, Lock, Mail, AlertCircle, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { looLogo } from '../lib/assets';
import heroImg from '../Assets/p1.jpg';
import nightImg from '../Assets/night view.avif';

const SLIDES = [heroImg, nightImg];

export default function Login() {
  const { login, loading, error, setError, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    setMounted(true);
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  // Auto-slide the hero image
  useEffect(() => {
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, password);
    if (ok) navigate('/dashboard', { replace: true });
  };

  return (
    <div
      className={`flex min-h-screen transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: '#0a1a0d' }}
    >
      {/* ── LEFT: Hero image panel ── */}
      <div className="relative hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col overflow-hidden">
        {/* Sliding images */}
        {SLIDES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === slideIdx ? 1 : 0 }}
          />
        ))}

        {/* Dark gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(9,31,13,0.65) 0%, rgba(9,31,13,0.2) 50%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        {/* Bottom fade for text legibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-72"
          style={{
            background: 'linear-gradient(to top, rgba(9,31,13,0.9) 0%, transparent 100%)',
          }}
        />

        {/* Logo top-left */}
        <div className="relative z-10 flex items-center gap-3 p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
            <img src={looLogo} alt="Akagera Park Inn" className="h-9 w-9 object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold text-sand-50">Akagera Park Inn</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-sand-200/70 mt-0.5">Rwanda · East Africa</span>
          </div>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 mt-auto p-10">
          {/* Star rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-sm font-medium text-sand-200/80">Akagera Village, Rwanda</span>
          </div>

          <h2 className="font-display text-3xl xl:text-4xl font-semibold text-sand-50 leading-tight">
            Where the wild meets<br />
            <span
              className="italic"
              style={{
                background: 'linear-gradient(90deg, #8ec48e, #62a862)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              warm hospitality.
            </span>
          </h2>
          <p className="mt-3 text-sm text-sand-200/70 leading-relaxed max-w-sm">
            Calm stays just minutes from Akagera National Park — pool, garden,
            restaurant &amp; 24-hour reception.
          </p>

          {/* Slide dots */}
          <div className="flex items-center gap-2 mt-6">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === slideIdx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === slideIdx ? '#62a862' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Login form panel ── */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16"
        style={{ background: '#0c1f0e' }}
      >
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-80 w-80 opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(35,88,37,0.4) 0%, transparent 70%)',
          }}
        />

        {/* Mobile logo (visible only on small screens) */}
        <div className="lg:hidden mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-700/30 border border-forest-500/20">
            <img src={looLogo} alt="Akagera Park Inn" className="h-10 w-10 object-contain" />
          </div>
          <p className="font-display text-lg font-semibold text-sand-50">Akagera Park Inn</p>
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-400 mb-2">
              Admin Portal
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-sand-50">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-sand-400/70">
              Sign in to manage your hotel dashboard.
            </p>
          </div>

          {/* Demo hint */}
          <div className="mb-7 rounded-xl border border-forest-600/25 bg-forest-900/40 px-4 py-3">
            <p className="text-xs text-forest-300/80 leading-relaxed">
              <span className="font-semibold text-forest-200">Demo:</span>
              {' '}admin@akageraparkinn.com
              <br />
              <span className="font-semibold text-forest-200">Password:</span>
              {' '}akagera2025
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sand-400/70"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-500/50" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@akageraparkinn.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-sand-50 placeholder-sand-500/40 transition-all duration-200 focus:border-forest-500/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-forest-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sand-400/70"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-500/50" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 text-sm text-sand-50 placeholder-sand-500/40 transition-all duration-200 focus:border-forest-500/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-forest-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sand-500/50 transition-colors hover:text-sand-300"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <p className="text-sm text-red-300 leading-snug">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="relative mt-1 w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 disabled:opacity-60"
              style={{
                background: loading
                  ? 'rgba(35,88,37,0.6)'
                  : 'linear-gradient(135deg, #235825 0%, #2e7030 60%, #235825 100%)',
                boxShadow: loading ? 'none' : '0 6px 24px rgba(35,88,37,0.45)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/8" />
            <Leaf className="h-3.5 w-3.5 text-forest-600/60" />
            <span className="h-px flex-1 bg-white/8" />
          </div>

          {/* Footer links */}
          <p className="mt-6 text-center text-xs text-sand-500/50">
            © {new Date().getFullYear()} Akagera Park Inn ·{' '}
            <a href="/" className="text-forest-400 hover:text-forest-300 transition-colors">
              View website
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
