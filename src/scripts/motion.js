import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scroll-triggered reveals, re-initialized on every page load / swap.
 *
 * [data-reveal]        — fade + rise when scrolled into view
 * [data-reveal-group]  — stagger all direct [data-reveal-item] children
 */
export function initMotion() {
  ScrollTrigger.getAll().forEach((t) => t.kill());

  if (prefersReducedMotion()) return;

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll('[data-reveal-item]');
    if (!items.length) return;
    gsap.from(items, {
      opacity: 0,
      y: 32,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 85%' },
    });
  });
}
