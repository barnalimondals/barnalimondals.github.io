/* ============================================================
   BARNALI MONDAL — Global JavaScript
   ============================================================ */

// --- Nav scroll effect ---
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile-menu');

// --- Hero parallax/tilt effect ---
const hero = document.querySelector('.hero');
const heroPhoto = document.querySelector('.hero__photo');

if (hero && heroPhoto) {
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Calculate rotation (-5 to 5 degrees)
    const rotateX = ((clientY / innerHeight) - 0.5) * -10;
    const rotateY = ((clientX / innerWidth) - 0.5) * 10;

    heroPhoto.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  hero.addEventListener('mouseleave', () => {
    heroPhoto.style.transform = `rotateX(0) rotateY(0) scale(1)`;
  });
}

// --- Nav scroll effect ---
if (nav) {
  const heroScroll = document.querySelector('.hero__scroll');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    nav.classList.toggle('nav--scrolled', scrolled);
    if (heroScroll) {
      heroScroll.classList.toggle('is-hidden', window.scrollY > 100);
    }
  }, { passive: true });
}

// --- Hamburger menu ---
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Scroll reveal ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observeReveal(root = document) {
  root.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

observeReveal();

// --- Active nav link (for single-page sections) ---
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
setActiveNavLink();

// --- Sidebar active link (research page) ---
function initSidebarNav() {
  const sidebarLinks = document.querySelectorAll('.research-sidebar__nav a');
  if (!sidebarLinks.length) return;

  const sections = Array.from(sidebarLinks).map(link => {
    const id = link.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.research-sidebar__nav a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
}
initSidebarNav();

// ============================================================
// DYNAMIC CONTENT LOADER
// ============================================================

/**
 * Fetch a JSON config file and render content into the page.
 * @param {string} configPath - Path to the JSON file (e.g. 'data/museum.json')
 * @param {string} containerId - ID of the DOM element to render into
 * @param {Function} renderFn - Function(data) that returns an HTML string
 */
async function loadDynamicContent(configPath, containerId, renderFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="loading-state">Loading…</div>';

  try {
    const res = await fetch(configPath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    container.innerHTML = renderFn(data);
    // Re-observe any .reveal elements injected by the renderer
    observeReveal(container);
  } catch (err) {
    console.warn('Could not load content:', configPath, err);
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__title">Nothing here yet.</p>
        <p class="empty-state__desc">Check back soon.</p>
      </div>`;
  }
}

// ============================================================
// MUSEUM RENDERER
// ============================================================

function renderMuseum(data) {
  if (!data.items || data.items.length === 0) {
    return `<div class="empty-state">
      <p class="empty-state__title">The studio is quiet for now.</p>
      <p class="empty-state__desc">Works coming soon.</p>
    </div>`;
  }

  return data.items.map(item => `
    <div class="gallery-item reveal">
      ${item.image
      ? `<img src="${item.image}" alt="${item.title}" loading="lazy">`
      : `<div class="gallery-placeholder" style="height:${item.placeholderHeight || 280}px">${item.title}</div>`
    }
      <div class="gallery-item__caption">
        <div class="gallery-item__title">${item.title}</div>
        <div class="gallery-item__meta">${item.medium || ''}${item.year ? ' · ' + item.year : ''}</div>
      </div>
    </div>
  `).join('');
}

// ============================================================
// TRAVEL RENDERER
// ============================================================

function renderTravel(data) {
  if (!data.items || data.items.length === 0) {
    return `<div class="empty-state">
      <p class="empty-state__title">No journeys logged yet.</p>
      <p class="empty-state__desc">The road awaits.</p>
    </div>`;
  }

  return data.items.map(item => `
    <div class="travel-entry reveal">
      <div class="travel-entry__photo">
        ${item.coverImage
      ? `<img src="${item.coverImage}" alt="${item.title}" loading="lazy">`
      : `<div style="width:100%;height:100%;background:var(--stone-100);display:flex;align-items:center;justify-content:center;color:var(--stone-300);font-family:var(--font-serif);font-style:italic;font-size:1rem;">${item.location || 'Somewhere'}</div>`
    }
      </div>
      <div class="travel-entry__content">
        <div class="travel-entry__location">${item.location || ''}</div>
        <h2 class="travel-entry__title">${item.title}</h2>
        <div class="travel-entry__date">${item.date || ''}</div>
        <p class="travel-entry__excerpt">${item.excerpt || ''}</p>
      </div>
    </div>
  `).join('');
}

// ============================================================
// SNAPSHOTS RENDERER
// ============================================================

function renderSnapshots(data) {
  if (!data.items || data.items.length === 0) {
    return `<div class="empty-state">
      <p class="empty-state__title">No moments captured yet.</p>
    </div>`;
  }

  return data.items.map(item => `
    <div class="snapshot-item reveal">
      ${item.image
      ? `<img src="${item.image}" alt="${item.caption || ''}" loading="lazy">`
      : `<div style="width:100%;height:100%;background:var(--stone-100);"></div>`
    }
      <div class="snapshot-item__overlay">
        <span class="snapshot-item__caption">${item.caption || ''}</span>
      </div>
    </div>
  `).join('');
}

// ============================================================
// WRITINGS RENDERER
// ============================================================

function renderWritings(data) {
  if (!data.items || data.items.length === 0) {
    return `<div class="empty-state">
      <p class="empty-state__title">No essays yet.</p>
      <p class="empty-state__desc">Thoughts are brewing.</p>
    </div>`;
  }

  return data.items.map(item => `
    <div class="writing-item reveal">
      ${item.tags && item.tags.length ? `
        <div class="writing-item__tags">
          ${item.tags.map(t => `<span class="writing-item__tag">${t}</span>`).join('')}
        </div>` : ''}
      <h2 class="writing-item__title">${item.title}</h2>
      <div class="writing-item__date">${item.date || ''}</div>
      <p class="writing-item__excerpt">${item.excerpt || ''}</p>
    </div>
  `).join('');
}

// ============================================================
// PAGE-SPECIFIC INIT
// ============================================================

const page = window.location.pathname.split('/').pop() || 'index.html';

if (page === 'the-studio.html') {
  loadDynamicContent('data/museum.json', 'museum-container', renderMuseum);
}
if (page === 'the-road.html') {
  loadDynamicContent('data/travel.json', 'travel-container', renderTravel);
}
if (page === 'moments.html') {
  loadDynamicContent('data/snapshots.json', 'snapshots-container', renderSnapshots);
}
if (page === 'writings.html') {
  loadDynamicContent('data/writings.json', 'writings-container', renderWritings);
}