/* =========================================================================
   LANDMARK REALTORS — CLIENT ENGINE (app.js)
   ========================================================================= */

'use strict';

// ─── PLACEHOLDER DATA ───────────────────────────────────────────────────────
const PLACEHOLDER_PROPERTIES = [
    {
        id: 'ph-1',
        title: 'The Monarch Corporate Tower',
        description: 'An architectural marvel standing tall on Ferozepur Road. Features double-height glass facades, VRF air conditioning, 100% power redundancy, high-speed elevators — designed for multinational HQs, banking institutions and premium legal firms.',
        price: 45000000,
        price_display: '₹4.5 Cr',
        location: 'Ferozepur Road, Ludhiana',
        type: 'buy',
        category: 'ultra-luxury',
        images: [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=900&auto=format&fit=crop'
        ],
        video_url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
        custom_fields: { 'Carpet Area': '4,200 Sq.Ft', 'Floor Config': 'B+G+5 Floors', 'Parking': '6 Dedicated Cars', 'Power Backup': '100% DG Set' },
        created_at: '2026-07-10T12:00:00Z'
    },
    {
        id: 'ph-2',
        title: 'Aura Luxury Retail Arcade',
        description: 'Located in the elite Sarabha Nagar shopping district. 32-foot frontage, double-height ceiling — ideal for luxury fashion labels, flagship jewellery boutiques or upscale cafes tapping Ludhiana\'s most affluent clientele.',
        price: 150000,
        price_display: '₹1.5 Lakh/month',
        location: 'Sarabha Nagar, Ludhiana',
        type: 'lease',
        category: 'premium',
        images: [
            'https://images.unsplash.com/photo-1555529669-e69e7aa0db9a?q=80&w=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=900&auto=format&fit=crop'
        ],
        video_url: '',
        custom_fields: { 'Super Area': '1,850 Sq.Ft', 'Frontage': '32 Feet', 'Ceiling': '14 Feet', 'Tenure': '9 Year Lease' },
        created_at: '2026-07-08T10:30:00Z'
    },
    {
        id: 'ph-3',
        title: 'Empire Business Chambers',
        description: 'Fully-fitted corporate suite on Pakhowal Road. 20 workstations, 10-seat boardroom with AV, 3 manager cabins, client lounge, server room and pantry. Perfect for IT, finance or expansion branches.',
        price: 75000,
        price_display: '₹75,000/month',
        location: 'Pakhowal Road, Ludhiana',
        type: 'lease',
        category: 'mid-luxury',
        images: [
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=900&auto=format&fit=crop'
        ],
        video_url: '',
        custom_fields: { 'Total Area': '2,100 Sq.Ft', 'Workstations': '20 Units', 'Cabins': '3 Private', 'HVAC': 'VRF Centralised' },
        created_at: '2026-07-05T09:00:00Z'
    },
    {
        id: 'ph-4',
        title: 'Pearl Galleria Showroom',
        description: 'Ground-floor showroom bay with massive street-facing glass frontage on BRS Nagar. High ambient light, lofted ceiling and excellent footfall — perfect for luxury automobile showrooms or premium home furnishings.',
        price: 200000,
        price_display: '₹2 Lakh/month',
        location: 'BRS Nagar, Ludhiana',
        type: 'lease',
        category: 'premium',
        images: [
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=900&auto=format&fit=crop'
        ],
        video_url: '',
        custom_fields: { 'Area': '3,200 Sq.Ft', 'Frontage': '48 Feet', 'Floor': 'Ground Level', 'Location Rank': 'Prime Corner' },
        created_at: '2026-07-03T08:00:00Z'
    },
    {
        id: 'ph-5',
        title: 'Skyline Summit Office Tower',
        description: 'The crown jewel of commercial real estate on Model Town Road. Panoramic city views, intelligent building management system, private terrace, valet parking — for ultra high-net-worth occupiers.',
        price: 120000000,
        price_display: '₹12 Cr',
        location: 'Model Town, Ludhiana',
        type: 'buy',
        category: 'ultra-luxury',
        images: [
            'https://images.unsplash.com/photo-1573164713347-df1e3e49a2e5?q=80&w=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=900&auto=format&fit=crop'
        ],
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        custom_fields: { 'Area': '8,500 Sq.Ft', 'Floors': '3 Full Floors', 'Parking': '18 Cars', 'Terrace': 'Private Rooftop' },
        created_at: '2026-07-01T07:00:00Z'
    },
    {
        id: 'ph-6',
        title: 'Meridian Business Hub',
        description: 'Co-working style premium offices on Link Road — plug-and-play, 150 Mbps fiber, 24/7 security, cafeteria access and a dedicated reception. Ideal for startups, boutique consultancies or regional sales teams.',
        price: 45000,
        price_display: '₹45,000/month',
        location: 'Link Road, Ludhiana',
        type: 'lease',
        category: 'mid-luxury',
        images: [
            'https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=900&auto=format&fit=crop'
        ],
        video_url: '',
        custom_fields: { 'Area': '1,200 Sq.Ft', 'Seats': '20 Fitted', 'Internet': '150 Mbps Fiber', 'Contract': 'Min. 11 Months' },
        created_at: '2026-06-28T11:00:00Z'
    }
];

let propertiesList = [];
let carouselIndex = 0;

// ─── BOOT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

    // Header scroll effect
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

    // Mobile nav toggle
    const hardRefreshBtn = document.getElementById('hard-refresh');
    if (hardRefreshBtn) {
        hardRefreshBtn.addEventListener('click', () => {
            // Perform a hard reload (bypass cache)
            window.location.reload(true);
        });
    }
        const menuToggle = document.getElementById('menu-toggle');
        const headerNav = document.getElementById('header-nav');
        if (menuToggle && headerNav) {
            menuToggle.addEventListener('click', () => {
                headerNav.classList.toggle('open');
            });
            // Close on link click
            headerNav.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => headerNav.classList.remove('open'));
            });
        }

    // Route
    const path = window.location.pathname;
    if (path.includes('properties.html'))      { await initPropertiesPage(); }
    else if (path.includes('property-details')){ await initPropertyDetailsPage(); }
    else                                        { await initHomePage(); }
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getYouTubeId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|v\/|watch\?v=|&v=)([^#&?]{11})/);
    return m ? m[1] : null;
}

function getEmbedUrl(url) {
    if (!url) return null;
    const ytId = getYouTubeId(url);
    if (ytId) return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
    return url; // treat as direct video
}

function getCategoryLabel(cat) {
    const map = { 'ultra-luxury': 'Ultra Luxury', 'premium': 'Premium', 'mid-luxury': 'Mid Luxury' };
    return map[cat] || cat;
}

function getSizeFromCustomFields(fields) {
    if (!fields) return null;
    for (const [k, v] of Object.entries(fields)) {
        if (/area|size|space/i.test(k)) return v;
    }
    return null;
}

// ─── CARD TEMPLATE (new clean design) ────────────────────────────────────────
function buildPropertyCard(prop, forCarousel = false) {
    const images  = (prop.images && prop.images.length) ? prop.images : ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900'];
    const cover   = images[0];
    const hasVid  = !!prop.video_url;
    const hasMore = images.length > 1;
    const size    = getSizeFromCustomFields(prop.custom_fields);
    const detUrl  = `property-details.html?id=${prop.id}`;
    const ytId    = getYouTubeId(prop.video_url);
    const embedUrl = getEmbedUrl(prop.video_url);

    // Dot indicators
    const dots = images.map((_, i) => `<span class="prop-dot${i===0?' active':''}"></span>`).join('');

    // First two custom field pairs for specs row
    let specsHTML = '';
    if (prop.custom_fields) {
        const entries = Object.entries(prop.custom_fields).slice(0, 2);
        specsHTML = entries.map(([k, v]) => `
            <div class="prop-spec">
                <span class="prop-spec-label">${k}</span>
                <span class="prop-spec-value">${v}</span>
            </div>`).join('');
    }

    return `
    <article class="prop-card" id="card-${prop.id}" data-id="${prop.id}">
        <div class="prop-card-media">
            <img src="${cover}" alt="${prop.title}" loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900'">
            <span class="prop-badge ${prop.type}">${prop.type === 'buy' ? 'For Sale' : 'For Lease'}</span>
            <span class="prop-price-badge">${prop.price_display}</span>
            ${hasVid ? `<button class="prop-video-indicator js-play-video" data-embed="${embedUrl}" aria-label="Play video"><i class="fa-solid fa-play"></i></button>` : ''}
            ${hasMore ? `<div class="prop-dots">${dots}</div>` : ''}
        </div>
        <div class="prop-card-body">
            <div class="prop-location"><i class="fa-solid fa-location-dot"></i>${prop.location}</div>
            <h3 class="prop-title">${prop.title}</h3>
            <p class="prop-desc">${prop.description}</p>
            ${specsHTML ? `<div class="prop-specs">${specsHTML}
                <div class="prop-spec">
                    <span class="prop-spec-label">Category</span>
                    <span class="prop-spec-value">${getCategoryLabel(prop.category)}</span>
                </div>
            </div>` : ''}
            <div class="prop-card-footer">
                <a href="${detUrl}" class="btn-gold">View Details</a>
                <a href="https://wa.me/916284046330?text=Hi, I'm interested in: ${encodeURIComponent(prop.title)}"
                   target="_blank" class="btn-outline" aria-label="WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
            </div>
        </div>
    </article>`;
}

// ─── VIDEO MODAL ──────────────────────────────────────────────────────────────
function initVideoModal() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.js-play-video');
        if (!btn) return;
        const embed = btn.dataset.embed;
        if (!embed) return;

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

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────
async function initHomePage() {
    initVideoModal();
    await loadFeaturedCarousel();
    initCollabForm();
}

async function loadFeaturedCarousel() {
    const container = document.getElementById('featured-properties-container');
    if (!container) return;

    let data = [];
    if (window.supabaseClient) {
        try {
            const res = await window.supabaseClient
                .from('properties').select('*')
                .order('created_at', { ascending: false }).limit(9);
            if (res.data && res.data.length) data = res.data;
        } catch (_) {}
    }
    if (!data.length) data = PLACEHOLDER_PROPERTIES;

    propertiesList = data;
    container.innerHTML = data.map(p => buildPropertyCard(p, true)).join('');

    // GSAP entrance for carousel cards
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(container.querySelectorAll('.prop-card'),
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
        );
    }

    initCarouselControls(container);
}

function initCarouselControls(container) {
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (!prevBtn || !nextBtn) return;

    const cards = container.querySelectorAll('.prop-card');
    const total = cards.length;
    let idx = 0;
    let autoSlide = null;

    function slide(dir) {
        idx = (idx + dir + total) % total;
        const cardW = cards[0].offsetWidth + 32; // gap (approx 2rem)
        const offset = idx * cardW;
        container.style.transform = `translateX(-${offset}px)`;
    }

    function startAutoSlide() {
        // Auto‑slide every 5 seconds
        autoSlide = setInterval(() => slide(1), 5000);
    }
    function stopAutoSlide() { if (autoSlide) clearInterval(autoSlide); }

    nextBtn.addEventListener('click', () => slide(1));
    prevBtn.addEventListener('click', () => slide(-1));

    // Pause auto‑slide on hover, resume on leave
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    // Initialise auto‑slide
    startAutoSlide();
}

// ─── PROPERTIES PAGE ──────────────────────────────────────────────────────────
async function initPropertiesPage() {
    initVideoModal();

    let data = [];
    if (window.supabaseClient) {
        try {
            const res = await window.supabaseClient
                .from('properties').select('*')
                .order('created_at', { ascending: false });
            if (res.data && res.data.length) data = res.data;
        } catch (_) {}
    }
    if (!data.length) data = PLACEHOLDER_PROPERTIES;

    propertiesList = data;

    // Apply URL filters on load
    const params = new URLSearchParams(window.location.search);
    const typeParam     = params.get('type');
    const locationParam = params.get('location');
    const categoryParam = params.get('category');

    if (typeParam)     { const el = document.getElementById('filter-type');     if (el) el.value = typeParam; }
    if (locationParam) { const el = document.getElementById('filter-location'); if (el) el.value = locationParam; }

    renderGrid(filterProperties());

    // Attach filter listeners
    ['filter-search','filter-type','filter-location','filter-sort'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => renderGrid(filterProperties()));
    });

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            ['filter-search','filter-type','filter-location','filter-sort'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = el.tagName === 'SELECT' ? el.options[0].value : '';
            });
            renderGrid(filterProperties());
        });
    }
}

function filterProperties() {
    const search   = (document.getElementById('filter-search')?.value || '').toLowerCase();
    const type     = document.getElementById('filter-type')?.value || 'all';
    const location = document.getElementById('filter-location')?.value || 'all';
    const sort     = document.getElementById('filter-sort')?.value || 'newest';

    let list = [...propertiesList];

    if (search)       list = list.filter(p => p.title.toLowerCase().includes(search) || p.location.toLowerCase().includes(search));
    if (type !== 'all')     list = list.filter(p => p.type === type);
    if (location !== 'all') list = list.filter(p => p.location.includes(location));

    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'newest')     list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return list;
}

function renderGrid(list) {
    const grid    = document.getElementById('properties-grid');
    const noMsg   = document.getElementById('no-results-msg');
    const countEl = document.getElementById('results-count');

    if (!grid) return;

    if (!list.length) {
        grid.innerHTML = '';
        if (noMsg) noMsg.style.display = 'block';
        if (countEl) countEl.textContent = '';
        return;
    }
    if (noMsg) noMsg.style.display = 'none';
    if (countEl) countEl.textContent = `Showing ${list.length} propert${list.length === 1 ? 'y' : 'ies'}`;

    grid.innerHTML = list.map(p => buildPropertyCard(p)).join('');

    // GSAP stagger in
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(grid.querySelectorAll('.prop-card'),
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
        );
    }
}

// ─── COLLAB FORM ──────────────────────────────────────────────────────────────
function initCollabForm() {
    const form = document.getElementById('collab-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn    = document.getElementById('btn-collab-submit');
        const status = document.getElementById('collab-form-status');
        const orig   = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
        btn.disabled  = true;

        const payload = {
            name:    document.getElementById('collab-name')?.value,
            phone:   document.getElementById('collab-phone')?.value,
            email:   document.getElementById('collab-email')?.value,
            type:    document.getElementById('collab-type')?.value,
            message: document.getElementById('collab-message')?.value,
        };

        try {
            if (window.supabaseClient) {
                await window.supabaseClient.from('inquiries').insert([payload]);
            }
            status.style.color = '#6ee7b7';
            status.textContent = '✓ Inquiry sent! We\'ll contact you within 24 hours.';
            form.reset();
        } catch (err) {
            status.style.color = '#f87171';
            status.textContent = 'Failed to submit. Please WhatsApp us directly.';
        }

        btn.innerHTML = orig;
        btn.disabled  = false;
        setTimeout(() => { status.textContent = ''; }, 6000);
    });
}

// ─── PROPERTY DETAILS PAGE ────────────────────────────────────────────────────
async function initPropertyDetailsPage() {
    const params = new URLSearchParams(window.location.search);
    const propId = params.get('id');

    let prop = null;

    if (window.supabaseClient && propId && !propId.startsWith('ph-')) {
        try {
            const res = await window.supabaseClient.from('properties').select('*').eq('id', propId).single();
            if (res.data) prop = res.data;
        } catch (_) {}
    }

    if (!prop) prop = PLACEHOLDER_PROPERTIES.find(p => p.id === propId) || PLACEHOLDER_PROPERTIES[0];

    renderDetailPage(prop);
}

function renderDetailPage(prop) {
    document.title = `${prop.title} | Landmark Realtors`;
    const container = document.getElementById('detail-root');
    if (!container) return;

    const images = (prop.images && prop.images.length) ? prop.images : ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900'];
    const ytId   = getYouTubeId(prop.video_url);
    const embedUrl = getEmbedUrl(prop.video_url);

    const thumbs = images.map((img, i) => `<img class="detail-thumb${i===0?' active':''}" src="${img}" alt="Image ${i+1}" data-index="${i}">`).join('');

    const specsHTML = prop.custom_fields
        ? Object.entries(prop.custom_fields).map(([k, v]) => `
            <div class="detail-spec-item">
                <label>${k}</label>
                <strong>${v}</strong>
            </div>`).join('')
        : '';

    container.innerHTML = `
    <div class="detail-hero section-padding">
        <div class="detail-media reveal-left">
            <img id="detail-main-img" class="detail-main-img" src="${images[0]}" alt="${prop.title}"
                 onerror="this.src='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900'">
            <div class="detail-thumbs">${thumbs}</div>
            ${embedUrl ? `
            <div class="video-embed" style="margin-top:2rem;">
                <iframe src="${ytId ? `https://www.youtube-nocookie.com/embed/${ytId}?rel=0` : embedUrl}"
                    title="${prop.title} — Video Tour" allowfullscreen loading="lazy"></iframe>
            </div>` : ''}
        </div>
        <div class="detail-sidebar glass-panel reveal-right" style="padding:2rem;">
            <span class="prop-badge ${prop.type}" style="display:inline-block;margin-bottom:1rem;">${prop.type === 'buy' ? 'For Sale' : 'For Lease'}</span>
            <h1 style="font-size:1.9rem;margin-bottom:0.5rem;">${prop.title}</h1>
            <p style="color:var(--color-gold-muted);font-size:0.8rem;margin-bottom:1rem;"><i class="fa-solid fa-location-dot"></i> ${prop.location}</p>
            <div class="detail-price">${prop.price_display}</div>
            <span class="category-badge ${prop.category}" style="display:inline-block;margin-bottom:1.5rem;">${getCategoryLabel(prop.category)}</span>

            <h4 style="font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-gold-muted);margin-bottom:1rem;">Property Specs</h4>
            <div class="detail-specs-grid">${specsHTML}</div>

            <h4 style="font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-gold-muted);margin:1.5rem 0 0.8rem;">Description</h4>
            <p style="font-size:0.88rem;line-height:1.8;">${prop.description}</p>

            <div style="display:flex;flex-direction:column;gap:0.8rem;margin-top:2rem;">
                <a href="https://wa.me/916284046330?text=Hi, I'm interested in: ${encodeURIComponent(prop.title + ' — ' + prop.location)}"
                   target="_blank" class="btn-gold" style="justify-content:center;gap:0.6rem;">
                   <i class="fa-brands fa-whatsapp"></i> WhatsApp Agent
                </a>
                <a href="tel:+916284046330" class="btn-outline" style="justify-content:center;">
                    <i class="fa-solid fa-phone"></i> Call Now
                </a>
            </div>
        </div>
    </div>`;

    // Thumbnail gallery switcher
    container.querySelectorAll('.detail-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const mainImg = document.getElementById('detail-main-img');
            if (mainImg) mainImg.src = thumb.src;
            container.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // GSAP
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('.reveal-left', { opacity:0, x:-50 }, { opacity:1, x:0, duration:1, ease:'power3.out', delay:0.3 });
        gsap.fromTo('.reveal-right', { opacity:0, x:50 }, { opacity:1, x:0, duration:1, ease:'power3.out', delay:0.5 });
    }
}
