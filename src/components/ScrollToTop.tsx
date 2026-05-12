import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restores scroll to top on route change.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};
