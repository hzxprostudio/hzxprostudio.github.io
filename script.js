// SCROLL PROGRESS BAR
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
});

// NAVBAR ACTIVE STATE (Optimized)
const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

// 1. Ambil semua section dan simpan posisinya dalam array (caching)
const spySections = Array.from(navAnchorLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

let sectionOffsets = [];
// Tunda pembacaan offsetTop pertama ke frame berikutnya agar tidak
// memaksa layout browser di tengah eksekusi script (forced reflow).
requestAnimationFrame(() => {
    sectionOffsets = spySections.map(section => ({
        id: section.id,
        offset: section.offsetTop
    }));
});

// 2. Fungsi update untuk resize agar offset tetap akurat
window.addEventListener('resize', () => {
    sectionOffsets = spySections.map(section => ({
        id: section.id,
        offset: section.offsetTop
    }));
});

const setActiveLink = () => {
    // 3. Gunakan requestAnimationFrame untuk sinkronisasi dengan refresh rate layar
    window.requestAnimationFrame(() => {
        const scrollPos = window.scrollY + 140;
        let currentId = null;

        // 4. Cari section berdasarkan cache, bukan menghitung offsetTop setiap scroll
        for (let i = 0; i < sectionOffsets.length; i++) {
            if (sectionOffsets[i].offset <= scrollPos) {
                currentId = sectionOffsets[i].id;
            }
        }

        navAnchorLinks.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + currentId;
            link.classList.toggle('active', isActive);
        });
    });
};

window.addEventListener('scroll', setActiveLink, {
    passive: true
});
setActiveLink();

// NAVBAR SCROLL STATE
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

// HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
}

function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
}
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
});
navLinks.addEventListener('click', closeMenu);
document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
});
window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeMenu();
});

// FAQ ACCORDION — only one item open at a time
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(other => other.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// FEATURED WORKS — Filter + Show More / Show Less
(function () {
    const worksGrid = document.querySelector('.works-grid');
    const worksMore = document.getElementById('worksMore');
    const worksToggleBtn = document.getElementById('worksToggleBtn');
    const filterBtns = document.querySelectorAll('#projectFilterTabs .filter-btn');
    if (!worksGrid || !worksMore || !worksToggleBtn) return;

    const allCards = Array.from(worksGrid.querySelectorAll('.work-card'));
    const toggleLabel = worksToggleBtn.querySelector('.worksToggleLabel');
    const mobileQuery = window.matchMedia('(max-width: 720px)');
    let expanded = false;
    let activeFilter = 'all';

    const getLimit = () => (mobileQuery.matches ? 3 : 6);

    function getFilteredCards() {
        return activeFilter === 'all'
            ? allCards
            : allCards.filter(card => card.dataset.category === activeFilter);
    }

    function render() {
        const limit = getLimit();
        const filtered = getFilteredCards();

        allCards.forEach(card => {
            const matches = activeFilter === 'all' || card.dataset.category === activeFilter;
            card.classList.toggle('work-card-hidden', !matches);
        });

        if (filtered.length <= limit) {
            worksMore.hidden = true;
            return;
        }

        worksMore.hidden = false;
        filtered.forEach((card, i) => {
            card.classList.toggle('work-card-hidden', !(expanded || i < limit));
        });

        toggleLabel.textContent = expanded ? 'Show Less' : 'Show More';
        worksToggleBtn.classList.toggle('is-open', expanded);
        worksToggleBtn.setAttribute('aria-expanded', String(expanded));
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activeFilter = btn.dataset.filter;
            expanded = false;

            filterBtns.forEach(b => {
                b.classList.remove('is-active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');

            render();
        });
    });

    worksToggleBtn.addEventListener('click', () => {
        expanded = !expanded;
        render();
        if (!expanded) {
            worksGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    window.addEventListener('resize', render);

    render();
})();

// CATEGORY DEMOS — Filter + Show More / Show Less
(function () {
    const demoGrid = document.getElementById('demoGrid');
    const demoMore = document.getElementById('demoMore');
    const demoToggleBtn = document.getElementById('demoToggleBtn');
    const filterBtns = document.querySelectorAll('#demoFilterTabs .filter-btn');
    if (!demoGrid || !demoMore || !demoToggleBtn) return;

    const allCards = Array.from(demoGrid.querySelectorAll('.work-card'));
    const toggleLabel = demoToggleBtn.querySelector('.worksToggleLabel');
    const mobileQuery = window.matchMedia('(max-width: 720px)');
    let expanded = false;
    let activeFilter = 'all';

    const getLimit = () => (mobileQuery.matches ? 3 : 6);

    function getFilteredCards() {
        return activeFilter === 'all'
            ? allCards
            : allCards.filter(card => card.dataset.category === activeFilter);
    }

    function render() {
        const limit = getLimit();
        const filtered = getFilteredCards();

        allCards.forEach(card => {
            const matches = activeFilter === 'all' || card.dataset.category === activeFilter;
            card.classList.toggle('work-card-hidden', !matches);
        });

        if (filtered.length <= limit) {
            demoMore.hidden = true;
            return;
        }

        demoMore.hidden = false;
        filtered.forEach((card, i) => {
            card.classList.toggle('work-card-hidden', !(expanded || i < limit));
        });

        toggleLabel.textContent = expanded ? 'Show Less' : 'Show More';
        demoToggleBtn.classList.toggle('is-open', expanded);
        demoToggleBtn.setAttribute('aria-expanded', String(expanded));
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activeFilter = btn.dataset.filter;
            expanded = false;

            filterBtns.forEach(b => {
                b.classList.remove('is-active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');

            render();
        });
    });

    demoToggleBtn.addEventListener('click', () => {
        expanded = !expanded;
        render();
        if (!expanded) {
            demoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    window.addEventListener('resize', render);

    render();
})();

// SCROLL REVEAL
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// COUNT-UP HERO STATS
const statEls = document.querySelectorAll('.hero-meta .num');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        const match = raw.match(/^([\d.]+)(.*)$/);
        if (!match) return;
        const targetVal = parseFloat(match[1]);
        const suffix = match[2];
        const isDecimal = match[1].includes('.');
        if (prefersReducedMotion) {
            statObserver.unobserve(el);
            return;
        }
        let start = null;
        const duration = 1100;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * targetVal;
            el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = raw;
        };
        requestAnimationFrame(step);
        statObserver.unobserve(el);
    });
}, {
    threshold: 0.5
});
statEls.forEach(el => statObserver.observe(el));

// HERO VISUAL — subtle tilt on mouse move (desktop only, respects reduced motion)
const heroStack = document.getElementById('heroStack');
if (heroStack && !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const heroVisual = document.querySelector('.hero-visual');
    heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroStack.style.transform = `perspective(1000px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
        heroStack.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
}

// WHATSAPP TOOLTIP — appears 5s after load, auto-hides after 8s
const waTooltip = document.getElementById('waTooltip');
const waTooltipClose = document.getElementById('waTooltipClose');
let waTooltipTimer = null;
let waTooltipHideTimer = null;

if (waTooltip) {
    waTooltipTimer = setTimeout(() => {
        waTooltip.classList.add('show');
        waTooltipHideTimer = setTimeout(() => {
            waTooltip.classList.remove('show');
        }, 8000);
    }, 5000);
}
if (waTooltipClose) {
    waTooltipClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        waTooltip.classList.remove('show');
        clearTimeout(waTooltipTimer);
        clearTimeout(waTooltipHideTimer);
    });
}

// ===== TESTIMONIALS — RESPONSIVE CAROUSEL =====
const testimonialsData = [{
        initial: 'A',
        name: 'Andi Pratama',
        role: 'Founder, StartupX',
        quote: 'The result is outstanding. Fast, clean, and communication was excellent throughout. We\u2019ll definitely be back for the next project.'
    },
    {
        initial: 'S',
        name: 'Sari Dewi',
        role: 'Owner, Dewi Studio',
        quote: 'I love the style — it stands out from the usual templates. They gave suggestions that genuinely improved the final result.'
    },
    {
        initial: 'R',
        name: 'Rizky H.',
        role: 'CEO, Kreasi Digital',
        quote: 'Worked with HZXPro three times now. Consistently great quality, fair pricing, and always on time. Highly recommended.'
    },
    {
        initial: 'D',
        name: 'Dina Amalia',
        role: 'Marketing Lead, Bloom Co',
        quote: 'Communication was smooth the entire way — progress updates came in regularly without us ever having to ask.'
    },
    {
        initial: 'F',
        name: 'Farhan Ilyas',
        role: 'Founder, Ruang Kopi',
        quote: 'The design broke away from the usual template look. Our own clients started asking who built the site.'
    },
    {
        initial: 'M',
        name: 'Maya Puspita',
        role: 'COO, Jejak Nusantara',
        quote: 'Even with a tight deadline, the team pushed through and delivered. No regrets switching from our previous vendor.'
    },
    {
        initial: 'B',
        name: 'Bagus Setiawan',
        role: 'Owner, Warkop Digital',
        quote: 'Fair pricing for agency-level output. Worth every rupiah — we\u2019ll be coming back for future projects.'
    },
    {
        initial: 'N',
        name: 'Nadia Rahma',
        role: 'Brand Manager, Klarra',
        quote: 'I was hesitant at first, but the result was more polished than agencies we\u2019ve worked with before.'
    },
    {
        initial: 'T',
        name: 'Teguh Wibowo',
        role: 'Founder, Loka Kreatif',
        quote: 'Revisions were handled quickly with no friction — they understood exactly what we needed. Will recommend to others.'
    }
];

const testiCarousel = document.getElementById('testiCarousel');
const testiTrack = document.getElementById('testiTrack');
const testiViewport = document.getElementById('testiViewport');
const testiPrevBtn = document.getElementById('testiPrev');
const testiNextBtn = document.getElementById('testiNext');
const testiDotsWrap = document.getElementById('testiDots');

if (testiTrack && testiViewport && testiCarousel) {
    const starsMarkup = Array.from({
            length: 5
        })
        .map(() => '<svg class="ic" width="15" height="15"><use href="#ic-star" /></svg>')
        .join('');

    function buildCardHTML(item) {
        return `
            <div class="testi-card">
                <div class="stars">${starsMarkup}</div>
                <blockquote>&ldquo;${item.quote}&rdquo;</blockquote>
                <div class="author">
                    <div class="avatar">${item.initial}</div>
                    <div>
                        <div class="name">${item.name}</div>
                        <div class="role">${item.role}</div>
                    </div>
                </div>
            </div>
        `;
    }

    function getPerSlide() {
        const w = window.innerWidth;
        if (w < 901) return 1;
        if (w <= 1100) return 2;
        return 3;
    }

    let perSlide = 3;
    let currentSlide = 0;
    let totalSlides = 1;
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 4500;

    function renderDots() {
        testiDotsWrap.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === currentSlide ? ' active' : '');
            dot.type = 'button';
            dot.setAttribute('aria-label', 'Testimonial slide ' + (i + 1));
            dot.addEventListener('click', () => goToSlide(i));
            testiDotsWrap.appendChild(dot);
        }
    }

    function renderSlides() {
        perSlide = getPerSlide();
        const slidesHTML = [];
        for (let i = 0; i < testimonialsData.length; i += perSlide) {
            const group = testimonialsData.slice(i, i + perSlide);
            const cardsHTML = group.map(item => buildCardHTML(item)).join('');
            slidesHTML.push(`<div class="testi-slide cols-${perSlide}">${cardsHTML}</div>`);
        }
        testiTrack.innerHTML = slidesHTML.join('');
        totalSlides = slidesHTML.length;
        currentSlide = Math.min(currentSlide, totalSlides - 1);
        renderDots();
        updateTrack(false);
    }

    function updateTrack(animate) {
        if (animate === false) {
            // Ganti trik "void offsetHeight" (forced reflow) dengan double rAF:
            // browser sempat menggambar frame tanpa transition dulu, baru
            // transition diaktifkan lagi di frame berikutnya — tanpa memaksa
            // layout dibaca secara sinkron.
            testiTrack.style.transition = 'none';
            testiTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            Array.from(testiDotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === currentSlide));
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    testiTrack.style.transition = '';
                });
            });
        } else {
            testiTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            Array.from(testiDotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        }
    }

    function goToSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;
        updateTrack(true);
        restartAutoplay();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
        if (prefersReducedMotion) return;
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateTrack(true);
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    testiNextBtn.addEventListener('click', nextSlide);
    testiPrevBtn.addEventListener('click', prevSlide);
    testiCarousel.addEventListener('mouseenter', stopAutoplay);
    testiCarousel.addEventListener('mouseleave', startAutoplay);
    testiCarousel.addEventListener('focusin', stopAutoplay);
    testiCarousel.addEventListener('focusout', startAutoplay);
    testiDotsWrap.addEventListener('mouseenter', stopAutoplay);
    testiDotsWrap.addEventListener('mouseleave', startAutoplay);
    [testiPrevBtn, testiNextBtn].forEach(btn => {
        btn.addEventListener('mouseenter', stopAutoplay);
        btn.addEventListener('pointerdown', stopAutoplay);
    });

    let touchStartX = 0;
    testiViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    }, {
        passive: true
    });
    testiViewport.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            diff > 0 ? nextSlide() : prevSlide();
        } else {
            startAutoplay();
        }
    }, {
        passive: true
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newPerSlide = getPerSlide();
            if (newPerSlide !== perSlide) renderSlides();
        }, 200);
    });

    requestAnimationFrame(() => {
        renderSlides();
        startAutoplay();
    });
}

// CONTACT FORM — sends to WhatsApp
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nama = document.getElementById('nama').value;
        const email = document.getElementById('email').value;
        const wa = document.getElementById('wa').value;
        const layanan = document.getElementById('layanan').value;
        const pesan = document.getElementById('pesan').value;

        const text = `Halo HZXPro, saya ingin konsultasi project.

Nama: ${nama}
Email: ${email}
WA: ${wa}
Layanan: ${layanan}

Pesan:
${pesan}`;

        window.open(`https://wa.me/6282128297825?text=${encodeURIComponent(text)}`, '_blank');
    });
}


// MARQUEE — driven by requestAnimationFrame at a constant pixel/second speed.
// (A CSS keyframe animation moves a *percentage* of the track's width in a fixed
// duration, so when the track's width varies by screen size, the effective speed
// varies too and the motion doesn't read as perfectly smooth. Animating a raw px
// offset every frame gives constant, consistent speed and a seamless wrap.)
(function () {
    const marqueeStrip = document.querySelector('.marquee-strip');
    const track = document.querySelector('.marquee-track');
    if (!track || !marqueeStrip || track.dataset.smoothMarquee === 'true') return;
    track.dataset.smoothMarquee = 'true';

    // Tunda seluruh pengukuran & setup ke frame berikutnya, biar tidak
    // memaksa layout browser di tengah eksekusi script (forced reflow)
    // akibat DOM yang sudah "kotor" dari script-script sebelumnya.
    requestAnimationFrame(() => {
        const baseItems = Array.from(track.children).map(el => el.cloneNode(true));
        const baseWidth = track.scrollWidth || 1;

        // Keep the track at least one full base-set wider than the viewport, so it
        // can scroll indefinitely without ever exposing a gap on the right edge.
        const targetWidth = Math.max(marqueeStrip.clientWidth, window.innerWidth) + baseWidth;
        const repeatsNeeded = Math.max(1, Math.ceil(targetWidth / baseWidth));
        for (let i = 1; i < repeatsNeeded; i++) {
            baseItems.forEach(el => track.appendChild(el.cloneNode(true)));
        }

        // Hand control over from the CSS keyframe to the JS loop below.
        track.style.animation = 'none';

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            track.style.transform = 'translate3d(0, 0, 0)';
            return;
        }

        const SPEED = 40; // pixels per second
        let pos = 0;
        let lastTime = null;

        function step(timestamp) {
            if (lastTime === null) lastTime = timestamp;
            const deltaSeconds = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            pos -= SPEED * deltaSeconds;
            if (pos <= -baseWidth) pos += baseWidth; // wrap seamlessly, content repeats every baseWidth px

            track.style.transform = `translate3d(${pos}px, 0, 0)`;
            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    });
})();

// cursor custom
const crosshair = document.getElementById('customCrosshair');

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

    // Gerakan kursor super responsif (tanpa delay biar presisi kayak pointer penembak)
    window.addEventListener('mousemove', function (e) {
        crosshair.style.left = `${e.clientX}px`;
        crosshair.style.top = `${e.clientY}px`;
    });

    // Cari semua tombol, link, dan item portofolio di web agency kamu
    const targets = document.querySelectorAll('a, button, .neo-btn, .portfolio-item, input, select, textarea');

    targets.forEach(item => {
        item.addEventListener('mouseenter', () => {
            crosshair.classList.add('hovering');
        });
        item.addEventListener('mouseleave', () => {
            crosshair.classList.remove('hovering');
        });
    });
}