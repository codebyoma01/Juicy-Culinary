/* ============================================================
   JUICY CULINARY — script.js
   Features: Dark mode, mobile menu, scroll animations,
   lightbox, form validation, back-to-top, price estimator
   ============================================================ */

/* ---- Dark Mode ---- */
const initDarkMode = () => {
  const toggles = document.querySelectorAll('.dark-toggle');
  const saved = localStorage.getItem('jc-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  toggles.forEach(t => {
    t.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('jc-theme', next);
    });
  });
};

/* ---- Navbar scroll ---- */
const initNavScroll = () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const handler = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
};

/* ---- Mobile Menu ---- */
const initMobileMenu = () => {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-overlay');
  if (!hamburger || !menu) return;

  const open = () => {
    hamburger.classList.add('open');
    menu.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    hamburger.classList.remove('open');
    menu.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () =>
    menu.classList.contains('open') ? close() : open()
  );
  overlay?.addEventListener('click', close);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
};

/* ---- Scroll Reveal ---- */
const initScrollReveal = () => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
};

/* ---- Back to Top ---- */
const initBackToTop = () => {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

/* ---- Lightbox ---- */
const initLightbox = () => {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const img = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let items = [];
  let currentIndex = 0;

  const openLightbox = (src, index) => {
    img.src = src;
    currentIndex = index;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  const showNext = () => {
    currentIndex = (currentIndex + 1) % items.length;
    img.src = items[currentIndex];
  };
  const showPrev = () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    img.src = items[currentIndex];
  };

  document.querySelectorAll('[data-lightbox]').forEach((el, i) => {
    items.push(el.getAttribute('data-lightbox') || el.src || el.querySelector('img')?.src);
    el.addEventListener('click', () => openLightbox(items[i], i));
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
};

/* ---- Gallery Filter ---- */
const initGalleryFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.masonry-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        const show = filter === 'all' || category === filter;
        item.style.opacity = show ? '1' : '0';
        item.style.transform = show ? 'scale(1)' : 'scale(0.95)';
        item.style.pointerEvents = show ? 'all' : 'none';
        item.style.transition = 'opacity 0.35s, transform 0.35s';
        setTimeout(() => { item.style.display = show ? '' : 'none'; }, show ? 0 : 350);
        if (show) setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
      });
    });
  });
};

/* ---- Price Estimator ---- */
const PRICES = {
  birthday:   { small: 20000, medium: 35000, large: 50000, xl: 75000 },
  wedding:    { small: 80000, medium: 120000, large: 180000, xl: 250000 },
  cupcakes:   { small: 8000, medium: 15000, large: 25000, xl: 40000 },
  dessertbox: { small: 15000, medium: 25000, large: 40000, xl: 60000 },
  custom:     { small: 30000, medium: 55000, large: 90000, xl: 150000 },
};

const fmt = (n) => '₦' + n.toLocaleString('en-NG');

const initEstimator = () => {
  const typeEl = document.querySelector('#est-type');
  const sizeEl = document.querySelector('#est-size');
  const priceEl = document.querySelector('#est-price');
  if (!typeEl || !sizeEl || !priceEl) return;

  const update = () => {
    const type = typeEl.value;
    const size = sizeEl.value;
    const price = PRICES[type]?.[size];
    if (price) {
      priceEl.textContent = fmt(price);
      priceEl.style.transform = 'scale(1.05)';
      setTimeout(() => priceEl.style.transform = 'scale(1)', 200);
    }
  };

  typeEl.addEventListener('change', update);
  sizeEl.addEventListener('change', update);
  update();
};

/* ---- Form Validation ---- */
const validateForm = (form) => {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    const errEl = group?.querySelector('.form-error');
    if (!field.value.trim()) {
      field.classList.add('error');
      if (errEl) errEl.textContent = 'This field is required.';
      valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      field.classList.add('error');
      if (errEl) errEl.textContent = 'Please enter a valid email.';
      valid = false;
    } else {
      field.classList.remove('error');
      if (errEl) errEl.textContent = '';
    }
    field.addEventListener('input', () => {
      field.classList.remove('error');
      if (errEl) errEl.textContent = '';
    }, { once: true });
  });
  return valid;
};

const initForms = () => {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        const modal = document.querySelector('.success-modal');
        if (modal) {
          modal.classList.add('open');
          modal.querySelector('.success-modal-close')?.addEventListener('click', () => {
            modal.classList.remove('open');
          });
        }
        form.reset();
      }
    });
  });
};

/* ---- File Upload Preview ---- */
const initFileUpload = () => {
  const area = document.querySelector('.file-upload');
  const input = document.querySelector('.file-upload input[type="file"]');
  const text = document.querySelector('.file-upload-text');
  if (!area || !input) return;

  area.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file && text) text.innerHTML = `<strong>${file.name}</strong> selected ✓`;
  });
  area.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor = 'var(--gold)'; });
  area.addEventListener('dragleave', () => area.style.borderColor = '');
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) { input.files = e.dataTransfer.files; if (text) text.innerHTML = `<strong>${file.name}</strong> selected ✓`; }
  });
};

/* ---- Active Nav Link ---- */
const initActiveNav = () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
};

/* ---- Smooth scroll for anchor links ---- */
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

/* ---- Init All ---- */
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initNavScroll();
  initMobileMenu();
  initScrollReveal();
  initBackToTop();
  initLightbox();
  initGalleryFilter();
  initEstimator();
  initForms();
  initFileUpload();
  initActiveNav();
  initSmoothScroll();
});