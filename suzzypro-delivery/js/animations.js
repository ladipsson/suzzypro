/* ==========================================================================
   SuzzyPro Delivery — animations.js
   IntersectionObserver-driven scroll reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  // Stagger children automatically within the same reveal group
  const groups = {};
  revealEls.forEach((el) => {
    const group = el.dataset.revealGroup || 'default';
    groups[group] = groups[group] || 0;
    el.style.setProperty('--delay', (groups[group] * 0.08) + 's');
    groups[group] += 1;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => observer.observe(el));
});
