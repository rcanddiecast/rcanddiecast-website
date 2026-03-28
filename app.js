document.addEventListener("DOMContentLoaded", () => {
    
    // ======== Minimal Smooth Scrolling (Lenis) ======== //
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ======== GSAP Registration ======== //
    gsap.registerPlugin(ScrollTrigger);

    // ======== Custom Mouse Cursor & Magnetic Hover ======== //
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (cursor && follower && !('ontouchstart' in window)) {
        let mouseX = 0, mouseY = 0;
        let pX = 0, pY = 0;
        
        // Track mouse
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move center dot
            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0.1,
                ease: "power2.out"
            });
            // Lagging follower
            gsap.to(follower, {
                x: mouseX,
                y: mouseY,
                duration: 0.8,
                ease: "power3.out"
            });
        });

        // Hover expanding links
        document.querySelectorAll('a, button, .link-hover').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });

        // Magnetic Effect
        document.querySelectorAll('.magnetic').forEach(elem => {
            elem.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(this, {
                    x: x * 0.4,
                    y: y * 0.4,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });
            elem.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // ======== Mobile Menu ======== //
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    let menuOpen = false;
    if(btn && menu) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            menuOpen = !menuOpen;
            if(menuOpen) {
                btn.innerText = "CLOSE";
                gsap.to(menu, { y: "0%", duration: 0.8, ease: "power4.inOut" });
            } else {
                btn.innerText = "MENU";
                gsap.to(menu, { y: "-100%", duration: 0.8, ease: "power4.inOut" });
            }
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                btn.innerText = "MENU";
                gsap.to(menu, { y: "-100%", duration: 0.8, ease: "power4.inOut" });
            });
        });
    }

    // ======== Loader & Hero Sequences ======== //
    function runIntroSequence() {
        const tl = gsap.timeline();
        
        // Loader wrap fade out
        tl.to(".loader-wrapper", {
            delay: 1.5,
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                document.getElementById('loader').style.display = 'none';
                ScrollTrigger.refresh();
            }
        })
        .from(".hero-bg-text", {
            y: 150,
            opacity: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: "power3.out"
        }, "-=0.8")
        .from(".hero-img", {
            scale: 1.5,
            duration: 2,
            ease: "power3.out"
        }, "-=1.5")
        .from(".hero-desc, .scroll-indicator", {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        }, "-=1");

        // Header appearing immediately after loader
        tl.from("#site-header", {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=1.5");

        // Set up Scroll Parallax
        gsap.to(".hero-img-container", {
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: 1.5
            },
            y: 150,
            opacity: 0
        });
        
        gsap.to(".hero-bg-text", {
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: 2
            },
            y: -100,
            x: 50
        });

        // Scroll-to-top logic
        const scrollBtn = document.getElementById("scroll-to-top");
        if(scrollBtn) {
            gsap.to(scrollBtn, {
                scrollTrigger: {
                    trigger: "#showroom",
                    start: "top center",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "back.out(1.7)"
            });

            scrollBtn.addEventListener('click', () => {
                lenis.scrollTo(0, { duration: 1.2, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            });
        }
    }

    // ======== API Fetch & Horizontal Showroom ======== //
    const API_URL = "https://script.google.com/macros/s/AKfycbxGi2nqIdiIz83Wi5vwERbQHsoKpDu7VVuny3EIegy4EU6KTta_TshEKqGaqFaOYamTYg/exec";
    
    // Fallback trigger if load fails or takes too long (3 seconds)
    const safetyTimer = setTimeout(() => {
        if(document.getElementById('loader').style.display !== 'none') {
            runIntroSequence();
            initHorizontalScroll(); // init empty or failed state
        }
    }, 3000);

    async function fetchData() {
        try {
            const resp = await fetch(API_URL);
            const data = await resp.json();
            
            clearTimeout(safetyTimer);
            
            // We load ALL data, without the stock filter, for massive gallery
            renderHorizontalGallery(data);
            
        } catch (err) {
            console.error(err);
            clearTimeout(safetyTimer);
            document.getElementById('api-gallery').innerHTML = `<h2 class="font-impact text-6xl text-white pl-20 uppercase">Data Stream Offline</h2>`;
            runIntroSequence();
            initHorizontalScroll();
        }
    }

    function renderHorizontalGallery(items) {
        const gallery = document.getElementById('api-gallery');
        gallery.innerHTML = '';

        items.forEach((item, index) => {
            const isEven = index % 2 === 0;
            const alignClass = isEven ? 'justify-end pb-20' : 'justify-start pt-20';
            
            gallery.innerHTML += `
                <div class="horizontal-item group">
                    <!-- Massive Background Title per item -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-10 font-impact text-[20vw] whitespace-nowrap z-0 select-none text-white overflow-hidden pointer-events-none group-hover:text-brand-orange group-hover:opacity-20 transition-all duration-700">
                        ${item.brandName}
                    </div>
                    
                    <div class="relative z-10 w-full md:w-4/5 ${alignClass} flex flex-col h-full mx-auto">
                        <div class="aspect-[4/5] rounded-sm overflow-hidden glass-dark p-2 w-full max-w-[400px]">
                             <img src="${item.ImageURL}" alt="${item.modelName}" class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none" onerror="this.src='https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1000'">
                        </div>
                        <div class="mt-8">
                            <h3 class="font-sans font-bold text-xs tracking-widest text-brand-orange uppercase">${item.category} • ${item.stock === 'stock' ? 'AVAILABLE' : 'ARCHIVED'}</h3>
                            <h2 class="font-impact text-4xl md:text-6xl text-white tracking-tighter mt-2 leading-none">${item.modelName}</h2>
                            <p class="font-sans text-xs text-gray-500 max-w-sm mt-4 tracking-wider uppercase">${item.brandName} // RATE ${item.rate} // RATING ${item.rating}/5</p>
                            
                            <div class="flex gap-4 mt-8">
                                ${item.ytLink ? `<a href="${item.ytLink}" target="_blank" class="magnetic link-hover px-6 py-3 border border-white/20 text-white font-sans text-xs tracking-widest font-bold hover:bg-white hover:text-black transition-colors">WATCH FILM</a>` : ''}
                                <a href="${item.instaLink || 'https://www.instagram.com/rcanddiecast/'}" target="_blank" class="magnetic link-hover px-6 py-3 bg-brand-orange text-white font-sans text-xs tracking-widest font-bold hover:bg-brand-hover transition-colors shadow-[0_0_30px_rgba(255,51,0,0.3)]">INQUIRE</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        // Intro and Scrolling triggers
        runIntroSequence();
        
        // Wait briefly for DOM to paint images before calculating widths
        setTimeout(initHorizontalScroll, 100);
    }

    function initHorizontalScroll() {
        const wrap = document.getElementById('api-gallery');
        const items = gsap.utils.toArray('.horizontal-item');
        
        if(items.length === 0) return;

        // Calculate total scroll distance
        const totalWidth = wrap.scrollWidth - window.innerWidth;
        
        gsap.to(items, {
            xPercent: -100 * (items.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: ".pin-wrap-container",
                pin: true,
                scrub: 1,
                // Make the scroll distance proportional to the number of items
                end: () => "+=" + wrap.scrollWidth
            }
        });

        // Fade in title
        gsap.to(".section-header", {
            scrollTrigger: {
                trigger: "#showroom",
                start: "top 80%"
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        });

        // Setup Restoration Parallax Images
        gsap.utils.toArray('.service-img-wrapper').forEach((img, i) => {
            const speed = img.dataset.speed || 1;
            gsap.from(img, {
                scrollTrigger: {
                    trigger: "#services",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                },
                y: 100 * speed,
                opacity: (i === 0) ? 0 : 0.8
            });
        });

        gsap.to(".service-text", {
             scrollTrigger: {
                 trigger: "#services",
                 start: "top 70%"
             },
             y: 0,
             opacity: 1,
             duration: 1.2,
             ease: "power3.out"
        });

        ScrollTrigger.refresh();
    }

    // Fire Fetch!
    fetchData();

});