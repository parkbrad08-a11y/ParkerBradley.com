// ===== NAV: background always on (work page starts scrolled) =====
const nav = document.getElementById('nav');
const navLogo = document.getElementById('nav-logo');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', y > 40);
  if (navLogo) navLogo.classList.toggle('visible', y > 0 || true); // always visible on work page
}, { passive: true });

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header, .media-item').forEach(el => {
  el.classList.add('fade-in');
  revealObserver.observe(el);
});

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
