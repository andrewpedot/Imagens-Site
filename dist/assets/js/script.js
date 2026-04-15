document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. HEADER REFERENCE
    ============================================================ */
    const header = document.getElementById('header');

    /* ============================================================
       2. HAMBURGER / MOBILE NAV
    ============================================================ */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    const closeMobileNav = () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    };

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        mobileNav.classList.toggle('open', isOpen);
        mobileNav.setAttribute('aria-hidden', String(!isOpen));
        document.body.classList.toggle('no-scroll', isOpen);
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    /* ============================================================
       3. SMOOTH SCROLL (anchor links)
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ============================================================
       4. SCROLL REVEAL (IntersectionObserver)
    ============================================================ */
    const revealItems = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(el => revealObserver.observe(el));

    /* ============================================================
       5. ANIMATED STAT COUNTERS
    ============================================================ */
    function animateCount(el, target, duration = 1800) {
        const start = performance.now();
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        };
        requestAnimationFrame(update);
    }

    const statsBand = document.querySelector('.stats-band');
    let countersStarted = false;

    if (statsBand) {
        const countersObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersStarted) {
                countersStarted = true;
                statsBand.querySelectorAll('.count[data-target]').forEach(el => {
                    animateCount(el, parseInt(el.dataset.target, 10));
                });
                countersObserver.disconnect();
            }
        }, { threshold: 0.3 });
        countersObserver.observe(statsBand);
    }

    /* ============================================================
       6. FILMSTRIP — DRAG SCROLL
    ============================================================ */
    const filmstrip = document.getElementById('filmstrip');

    if (filmstrip) {
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        const dragStart = (e) => {
            isDragging = true;
            filmstrip.classList.add('is-dragging');
            startX = (e.touches ? e.touches[0].pageX : e.pageX) - filmstrip.offsetLeft;
            scrollLeft = filmstrip.scrollLeft;
        };

        const dragEnd = () => {
            isDragging = false;
            filmstrip.classList.remove('is-dragging');
        };

        const dragMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = (e.touches ? e.touches[0].pageX : e.pageX) - filmstrip.offsetLeft;
            const walk = (x - startX) * 1.4;
            filmstrip.scrollLeft = scrollLeft - walk;
        };

        filmstrip.addEventListener('mousedown',  dragStart);
        filmstrip.addEventListener('touchstart', dragStart, { passive: true });

        filmstrip.addEventListener('mouseup',    dragEnd);
        filmstrip.addEventListener('mouseleave', dragEnd);
        filmstrip.addEventListener('touchend',   dragEnd);

        filmstrip.addEventListener('mousemove',  dragMove);
        filmstrip.addEventListener('touchmove',  dragMove, { passive: false });

        // Prevent accidental link/img drag
        filmstrip.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', e => e.preventDefault());
        });
    }

    /* ============================================================
       7. HERO IMAGE PARALLAX
    ============================================================ */
    const heroImg = document.getElementById('hero-img');

    if (heroImg && window.matchMedia('(min-width: 769px)').matches) {
        const parallax = () => {
            const scrollY = window.scrollY;
            if (scrollY <= window.innerHeight) {
                heroImg.style.transform = `translateY(${scrollY * 0.12}px)`;
            }
        };
        window.addEventListener('scroll', parallax, { passive: true });
    }

});
