/* =====================================================================
   JPJ Solutions — Main JavaScript
   ---------------------------------------------------------------------
   Modules:
     1. Utilities
     2. Year stamp
     3. Theme toggle (dark / light + localStorage)
     4. Mobile menu
     5. Navbar scroll state + smooth scroll
     6. Active nav link on scroll (IntersectionObserver)
     7. Scroll-reveal animations (IntersectionObserver)
     8. Typewriter effect
     9. Canvas particle system (hero background)
    10. Portfolio filtering
    11. Portfolio modal / lightbox (accessible, focus-trapped)
    12. Testimonials carousel (auto-scroll + controls + dots)
    13. Contact form (basic client-side validation)
   All initialised on DOMContentLoaded.
   ===================================================================== */

(function () {
  'use strict';

  /* ===================================================================
     1. UTILITIES
     =================================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================================================
     2. YEAR STAMP (footer)
     =================================================================== */
  function initYear() {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ===================================================================
     3. THEME TOGGLE
     Persists the user's choice to localStorage; defaults to dark.
     =================================================================== */
  function initTheme() {
    const root = document.documentElement;
    const toggle = $('#themeToggle');
    const STORAGE_KEY = 'jpj-theme';

    // Restore saved preference (fall back to dark)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      root.setAttribute('data-theme', saved);
    }
    syncPressed();

    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem(STORAGE_KEY, next);
        syncPressed();
      });
    }

    function syncPressed() {
      if (!toggle) return;
      const isLight = root.getAttribute('data-theme') === 'light';
      toggle.setAttribute('aria-pressed', String(isLight));
    }
  }

  /* ===================================================================
     4. MOBILE MENU
     =================================================================== */
  function initMobileMenu() {
    const hamburger = $('#hamburger');
    const navLinks = $('#navLinks');
    if (!hamburger || !navLinks) return;

    const setOpen = (open) => {
      navLinks.classList.toggle('open', open);
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    };

    hamburger.addEventListener('click', () => {
      setOpen(!navLinks.classList.contains('open'));
    });

    // Close the menu after clicking any link
    $$('.nav-link', navLinks).forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });
  }

  /* ===================================================================
     5. NAVBAR SCROLL STATE + SMOOTH SCROLL
     =================================================================== */
  function initNavbarScroll() {
    const navbar = $('#navbar');
    const onScroll = () => {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Smooth scroll for internal anchor links (respects reduced motion)
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  /* ===================================================================
     6. ACTIVE NAV LINK ON SCROLL
     =================================================================== */
  function initScrollSpy() {
    const sections = $$('main section[id]');
    const navLinks = $$('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const byId = {};
    navLinks.forEach((l) => { byId[l.getAttribute('href')] = l; });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = byId['#' + entry.target.id];
          if (!link) return;
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((s) => observer.observe(s));
  }

  /* ===================================================================
     7. SCROLL-REVEAL ANIMATIONS
     =================================================================== */
  function initReveal() {
    const els = $$('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => observer.observe(el));
  }

  /* ===================================================================
     8. TYPEWRITER EFFECT
     Cycles through a list of roles with type / pause / delete phases.
     =================================================================== */
  function initTypewriter() {
    const el = $('#typewriter');
    if (!el) return;
    const words = ['Web Designer.', 'AI Builder.', 'IT Professional.', 'Problem Solver.'];

    // Reduced-motion: just show the first word, no animation loop.
    if (prefersReducedMotion) { el.textContent = words[0]; return; }

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const TYPE_SPEED = 90;
    const DELETE_SPEED = 45;
    const HOLD_FULL = 1400;
    const HOLD_EMPTY = 350;

    function tick() {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          return setTimeout(tick, HOLD_FULL);
        }
        return setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          return setTimeout(tick, HOLD_EMPTY);
        }
        return setTimeout(tick, DELETE_SPEED);
      }
    }
    tick();
  }

  /* ===================================================================
     9. CANVAS PARTICLE SYSTEM (hero background)
     Lightweight, dependency-free. Particles drift and link with lines
     when close; they also gently react to the pointer.
     =================================================================== */
  function initParticles() {
    const canvas = $('#heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height, particles = [], animationId;
    const mouse = { x: null, y: null, radius: 130 };
    const ACCENT = '16, 185, 129'; // emerald green RGB

    // Skip the animation loop entirely for reduced-motion users,
    // but still paint one static frame so the hero isn't blank.
    const animate = !prefersReducedMotion;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      // Scale particle count with screen area (capped for performance)
      const count = Math.min(Math.floor((width * height) / 14000), 110);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 0.6
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (animate) {
          p.x += p.vx;
          p.y += p.vy;
          // Wrap around edges
          if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

          // Gentle pointer repulsion
          if (mouse.x !== null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < mouse.radius && dist > 0) {
              const force = (mouse.radius - dist) / mouse.radius;
              p.x += (dx / dist) * force * 1.6;
              p.y += (dy / dist) * force * 1.6;
            }
          }
        }

        // Particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, 0.7)`;
        ctx.fill();

        // Link lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${ACCENT}, ${0.14 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (animate) animationId = requestAnimationFrame(draw);
    }

    // Pointer tracking
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    // Pause the loop when the hero is off-screen (saves battery/CPU)
    if (animate && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animationId) draw();
          } else if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        });
      }, { threshold: 0 });
      io.observe(canvas);
    }

    window.addEventListener('resize', debounce(resize, 200));
    resize();
    draw();
  }

  /* ===================================================================
     10. PORTFOLIO FILTERING
     =================================================================== */
  function initFilters() {
    const buttons = $$('.filter-btn');
    const cards = $$('.project-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        cards.forEach((card) => {
          const tags = (card.dataset.tags || '').split(' ');
          const show = filter === 'all' || tags.includes(filter);
          card.classList.toggle('hide', !show);
        });
      });
    });
  }

  /* ===================================================================
     11. PORTFOLIO MODAL / LIGHTBOX (accessible)
     =================================================================== */
  function initModal() {
    const modal = $('#projectModal');
    if (!modal) return;

    const dialog = $('.modal-dialog', modal);
    const imgEl = $('#modalImg');
    const catEl = $('#modalCat');
    const titleEl = $('#modalTitle');
    const descEl = $('#modalDesc');
    const stackEl = $('#modalStack');
    const liveEl = $('#modalLive');
    let lastFocused = null;

    function open(card) {
      lastFocused = document.activeElement;

      imgEl.src = card.dataset.image || '';
      imgEl.alt = (card.dataset.title || 'Project') + ' — full preview';
      catEl.textContent = card.dataset.category || '';
      titleEl.textContent = card.dataset.title || '';
      descEl.textContent = card.dataset.desc || '';

      // Tech stack chips
      stackEl.innerHTML = '';
      (card.dataset.stack || '').split(',').map((s) => s.trim()).filter(Boolean).forEach((tech) => {
        const span = document.createElement('span');
        span.textContent = tech;
        stackEl.appendChild(span);
      });

      // REPLACE: real live-site link would go here per project.
      liveEl.setAttribute('href', '#');

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Move focus into the dialog
      const closeBtn = $('#modalClose');
      if (closeBtn) closeBtn.focus();

      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }

    // Focus trap + ESC handling
    function onKeydown(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;

      const focusables = $$(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        dialog
      ).filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    // Wire up each project card (whole card + explicit button)
    $$('.project-card').forEach((card) => {
      const openHandler = (e) => { e.preventDefault(); open(card); };
      const btn = $('.project-open', card);
      if (btn) btn.addEventListener('click', openHandler);
      // Allow keyboard activation from the card itself
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'View details for ' + (card.dataset.title || 'project'));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
      });
    });

    // Close handlers (backdrop, close button)
    $$('[data-close-modal]', modal).forEach((el) => el.addEventListener('click', close));
  }

  /* ===================================================================
     12. TESTIMONIALS CAROUSEL
     =================================================================== */
  function initCarousel() {
    const track = $('#carouselTrack');
    const prev = $('#carouselPrev');
    const next = $('#carouselNext');
    const dotsWrap = $('#carouselDots');
    if (!track) return;

    const slides = $$('.testimonial', track);
    let index = 0;
    let timer = null;
    const AUTO_MS = 5000;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    const dots = $$('button', dotsWrap);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }

    function nextSlide() { goTo(index + 1); }
    function prevSlide() { goTo(index - 1); }

    function start() {
      if (prefersReducedMotion) return; // no auto-scroll for reduced motion
      timer = setInterval(nextSlide, AUTO_MS);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (next) next.addEventListener('click', () => { nextSlide(); restart(); });
    if (prev) prev.addEventListener('click', () => { prevSlide(); restart(); });

    // Pause on hover / focus for accessibility
    const carousel = track.closest('.carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      carousel.addEventListener('focusin', stop);
      carousel.addEventListener('focusout', start);
    }

    goTo(0);
    start();
  }

  /* ===================================================================
     13. CONTACT FORM (client-side validation only)
     REPLACE: connect to a backend or form service to actually send.
     =================================================================== */
  function initContactForm() {
    const form = $('#contactForm');
    const status = $('#formStatus');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const subject = (data.get('subject') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !email || !subject || !message) {
        setStatus('Please fill in all fields.', 'error');
        return;
      }
      if (!emailOk) {
        setStatus('Please enter a valid email address.', 'error');
        return;
      }

      // REPLACE: send the data to your backend / form endpoint here.
      setStatus('Thanks, ' + name + '! Your message has been noted (demo only).', 'success');
      form.reset();
    });

    function setStatus(msg, type) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form-status ' + type;
    }
  }

  /* ===================================================================
     Small debounce helper
     =================================================================== */
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /* ===================================================================
     INIT
     =================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initYear();
    initTheme();
    initMobileMenu();
    initNavbarScroll();
    initScrollSpy();
    initReveal();
    initTypewriter();
    initParticles();
    initFilters();
    initModal();
    initCarousel();
    initContactForm();
  });
})();
