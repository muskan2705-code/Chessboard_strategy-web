document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Toggle hamburger icon appearance if needed
            const bars = menuToggle.querySelectorAll('.bar');
            if (mainNav.classList.contains('active')) {
                bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-links a, .nav-cta');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav && menuToggle && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });

    // 2. Sticky Header Styling on Scroll
    const header = document.getElementById('site-header');

    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Intersection Observer for Fade-In Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animatedElements = document.querySelectorAll('.fade-in-up');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }

    // 4. Smooth Scrolling for anchor links (fallback for browsers that don't support scroll-behavior: smooth)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Reveal service cards on the home page
    const exploreServicesBtn = document.getElementById('explore-services-btn');
    const serviceSummary = document.getElementById('service-summary');

    if (exploreServicesBtn && serviceSummary) {
        exploreServicesBtn.addEventListener('click', () => {
            const shouldOpen = serviceSummary.hidden;
            serviceSummary.hidden = !shouldOpen;
            exploreServicesBtn.setAttribute('aria-expanded', String(shouldOpen));
            exploreServicesBtn.textContent = shouldOpen ? 'Hide Services' : 'Explore Our Services';

            if (shouldOpen) {
                serviceSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    const worksSlider = document.getElementById('works-video-slider');
    const sliderPrev = document.querySelector('.slider-btn-prev');
    const sliderNext = document.querySelector('.slider-btn-next');

    if (worksSlider && sliderPrev && sliderNext) {
        const scrollWorksSlider = (direction) => {
            worksSlider.scrollBy({
                left: direction * worksSlider.clientWidth * 0.8,
                behavior: 'smooth'
            });
        };

        sliderPrev.addEventListener('click', () => scrollWorksSlider(-1));
        sliderNext.addEventListener('click', () => scrollWorksSlider(1));
    }

    // 6. PaintWorklet for Hero Ring Particles Background
    if ('paintWorklet' in CSS) {
        CSS.paintWorklet.addModule(
            'assets/ringparticles.js'
        );

        let isInteractive = false;
        const welcome = document.querySelector('#hero');
        if (welcome) {
            welcome.addEventListener('pointermove', (e) => {
                if (!isInteractive) { welcome.classList.add('interactive'); isInteractive = true; }
                welcome.style.setProperty('--ring-x', (e.clientX / window.innerWidth) * 100);
                welcome.style.setProperty('--ring-y', (e.clientY / window.innerHeight) * 100);
                welcome.style.setProperty('--ring-interactive', 1);
            });
            welcome.addEventListener('pointerleave', (e) => {
                welcome.classList.remove('interactive'); isInteractive = false;
                welcome.style.setProperty('--ring-x', 50);
                welcome.style.setProperty('--ring-y', 50);
                welcome.style.setProperty('--ring-interactive', 0);
            });
        }
    }

    // 7. Neon Purple Cursor Trail
    const cursorCanvas = document.createElement('canvas');
    const cursorCtx = cursorCanvas.getContext('2d');
    document.body.appendChild(cursorCanvas);

    cursorCanvas.style.position = 'fixed';
    cursorCanvas.style.top = '0';
    cursorCanvas.style.left = '0';
    cursorCanvas.style.width = '100vw';
    cursorCanvas.style.height = '100vh';
    cursorCanvas.style.pointerEvents = 'none';
    cursorCanvas.style.zIndex = '-1';

    let cWidth = cursorCanvas.width = window.innerWidth;
    let cHeight = cursorCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        cWidth = cursorCanvas.width = window.innerWidth;
        cHeight = cursorCanvas.height = window.innerHeight;
    });

    const cursorParticles = [];

    class CursorParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // Much smaller dots (0.5px to 2px radius)
            this.size = Math.random() * 1.5 + 0.5;
            this.life = 1;
            // Fade out quickly for a faster, snappy animation
            this.decay = Math.random() * 0.03 + 0.02;
            // Faster, dynamic random drifting
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
        }
        update() {
            this.life -= this.decay;
            this.x += this.vx;
            this.y += this.vy;
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(153, 102, 255, ${this.life})`; // Neon purple #9966FF
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#9966FF';
            ctx.fill();
        }
    }

    window.addEventListener('mousemove', (e) => {
        // Spawn a small burst of scattered particles directly under the cursor
        // creating a "magic dust" effect instead of a continuous painted line.
        const particleCount = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < particleCount; j++) {
            const scatterX = e.clientX + (Math.random() * 20 - 10);
            const scatterY = e.clientY + (Math.random() * 20 - 10);
            cursorParticles.push(new CursorParticle(scatterX, scatterY));
        }
    });

    function animateCursorTrail() {
        cursorCtx.clearRect(0, 0, cWidth, cHeight);

        for (let i = 0; i < cursorParticles.length; i++) {
            cursorParticles[i].update();
            cursorParticles[i].draw(cursorCtx);
            if (cursorParticles[i].life <= 0) {
                cursorParticles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateCursorTrail);
    }

    animateCursorTrail();
});
