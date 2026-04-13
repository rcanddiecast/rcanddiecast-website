document.addEventListener("DOMContentLoaded", () => {

    // ======== GSAP & Lenis Setup ======== //
    gsap.registerPlugin(ScrollTrigger);

    // Single Lenis tick via GSAP — the official Lenis+GSAP integration pattern.
    // Do NOT also add a manual requestAnimationFrame loop; that would double-tick Lenis.
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,  // Critical: let native touch scroll work on mobile
        touchMultiplier: 2,
    });

    // Wire Lenis into GSAP ticker (single source of truth for the animation loop)
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // ======== Dynamic Island & Scroll to Top Logic ======== //
    let lastScroll = 0;
    const island = document.querySelector('.dynamic-island');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        const current = window.scrollY;

        // Hide on scroll down, show on scroll up (app feel)
        if (island) {
            if (current > 200 && current > lastScroll && window.innerWidth < 768) {
                island.style.transform = 'translate(-50%, 150%) scale(0.9)';
            } else {
                island.style.transform = 'translate(-50%, 0) scale(1)';
            }
            if (window.innerWidth >= 768) {
                island.style.transform = current > 50 ? 'translate(-50%, -10px) scale(0.95)' : 'translate(-50%, 0) scale(1)';
            }
        }

        // Scroll to top button visibility
        if (scrollToTopBtn) {
            if (current > 800) {
                scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-8');
                scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-8');
                scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        }

        lastScroll = current;
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.5 });
        });
    }

    // Wire all #hash anchor links to lenis.scrollTo() so they work with smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { duration: 1.5, offset: 0 });
            }
        });
    });

    // ======== API Fetching & Data Splitting ======== //
    const API_URL = "/data/products.json";

    async function initApp() {
        // Safety net — dismiss loader after 12s max regardless of API state
        const safetyTimer = setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 1s';
                setTimeout(() => loader.remove(), 1000);
            }
            if (document.getElementById('bento-gallery')) {
                document.getElementById('bento-gallery').innerHTML = `
                    <div class="col-span-full py-20 text-center">
                        <p class="text-white text-2xl font-bold tracking-tighter mb-2">API Timeout</p>
                        <p class="text-gray-500 text-sm">Could not reach the garage. Please check your connection.</p>
                    </div>
                `;
            }
        }, 12000);

        try {
            // 10-second fetch timeout via AbortController
            const controller = new AbortController();
            const fetchTimeout = setTimeout(() => controller.abort(), 10000);

            gsap.to("#loader-bar", { width: "80%", duration: 1.5, ease: "power2.out" });

            const resp = await fetch(API_URL, { signal: controller.signal });
            clearTimeout(fetchTimeout);
            const data = await resp.json();

            // ── Layer 1: OOS rule — optionally show them but label them OOS ──
            const products = data;

            // ── Layer 2: Slider rule — only slider="yes" products go in the hero ──
            const sliderProducts = products.filter(item => item.slider === 'yes');

            // ── Layer 3: showProdct rule — only showProdct="yes" products show in the grid ──
            // (Set showProdct:"no" in products.json to hide a product without marking it OOS)
            const listProducts = products.filter(item => item.showProdct === 'yes');

            clearTimeout(safetyTimer);

            // Finish loader
            gsap.to("#loader-bar", {
                width: "100%", duration: 0.5, onComplete: () => {
                    gsap.to("#loader", { opacity: 0, duration: 1, ease: "power2.inOut", onComplete: () => document.getElementById('loader')?.remove() });
                }
            });

            if (products.length === 0) return;

            // 1. Init Hero Slider — only slider="yes" products
            initHeroSlider(sliderProducts);

            // 2. Init Bento Showroom — ALL in-stock products
            renderBentoGrid(listProducts);

            // 3. Init Kinetic Marquee
            renderMarquee(listProducts);

            // Parallax Images Initializer
            initParallax();

            // 4. Init Search & Filter system
            initFilterSystem(listProducts);

        } catch (err) {
            clearTimeout(safetyTimer);
            console.error("API Error:", err.name === 'AbortError' ? 'Request timed out after 10s' : err);
            const loader = document.getElementById('loader');
            if (loader) {
                gsap.to(loader, { opacity: 0, duration: 0.8, onComplete: () => loader.remove() });
            }
            const gallery = document.getElementById('bento-gallery');
            if (gallery) {
                gallery.innerHTML = `
                    <div class="col-span-full py-20 text-center">
                        <p class="text-white text-2xl font-bold tracking-tighter mb-2">Garage Offline</p>
                        <p class="text-gray-500 text-sm">Could not connect to the API. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    // ======== 1. Hero Kinetic Slider ======== //
    let currentSlide = 0;
    let heroSlides = [];
    let autoPlayInterval;

    function initHeroSlider(sliderProducts) {
        // Only slider="yes" products are passed in; show up to first 5 slides
        heroSlides = sliderProducts.slice(0, 5);
        const products = heroSlides; // alias for the rest of the function
        const track = document.getElementById('hero-slider-track');
        const controls = document.getElementById('hero-controls');

        track.innerHTML = '';
        controls.innerHTML = '';

        heroSlides.forEach((slide, i) => {
            track.innerHTML += `
                <div class="absolute inset-0 w-full h-full hero-slide" id="slide-${i}" style="opacity: ${i === 0 ? 1 : 0}; z-index: ${i === 0 ? 10 : 0};">
                    <img src="${slide.ImageURL}" class="absolute inset-0 w-full h-[120%] object-cover grayscale opacity-80" data-speed="1.15" onerror="this.src='/image/trx4m.jpg'">
                    <div class="absolute inset-0 bg-hero-vignette mix-blend-multiply"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-surface-950 opacity-90"></div>
                    
                    <div class="relative z-20 max-w-[1920px] mx-auto px-6 lg:px-12 w-full h-full flex flex-col justify-end pb-[25vh]">
                        <div class="slide-text-${i} inline-flex items-center gap-4 mb-6">
                            <span class="w-8 h-[2px] bg-brand-orange"></span>
                            <span class="text-[10px] text-brand-orange uppercase tracking-[0.5em] font-extrabold">${slide.brandName} EXCLUSIVE</span>
                        </div>
                        <h1 class="text-6xl md:text-8xl lg:text-[10rem] font-extrabold tracking-tighter text-white leading-[0.85] slide-text-${i}">
                            ${slide.modelName}
                        </h1>
                        <p class="text-gray-400 font-light mt-8 max-w-xl text-sm md:text-xl slide-text-${i} leading-relaxed">
                            ${slide.productDec ? slide.productDec.substring(0, 140) + '...' : 'Ultimate engineering scaling down legends.'}
                        </p>
                    </div>
                </div>
            `;

            controls.innerHTML += `<button onclick="goToSlide(${i})" class="w-16 h-1 rounded-full transition-all duration-700 ${i === 0 ? 'bg-brand-orange' : 'bg-white/20 hover:bg-white/50'}" id="dot-${i}"></button>`;
        });

        // Initial intro animation
        gsap.fromTo(`.slide-text-0`,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15, duration: 1.5, ease: "power3.out", delay: 1.5 }
        );

        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        const heroSection = document.getElementById('kinetic-hero');

        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        heroSection.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            // Only swipe slide if horizontal movement dominates and is significant
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                if (dx < 0) goToSlide((currentSlide + 1) % heroSlides.length);
                else goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
            }
        }, { passive: true });

        autoPlayInterval = setInterval(() => {
            goToSlide((currentSlide + 1) % heroSlides.length);
        }, 6000);
    }

    window.goToSlide = function (index) {
        if (index === currentSlide) return;
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => goToSlide((currentSlide + 1) % heroSlides.length), 6000);

        gsap.to(`#slide-${currentSlide}`, { opacity: 0, duration: 1.2, zIndex: 0, ease: "power2.inOut" });
        document.getElementById(`dot-${currentSlide}`).classList.replace('bg-brand-orange', 'bg-white/20');

        gsap.fromTo(`#slide-${index}`, { opacity: 0 }, { opacity: 1, duration: 1.2, zIndex: 10, ease: "power2.inOut" });
        gsap.fromTo(`.slide-text-${index}`,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15, duration: 1.5, ease: "power3.out", delay: 0.3 }
        );

        document.getElementById(`dot-${index}`).classList.replace('bg-white/20', 'bg-brand-orange');
        currentSlide = index;
    }

    // ======== 2. Bento Grid Showroom ======== //
    function renderBentoGrid(products) {
        const gallery = document.getElementById('bento-gallery');
        let html = '';

        products.forEach((product, i) => {
            // Asymmetric CSS Grid logic
            let bentoClass = 'col-span-1 md:col-span-4 min-h-[400px]';
            if (i % 5 === 0) bentoClass = 'col-span-1 md:col-span-8 min-h-[450px] md:min-h-[550px]';
            if (i % 5 === 1) bentoClass = 'col-span-1 md:col-span-4 row-span-1 md:row-span-2 min-h-[400px] md:min-h-[800px]';
            if (i % 5 === 2) bentoClass = 'col-span-1 md:col-span-4 min-h-[400px]';
            if (i % 5 === 3) bentoClass = 'col-span-1 md:col-span-8 min-h-[450px] md:min-h-[550px]';

            const isOOS = product.stock && product.stock.toUpperCase() === 'OOS';
            const waText = encodeURIComponent(`Hi 👋, I'm interested in your product: *${product.productName}*. Could you please share pricing, availability, and more details?`);
            const dynamicWALink = `https://wa.me/918606447311?text=${waText}`;
            html += `
                <div class="${bentoClass} bento-card relative group flex flex-col justify-end overflow-hidden">
                    <img src="${product.ImageURL}" class="absolute inset-0 w-full h-[110%] object-cover parallax-img origin-center grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2000ms] ease-out" data-speed="1.05" loading="lazy" onerror="this.src='/image/trx4m.jpg'">
                    <div class="absolute inset-0 bg-hero-vignette opacity-80 mix-blend-multiply transition-opacity duration-1000 group-hover:opacity-60"></div>
                    
                    ${isOOS ? `
                    <div class="absolute top-6 right-6 z-[100]">
                        <button class="flex items-center justify-center gap-2 bg-brand-orange text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] text-[9px] md:text-[11px] px-4 md:px-5 py-2 md:py-2.5 uppercase tracking-[0.15em] font-extrabold shadow-[0_8px_16px_rgba(255,61,0,0.4)] rounded-full border border-orange-500/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_24px_rgba(255,61,0,0.6)] active:scale-95 cursor-pointer" onclick="window.open('${dynamicWALink}', '_blank')">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <span>Out of Stock</span>
                        </button>
                    </div>
                    ` : ''}

                    <div class="relative z-10 p-8 flex flex-col items-start w-full">
                        <div class="flex items-center flex-wrap gap-2 mb-4">
                            <span class="bg-brand-orange text-white text-[8px] px-3 py-1.5 rounded-full uppercase tracking-[0.2em] font-extrabold shadow-[0_0_15px_rgba(255,61,0,0.5)]">
                                ${product.brandName}
                            </span>
                            ${product.scale ? `
                            <span class="group relative flex items-center gap-1.5 bg-[#111] border border-white/10 text-white/80 text-[8px] px-3 py-1.5 rounded-full uppercase tracking-[0.2em] font-extrabold shadow-[0_8px_16px_rgba(0,0,0,0.4)] overflow-hidden cursor-default transition-all duration-500 hover:border-white/30 hover:text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-[2px]" title="Product Scale: ${product.scale}">
                                <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] transition-transform duration-1000 ease-out group-hover:translate-x-[150%]"></span>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 group-hover:opacity-100 transition-opacity"><rect x="3" y="10" width="18" height="4" rx="1"></rect><line x1="7" y1="10" x2="7" y2="12"></line><line x1="11" y1="10" x2="11" y2="12"></line><line x1="15" y1="10" x2="15" y2="12"></line><line x1="19" y1="10" x2="19" y2="12"></line></svg>
                                <span>SCALE ${product.scale}</span>
                            </span>
                            ` : ''}
                        </div>
                        
                        <h3 class="text-3xl lg:text-5xl font-extrabold tracking-tighter leading-[0.9] text-white">${product.modelName}</h3>
                        
                        <!-- Price + actions: always visible on mobile, reveal on hover on desktop -->
                        <div class="mt-6 w-full flex justify-between items-end
                                    opacity-100 translate-y-0
                                    md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0
                                    transition-all duration-[800ms] ease-out">
                            <p class="text-white text-xl md:text-3xl font-light tracking-tight">₹${product.rate.toLocaleString()}</p>
                            
                            <div class="flex gap-2 md:gap-3">
                                ${product.ytLink ? `
                                <a href="${product.ytLink}" target="_blank" class="w-12 h-12 rounded-[1.2rem] flex justify-center items-center bg-transparent border border-white/20 hover:bg-[#ff0000] hover:border-[#ff0000] text-white transition-colors duration-300 shadow-none hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="translate-x-[1px]" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </a>` : ''}
                                
                                <a href="${product.instaLink || '#'}" target="_blank" class="w-12 h-12 rounded-[1.2rem] flex justify-center items-center bg-white hover:bg-brand-orange text-black hover:text-white transition-colors duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(255,61,0,0.4)]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="rotate-45" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </a>
                                
                                <a href="${dynamicWALink}" target="_blank" class="flex-1 min-w-0 relative overflow-hidden h-12 px-2 sm:px-5 md:px-6 rounded-[1.2rem] flex justify-center items-center border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_25px_rgba(255,61,0,0.4)] hover:border-brand-orange hover:-translate-y-1 group/wa [transform:translateZ(0)]">
                                    <div class="absolute inset-0 bg-brand-orange translate-y-[100%] group-hover/wa:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-[1.2rem]"></div>
                                    <div class="relative z-10 flex items-center gap-1.5 md:gap-2.5 text-white w-full justify-center">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 group-hover/wa:rotate-[-10deg] group-hover/wa:scale-110 transition-transform duration-500"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                        <div class="font-extrabold text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] relative overflow-hidden h-[1.3em] inline-flex flex-col items-center">
                                            <span class="uppercase leading-[1.3em] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/wa:-translate-y-full">Order</span>
                                            <span class="uppercase leading-[1.3em] absolute top-0 left-0 w-full text-center transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-full group-hover/wa:translate-y-0">Order</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        gallery.innerHTML = html;

        // Stagger entrance on scroll
        gsap.from(".bento-card", {
            scrollTrigger: { trigger: "#bento-gallery", start: "top 85%" },
            y: 100,
            opacity: 0,
            stagger: 0.15,
            duration: 1.5,
            ease: "power3.out"
        });

        initParallax(); // Re-init parallax for new images
    }

    // ======== 3. Kinetic Marquee Footer ======== //
    function renderMarquee(products) {
        const uniqueBrands = [...new Set(products.map(p => p.brandName))];
        const track = document.getElementById('marquee-track');

        // Build the colossal typography string
        const brandString = uniqueBrands.map(b => `
            <span class="text-[5rem] md:text-[8rem] lg:text-[12rem] font-extrabold tracking-tighter text-white/20 md:text-surface-900 mx-8 md:mx-16 uppercase hover:text-brand-orange transition-colors duration-[800ms] select-none">
                ${b}
            </span>
        `).join('<span class="text-[4rem] md:text-[6rem] font-light text-white/10 md:text-surface-850 mx-4 select-none">×</span>');

        // Multiply massive string 4 times for infinite loop
        track.innerHTML = brandString + brandString + brandString + brandString;
    }

    // ======== 4. Parallax Util ======== //
    function initParallax() {
        gsap.utils.toArray('.parallax-img').forEach(img => {
            gsap.to(img, {
                yPercent: 15, // Move image slightly upwards as scrolled
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    initApp();

    // ======== 5. Search & Filter System ======== //
    let _allProducts = [];
    let _filterState = {
        query: '',
        brand: '',
        sort: '',
        priceMin: 0,
        priceMax: Infinity,
    };
    let _priceAbsMax = 10000;

    function initFilterSystem(products) {
        _allProducts = products;

        // Compute actual price bounds from data
        const prices = products.map(p => p.rate);
        const absMin = Math.min(...prices);
        const absMax = Math.max(...prices);
        _priceAbsMax = absMax;
        _filterState.priceMax = absMax;

        // Set slider bounds based on real data
        ['price-min', 'price-min-mobile'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.min = absMin; el.max = absMax; el.value = absMin; el.step = Math.max(100, Math.floor((absMax - absMin) / 50) * 10); }
        });
        ['price-max', 'price-max-mobile'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.min = absMin; el.max = absMax; el.value = absMax; el.step = Math.max(100, Math.floor((absMax - absMin) / 50) * 10); }
        });
        updatePriceDisplay();

        // Populate brand dropdowns
        const brands = [...new Set(products.map(p => p.brandName))].sort();
        ['brand-filter', 'brand-filter-mobile'].forEach(id => {
            const sel = document.getElementById(id);
            if (!sel) return;
            brands.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b; opt.textContent = b;
                sel.appendChild(opt);
            });
        });

        // ---- Desktop event listeners ----
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        const brandFilter = document.getElementById('brand-filter');
        const sortFilter = document.getElementById('sort-filter');
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const clearAllBtn = document.getElementById('clear-all-btn');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                _filterState.query = searchInput.value.trim();
                clearSearchBtn.style.display = _filterState.query ? 'flex' : 'none';
                applyFilters();
            });
        }
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                searchInput.value = '';
                _filterState.query = '';
                clearSearchBtn.style.display = 'none';
                applyFilters();
            });
        }
        if (brandFilter) {
            brandFilter.addEventListener('change', () => {
                _filterState.brand = brandFilter.value;
                applyFilters();
            });
        }
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                _filterState.sort = sortFilter.value;
                applyFilters();
            });
        }
        if (priceMin) {
            priceMin.addEventListener('input', () => {
                let v = parseInt(priceMin.value);
                if (v >= parseInt(priceMax.value)) v = parseInt(priceMax.value) - parseInt(priceMin.step || 100);
                priceMin.value = v;
                _filterState.priceMin = v;
                updatePriceDisplay();
                applyFilters();
            });
        }
        if (priceMax) {
            priceMax.addEventListener('input', () => {
                let v = parseInt(priceMax.value);
                if (v <= parseInt(priceMin.value)) v = parseInt(priceMin.value) + parseInt(priceMax.step || 100);
                priceMax.value = v;
                _filterState.priceMax = v;
                updatePriceDisplay();
                applyFilters();
            });
        }
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => clearAllFilters());
        }

        // ---- Mobile search (live) ----
        const searchMobile = document.getElementById('search-input-mobile');
        const clearSearchMobileBtn = document.getElementById('clear-search-mobile-btn');
        if (searchMobile) {
            searchMobile.addEventListener('input', () => {
                _filterState.query = searchMobile.value.trim();
                if (searchInput) searchInput.value = searchMobile.value;
                clearSearchMobileBtn.style.display = _filterState.query ? 'flex' : 'none';
                applyFilters();
            });
        }
        if (clearSearchMobileBtn) {
            clearSearchMobileBtn.addEventListener('click', () => {
                if (searchMobile) searchMobile.value = '';
                if (searchInput) searchInput.value = '';
                _filterState.query = '';
                clearSearchMobileBtn.style.display = 'none';
                applyFilters();
            });
        }

        // Mobile range sliders — live preview while sheet is open
        const pmMin = document.getElementById('price-min-mobile');
        const pmMax = document.getElementById('price-max-mobile');
        if (pmMin) pmMin.addEventListener('input', () => updatePriceDisplay());
        if (pmMax) pmMax.addEventListener('input', () => updatePriceDisplay());
    }

    function updatePriceDisplay() {
        // Desktop
        const pMin = document.getElementById('price-min');
        const pMax = document.getElementById('price-max');
        const disp = document.getElementById('price-display');
        if (pMin && pMax && disp) {
            disp.textContent = `₹${parseInt(pMin.value).toLocaleString()} – ₹${parseInt(pMax.value).toLocaleString()}`;
        }
        // Mobile
        const pmMin = document.getElementById('price-min-mobile');
        const pmMax = document.getElementById('price-max-mobile');
        const dispM = document.getElementById('price-display-mobile');
        if (pmMin && pmMax && dispM) {
            dispM.textContent = `₹${parseInt(pmMin.value).toLocaleString()} – ₹${parseInt(pmMax.value).toLocaleString()}`;
        }
    }

    function applyFilters() {
        let results = [..._allProducts];

        // 1. Text search (name, brand, model)
        if (_filterState.query) {
            const q = _filterState.query.toLowerCase();
            results = results.filter(p =>
                p.productName.toLowerCase().includes(q) ||
                p.brandName.toLowerCase().includes(q) ||
                p.modelName.toLowerCase().includes(q)
            );
        }

        // 2. Brand filter
        if (_filterState.brand) {
            results = results.filter(p => p.brandName === _filterState.brand);
        }

        // 3. Price range
        results = results.filter(p => p.rate >= _filterState.priceMin && p.rate <= _filterState.priceMax);

        // 4. Sort
        if (_filterState.sort === 'low') results.sort((a, b) => a.rate - b.rate);
        else if (_filterState.sort === 'high') results.sort((a, b) => b.rate - a.rate);
        else if (_filterState.sort === 'az') results.sort((a, b) => a.productName.localeCompare(b.productName));

        renderBentoGridFiltered(results);
        updateActiveFiltersRow(results.length);
        updateFilterActiveDot();
    }

    function renderBentoGridFiltered(products) {
        const gallery = document.getElementById('bento-gallery');
        if (!gallery) return;

        if (products.length === 0) {
            gallery.innerHTML = `
                <div class="no-results-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <p style="font-size:1.1rem; font-weight:800; color:rgba(255,255,255,0.7); letter-spacing:-0.02em;">No results found</p>
                    <p style="font-size:0.75rem; color:rgba(255,255,255,0.25); text-align:center; max-width:240px;">Try a different search term or clear your filters.</p>
                    <button onclick="clearAllFilters()" style="margin-top:0.5rem; padding:0.6rem 1.5rem; border-radius:99px; background:rgba(255,61,0,0.15); border:1px solid rgba(255,61,0,0.35); color:#ff3d00; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.15em; cursor:pointer;">Clear Filters</button>
                </div>
            `;
            return;
        }

        let html = '';
        products.forEach((product, i) => {
            let bentoClass = 'col-span-1 md:col-span-4 min-h-[400px]';
            if (i % 5 === 0) bentoClass = 'col-span-1 md:col-span-8 min-h-[450px] md:min-h-[550px]';
            if (i % 5 === 1) bentoClass = 'col-span-1 md:col-span-4 row-span-1 md:row-span-2 min-h-[400px] md:min-h-[800px]';
            if (i % 5 === 2) bentoClass = 'col-span-1 md:col-span-4 min-h-[400px]';
            if (i % 5 === 3) bentoClass = 'col-span-1 md:col-span-8 min-h-[450px] md:min-h-[550px]';

            const isOOS = product.stock && product.stock.toUpperCase() === 'OOS';
            const waText = encodeURIComponent(`Hi 👋, I'm interested in your product: *${product.productName}*. Could you please share pricing, availability, and more details?`);
            const dynamicWALink = `https://wa.me/918606447311?text=${waText}`;
            html += `
                <div class="${bentoClass} bento-card relative group flex flex-col justify-end overflow-hidden">
                    <img src="${product.ImageURL}" class="absolute inset-0 w-full h-[110%] object-cover parallax-img origin-center grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2000ms] ease-out" data-speed="1.05" loading="lazy" onerror="this.src='/image/trx4m.jpg'">
                    <div class="absolute inset-0 bg-hero-vignette opacity-80 mix-blend-multiply transition-opacity duration-1000 group-hover:opacity-60"></div>
                    
                    ${isOOS ? `
                    <div class="absolute top-6 right-6 z-[100]">
                        <button class="flex items-center justify-center gap-2 bg-brand-orange text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] text-[9px] md:text-[11px] px-4 md:px-5 py-2 md:py-2.5 uppercase tracking-[0.15em] font-extrabold shadow-[0_8px_16px_rgba(255,61,0,0.4)] rounded-full border border-orange-500/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_24px_rgba(255,61,0,0.6)] active:scale-95 cursor-pointer" onclick="window.open('${dynamicWALink}', '_blank')">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <span>Out of Stock</span>
                        </button>
                    </div>
                    ` : ''}

                    <div class="relative z-10 p-8 flex flex-col items-start w-full">
                        <div class="flex items-center flex-wrap gap-2 mb-4">
                            <span class="bg-brand-orange text-white text-[8px] px-3 py-1.5 rounded-full uppercase tracking-[0.2em] font-extrabold shadow-[0_0_15px_rgba(255,61,0,0.5)]">
                                ${product.brandName}
                            </span>
                            ${product.scale ? `
                            <span class="group relative flex items-center gap-1.5 bg-[#111] border border-white/10 text-white/80 text-[8px] px-3 py-1.5 rounded-full uppercase tracking-[0.2em] font-extrabold shadow-[0_8px_16px_rgba(0,0,0,0.4)] overflow-hidden cursor-default transition-all duration-500 hover:border-white/30 hover:text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-[2px]" title="Product Scale: ${product.scale}">
                                <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] transition-transform duration-1000 ease-out group-hover:translate-x-[150%]"></span>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 group-hover:opacity-100 transition-opacity"><rect x="3" y="10" width="18" height="4" rx="1"></rect><line x1="7" y1="10" x2="7" y2="12"></line><line x1="11" y1="10" x2="11" y2="12"></line><line x1="15" y1="10" x2="15" y2="12"></line><line x1="19" y1="10" x2="19" y2="12"></line></svg>
                                <span>SCALE ${product.scale}</span>
                            </span>
                            ` : ''}
                        </div>
                        <h3 class="text-3xl lg:text-5xl font-extrabold tracking-tighter leading-[0.9] text-white">${product.modelName}</h3>
                        <div class="mt-6 w-full flex justify-between items-end
                                    opacity-100 translate-y-0
                                    md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0
                                    transition-all duration-[800ms] ease-out">
                            <p class="text-white text-xl md:text-3xl font-light tracking-tight">₹${product.rate.toLocaleString()}</p>
                            <div class="flex gap-2 md:gap-3">
                                ${product.ytLink ? `
                                <a href="${product.ytLink}" target="_blank" class="w-12 h-12 rounded-[1.2rem] flex justify-center items-center bg-transparent border border-white/20 hover:bg-[#ff0000] hover:border-[#ff0000] text-white transition-colors duration-300 shadow-none hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="translate-x-[1px]" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </a>` : ''}
                                <a href="${product.instaLink || '#'}" target="_blank" class="w-12 h-12 rounded-[1.2rem] flex justify-center items-center bg-white hover:bg-brand-orange text-black hover:text-white transition-colors duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(255,61,0,0.4)]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="rotate-45" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </a>
                                <a href="${dynamicWALink}" target="_blank" class="flex-1 min-w-0 relative overflow-hidden h-12 px-2 sm:px-5 md:px-6 rounded-[1.2rem] flex justify-center items-center border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_25px_rgba(255,61,0,0.4)] hover:border-brand-orange hover:-translate-y-1 group/wa [transform:translateZ(0)]">
                                    <div class="absolute inset-0 bg-brand-orange translate-y-[100%] group-hover/wa:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-[1.2rem]"></div>
                                    <div class="relative z-10 flex items-center gap-1.5 md:gap-2.5 text-white w-full justify-center">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 group-hover/wa:rotate-[-10deg] group-hover/wa:scale-110 transition-transform duration-500"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                        <div class="font-extrabold text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] relative overflow-hidden h-[1.3em] inline-flex flex-col items-center">
                                            <span class="uppercase leading-[1.3em] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/wa:-translate-y-full">Order</span>
                                            <span class="uppercase leading-[1.3em] absolute top-0 left-0 w-full text-center transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-full group-hover/wa:translate-y-0">Order</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        gallery.innerHTML = html;

        // Lightweight fade-in (no stagger GSAP since filter re-renders frequently)
        gallery.style.opacity = '0';
        requestAnimationFrame(() => {
            gallery.style.transition = 'opacity 0.4s ease';
            gallery.style.opacity = '1';
        });

        // Re-init parallax for new images
        ScrollTrigger.getAll().forEach(st => st.kill());
        initParallax();
    }

    function updateActiveFiltersRow(count) {
        const row = document.getElementById('active-filters-row');
        if (!row) return;
        row.innerHTML = '';

        const hasQuery = _filterState.query;
        const hasBrand = _filterState.brand;
        const hasSort = _filterState.sort;
        const hasPriceMin = _filterState.priceMin > 0;
        const hasPriceMax = _filterState.priceMax < _priceAbsMax;
        const hasAnyFilter = hasQuery || hasBrand || hasSort || hasPriceMin || hasPriceMax;

        // Result count
        const countBadge = document.createElement('span');
        countBadge.id = 'result-count';
        countBadge.textContent = `${count} result${count !== 1 ? 's' : ''}`;
        if (hasAnyFilter) countBadge.classList.add('has-filter');
        row.appendChild(countBadge);

        if (!hasAnyFilter) return;

        const sep = document.createElement('span');
        sep.style.cssText = 'width:1px; height:14px; background:rgba(255,255,255,0.1); align-self:center; margin:0 4px;';
        row.appendChild(sep);

        if (hasQuery) {
            row.appendChild(makePill(`"${_filterState.query}"`, () => {
                _filterState.query = '';
                const si = document.getElementById('search-input');
                const sm = document.getElementById('search-input-mobile');
                if (si) si.value = '';
                if (sm) sm.value = '';
                document.getElementById('clear-search-btn').style.display = 'none';
                document.getElementById('clear-search-mobile-btn').style.display = 'none';
                applyFilters();
            }));
        }
        if (hasBrand) {
            row.appendChild(makePill(_filterState.brand, () => {
                _filterState.brand = '';
                const bf = document.getElementById('brand-filter');
                const bfm = document.getElementById('brand-filter-mobile');
                if (bf) bf.value = '';
                if (bfm) bfm.value = '';
                applyFilters();
            }));
        }
        if (hasSort) {
            const sortLabels = { low: 'Price: Low→High', high: 'Price: High→Low', az: 'A→Z' };
            row.appendChild(makePill(sortLabels[_filterState.sort], () => {
                _filterState.sort = '';
                const sf = document.getElementById('sort-filter');
                const sfm = document.getElementById('sort-filter-mobile');
                if (sf) sf.value = '';
                if (sfm) sfm.value = '';
                applyFilters();
            }));
        }
        if (hasPriceMin || hasPriceMax) {
            row.appendChild(makePill(
                `₹${_filterState.priceMin.toLocaleString()} – ₹${_filterState.priceMax.toLocaleString()}`,
                () => {
                    _filterState.priceMin = 0;
                    _filterState.priceMax = _priceAbsMax;
                    ['price-min', 'price-min-mobile'].forEach(id => { const el = document.getElementById(id); if (el) el.value = el.min; });
                    ['price-max', 'price-max-mobile'].forEach(id => { const el = document.getElementById(id); if (el) el.value = el.max; });
                    updatePriceDisplay();
                    applyFilters();
                }
            ));
        }
    }

    function makePill(label, onRemove) {
        const pill = document.createElement('button');
        pill.className = 'filter-active-pill';
        pill.setAttribute('aria-label', `Remove filter: ${label}`);
        pill.innerHTML = `${label} <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
        pill.addEventListener('click', onRemove);
        return pill;
    }

    function updateFilterActiveDot() {
        const dot = document.getElementById('filter-active-dot');
        if (!dot) return;
        const hasBrand = _filterState.brand;
        const hasSort = _filterState.sort;
        const hasPriceMin = _filterState.priceMin > 0;
        const hasPriceMax = _filterState.priceMax < _priceAbsMax;
        dot.style.display = (hasBrand || hasSort || hasPriceMin || hasPriceMax) ? 'block' : 'none';
    }

    // ---- Global functions for mobile sheet ----
    window.openMobileFilter = function () {
        document.getElementById('mobile-filter-sheet').classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeMobileFilter = function () {
        document.getElementById('mobile-filter-sheet').classList.remove('open');
        document.body.style.overflow = '';
    };

    window.applyMobileFilters = function () {
        const bmf = document.getElementById('brand-filter-mobile');
        const smf = document.getElementById('sort-filter-mobile');
        const pmMin = document.getElementById('price-min-mobile');
        const pmMax = document.getElementById('price-max-mobile');

        if (bmf) {
            _filterState.brand = bmf.value;
            const bf = document.getElementById('brand-filter');
            if (bf) bf.value = bmf.value;
        }
        if (smf) {
            _filterState.sort = smf.value;
            const sf = document.getElementById('sort-filter');
            if (sf) sf.value = smf.value;
        }
        if (pmMin && pmMax) {
            _filterState.priceMin = parseInt(pmMin.value);
            _filterState.priceMax = parseInt(pmMax.value);
            const pmin = document.getElementById('price-min');
            const pmax = document.getElementById('price-max');
            if (pmin) pmin.value = pmMin.value;
            if (pmax) pmax.value = pmMax.value;
            updatePriceDisplay();
        }
        applyFilters();
    };

    window.clearAllFilters = function () {
        _filterState = { query: '', brand: '', sort: '', priceMin: 0, priceMax: _priceAbsMax };

        ['search-input', 'search-input-mobile'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        ['clear-search-btn', 'clear-search-mobile-btn'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
        ['brand-filter', 'brand-filter-mobile'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        ['sort-filter', 'sort-filter-mobile'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        ['price-min', 'price-min-mobile'].forEach(id => { const el = document.getElementById(id); if (el) el.value = el.min; });
        ['price-max', 'price-max-mobile'].forEach(id => { const el = document.getElementById(id); if (el) el.value = el.max; });

        updatePriceDisplay();
        applyFilters();
    };
});