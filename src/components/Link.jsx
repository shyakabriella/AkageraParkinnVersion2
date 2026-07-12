import { Link as RouterLink, useNavigate as useRouterNavigate } from 'react-router-dom';

export function useNavigate() {
    return useRouterNavigate();
}

export function NavProvider({ children }) {
    // NavProvider is no longer strictly needed with react-router-dom, but we'll render children to avoid breaking layout
    return <>{children}</>;
}

export function Link({ to, children, ...rest }) {
    if (to && to.startsWith('http')) {
        return (
            <a href={to} target="_blank" rel="noopener noreferrer" {...rest}>
                {children}
            </a>
        );
    }
    return (
        <RouterLink to={to} {...rest}>
            {children}
        </RouterLink>
    );
}
