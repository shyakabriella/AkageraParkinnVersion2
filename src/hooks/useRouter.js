import { useEffect, useState, useCallback } from 'react';
/**
 * A tiny hash-based router. Routes are stored after the `#` (e.g. `#/about`).
 * Hash routing keeps this a static SPA with no server config and works on
 * any host (including `file://`), which is ideal for a marketing site.
 */
export function useRouter() {
    const [path, setPath] = useState(() => normalize(window.location.hash));
    useEffect(() => {
        const onHashChange = () => {
            setPath(normalize(window.location.hash));
            window.scrollTo({ top: 0, behavior: 'auto' });
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);
    const navigate = useCallback((to) => {
        const next = to.startsWith('#') ? to : `#${to}`;
        if (window.location.hash === next) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        window.location.hash = next;
    }, []);
    return { path, navigate };
}
function normalize(hash) {
    const raw = hash.replace(/^#/, '');
    if (!raw || raw === '/')
        return '/';
    return raw.startsWith('/') ? raw : `/${raw}`;
}
