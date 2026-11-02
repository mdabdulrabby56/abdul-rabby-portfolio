/*!
 * Main Scripts
 * Template : NOVA — Personal Portfolio
 */

/* ============================================================
   1. HEADER SCROLL EFFECT
   ============================================================ */
(function () {
    'use strict';

    var header = document.getElementById('nav');
    if (!header) return;

    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

}());

/* ============================================================
   2. PRELOADER
   ============================================================ */
(function () {
    'use strict';

    var DELAY = 2000;
    var FADE_TIME = 800;

    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        if (!preloader) return;

        setTimeout(function () {
            preloader.classList.add('hide');
            setTimeout(function () { preloader.remove(); }, FADE_TIME);
        }, DELAY);
    });

}());


/* ============================================================
   3. HERO CANVAS — PARTICLE GRID
   ============================================================ */
(function () {
    'use strict';

    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dots = [];
    var W, H;
    var mouseX = 0, mouseY = 0;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        makeDots();
    }

    function makeDots() {
        dots = [];
        var cols = Math.floor(W / 80);
        var rows = Math.floor(H / 80);

        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var x = c * 80 + 40;
                var y = r * 80 + 40;
                dots.push({ x: x, y: y, ox: x, oy: y, vx: 0, vy: 0, r: Math.random() * 1.5 + 0.5 });
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        var dotColor = isDark ? 'rgba(212,255,0,0.25)' : 'rgba(100,100,180,0.15)';
        var lineColor = isDark ? 'rgba(212,255,0,0.04)' : 'rgba(100,100,180,0.05)';

        dots.forEach(function (d) {
            var dx = mouseX - d.x;
            var dy = mouseY - d.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var force = Math.max(0, 1 - dist / 150);

            d.vx += -dx * force * 0.015 + (d.ox - d.x) * 0.05;
            d.vy += -dy * force * 0.015 + (d.oy - d.y) * 0.05;
            d.vx *= 0.85;
            d.vy *= 0.85;
            d.x += d.vx;
            d.y += d.vy;

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r + (force * 3), 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
        });

        for (var i = 0; i < dots.length; i++) {
            for (var j = i + 1; j < dots.length; j++) {
                var dx = dots[i].x - dots[j].x;
                var dy = dots[i].y - dots[j].y;
                var d = Math.sqrt(dx * dx + dy * dy);

                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('resize', resize);
    resize();
    draw();

}());


/* ============================================================
   4. COUNTER ANIMATION
   ============================================================ */
(function () {
    'use strict';

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '+';
        var start = null;

        requestAnimationFrame(function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / 2000, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
        });
    }

    function init() {
        var els = document.querySelectorAll('[data-count]');
        if (!els.length) return;

        if (!('IntersectionObserver' in window)) {
            els.forEach(animateCounter);
            return;
        }

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    animateCounter(e.target);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });

        els.forEach(function (el) { obs.observe(el); });
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();

}());


/* ============================================================
   5. ABOUT — PORTRAIT 3D TILT
   ============================================================ */
(function () {
    'use strict';

    var cards = document.querySelectorAll('.portrait-frame');
    if (!cards.length) return;

    cards.forEach(function (card) {
        var inner = card.querySelector('.portrait-placeholder');
        if (!inner) return;

        var raf = null;

        card.addEventListener('mousemove', function (e) {
            if (raf) cancelAnimationFrame(raf);

            raf = requestAnimationFrame(function () {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
                var rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;

                inner.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.03)';
                card.style.setProperty('--x', x + 'px');
                card.style.setProperty('--y', y + 'px');
            });
        });

        card.addEventListener('mouseleave', function () {
            inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

}());


/* ============================================================
   6. SERVICE POPUP
   ============================================================ */
(function () {
    'use strict';

    var popup = document.getElementById('servicePopup');
    if (!popup) return;

    function openPopup() {
        popup.classList.add('active');
        popup.setAttribute('aria-hidden', 'false');
        document.body.classList.add('popup-open');
    }

    function closePopup() {
        popup.classList.remove('active');
        popup.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('popup-open');
    }

    document.querySelectorAll('.open-popup').forEach(function (btn) {
        btn.addEventListener('click', openPopup);
    });

    document.querySelectorAll('.close-popup').forEach(function (btn) {
        btn.addEventListener('click', closePopup);
    });

    popup.addEventListener('click', function (e) {
        if (e.target === popup) closePopup();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
    });

}());


/* ============================================================
   7. PORTFOLIO FILTER
   ============================================================ */
(function () {
    'use strict';

    var filterBtns = document.querySelectorAll('.work-filter button');
    var workCards = document.querySelectorAll('.work-card');

    if (!filterBtns.length || !workCards.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = btn.getAttribute('data-filter');

            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            workCards.forEach(function (card, i) {
                var col = card.closest('.project-col');
                if (!col) return;

                var match = filter === 'all' || card.getAttribute('data-category') === filter;

                if (match) {
                    col.classList.remove('hide-project');
                    setTimeout(function () { col.classList.add('show-project'); }, i * 100);
                } else {
                    col.classList.remove('show-project');
                    col.classList.add('hide-project');
                }
            });
        });
    });

}());


/* ============================================================
   8. TESTIMONIAL SWIPER
   ============================================================ */
(function () {
    'use strict';

    if (!document.querySelector('.testimonialSwiper')) return;
    if (typeof Swiper === 'undefined') return;

    new Swiper('.testimonialSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 2200,
        loop: true,

        autoplay: {
            delay: 1500,
            disableOnInteraction: false
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },

        breakpoints: {
            768: { slidesPerView: 1, spaceBetween: 20 },
            991: { slidesPerView: 2 }
        }
    });

}());


/* ============================================================
   9. BLOG POPUP
   ============================================================ */
(function () {
    'use strict';

    var popup = document.querySelector('.blog-popup');
    if (!popup) return;

    var openBtns = document.querySelectorAll('.readMoreBtn');
    var closeBtn = document.querySelector('.blog-close');
    var overlay = document.querySelector('.blog-popup-overlay');

    function openPopup(e) {
        e.preventDefault();
        popup.classList.add('active-popup');
        popup.setAttribute('aria-hidden', 'false');
        document.body.classList.add('popup-open');
    }

    function closePopup() {
        popup.classList.remove('active-popup');
        popup.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('popup-open');
    }

    openBtns.forEach(function (btn) { btn.addEventListener('click', openPopup); });

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (overlay) overlay.addEventListener('click', closePopup);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('active-popup')) closePopup();
    });

}());


/* ============================================================
   10. SIDE MENU 
   ============================================================ */
(function () {
    'use strict';

    var menu = document.querySelector('.side-menu');
    var toggleBtn = document.querySelector('.menu-toggle');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');

    if (!menu || !toggleBtn) return;

    var toggleIcon = toggleBtn.querySelector('i');

    var menuSound = new Audio('assets/sound/menu.mp3');
    menuSound.preload = 'auto';

    function playSound() {
        menuSound.currentTime = 0;
        menuSound.play().catch(function () { });
    }

    function openMenu() {
        menu.classList.add('active');
        if (toggleIcon) {
            toggleIcon.classList.remove('ti-menu-2');
            toggleIcon.classList.add('ti-x');
        }
        playSound();
    }

    function closeMenu() {
        menu.classList.remove('active');
        if (toggleIcon) {
            toggleIcon.classList.remove('ti-x');
            toggleIcon.classList.add('ti-menu-2');
        }
        playSound();
    }

    toggleBtn.addEventListener('click', function () {
        menu.classList.contains('active') ? closeMenu() : openMenu();
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
        if (
            menu.classList.contains('active') &&
            !menu.contains(e.target) &&
            !toggleBtn.contains(e.target)
        ) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
    });

    function updateActiveLink() {
        var current = '';

        sections.forEach(function (sec) {
            if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
        });

        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

}());


/* ============================================================
   11. BUTTON SOUND EFFECT
   ============================================================ */
(function () {
    'use strict';

    var buttons = document.querySelectorAll('.btn-quote');
    if (!buttons.length) return;

    var sound = new Audio('assets/sound/button.mp3');
    sound.preload = 'auto';
    sound.volume = 0.5;

    function playSound() {
        sound.currentTime = 0;
        sound.play().catch(function () { });
    }

    buttons.forEach(function (btn) {
        btn.addEventListener('mouseenter', playSound);
    });

}());


/* ============================================================
   12. SCROLL TO TOP BUTTON
   ============================================================ */
(function () {
    'use strict';

    var scrollBtn = document.querySelector('.scroll-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', function () {
        scrollBtn.classList.toggle('active', window.scrollY > 300);
    }, { passive: true });

}());


/* ============================================================
   13. TEXT ROTATE ANIMATION 
   ============================================================ */
(function () {
    'use strict';
    if (typeof gsap === 'undefined' || typeof SplitType === 'undefined') return;

    var elements = document.querySelectorAll('.rotate-text');
    if (!elements.length) return;

    elements.forEach(function (el) {
        var split = new SplitType(el, {
            types: 'words, chars'
        });

        gsap.from(split.chars, {
            rotateX: -90,
            opacity: 0,
            stagger: 0.04,
            duration: 0.6,
            transformOrigin: 'top center',
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

    });

}());
/* ============================================================
   14. SKILLS PROGRESS BARS + COUNTER ANIMATION
   ============================================================ */
(function () {
    'use strict';

    var section = document.getElementById('portfolioSkills');
    if (!section) return;

    var started = false;

    function animateSkills() {
        if (started) return;
        started = true;

        var skills = document.querySelectorAll('.skill-item-box');
        if (!skills.length) return;

        skills.forEach(function (skill) {
            var progress = parseInt(skill.getAttribute('data-progress'), 10);
            var counter = skill.querySelector('.skill-counter');

            if (!progress || !counter) return;

            skill.style.setProperty('--progress-width', progress + '%');
            skill.classList.add('active');

            var current = 0;
            var interval = setInterval(function () {
                current++;
                counter.textContent = current;
                if (current >= progress) clearInterval(interval);
            }, 20);
        });
    }

    if (!('IntersectionObserver' in window)) {
        animateSkills();
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(section);

}());