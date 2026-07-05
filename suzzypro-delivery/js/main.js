/* ==========================================================================
   SuzzyPro Delivery — main.js
   Navigation, counters, FAQ accordion, newsletter, cookie banner, floats
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavbar();
  initMobileNav();
  initCounters();
  initFaq();
  initNewsletter();
  initCookieBanner();
  initFloatButtons();
  initContactForm();
  initQuoteForm();
  markActiveNavLink();
});

/* ---------- Page loader ---------- */
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 250);
  });
}

/* ---------- Sticky navbar on scroll ---------- */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

/* ---------- Highlight active nav link ---------- */
function markActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (target % 1 === 0 ? Math.floor(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => observer.observe(c));
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ---------- Newsletter signup ---------- */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (!input.value || !input.checkValidity()) {
      input.style.outline = '2px solid #E5484D';
      return;
    }
    const originalText = btn.textContent;
    btn.textContent = 'Subscribing...';
    setTimeout(() => {
      btn.textContent = 'Subscribed ✓';
      input.value = '';
      input.style.outline = 'none';
      setTimeout(() => { btn.textContent = originalText; }, 2200);
    }, 800);
  });
}

/* ---------- Cookie banner ---------- */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
  if (localStorage && localStorage.getItem && false) return; // storage intentionally unused for portability
  setTimeout(() => banner.classList.add('visible'), 1200);
  banner.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => banner.classList.remove('visible'));
  });
}

/* ---------- Floating buttons (back to top) ---------- */
function initFloatButtons() {
  const topBtn = document.querySelector('.float-btn.top');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      topBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('.btn, .float-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setFormLoading(form, true);
    const feedback = form.querySelector('.form-feedback');
    setTimeout(() => {
      setFormLoading(form, false);
      if (feedback) {
        feedback.textContent = "Message sent — we'll reply within one business day.";
        feedback.className = 'form-feedback success';
      }
      form.reset();
    }, 1000);
  });
}

/* ---------- Business quote request form ---------- */
function initQuoteForm() {
  const form = document.querySelector('#quote-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setFormLoading(form, true);
    const feedback = form.querySelector('.form-feedback');
    setTimeout(() => {
      setFormLoading(form, false);
      if (feedback) {
        feedback.textContent = 'Quote request received — our logistics team will contact you shortly.';
        feedback.className = 'form-feedback success';
      }
      form.reset();
    }, 1000);
  });
}

function setFormLoading(form, isLoading) {
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  if (isLoading) {
    btn.dataset.label = btn.textContent;
    btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Sending...';
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.label || 'Send';
    btn.disabled = false;
  }
}
