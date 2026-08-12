import { useEffect } from 'react';

/**
 * Shared hook that runs after each page's HTML is injected.
 * Fixes: frozen animations, SPA navigation.
 */
export function usePageInit() {
  useEffect(() => {
    // 1. Reveal all frozen (opacity:0) elements with smooth transition
    const revealFrozen = () => {
      const frozen = document.querySelectorAll('[style*="opacity: 0"]');
      frozen.forEach(el => {
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    };
    setTimeout(revealFrozen, 80);

    // 2. SPA navigation — intercept internal <a> clicks so React Router handles them
    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      // Only intercept relative/internal links
      if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto') || href.startsWith('tel')) return;
      if (anchor.target === '_blank') return;
      e.preventDefault();
      window.history.pushState(null, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };
    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);
}
