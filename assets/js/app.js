/* =========================================================================
   LANDMARK REALTORS — CLIENT ENGINE (app.js)
   ========================================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Global loading progress bar listeners
    window.addEventListener('beforeunload', showLoadingBar);
    document.querySelectorAll('form').forEach(f => {
        if (f.id !== 'collab-form' && f.id !== 'inquiry-form') {
            f.addEventListener('submit', showLoadingBar);
        }
    });

    // 1. Header scroll effect
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            const isHome = window.location.pathname.endsWith('index.html') ||
                           window.location.pathname.endsWith('/') ||
                           window.location.pathname.endsWith('data/');
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else if (isHome) {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile nav toggle (with hamburger icon animation)
    const menuToggle = document.getElementById('menu-toggle');
    const headerNav = document.getElementById('header-nav');
    if (menuToggle && headerNav) {
        menuToggle.addEventListener('click', () => {
            headerNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
        });
        // Close on link click
        headerNav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                headerNav.classList.remove('open');
                menuToggle.classList.remove('open');
            });
        });
    }

    // 3. Video Modal Trigger
    initVideoModal();

    // 4. Homepage Carousel Slider (for desktop controls)
    const carouselContainer = document.getElementById('featured-properties-container');
    if (carouselContainer) {
        initCarouselControls(carouselContainer);
    }
});

// ─── VIDEO MODAL ──────────────────────────────────────────────────────────────
function initVideoModal() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.js-play-video');
        if (!btn) return;
        
        let embed = btn.dataset.embed;
        if (!embed) return;
        
        // Convert watch URLs to embed format if needed
        if (embed.includes('youtube.com/watch?v=')) {
            const ytId = embed.split('v=')[-1].split('&')[0];
            embed = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
        }

        const modal     = document.getElementById('video-modal');
        const container = document.getElementById('modal-video-container');
        if (!modal || !container) return;

        container.innerHTML = `<iframe src="${embed}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        modal.classList.add('open');
    });

    const closeBtn = document.getElementById('modal-close-btn');
    const modal    = document.getElementById('video-modal');
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    function closeModal() {
        const modal     = document.getElementById('video-modal');
        const container = document.getElementById('modal-video-container');
        if (modal) modal.classList.remove('open');
        if (container) container.innerHTML = '';
    }
}

// ─── CAROUSEL SLIDER CONTROLS ──────────────────────────────────────────────────
function initCarouselControls(container) {
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (!prevBtn || !nextBtn) return;

    const cards = container.querySelectorAll('.prop-card');
    if (!cards.length) return;
    
    const total = cards.length;
    let idx = 0;
    let autoSlide = null;

    function slide(dir) {
        // Only run carousel logic on desktop views
        if (window.innerWidth <= 768) return;

        idx = (idx + dir + total) % total;
        // Calculate offset based on active card width + gap (gap is 2rem = 32px)
        const cardW = cards[0].offsetWidth + 32;
        const offset = idx * cardW;
        container.style.transform = `translateX(-${offset}px)`;
    }

    function startAutoSlide() {
        if (window.innerWidth <= 768) return;
        autoSlide = setInterval(() => slide(1), 5000);
    }
    function stopAutoSlide() { if (autoSlide) clearInterval(autoSlide); }

    nextBtn.addEventListener('click', () => slide(1));
    prevBtn.addEventListener('click', () => slide(-1));

    // Pause on hover
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
    
    // GSAP stagger animations for server-rendered cards
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(cards,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
        );
    }
}

// ─── GLOBAL LOADING BAR ───────────────────────────────────────────────────────
function showLoadingBar() {
    let bar = document.getElementById('global-loading-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'global-loading-bar';
        bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(to right, #e8cc87, #c5a880);z-index:99999;width:0%;transition:width 0.4s ease, opacity 0.4s ease;opacity:0;';
        document.body.appendChild(bar);
        
        // Force reflow
        bar.offsetWidth;
    }
    bar.style.opacity = '1';
    bar.style.width = '35%';
    
    setTimeout(() => { bar.style.width = '65%'; }, 150);
    setTimeout(() => { bar.style.width = '85%'; }, 500);
    setTimeout(() => { bar.style.width = '95%'; }, 1200);
}
window.showLoadingBar = showLoadingBar;
