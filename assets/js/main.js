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

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

// ===== CAROUSEL =====
const track = document.getElementById('carousel-track');
const dotsContainer = document.getElementById('carousel-dots');

if (track && dotsContainer) {
  const origItems = Array.from(track.querySelectorAll('.carousel-item'));
  const total = origItems.length;
  let currentIndex = 0;
  let autoAdvanceTimer = null;
  let isDragging = false;
  let dragStartX = 0;
  let dragScrollLeft = 0;
  let isRepositioning = false;

  // Clone all items for infinite loop: prepend copies of all items (in order)
  // and append copies of all items (in order)
  for (let i = total - 1; i >= 0; i--) {
    const clone = origItems[i].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.insertBefore(clone, track.firstChild);
  }
  for (let i = 0; i < total; i++) {
    const clone = origItems[i].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  const offset = total; // number of clones prepended

  function allItems() {
    return Array.from(track.querySelectorAll('.carousel-item'));
  }

  // Center a given item in the track using scrollLeft only (no page scroll)
  function centerOn(item, smooth) {
    const left = item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2;
    if (smooth) {
      track.style.scrollBehavior = 'smooth';
      track.scrollLeft = left;
      // Reset after transition
      setTimeout(() => { track.style.scrollBehavior = ''; }, 500);
    } else {
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = left;
      track.style.scrollBehavior = '';
    }
  }

  function goTo(realIndex, smooth = true) {
    currentIndex = ((realIndex % total) + total) % total;
    centerOn(allItems()[offset + currentIndex], smooth);
    updateDots(currentIndex);
    if (smooth) resetAutoAdvance();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  // Generate dots
  origItems.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots(index) {
    Array.from(dotsContainer.querySelectorAll('.carousel-dot'))
      .forEach((d, i) => d.classList.toggle('active', i === index));
  }

  // Scroll-end: detect position and silently reposition if in clone territory
  let scrollTimer = null;
  track.addEventListener('scroll', () => {
    if (isRepositioning) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const items = allItems();
      const scrollCenter = track.scrollLeft + track.clientWidth / 2;
      let closestIdx = 0, minDist = Infinity;
      items.forEach((item, i) => {
        const dist = Math.abs((item.offsetLeft + item.offsetWidth / 2) - scrollCenter);
        if (dist < minDist) { minDist = dist; closestIdx = i; }
      });

      if (closestIdx < offset) {
        // In prepended clones — silently jump to real equivalent
        isRepositioning = true;
        centerOn(items[offset + closestIdx], false);
        currentIndex = closestIdx;
        updateDots(currentIndex);
        requestAnimationFrame(() => { isRepositioning = false; });
      } else if (closestIdx >= offset + total) {
        // In appended clones — silently jump to real equivalent
        const realIdx = closestIdx - offset - total;
        isRepositioning = true;
        centerOn(items[offset + realIdx], false);
        currentIndex = realIdx;
        updateDots(currentIndex);
        requestAnimationFrame(() => { isRepositioning = false; });
      } else {
        currentIndex = closestIdx - offset;
        updateDots(currentIndex);
      }
    }, 80);
  }, { passive: true });

  // Drag-to-scroll
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.pageX - track.offsetLeft;
    dragScrollLeft = track.scrollLeft;
    clearInterval(autoAdvanceTimer);
    track.style.userSelect = 'none';
  });
  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    track.scrollLeft = dragScrollLeft - (e.pageX - track.offsetLeft - dragStartX);
  });
  ['mouseup', 'mouseleave'].forEach(evt => track.addEventListener(evt, () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.userSelect = '';
    resetAutoAdvance();
  }));

  track.addEventListener('mouseenter', () => clearInterval(autoAdvanceTimer));
  track.addEventListener('mouseleave', () => { if (!isDragging) startAutoAdvance(); });

  const prevBtn = document.querySelector('.carousel-btn--prev');
  const nextBtn = document.querySelector('.carousel-btn--next');
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // Click-to-lightbox on original items only
  origItems.forEach(item => {
    item.addEventListener('click', () => {
      if (isDragging) return;
      openLightbox(item.dataset.src, item.dataset.type);
    });
  });

  function startAutoAdvance() {
    autoAdvanceTimer = setInterval(next, 4000);
  }
  function resetAutoAdvance() {
    clearInterval(autoAdvanceTimer);
    startAutoAdvance();
  }

  // Initialize centered on first real item
  requestAnimationFrame(() => {
    centerOn(allItems()[offset], false);
    startAutoAdvance();
  });
}

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
