/**
 * LANDMARK REALTORS — HERO ANIMATION ENGINE
 * Three.js: Floating golden particle field + wireframe skyline
 * GSAP: SVG city skyline draw-on animation
 */

(function () {
    'use strict';

    // ─────────────────────────────────────────────
    // THREE.JS INIT
    // ─────────────────────────────────────────────
    let scene, camera, renderer, particleSystem, wireGroup;
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    let animationId;

    function initThree() {
        const container = document.getElementById('hero-canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x07090e, 0.008);

        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(0, 20, 180);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // ── 1. Glowing gold particle field ──
        const pGeo = new THREE.BufferGeometry();
        const pCount = 400;
        const pos = new Float32Array(pCount * 3);
        const sizes = new Float32Array(pCount);

        for (let i = 0; i < pCount; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 500;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 300;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 400;
            sizes[i] = Math.random() * 2.5 + 0.5;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const pMat = new THREE.PointsMaterial({
            color: 0xc5a880,
            size: 1.2,
            transparent: true,
            opacity: 0.55,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        particleSystem = new THREE.Points(pGeo, pMat);
        scene.add(particleSystem);

        // ── 2. Wireframe building skyline ──
        wireGroup = new THREE.Group();
        const goldMat = new THREE.MeshBasicMaterial({
            color: 0xc5a880, wireframe: true,
            transparent: true, opacity: 0.09,
        });

        const buildings = [
            // [w, h, d, x, z]
            [14, 90, 14, -120, -20],
            [10, 65, 10, -95, 10],
            [18, 120, 16, -60, -30],
            [12, 80, 12, -35, 5],
            [22, 150, 20, 0, -40],   // hero center tower
            [14, 110, 12, 30, -10],
            [10, 70, 10, 58, 8],
            [16, 95, 14, 85, -25],
            [12, 60, 10, 112, 12],
            [18, 130, 16, 140, -35],
            // background layer
            [8, 50, 8, -145, -80],
            [10, 75, 10, -100, -80],
            [12, 55, 10, -50, -80],
            [8, 45, 8, 0, -80],
            [10, 68, 8, 55, -80],
            [12, 80, 10, 110, -80],
            [8, 40, 8, 155, -80],
        ];

        buildings.forEach(([w, h, d, x, z]) => {
            const geo = new THREE.BoxGeometry(w, h, d);
            const mesh = new THREE.Mesh(geo, goldMat);
            mesh.position.set(x, h / 2 - 60, z);
            wireGroup.add(mesh);
        });

        scene.add(wireGroup);

        // Mouse parallax
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
            mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
        });

        window.addEventListener('resize', onResize);
        animate();
    }

    function animate() {
        animationId = requestAnimationFrame(animate);

        // Smooth parallax
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        if (particleSystem) {
            particleSystem.rotation.y += 0.0003;
            particleSystem.rotation.x += 0.0001;
        }
        if (wireGroup) {
            wireGroup.rotation.y = targetX * 0.18;
            wireGroup.position.y = targetY * -8;
        }
        if (camera) {
            camera.position.x += (targetX * 20 - camera.position.x) * 0.04;
        }

        renderer.render(scene, camera);
    }

    function onResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // ─────────────────────────────────────────────
    // SVG SKYLINE ANIMATION (GSAP DrawSVG / strokeDashoffset)
    // ─────────────────────────────────────────────
    function animateSVGSkyline() {
        const svg = document.getElementById('hero-skyline');
        if (!svg || typeof gsap === 'undefined') return;

        const paths = svg.querySelectorAll('.sky-path');
        const windows = svg.querySelectorAll('.sky-window');

        // Set initial state
        paths.forEach(p => {
            const len = p.getTotalLength ? p.getTotalLength() : 1000;
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        });
        gsap.set(windows, { opacity: 0, scale: 0, transformOrigin: 'center' });

        // Animate buildings drawing in
        gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 2.4,
            ease: 'power2.inOut',
            stagger: 0.12,
            delay: 0.5,
        });

        // Window lights flickering on
        gsap.to(windows, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: { each: 0.05, from: 'random' },
            delay: 2.2,
            ease: 'power1.out',
        });

        // Subtle pulse on windows
        gsap.to(windows, {
            opacity: 0.4,
            duration: 2,
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.3, from: 'random' },
            delay: 3,
            ease: 'sine.inOut',
        });
    }

    // ─────────────────────────────────────────────
    // GSAP SCROLL ANIMATIONS
    // ─────────────────────────────────────────────
    function initGSAP() {
        if (typeof gsap === 'undefined') return;

        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Reveal elements on scroll
            gsap.utils.toArray('.reveal').forEach(el => {
                gsap.fromTo(el, { opacity: 0, y: 50 }, {
                    opacity: 1, y: 0, duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el, start: 'top 88%', toggleActions: 'play none none none',
                    }
                });
            });

            gsap.utils.toArray('.reveal-left').forEach(el => {
                gsap.fromTo(el, { opacity: 0, x: -60 }, {
                    opacity: 1, x: 0, duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' }
                });
            });

            gsap.utils.toArray('.reveal-right').forEach(el => {
                gsap.fromTo(el, { opacity: 0, x: 60 }, {
                    opacity: 1, x: 0, duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' }
                });
            });

            gsap.utils.toArray('.reveal-scale').forEach(el => {
                gsap.fromTo(el, { opacity: 0, scale: 0.88 }, {
                    opacity: 1, scale: 1, duration: 1,
                    ease: 'back.out(1.5)',
                    scrollTrigger: { trigger: el, start: 'top 88%' }
                });
            });

            // Stagger card grids
            gsap.utils.toArray('.services-grid, .properties-grid').forEach(grid => {
                const cards = grid.querySelectorAll('.service-card, .prop-card');
                gsap.fromTo(cards,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1, y: 0, duration: 0.8, stagger: 0.12,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: grid, start: 'top 85%' }
                    }
                );
            });
        }

        // ── Hero entrance ──
        const tl = gsap.timeline({ delay: 0.3 });
        tl.fromTo('.hero-tagline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
          .fromTo('.hero-title',   { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, '-=0.4')
          .fromTo('.hero-desc',    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
          .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
          .fromTo('.hero-stats',   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2');

        // Stat counter animation
        const stats = document.querySelectorAll('.hero-stat h3[data-target]');
        stats.forEach(el => {
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            gsap.fromTo({ val: 0 }, { val: target }, {
                duration: 2, delay: 1.5, ease: 'power2.out',
                onUpdate: function () { el.textContent = prefix + Math.round(this.targets()[0].val) + suffix; }
            });
        });
    }

    // ─────────────────────────────────────────────
    // BOOT
    // ─────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        initThree();
        animateSVGSkyline();
        initGSAP();
    });

    // Expose for external use
    window.LMThree = { destroy: () => { if (animationId) cancelAnimationFrame(animationId); } };
})();
