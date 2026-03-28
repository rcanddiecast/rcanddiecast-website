document.addEventListener("DOMContentLoaded", () => {
    
    // ======== Smooth Scrolling (Lenis) ======== //
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ======== GSAP Registration ======== //
    gsap.registerPlugin(ScrollTrigger);

    // ======== Mobile Menu ======== //
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            menu.classList.toggle('hidden');
            menu.classList.toggle('flex');
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
            });
        });
    }

    // ======== Data Fetching & Rendering ======== //
    const API_URL = "https://script.google.com/macros/s/AKfycbxGi2nqIdiIz83Wi5vwERbQHsoKpDu7VVuny3EIegy4EU6KTta_TshEKqGaqFaOYamTYg/exec";
    
    let allProducts = [];
    const ITEMS_PER_PAGE = 8;
    let currentPage = 1;
    let loaded = false;

    function hideLoader() {
        if(loaded) return;
        loaded = true;
        const loader = document.getElementById("loader");
        if(loader) {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loader.style.display = 'none';
                    initHeroAnimations();
                }
            });
        } else {
            initHeroAnimations();
        }
    }

    // Fallback: hide loader after 3.5s no matter what
    setTimeout(hideLoader, 3500);

    async function fetchProducts() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            // Filter by stock
            allProducts = data.filter(item => item.stock === "stock");
            hideLoader();
            renderProducts();

        } catch (error) {
            console.error("Error fetching data:", error);
            // Provide fallback or error state
            const grid = document.getElementById('product-grid');
            if(grid) {
                grid.innerHTML = '<p class="text-brand-orange text-center col-span-full">Failed to load stock. Please try again later.</p>';
            }
            hideLoader();
        }
    }

    function renderProducts() {
        const grid = document.getElementById('product-grid');
        grid.innerHTML = ''; // Clear out skeletons
        
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentItems = allProducts.slice(startIndex, endIndex);

        currentItems.forEach((product, i) => {
            grid.innerHTML += `
                <div class="product-card glass rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 opacity-0 group">
                    <div class="relative aspect-square overflow-hidden bg-dark-900 border-b border-white/10">
                        <img src="${product.ImageURL}" alt="${product.modelName}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" onerror="this.src='https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1000'">
                        <div class="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            ${product.category}
                        </div>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="flex justify-between items-start gap-2">
                            <div>
                                <h3 class="font-bold text-xl leading-snug">${product.brandName}</h3>
                                <p class="text-sm text-gray-400 mt-1">${product.modelName}</p>
                            </div>
                            <!-- Rating -->
                            <div class="flex items-center gap-1 text-yellow-500 text-sm">
                                <span>★</span>
                                <span>${product.rating || 5}</span>
                            </div>
                        </div>
                        <p class="text-brand-orange font-mono font-bold text-lg">₹${product.rate}</p>
                        
                        <!-- Actions -->
                        <div class="pt-4 flex gap-3 border-t border-white/10">
                            ${product.ytLink ? `<a href="${product.ytLink}" target="_blank" class="flex-1 bg-white/5 hover:bg-brand-orange hover:text-white transition-colors text-center py-3 rounded-xl text-sm font-semibold tracking-wide flex justify-center items-center gap-2"><svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> Review</a>` : ''}
                            <a href="${product.instaLink || 'https://www.instagram.com/rcanddiecast/'}" target="_blank" class="flex-1 border border-brand-orange/30 text-brand-orange hover:bg-brand-orange hover:text-white transition-colors text-center py-3 rounded-xl text-sm font-semibold tracking-wide">Contact</a>
                        </div>
                    </div>
                </div>
            `;
        });

        renderPagination();

        // Animate newly added cards
        setTimeout(() => {
            gsap.to(".product-card", {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "all"
            });
            ScrollTrigger.refresh();
        }, 100);
    }

    function renderPagination() {
        const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
        const controls = document.getElementById('pagination-controls');
        controls.innerHTML = '';

        if (totalPages <= 1) return;

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.innerText = '←';
        prevBtn.className = `w-10 h-10 rounded-full flex items-center justify-center glass ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-orange hover:text-white'}`;
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => { if(currentPage > 1) { currentPage--; window.location.hash = "collection"; renderProducts(); } };
        controls.appendChild(prevBtn);

        // Page Numbers
        for(let i=1; i<=totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.innerText = i;
            pageBtn.className = `w-10 h-10 rounded-full flex items-center justify-center glass font-bold transition-colors ${i === currentPage ? 'bg-brand-orange text-white' : 'hover:bg-white/20'}`;
            pageBtn.onclick = () => { currentPage = i; window.location.hash = "collection"; renderProducts(); };
            controls.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.innerText = '→';
        nextBtn.className = `w-10 h-10 rounded-full flex items-center justify-center glass ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-orange hover:text-white'}`;
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => { if(currentPage < totalPages) { currentPage++; window.location.hash = "collection"; renderProducts(); } };
        controls.appendChild(nextBtn);
    }

    // ======== GSAP Animations ======== //
    function initHeroAnimations() {
        const tl = gsap.timeline();
        
        tl.from(".hero-content > *", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        })
        .from(".hero-image-inner", {
            scale: 0.8,
            rotationY: 15,
            rotationX: 5,
            opacity: 0,
            duration: 1.2,
            ease: "back.out(1.5)"
        }, "-=0.8");
    }

    // Scroll Animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    gsap.from(".service-img-container", {
        scrollTrigger: {
            trigger: "#services",
            start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    gsap.from(".service-content > *", {
        scrollTrigger: {
            trigger: "#services",
            start: "top 70%",
        },
        x: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
    });

    // Start fetching
    // Give loader minimal time to show before fetching, for wow effect
    setTimeout(() => {
        fetchProducts();
    }, 1000);

});