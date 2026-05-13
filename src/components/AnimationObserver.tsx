import { useEffect } from 'react';

/**
 * Adds the `is-in` class to `.reveal` elements when they scroll into view,
 * powering the fade-up animations defined in index.css.
 */
export const AnimationObserver = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const observed = new WeakSet<HTMLElement>();

    const observeElement = (el: HTMLElement) => {
      if (observed.has(el)) return;
      observed.add(el);
      io.observe(el);
    };

    const observeReveals = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches('.reveal')) {
        observeElement(root);
      }

      root.querySelectorAll?.<HTMLElement>('.reveal').forEach(observeElement);
    };

    observeReveals(document);

    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            observeReveals(node);
          }
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
};
