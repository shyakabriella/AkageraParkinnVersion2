import { useEffect } from 'react';

/**
 * Shared hook that runs after each page mount.
 * Handles revealing any elements that may be frozen at opacity:0.
 * Internal navigation is handled by React Router's <Link> — no manual interception needed.
 */
export function usePageInit() {
  useEffect(() => {
    // Reveal any elements that were frozen at opacity:0 (e.g. from old CSS animations)
    const revealFrozen = () => {
      const frozen = document.querySelectorAll('[style*="opacity: 0"]');
      frozen.forEach(el => {
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    };
    const timer = setTimeout(revealFrozen, 80);
    return () => clearTimeout(timer);
  }, []);
}
