import { useEffect } from 'react';

/**
 * Adds the `is-in` class to `.reveal` elements when they scroll into view,
 * powering the fade-up animations defined in index.css.
 */
export const AnimationObserver = () => {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    if (!elements.length) return;

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

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  return null;
};
