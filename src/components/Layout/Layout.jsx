import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useReveal } from "../../hooks/useReveal";

// Shared phone number — single source of truth
const PHONE_NUMBER = "+250788395521";
const PHONE_DISPLAY = "+250 788 395 521";

function MobileBottomBar({ onOpenMenu }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[999] md:hidden">
      <div
        className="grid h-[68px] grid-cols-3 overflow-hidden bg-white"
        style={{ borderTop: '1px solid #e5e7eb', boxShadow: '0 -4px 12px rgba(0,0,0,0.08)' }}
      >
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="flex flex-col items-center justify-center transition-colors"
          style={{ borderRight: '1px solid #e5e7eb', color: '#4a4a4a' }}
        >
          <span className="mb-1 inline-flex">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
            Menu
          </span>
        </button>

        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex flex-col items-center justify-center transition-colors"
          style={{ borderRight: '1px solid #e5e7eb', color: '#4a4a4a' }}
          aria-label={`Call us: ${PHONE_DISPLAY}`}
        >
          <span className="mb-1 inline-flex">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.79.68 2.63a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.45-1.25a2 2 0 0 1 2.11-.45c.84.33 1.73.56 2.63.68A2 2 0 0 1 22 16.92Z" />
            </svg>
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
            Call
          </span>
        </a>

        <a
          href="https://direct-book.com/properties/akageraparkinn"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors"
          style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
        >
          Book Now
        </a>
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  // Sidebar open state — key it to path so it auto-closes on navigation
  // sidebarPath stores which path the sidebar was opened on
  const [sidebarOpenPath, setSidebarOpenPath] = useState(null);
  const sidebarOpen = sidebarOpenPath === path;
  const openSidebar = () => setSidebarOpenPath(path);
  const closeSidebar = () => setSidebarOpenPath(null);
  const toggleSidebar = () => setSidebarOpenPath(prev => (prev === path ? null : path));

  useReveal(path);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-sand-50">
      <Navbar
        currentPath={path}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        onCloseSidebar={closeSidebar}
      />
      <main className="pb-[74px] lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomBar onOpenMenu={openSidebar} />
    </div>
  );
}
