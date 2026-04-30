// PAGE INIT
window.addEventListener('load', function() {
  document.getElementById('page').classList.add('visible');
  runHeroEntrance();
});

// CURSOR GLOW
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (!isTouchDevice) {
  const glow = document.getElementById('cursorGlow');
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; glow.classList.add('active'); });
  function tickGlow() {
    gx += (mx - gx) * 0.06; gy += (my - gy) * 0.06;
    glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
    requestAnimationFrame(tickGlow);
  }
  tickGlow();
}

// HEADER
let lastScroll = 0;
const header = document.getElementById('header');
function updateHeader() {
  const y = window.scrollY;
  if (y > lastScroll && y > 200) header.classList.add('hidden');
  else header.classList.remove('hidden');
  lastScroll = y;
}

// MOBILE MENU
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  menuBtn.classList.toggle('active', menuOpen);
  mobileMenu.classList.toggle('open', menuOpen);
  menuBtn.setAttribute('aria-expanded', menuOpen);
  menuBtn.textContent = menuOpen ? 'Close' : 'Menu';
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});
document.querySelectorAll('[data-nav]').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false; menuBtn.classList.remove('active');
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = 'Menu';
    document.body.style.overflow = '';
  });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) menuBtn.click(); });

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop, behavior: 'smooth' }); }
  });
});

// HERO — SVG per-letter stroke animation (from f_2.html)
function runHeroEntrance() {
  const svg = document.getElementById('heroTitleSvg');
  if (!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  const text = 'COMING SOON';
  const vw = window.innerWidth;
  const fontSize = vw <= 360 ? 60 : vw <= 480 ? 72 : vw <= 768 ? 90 : 110;
  const startX = 10;
  const baseY = Math.round(fontSize * 0.95);
  const fontAttrs = {
    'font-family': "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    'font-weight': '800', 'font-size': fontSize, 'letter-spacing': '-5',
  };
  function applyFont(el) { for (const [k, v] of Object.entries(fontAttrs)) el.setAttribute(k, v); }

  const defs = document.createElementNS(ns, 'defs');
  svg.appendChild(defs);

  const measure = document.createElementNS(ns, 'text');
  applyFont(measure);
  measure.setAttribute('x', startX); measure.setAttribute('y', baseY);
  measure.textContent = text; measure.style.visibility = 'hidden';
  svg.appendChild(measure);

  const charX = [];
  for (let i = 0; i < text.length; i++) charX.push(startX + (i > 0 ? measure.getSubStringLength(0, i) : 0));

  const totalWidth = measure.getComputedTextLength();
  svg.setAttribute('viewBox', '0 0 ' + Math.ceil(totalWidth + startX * 2) + ' ' + Math.ceil(baseY + fontSize * 0.25));
  svg.removeChild(measure);

  let animIdx = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ') continue;
    const x = charX[i], clipId = 'hc' + i, d = animIdx * 0.09;

    const cp = document.createElementNS(ns, 'clipPath'); cp.id = clipId;
    const cpT = document.createElementNS(ns, 'text');
    applyFont(cpT); cpT.setAttribute('x', x); cpT.setAttribute('y', baseY);
    cpT.textContent = ch; cp.appendChild(cpT); defs.appendChild(cp);

    const s1 = document.createElementNS(ns, 'text');
    applyFont(s1); s1.setAttribute('x', x); s1.setAttribute('y', baseY);
    s1.setAttribute('clip-path', 'url(#' + clipId + ')');
    s1.textContent = ch; s1.classList.add('hero-stroke-dark');
    s1.style.animationDelay = d + 's'; svg.appendChild(s1);

    const s2 = document.createElementNS(ns, 'text');
    applyFont(s2); s2.setAttribute('x', x); s2.setAttribute('y', baseY);
    s2.setAttribute('clip-path', 'url(#' + clipId + ')');
    s2.textContent = ch; s2.classList.add('hero-stroke-glow');
    s2.style.animationDelay = (d + 0.9) + 's'; svg.appendChild(s2);

    const s3 = document.createElementNS(ns, 'text');
    applyFont(s3); s3.setAttribute('x', x); s3.setAttribute('y', baseY);
    s3.setAttribute('clip-path', 'url(#' + clipId + ')');
    s3.textContent = ch; s3.classList.add('hero-text-fill');
    s3.style.animationDelay = (d + 1.7) + 's'; svg.appendChild(s3);

    animIdx++;
  }

  setTimeout(() => svg.classList.add('go'), 100);

  const heroReveal = document.getElementById('heroImageReveal');
  const heroImg = document.getElementById('heroImage');
  const heroFooter = document.getElementById('heroFooter');
  if (heroReveal && heroImg) {
    setTimeout(() => { heroReveal.style.transition = 'transform 1.4s cubic-bezier(0.77, 0, 0.175, 1)'; heroReveal.style.transform = 'scaleY(0)'; }, 600);
    setTimeout(() => { heroImg.style.transition = 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)'; heroImg.style.transform = 'scale(1)'; }, 800);
    if (heroFooter) setTimeout(() => { heroFooter.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'; heroFooter.style.opacity = '1'; heroFooter.style.transform = 'translateY(0)'; }, 1600);
  }
}

// HERO SVG REPLAY ON SCROLL
(function() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;
  let heroWasOut = false;
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        heroWasOut = true;
      } else if (heroWasOut) {
        heroWasOut = false;
        const svg = document.getElementById('heroTitleSvg');
        if (svg) {
          svg.classList.remove('go');
          while (svg.firstChild) svg.removeChild(svg.firstChild);
          runHeroEntrance();
        }
      }
    });
  }, { threshold: 0.15 });
  heroObserver.observe(heroSection);
})();

// MAGIC TEXT — scroll-progress word opacity (like MagicText React component)
// MAGIC TEXT — scroll-progress word opacity
(function() {
  const storyContainer = document.getElementById('storyText');
  if (!storyContainer) return;

  const paragraphs = Array.from(storyContainer.querySelectorAll('.story-text'));
  if (paragraphs.length === 0) return;

  const allWordEls = [];

  // Loop through each paragraph to create the spans
  paragraphs.forEach(p => {
    const text = p.textContent.trim();
    p.textContent = '';
    const words = text.split(/\s+/);

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'story-word';
      
      const ghost = document.createElement('span');
      ghost.className = 'story-word-ghost';
      ghost.textContent = word;
      span.appendChild(ghost);
      
      const reveal = document.createElement('span');
      reveal.className = 'story-word-reveal';
      reveal.textContent = word;
      span.appendChild(reveal);
      
      p.appendChild(span);
      allWordEls.push(reveal); // Push to master array for continuous scrolling
      
      if (i < words.length - 1) {
        p.appendChild(document.createTextNode(' '));
      }
    });
  });

  function updateMagicText() {
    const rect = storyContainer.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.9;
    const end = vh * 0.25;
    const scrollProgress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    
    // Apply opacity across all words globally
    allWordEls.forEach((el, i) => {
      const wordStart = i / allWordEls.length;
      const wordEnd = wordStart + 1 / allWordEls.length;
      const wordProgress = Math.max(0, Math.min(1, (scrollProgress - wordStart) / (wordEnd - wordStart)));
      el.style.opacity = wordProgress;
    });
  }

  window.__updateMagicText = updateMagicText;
})();



// TOUCH DEVICE — gallery card tap-to-reveal
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.querySelectorAll('.gallery-col').forEach(function(col) {
    col.addEventListener('click', function(e) {
      var wasActive = col.classList.contains('touch-active');
      document.querySelectorAll('.gallery-col.touch-active').forEach(function(c) {
        c.classList.remove('touch-active');
      });
      if (!wasActive) col.classList.add('touch-active');
    });
  });
}

// ===== CACHED DOM REFS (zero queries per scroll frame) =====
const _scrollProgress = document.getElementById('scrollProgress');
const _toTop = document.getElementById('toTop');
const _heroWrap = document.getElementById('heroTitleWrap');
const _heroImg = document.getElementById('heroImage');
const _gallerySec = document.querySelector('.gallery');
const _galleryCols = Array.from(document.querySelectorAll('.gallery-col'));
const _galleryImgs = Array.from(document.querySelectorAll('.gallery-col img'));
const _scrollRevealEls = Array.from(document.querySelectorAll('[data-scroll-reveal]'));
const _footerColEls = Array.from(document.querySelectorAll('.footer-col-reveal'));
const _footerSocialEls = Array.from(document.querySelectorAll('.footer-social-reveal'));

// SCROLL PROGRESS
function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max > 0) _scrollProgress.style.width = ((window.scrollY / max) * 100) + '%';
}

// BACK TO TOP
function updateToTop() { _toTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.4); }

// AOS (one-time reveal — uses IntersectionObserver, no scroll queries)
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('aos-in'); aosObserver.unobserve(entry.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// GALLERY REVEAL — bi-directional
function revealGallery() {
  const vh = window.innerHeight;
  for (let i = 0; i < _galleryCols.length; i++) {
    const item = _galleryCols[i];
    const rect = item.getBoundingClientRect();
    const inView = rect.top < vh * 0.9 && rect.bottom > vh * 0.05;
    if (inView && !item.classList.contains('vis')) {
      item.classList.remove('vis-out-up', 'vis-out-down');
      item.classList.add('vis');
    } else if (!inView && item.classList.contains('vis')) {
      item.classList.remove('vis');
      if (rect.bottom <= vh * 0.05) {
        item.classList.remove('vis-out-down');
        item.classList.add('vis-out-up');
      } else {
        item.classList.remove('vis-out-up');
        item.classList.add('vis-out-down');
      }
    }
  }
}

// PARALLAX + HERO ZOOM (instant zoom on any scroll)
let currentHeroZoom = 1;
let targetHeroZoom = 1;
let isAnimatingZoom = false;

// This handles the buttery smooth easing of the scale
function updateHeroZoom() {
  // Interpolate smoothly towards the target (0.05 is the transition speed)
  currentHeroZoom += (targetHeroZoom - currentHeroZoom) * 0.05;
  
  var y = window.scrollY;
  if (_heroImg) {
    // Apply both the smooth zoom AND the instant parallax
    _heroImg.style.transform = 'scale(' + currentHeroZoom + ') translateY(' + (y * 0.08) + 'px)';
  }
  
  // Keep looping until the zoom finishes
  if (Math.abs(targetHeroZoom - currentHeroZoom) > 0.001) {
    requestAnimationFrame(updateHeroZoom);
  } else {
    isAnimatingZoom = false;
    currentHeroZoom = targetHeroZoom; // Snap to exact final value
  }
}

// PARALLAX + HERO ZOOM (Single smooth zoom transition)
function heroParallax() {
  var y = window.scrollY;
  var vh = window.innerHeight;
  
  if (y < vh * 1.5) {
    if (_heroWrap) _heroWrap.style.transform = 'translateY(' + (y * -0.35) + 'px)';
    
    if (_heroImg) {
      // 1. Kill the initial CSS load animation so it doesn't fight the scroll
      if (y > 10) _heroImg.style.transition = 'none';
      
      // 2. Set the target state: 1.25 if scrolled down, 1 if at the very top
      let newTarget = y > 10 ? 1.25 : 1;
      
      // 3. If the state changes (e.g., they just started scrolling), trigger the smooth zoom
      if (newTarget !== targetHeroZoom) {
        targetHeroZoom = newTarget;
        if (!isAnimatingZoom) {
          isAnimatingZoom = true;
          requestAnimationFrame(updateHeroZoom);
        }
      }
      
      // 4. Always update the parallax instantly on scroll, even if zoom is finished
      if (!isAnimatingZoom) {
         _heroImg.style.transform = 'scale(' + currentHeroZoom + ') translateY(' + (y * 0.08) + 'px)';
      }
    }
  }
}

// GALLERY PARALLAX — cached refs
function galleryParallax() {
  if (!_gallerySec) return;
  const r = _gallerySec.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.top < vh && r.bottom > 0) {
    const progress = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
    for (let i = 0; i < _galleryImgs.length; i++) {
      if (_galleryCols[i].classList.contains('vis')) {
        const offset = (progress - 0.5) * ((i % 2 === 0) ? -15 : 15);
        _galleryImgs[i].style.transform = 'scale(1.05) translateY(' + offset + 'px)';
      }
    }
  }
}

// BI-DIRECTIONAL helper (used for sections, footer cols, footer socials)
function biReveal(els, visCls, outUpCls, outDownCls, enterThresh, exitThresh) {
  const vh = window.innerHeight;
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    const rect = el.getBoundingClientRect();
    const inView = rect.top < vh * enterThresh && rect.bottom > vh * exitThresh;
    if (inView && !el.classList.contains(visCls)) {
      el.classList.remove(outUpCls, outDownCls);
      el.classList.add(visCls);
    } else if (!inView && el.classList.contains(visCls)) {
      el.classList.remove(visCls);
      if (rect.bottom <= vh * exitThresh) {
        el.classList.remove(outDownCls);
        el.classList.add(outUpCls);
      } else {
        el.classList.remove(outUpCls);
        el.classList.add(outDownCls);
      }
    }
  }
}

function revealSections() { biReveal(_scrollRevealEls, 's-vis', 's-out-up', 's-out-down', 0.85, 0.05); }
function revealFooter() {
  biReveal(_footerColEls, 's-vis', 's-out-up', 's-out-down', 0.95, 0.0);
  biReveal(_footerSocialEls, 's-vis', 's-out-up', 's-out-down', 0.95, 0.0);
}

// SCROLL HANDLER
let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress(); updateHeader(); updateToTop();
      heroParallax(); revealGallery(); galleryParallax();
      if (window.__updateMagicText) window.__updateMagicText();
      revealSections(); revealFooter();
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => { ticking = false; onScroll(); });
setTimeout(onScroll, 150);
