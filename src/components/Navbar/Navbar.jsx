import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ sidebarOpen, onToggleSidebar, onCloseSidebar }) => {
  const [scrolled, setScrolled] = useState(false);

  // Use internal state if no external control provided (backward compat)
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = sidebarOpen !== undefined ? sidebarOpen : internalOpen;
  const toggleSidebar = onToggleSidebar ?? (() => setInternalOpen(prev => !prev));
  const closeSidebar = onCloseSidebar ?? (() => setInternalOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header className={`hly-header${scrolled ? ' scrolled' : ''}`}>
        <div className="hly-header-inner">

          {/* Logo — LEFT */}
          <div className="hly-logo">
            <Link to="/" aria-label="Akagera Park Inn — Home">
              <img src="/loo.png" alt="Akagera Park Inn" className="hly-logo-img" />
            </Link>
          </div>

          {/* Right controls */}
          <div className="hly-header-right">
            {/* Location text — desktop only */}
            <div className="hly-location">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Kayonza, Eastern Province, Rwanda</span>
            </div>

            {/* Hamburger */}
            <button
              className="hly-menu-btn"
              onClick={toggleSidebar}
              aria-label="Open menu"
              aria-expanded={isOpen}
            >
              <span className="hly-menu-bar" />
              <span className="hly-menu-bar" />
              <span className="hly-menu-bar" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`hly-overlay${isOpen ? ' active' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside className={`hly-sidebar${isOpen ? ' open' : ''}`} aria-label="Navigation menu">

        {/* Close Button */}
        <button className="hly-sidebar-close" onClick={closeSidebar} aria-label="Close menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Sidebar Logo */}
        <div className="hly-sidebar-logo">
          <Link to="/" onClick={closeSidebar}>
            <img src="/loo.png" alt="Akagera Park Inn" />
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="hly-sidebar-nav">
          <ul>
            <li>
              <Link to="/" onClick={closeSidebar}>Home</Link>
            </li>
            <li>
              <a
                href="https://direct-book.com/properties/akageraparkinn/about?locale=en"
                target="_blank" rel="noopener noreferrer"
                onClick={closeSidebar}
              >About</a>
            </li>
            <li>
              <a
                href="https://direct-book.com/properties/akageraparkinn?locale=en"
                target="_blank" rel="noopener noreferrer"
                onClick={closeSidebar}
              >Rooms</a>
            </li>
            <li>
              <Link to="/gallery" onClick={closeSidebar}>Gallery</Link>
            </li>
            <li>
              <Link to="/experiences" onClick={closeSidebar}>Experiences</Link>
            </li>
            <li>
              <Link to="/offers" onClick={closeSidebar}>Offers</Link>
            </li>
            <li>
              <Link to="/services" onClick={closeSidebar}>Services</Link>
            </li>
            <li>
              <Link to="/restaurant" onClick={closeSidebar}>Restaurant</Link>
            </li>
            <li>
              <a
                href="https://direct-book.com/properties/akageraparkinn/policies?locale=en"
                target="_blank" rel="noopener noreferrer"
                onClick={closeSidebar}
              >Policies</a>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="hly-sidebar-footer">
          <p>© {new Date().getFullYear()} Akagera Park Inn</p>
          <div className="hly-sidebar-socials">
            <a href="https://www.tiktok.com/@akagera.parkinn" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 448 512" width="16" height="16" fill="currentColor"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
            </a>
            <a href="https://www.facebook.com/share/1DxQEEXv7V/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 320 512" width="16" height="16" fill="currentColor"><path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"/></svg>
            </a>
            <a href="https://www.instagram.com/akageraparkinn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 448 512" width="16" height="16" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z"/></svg>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
