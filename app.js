document.addEventListener("DOMContentLoaded", () => {
    
    // ======== GSAP & Lenis Setup ======== //
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false,  // Critical: let native touch scroll work on mobile
        touchMultiplier: 2,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);

    // ======== Dynamic Island & Scroll to Top Logic ======== //
    let lastScroll = 0;
    const island = document.querySelector('.dynamic-island');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        
        // Hide on scroll down, show on scroll up (app feel)
        if(current > 200 && current > lastScroll && window.innerWidth < 768) {
            island.style.transform = 'translate(-50%, 150%) scale(0.9)';
        } else {
            island.style.transform = 'translate(-50%, 0) scale(1)';
        }
        
        if(window.innerWidth >= 768) {
             island.style.transform = current > 50 ? 'translate(-50%, -10px) scale(0.95)' : 'translate(-50%, 0) scale(1)';
        }

        // Scroll to top button visibility
        if(current > 800) {
            scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-8');
            scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');
        } else {
            scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-8');
            scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        }
        
        lastScroll = current;
    });

    if(scrollToTopBtn) {
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
            const products = data.filter(item => item.stock === 'stock');
            
            clearTimeout(safetyTimer);

            // Finish loader
            gsap.to("#loader-bar", { width: "100%", duration: 0.5, onComplete: () => {
                gsap.to("#loader", { opacity: 0, duration: 1, ease: "power2.inOut", onComplete: () => document.getElementById('loader')?.remove() });
            }});
            
            if (products.length === 0) return;

            // 1. Init Hero Slider (First 3)
            initHeroSlider(products);
            
            // 2. Init Bento Showroom (Remaining)
            renderBentoGrid(products.slice(3));
            
            // 3. Init Kinetic Marquee
            renderMarquee(products);
            
            // Parallax Images Initializer
            initParallax();

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

    function initHeroSlider(products) {
        heroSlides = products.slice(0, 3);
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

    window.goToSlide = function(index) {
        if(index === currentSlide) return;
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
            
            html += `
                <div class="${bentoClass} bento-card relative group flex flex-col justify-end">
                    <img src="${product.ImageURL}" class="absolute inset-0 w-full h-[110%] object-cover parallax-img origin-center grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2000ms] ease-out" data-speed="1.05" loading="lazy" onerror="this.src='/image/trx4m.jpg'">
                    <div class="absolute inset-0 bg-hero-vignette opacity-80 mix-blend-multiply transition-opacity duration-1000 group-hover:opacity-60"></div>
                    
                    <div class="relative z-10 p-8 flex flex-col items-start w-full">
                        <span class="bg-brand-orange text-white text-[8px] px-3 py-1.5 rounded-full uppercase tracking-[0.2em] font-extrabold mb-4 shadow-[0_0_15px_rgba(255,61,0,0.5)]">
                            ${product.brandName}
                        </span>
                        
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
});