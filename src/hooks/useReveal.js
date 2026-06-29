import { useEffect } from 'react';
/**
 * Adds the `is-visible` class to every element with the `reveal` class
 * as it scrolls into view. Re-runs whenever `dep` changes (e.g. on route
 * change) so newly mounted sections are picked up.
 */
export function useReveal(dep = undefined) {
    useEffect(() => {
        const els = Array.from(document.querySelectorAll('.reveal'));
        if (!('IntersectionObserver' in window) || els.length === 0) {
            els.forEach((el) => el.classList.add('is-visible'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.dataset.revealDelay;
                    if (delay)
                        el.style.transitionDelay = `${delay}ms`;
                    el.classList.add('is-visible');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dep]);
}
