// ===== NAV: Logo fade-in on scroll past 80vh, background on scroll =====
const nav = document.getElementById('nav');
const navLogo = document.getElementById('nav-logo');
const heroThreshold = window.innerHeight * 0.8;

function onScroll() {
  const y = window.scrollY;

  // Logo visibility
  if (navLogo) {
    navLogo.classList.toggle('visible', y > heroThreshold);
  }

  // Nav background
  if (nav) {
    nav.classList.toggle('scrolled', y > 40);
  }

  // Active nav link
  const sections = document.querySelectorAll('.section, .hero');
  const links = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (y >= top) {
      current = sec.id;
    }
  });

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== HERO ANIMATIONS =====
window.addEventListener('DOMContentLoaded', () => {
  const heroName = document.querySelector('.hero-name');
  const accentLine = document.querySelector('.hero-accent-line');

  // Stagger hero entrance
  requestAnimationFrame(() => {
    if (heroName) heroName.classList.add('visible');
    if (accentLine) accentLine.classList.add('visible');
  });
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-header, .project-featured, .project-row, .about-layout, .contact-layout, .hero-tagline, .availability-badge').forEach(el => {
  el.classList.add('fade-in');
  revealObserver.observe(el);
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    const original = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
      });

      if (res.ok) {
        btn.textContent = 'Sent!';
        btn.style.borderColor = 'var(--teal)';
        btn.style.color = 'var(--teal)';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.style.borderColor = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Error — try again';
      btn.style.borderColor = '#ff453a';
      btn.style.color = '#ff453a';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = original;
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 3000);
    }
  });
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxClose = document.getElementById('lightbox-close');
let lightboxVideo = null;

function openLightbox(src, type) {
  lightboxContent.innerHTML = '';
  if (type === 'video') {
    lightboxVideo = document.createElement('video');
    lightboxVideo.src = src;
    lightboxVideo.controls = true;
    lightboxVideo.autoplay = true;
    lightboxVideo.playsInline = true;
    lightboxVideo.style.outline = 'none';
    lightboxContent.appendChild(lightboxVideo);
    lightboxVideo.play().catch(() => {});
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    lightboxContent.appendChild(img);
    lightboxVideo = null;
  }
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  if (lightboxVideo) {
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxVideo = null;
  }
  lightboxContent.innerHTML = '';
}

document.querySelectorAll('.media-item').forEach(item => {
  item.addEventListener('click', () => {
    openLightbox(item.dataset.src, item.dataset.type);
  });
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

// ===== VIDEO AUTOPLAY (muted, play on scroll into view) =====
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('video').forEach(v => {
  v.muted = true;
  v.removeAttribute('controls');
  videoObserver.observe(v);
});
