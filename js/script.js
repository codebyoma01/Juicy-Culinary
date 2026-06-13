/**
 * JUICY CULINARY — script.js
 * Features: dark mode, nav, mobile menu, scroll reveal,
 *           lightbox, gallery filter, price estimator,
 *           form validation, file upload, back-to-top
 */

'use strict';

/* ============================================================
   DARK MODE
   ============================================================ */
function initDarkMode() {
  const toggles = document.querySelectorAll('.dark-toggle');
  const saved = localStorage.getItem('jc-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  toggles.forEach(toggle => {
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.addEventListener('click', () => {
      const curr = document.documentElement.getAttribute('data-theme');
      const next = curr === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('jc-theme', next);
    });
  });
}

/* ============================================================
   NAVIGATION — scroll state + active link
   ============================================================ */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Scroll state
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mark active link
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-overlay');
  if (!hamburger || !menu) return;

  const open = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () =>
    menu.classList.contains('open') ? close() : open()
  );

  overlay?.addEventListener('click', close);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) close();
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => io.observe(el));
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackTop() {
  const btn = document.querySelector('.back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   PRICE ESTIMATOR
   ============================================================ */
const PRICE_TABLE = {
  birthday:    { small: 20000,  medium: 35000,  large: 55000,  xl: 80000  },
  wedding:     { small: 80000,  medium: 130000, large: 200000, xl: 280000 },
  celebration: { small: 25000,  medium: 45000,  large: 70000,  xl: 100000 },
  corporate:   { small: 35000,  medium: 60000,  large: 90000,  xl: 140000 },
  cupcakes:    { small: 8000,   medium: 15000,  large: 28000,  xl: 45000  },
  dessertbox:  { small: 15000,  medium: 28000,  large: 45000,  xl: 65000  },
};

function fmtNaira(n) {
  return '₦' + n.toLocaleString('en-NG');
}

function initEstimator() {
  // Runs for both homepage estimator and order page sidebar estimator
  document.querySelectorAll('[data-estimator]').forEach(wrapper => {
    const typeEl  = wrapper.querySelector('[data-est-type]');
    const sizeEl  = wrapper.querySelector('[data-est-size]');
    const priceEl = wrapper.querySelector('[data-est-price]');
    if (!typeEl || !sizeEl || !priceEl) return;

    const update = () => {
      const type = typeEl.value;
      const size = sizeEl.value;
      const price = PRICE_TABLE[type]?.[size];
      if (!price) return;

      priceEl.style.opacity = '0';
      priceEl.style.transform = 'translateY(5px)';

      setTimeout(() => {
        priceEl.textContent = fmtNaira(price);
        priceEl.style.opacity = '1';
        priceEl.style.transform = 'translateY(0)';
      }, 150);
    };

    priceEl.style.transition = 'opacity 0.25s, transform 0.25s';
    typeEl.addEventListener('change', update);
    sizeEl.addEventListener('change', update);
    update();
  });
}

/* ============================================================
   GALLERY FILTER
   ============================================================ */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const countEl = document.querySelector('.gallery-count');
  const emptyEl = document.querySelector('.gallery-empty');
  if (!filterBtns.length) return;

  function applyFilter(filter) {
    let visible = 0;

    items.forEach(item => {
      const cat = item.getAttribute('data-category');
      const show = filter === 'all' || cat === filter;

      if (show) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.97)';
        requestAnimationFrame(() => {
          item.style.transition = 'opacity 0.35s, transform 0.35s';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        });
        visible++;
      } else {
        item.style.transition = 'opacity 0.2s, transform 0.2s';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.96)';
        setTimeout(() => { item.style.display = 'none'; }, 220);
      }
    });

    if (countEl) countEl.textContent = visible + ' pieces';
    if (emptyEl) emptyEl.classList.toggle('visible', visible === 0);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  // Init count
  if (countEl) countEl.textContent = items.length + ' pieces';
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lb = document.querySelector('.lightbox');
  if (!lb) return;

  const imgEl   = lb.querySelector('.lightbox-img');
  const closeEl = lb.querySelector('.lb-close');
  const prevEl  = lb.querySelector('.lb-prev');
  const nextEl  = lb.querySelector('.lb-next');
  const caption = lb.querySelector('.lb-caption');

  let items = [];
  let current = 0;

  function open(index) {
    current = index;
    imgEl.src = items[current].src;
    imgEl.alt = items[current].alt || '';
    if (caption) caption.textContent = items[current].label || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { imgEl.src = ''; }, 300);
  }

  function showPrev() {
    current = (current - 1 + items.length) % items.length;
    imgEl.style.opacity = '0';
    setTimeout(() => {
      imgEl.src = items[current].src;
      if (caption) caption.textContent = items[current].label || '';
      imgEl.style.opacity = '1';
    }, 150);
  }

  function showNext() {
    current = (current + 1) % items.length;
    imgEl.style.opacity = '0';
    setTimeout(() => {
      imgEl.src = items[current].src;
      if (caption) caption.textContent = items[current].label || '';
      imgEl.style.opacity = '1';
    }, 150);
  }

  imgEl.style.transition = 'opacity 0.15s';

  // Collect all gallery items
  document.querySelectorAll('[data-lb]').forEach((el, i) => {
    items.push({
      src:   el.getAttribute('data-lb'),
      alt:   el.getAttribute('data-lb-alt') || '',
      label: el.getAttribute('data-lb-label') || ''
    });
    el.addEventListener('click', () => open(i));
  });

  closeEl?.addEventListener('click', close);
  prevEl?.addEventListener('click', showPrev);
  nextEl?.addEventListener('click', showNext);

  lb.addEventListener('click', e => {
    if (e.target === lb) close();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
}

/* ============================================================
   FORM VALIDATION
   ============================================================ */
function validateField(field) {
  const val = field.value.trim();
  const group = field.closest('.form-group');
  const errEl = group?.querySelector('.form-error');
  let msg = '';

  if (field.required && !val) {
    msg = 'This field is required.';
  } else if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    msg = 'Please enter a valid email address.';
  } else if (field.type === 'tel' && val && !/^[\d\s\+\-\(\)]{7,}$/.test(val)) {
    msg = 'Please enter a valid phone number.';
  }

  field.classList.toggle('error', !!msg);
  if (errEl) errEl.textContent = msg;
  return !msg;
}

function initForms() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

    // Live validation on blur
    fields.forEach(f => {
      f.addEventListener('blur', () => validateField(f));
      f.addEventListener('input', () => {
        if (f.classList.contains('error')) validateField(f);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let allValid = true;
      fields.forEach(f => { if (!validateField(f)) allValid = false; });

      if (allValid) {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
          modal.classList.add('open');
          modal.querySelector('.modal-close-btn')?.addEventListener('click', () => {
            modal.classList.remove('open');
          }, { once: true });
        }
        form.reset();
      } else {
        // Scroll to first error
        const firstErr = form.querySelector('.form-control.error');
        firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErr?.focus();
      }
    });
  });
}

/* ============================================================
   FILE UPLOAD — drag & drop + preview
   ============================================================ */
function initFileUpload() {
  document.querySelectorAll('.file-drop').forEach(zone => {
    const input = zone.querySelector('input[type="file"]');
    const display = zone.querySelector('.file-name-display');
    if (!input) return;

    const setFile = (file) => {
      if (file && display) {
        display.textContent = `✓ ${file.name}`;
        display.style.display = 'block';
      }
    };

    input.addEventListener('change', () => setFile(input.files[0]));

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) {
        // Transfer to input
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        setFile(file);
      }
    });
  });
}

/* ============================================================
   ORDER STEPS — track form progress
   ============================================================ */
function initOrderSteps() {
  const steps = document.querySelectorAll('.order-step');
  if (!steps.length) return;

  const sections = document.querySelectorAll('.form-section[data-step]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepId = entry.target.getAttribute('data-step');
        steps.forEach((step, i) => {
          const num = i + 1;
          step.classList.remove('active', 'done');
          if (num < +stepId) step.classList.add('done');
          if (num === +stepId) step.classList.add('active');
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => io.observe(s));
}

/* ============================================================
   MARQUEE — duplicate for seamless loop
   ============================================================ */
function initMarquee() {
  const tracks = document.querySelectorAll('.marquee-track');
  tracks.forEach(track => {
    // Duplicate content for seamless loop
    track.innerHTML += track.innerHTML;
  });
}

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initNav();
  initMobileMenu();
  initScrollReveal();
  initBackTop();
  initEstimator();
  initGalleryFilter();
  initLightbox();
  initForms();
  initFileUpload();
  initOrderSteps();
  initMarquee();
  initSmoothScroll();
});