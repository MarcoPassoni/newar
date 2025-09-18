// Mobile menu toggle - CON OVERLAY
const mobileMenuIcon = document.getElementById('mobileMenuIcon');
const mobileFS = document.getElementById('mobileMenuFullscreen');
const mobileOverlay = document.getElementById('mobileMenuOverlay');

if (mobileMenuIcon) {
  mobileMenuIcon.addEventListener('click', () => {
    mobileFS.classList.toggle('open');
    mobileMenuIcon.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
  });
}

// Chiudi menu cliccando overlay
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', () => {
    mobileFS.classList.remove('open');
    mobileMenuIcon.classList.remove('open');
    mobileOverlay.classList.remove('open');
  });
}

// Close fullscreen nav when clicking a link
mobileFS?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileFS.classList.remove('open');
    mobileMenuIcon.classList.remove('open');
    mobileOverlay.classList.remove('open');
  });
});

// Service modals handling
const modalTriggers = document.querySelectorAll('[data-open]');
const modals = document.querySelectorAll('.service-modal');
const backdrop = document.querySelector('.modal-backdrop');
let lastFocusedEl = null;
let scrollBarCompensated = false;
function lockScroll(){
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  if(scrollBarWidth > 0){
    document.documentElement.style.setProperty('--sbw', scrollBarWidth + 'px');
    document.body.style.paddingRight = scrollBarWidth + 'px';
    scrollBarCompensated = true;
  }
  document.body.classList.add('no-scroll');
}
function unlockScroll(){
  document.body.classList.remove('no-scroll');
  if(scrollBarCompensated){
    document.body.style.paddingRight = '';
    scrollBarCompensated = false;
  }
}
function closeModals(){
  modals.forEach(m => m.classList.remove('open'));
  backdrop?.classList.remove('open');
  unlockScroll();
  if(lastFocusedEl){
    lastFocusedEl.focus();
    lastFocusedEl = null;
  }
}
// Gestione apertura con scroll centrato e focus trap
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function focusTrap(modal){
  const focusable = modal.querySelectorAll('a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  if(!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length -1];
  modal.addEventListener('keydown', e => {
    if(e.key === 'Tab'){
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });
}
modalTriggers.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-open');
    const target = document.getElementById(id);
    if(!target) return;
    lastFocusedEl = btn;
    // Calcola la card associata (antenato .service-card) per centrarla
    const card = btn.closest('.service-card');
    if(card){
      const rect = card.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const centerOffset = absoluteTop - (window.innerHeight/2) + (rect.height/2);
      const scrollBehavior = prefersReduced ? 'auto' : 'smooth';
      // Scroll prima, poi apertura modale (attendiamo evento scroll oppure timeout di fallback)
      let opened = false;
      function openNow(){
        if(opened) return; opened = true;
        closeModals();
        target.classList.add('open');
        backdrop?.classList.add('open');
        lockScroll();
        setTimeout(()=> target.focus(), 40);
        focusTrap(target);
      }
      const prevY = window.scrollY;
      window.scrollTo({ top: centerOffset, behavior: scrollBehavior });
      // Se lo scroll non avviene (già centrato) apri subito
      if(Math.abs(window.scrollY - prevY) < 2){
        openNow();
      } else {
        let timeout = setTimeout(openNow, prefersReduced ? 10 : 420);
        const onScrollEnd = () => {
          clearTimeout(timeout); openNow(); window.removeEventListener('scroll', onScrollEnd, true);
        };
        window.addEventListener('scroll', onScrollEnd, true);
      }
    } else {
      // Fallback se niente card (apri direttamente)
      closeModals();
      target.classList.add('open');
      backdrop?.classList.add('open');
      lockScroll();
      setTimeout(()=> target.focus(), 40);
      focusTrap(target);
    }
  });
});
document.addEventListener('click', e => {
  if(e.target.matches('[data-close]') || e.target === backdrop){
    closeModals();
  }
});
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModals(); });

// EmailJS contact form
// Sostituisci i valori 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', 'YOUR_PUBLIC_KEY' con i tuoi dati personali EmailJS
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = 'Invio in corso...';
    if (typeof emailjs !== 'undefined') {
      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this, 'YOUR_PUBLIC_KEY')
        .then(() => {
          formMessage.textContent = 'Abbiamo ricevuto il tuo messaggio, ti risponderemo al più presto!';
          contactForm.reset();
        })
        .catch(() => {
          formMessage.textContent = 'Errore nell\'invio. Riprova. Ci scusiamo per il disagio.';
        });
    } else {
      formMessage.textContent = 'EmailJS non caricato';
    }
  });
}

// Scroll links (smooth) + close nav - MOBILE ONLY
mobileFS?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const section = document.querySelector(href);
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Chiudi menu
      mobileFS?.classList.remove('open');
      mobileMenuIcon?.classList.remove('open');
      mobileOverlay?.classList.remove('open');
    }
  });
});

// EmailJS SDK loader
(function(){
  if (!window.emailjs) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
    script.onload = function() { emailjs.init('YOUR_PUBLIC_KEY'); };
    document.body.appendChild(script);
  } else { emailjs.init('YOUR_PUBLIC_KEY'); }
})();

// IntersectionObserver reveal for .animated-section and .service-card
const observer = ('IntersectionObserver' in window) ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 }) : null;

document.querySelectorAll('.animated-section, .service-card, .founder-card').forEach(el => {
  el.classList.add('reveal');
  observer?.observe(el);
});

// Subtle parallax on service cards (mouse move)
const cards = document.querySelectorAll('.service-card');
cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // 0 -> width
    const y = e.clientY - rect.top;  // 0 -> height
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 4; // max 4deg
    const rotateY = ((x - centerX) / centerX) * -4;
    card.style.transform = `translateY(-10px) scale(1.035) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Improve keyboard accessibility for cards
cards.forEach(card => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const link = card.querySelector('.service-link');
      link?.click();
    }
  });
});
