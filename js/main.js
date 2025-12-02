/* main.js
   Vanilla JS for:
   - Navbar burger toggle
   - Hero slider (autoplay, controls, dots)
   - Header scroll shadow
   - Portfolio lightbox modal
   - Contact form front-end validation and example fetch snippet
*/

/* DOM helpers */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // Update year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navbar burger
  const burger = $('.navbar-burger');
  const menu = $('#mainMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
    });
  }

  // Header shadow on scroll
  const header = document.querySelector('.header');
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Slider
  const slides = $$('.slide');
  const dotsContainer = $('.slider-dots');
  const prevBtn = $('.slider-prev');
  const nextBtn = $('.slider-next');
  let current = 0;
  let autoplayInterval = null;
  const autoplayDelay = 6000;

  // create dots
  slides.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.classList.toggle('active', i === 0);
    btn.setAttribute('aria-label', `Go to slide ${i+1}`);
    btn.setAttribute('role', 'tab');
    btn.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(btn);
  });

  function show(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    // update dots
    $$('.slider-dots button').forEach((b, i) => b.classList.toggle('active', i === index));
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    show(current);
    restartAutoplay();
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  function startAutoplay() {
    autoplayInterval = setInterval(next, autoplayDelay);
  }
  function stopAutoplay() {
    if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; }
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pause on hover/focus for accessibility
  const sliderEl = $('.slider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', stopAutoplay);
    sliderEl.addEventListener('mouseleave', startAutoplay);
    sliderEl.addEventListener('focusin', stopAutoplay);
    sliderEl.addEventListener('focusout', startAutoplay);
  }

  startAutoplay();

  // Portfolio lightbox
  const lightboxEl = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  const portfolioItems = $$('.portfolio-item');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxEl.classList.add('is-active');
    lightboxEl.setAttribute('aria-hidden', 'false');
    // focus close button for keyboard
    const closeBtn = lightboxEl.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightboxEl.classList.remove('is-active');
    lightboxEl.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    // return focus to last portfolio item (not tracked here; user can tab)
  }

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item.dataset.src, item.querySelector('img').alt);
    });
    // keyboard accessible
    item.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openLightbox(item.dataset.src, item.querySelector('img').alt);
      }
    });
  });

  // modal close buttons
  const modalClose = lightboxEl.querySelector('.modal-close');
  const modalBackground = lightboxEl.querySelector('.modal-background');
  [modalClose, modalBackground].forEach(el => {
    if (el) el.addEventListener('click', closeLightbox);
  });

  // Escape to close
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && lightboxEl.classList.contains('is-active')) {
      closeLightbox();
    }
  });

  // Contact form validation
  const form = $('#contact-form');
  const nameInput = $('#name');
  const emailInput = $('#email');
  const messageInput = $('#message');
  const nameError = $('#name-error');
  const emailError = $('#email-error');
  const messageError = $('#message-error');
  const formStatus = $('#form-status');

  const validators = {
    name: value => value.trim().length >= 2 || 'Please enter your name (2+ characters).',
    email: value => /\S+@\S+\.\S+/.test(value) || 'Please enter a valid email address.',
    message: value => value.trim().length >= 10 || 'Please provide a brief message (10+ characters).'
  };

  function validateField(input, errorEl, rule) {
    const res = rule(input.value);
    if (res !== true) {
      errorEl.textContent = res;
      errorEl.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      return false;
    }
    errorEl.textContent = '';
    errorEl.hidden = true;
    input.removeAttribute('aria-invalid');
    return true;
  }

  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      formStatus.textContent = '';

      const okName = validateField(nameInput, nameError, validators.name);
      const okEmail = validateField(emailInput, emailError, validators.email);
      const okMessage = validateField(messageInput, messageError, validators.message);

      if (!(okName && okEmail && okMessage)) {
        formStatus.textContent = 'Please correct the errors above.';
        return;
      }

      // Example front-end submission (no server included)
      formStatus.textContent = 'Sending…';

      // Example fetch snippet (uncomment & provide your API endpoint to use)
      /*
      fetch('https://api.example.com/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          message: messageInput.value
        })
      }).then(r => {
        if (r.ok) {
          formStatus.textContent = 'Message sent. Thank you!';
          form.reset();
        } else {
          formStatus.textContent = 'Submission failed. Please try again later.';
        }
      }).catch(err => {
        formStatus.textContent = 'Network error. Please try again later.';
      });
      */

      // Since there's no server, simulate success
      setTimeout(() => {
        formStatus.textContent = 'Message sent. Thank you!';
        form.reset();
      }, 900);
    });
  }

  // Accessibility - trap focus inside modal when active (lightbox)
  document.addEventListener('focusin', (ev) => {
    if (lightboxEl.classList.contains('is-active')) {
      if (!lightboxEl.contains(ev.target)) {
        // redirect focus to the modal close button
        const closeBtn = lightboxEl.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
      }
    }
  });

  // Smooth scrolling for anchor links
  const anchorLinks = $$('a[href^="#"]');
  anchorLinks.forEach(a => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        ev.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close burger menu on mobile if open
        if (menu.classList.contains('is-active')) {
          menu.classList.remove('is-active');
          if (burger) burger.classList.remove('is-active');
        }
      }
    });
  });

});
