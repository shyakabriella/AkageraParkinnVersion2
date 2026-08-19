import { useEffect } from 'react';

/**
 * Triggers scroll-reveal animations on route changes.
 * Elements with the class `reveal` will animate in when they enter the viewport.
 */
export function useReveal(path) {
  useEffect(() => {
    const revealElements = () => {
      const els = document.querySelectorAll('.reveal:not(.revealed)');
      if (!els.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      els.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    };

    // Small delay ensures DOM is ready after route transition
    const timer = setTimeout(revealElements, 100);
    return () => clearTimeout(timer);
  }, [path]);
}
