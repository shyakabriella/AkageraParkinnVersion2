import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from './Link';
import { site } from '../data/site';
import { looLogo } from '../lib/assets';
const links = [
  { label: 'About', to: '/about' },
  { label: 'Rooms', to: '/stays' },
  { label: 'Services', to: '/experiences' },
  { label: 'Restaurant', to: '/restaurant' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Reviews', to: '/stories' },
];
export default function Navbar({ currentPath }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const onToggle = () => setOpen((v) => !v);
    window.addEventListener('toggle-mobile-menu', onToggle);
    return () => window.removeEventListener('toggle-mobile-menu', onToggle);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  // Solid nav on any non-home route (those pages have dark headers).
  const isHome = currentPath === '/';
  const solid = scrolled || !isHome;
  return (<header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid
    ? 'bg-forest-950/85 text-sand-50 backdrop-blur-md shadow-soft'
    : 'bg-transparent text-sand-50'}`}>
    <nav className="container-x flex h-20 items-center justify-between">
      <Link to="/" className="group flex items-center gap-4" aria-label="Akagera Park Inn — home">
        <span className={`flex items-center justify-center transition-colors duration-300 ${solid ? 'border-sand-50/30' : 'border-sand-50/40'} group-hover:border-sand-50`}>
          <img src={looLogo} alt="Akagera Park Inn logo" className="h-16 w-auto object-contain" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-wide">
            {site.name}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-sand-200/80">
            {site.subtitle}
          </span>
        </span>
      </Link>

      <ul className="hidden items-center gap-8 lg:flex">
        {links.map((l) => {
          const active = currentPath === l.to || currentPath.startsWith(`${l.to}/`);
          return (<li key={l.to}>
            <Link to={l.to} className={`group relative text-sm font-medium tracking-wide transition-colors ${active ? 'text-sand-50' : 'text-sand-100/80 hover:text-sand-50'}`}>
              {l.label}
              <span className={`absolute -bottom-1.5 left-0 h-px bg-sand-50 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          </li>);
        })}
      </ul>

      <div className="hidden lg:block">
        <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !px-6">
          Book Your Stay
        </a>
      </div>

      <button type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex h-10 w-10 items-center justify-center rounded-full border border-sand-50/30 text-sand-50 transition-colors hover:border-sand-50 lg:hidden">
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </nav>

    {/* Mobile drawer */}
    <div className={`lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-x-0 top-20 origin-top bg-forest-950/95 backdrop-blur-md transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}>
        <ul className="container-x flex flex-col gap-1 py-6">
          {links.map((l) => (<li key={l.to}>
            <button type="button" onClick={() => {
              setOpen(false);
              navigate(l.to);
            }} className="block w-full border-b border-sand-50/10 py-4 text-left font-display text-2xl text-sand-100">
              {l.label}
            </button>
          </li>))}
          <li className="pt-4">
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center" onClick={() => setOpen(false)}>
              Book Your Stay
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>);
}
