# RC & Diecast — Design System Reference

> **Purpose**: This document is the single source of truth for all design decisions, tokens, component patterns, and rules for the RC & Diecast website. Refer to this before making any design change to maintain consistency.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Glassmorphism & Surface Language](#5-glassmorphism--surface-language)
6. [Component Library](#6-component-library)
   - [Dynamic Island Navigation](#61-dynamic-island-navigation)
   - [App Loader](#62-app-loader)
   - [Hero Kinetic Slider](#63-hero-kinetic-slider)
   - [Bento Card (Product Card)](#64-bento-card-product-card)
   - [Bento Grid Layout](#65-bento-grid-layout)
   - [Search & Filter Bar (Desktop)](#66-search--filter-bar-desktop)
   - [Mobile Search + Filter Sheet](#67-mobile-search--filter-sheet)
   - [Active Filter Pills](#68-active-filter-pills)
   - [Result Count Badge](#69-result-count-badge)
   - [Kinetic Marquee Footer](#610-kinetic-marquee-footer)
   - [Scroll-to-Top Button](#611-scroll-to-top-button)
   - [Scroll Indicator Arrow](#612-scroll-indicator-arrow)
   - [Section Headers](#613-section-headers)
   - [No Results State](#614-no-results-state)
7. [Animation & Motion](#7-animation--motion)
8. [Icons & SVG Rules](#8-icons--svg-rules)
9. [Product Data Rules](#9-product-data-rules)
10. [Z-Index Stack](#10-z-index-stack)
11. [External Dependencies](#11-external-dependencies)
12. [File Structure](#12-file-structure)
13. [Rules — What Never To Change](#13-rules--what-never-to-change)

---

## 1. Design Philosophy

The RC & Diecast website follows a **Kinetic App Experience** aesthetic. The core principles are:

| Principle | Description |
|-----------|-------------|
| **Ultra-Dark Monochrome** | All surfaces are pure black or near-black. No light backgrounds ever. |
| **Brand Orange as the Only Accent** | `#ff3d00` is the sole accent color. It is used sparingly as a highlight, never as a fill for large areas. |
| **Glassmorphism UI** | All floating UI elements (nav, filter bar, cards) use `backdrop-blur` + semi-transparent dark backgrounds. |
| **Typographic-led Layout** | Large, tight, extrabold lettering is a design element in itself, not just content. |
| **Micro-animations everywhere** | Every interactive element has a hover, transition, or entrance animation. No static state is acceptable. |
| **Mobile-first, App-feel** | The nav docks at the bottom on mobile (like an iOS app). Modals appear as bottom sheets. Touch swipe is natively supported. |
| **Grayscale → Color on interaction** | Product images start grayscale and reveal color on hover — creating dramatic reveals. |

---

## 2. Color Tokens

Defined in `tailwind.config.js`. **Always use these token names, never raw hex values in Tailwind classes.**

### Brand Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| `brand.orange` | `#ff3d00` | `bg-brand-orange`, `text-brand-orange`, `border-brand-orange` | Primary accent: CTAs, active states, highlights, prices |
| `brand.hover` | `#e53700` | `hover:bg-brand-hover` | Hover state for orange buttons |

### Surface Colors (Backgrounds)

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| `surface.950` | `#000000` | `bg-surface-950` | Page background, deepest layer |
| `surface.900` | `#050505` | `bg-surface-900` | Cards, nav background, slightly lifted |
| `surface.850` | `#0a0a0a` | `bg-surface-850` | Mid-elevation elements |
| `surface.800` | `#111111` | `bg-surface-800` | Highest lifted surfaces |

### Utility Colors (Tailwind defaults used directly)

| Usage | Class |
|-------|-------|
| Borders, dividers | `border-white/5`, `border-white/10` |
| Hover overlays | `hover:bg-white/10` |
| Body text on dark | `text-gray-400`, `text-gray-500`, `text-gray-600` |
| Text selection | `selection:bg-brand-orange selection:text-white` (set on `<body>`) |

### Background Gradients

| Name | Definition | Usage |
|------|------------|-------|
| `hero-vignette` | `linear-gradient(to top, #000 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)` | Hero slide overlay, bento card overlay |
| `app-glass` | `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))` | Footer glassmorphism hover overlay |

---

## 3. Typography

**Font**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — loaded via Google Fonts.

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
```

**Weights used**: 300 (light), 400 (regular), 700 (bold), 800 (extrabold).

### Type Scale

| Role | Size | Weight | Tailwind | Notes |
|------|------|--------|----------|-------|
| Hero Headline | `6rem` → `8rem` → `10rem` | 800 | `text-6xl md:text-8xl lg:text-[10rem]` | `tracking-tighter`, `leading-[0.85]` |
| Section Title | `2.25rem` → `4.5rem` | 800 | `text-4xl md:text-7xl` | `tracking-tighter` |
| Bento Card Title | `1.875rem` → `3rem` | 800 | `text-3xl lg:text-5xl` | `tracking-tighter`, `leading-[0.9]` |
| Footer Brand Logo | `2.25rem` → `3.75rem` | 800 | `text-4xl md:text-6xl` | `tracking-tighter` |
| Brand Tag / Label | `8px` | 800 | `text-[8px]` | Uppercase, `tracking-[0.2em]` |
| Section Eyebrow | `10px` → `14px` | 800 | `text-[10px] md:text-sm` | Uppercase, `tracking-[0.5em]` |
| Micro-label / Footer tag | `9px` | 700–800 | `text-[9px]` | Uppercase, `tracking-[0.3em]`–`[0.4em]` |
| Body / Description | `14px` → `20px` | 300 (light) | `text-sm md:text-xl` | `leading-relaxed`, `text-gray-400` |
| Price | `20px` → `30px` | 300 (light) | `text-xl md:text-3xl` | `tracking-tight` |

### Typography Rules

- **ALL labels, eyebrows, and badges** are `uppercase` with wide `letter-spacing`
- **Headings** always use `tracking-tighter` — never normal or loose tracking
- **`font-extrabold` (800)** is the dominant weight for all display text
- **`font-light` (300)** is used for body copy and prices to create contrast
- Never use mid-weights (500, 600) for display elements — they kill the premium feel

---

## 4. Spacing & Layout

### Container
```html
<div class="max-w-[1920px] mx-auto px-6 lg:px-12">
```
- Max width: `1920px` (ultra-wide support)
- Mobile padding: `24px` (`px-6`)
- Desktop padding: `48px` (`px-12`)

### Section Spacing
| Section | Top Padding | Bottom Padding |
|---------|-------------|----------------|
| Bento Showroom | `pt-32` (128px) | `pb-24` (96px) |
| Footer | `pt-32` (128px) | `pb-48 md:pb-24` |
| Between section header and content | `mb-12` |

### Grid System
The product grid uses a **12-column dense grid**:
```html
<div class="grid grid-cols-1 md:grid-cols-12 gap-6 grid-flow-row-dense">
```
- Mobile: **1 column**, full width
- Desktop: **12 columns**, `24px` gap
- Cards use asymmetric column spans (see Bento Card section)

### Border Radius Scale

| Size | Value | Usage |
|------|-------|-------|
| Small | `rounded-full` | Icon buttons, dots, pill badges |
| Medium | `rounded-[1rem]` | Mobile filter sheet action buttons |
| Large | `rounded-[1.5rem]` | Mobile search bar, filter trigger |
| XL | `rounded-[2rem]` | Bento cards, filter bar, nav |
| Full pill | `rounded-[99px]` | Filter active pills |

---

## 5. Glassmorphism & Surface Language

The "Dynamic Island" glass style is the core UI language for all floating elements.

### `.dynamic-island` (Tailwind utility class)
```css
.dynamic-island {
  backdrop-filter: blur(24px);        /* 2xl blur */
  background: rgba(0,0,0,0.70);       /* surface-950/70 */
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
```
**Used on**: Nav, scroll-to-top button, mobile filter trigger, mobile search bar.

### Filter Bar Glass (Desktop)
```css
background: rgba(5,5,5,0.85);
backdrop-filter: blur(24px);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 2rem;
```
**Focus ring** (orange glow on focus-within):
```css
box-shadow: 0 0 0 1px rgba(255,61,0,0.4), 0 20px 40px rgba(0,0,0,0.6);
```

### Mobile Filter Sheet Panel
```css
background: #050505;                           /* surface-900 */
border-top: 1px solid rgba(255,255,255,0.08);
border-radius: 2rem 2rem 0 0;                  /* rounded top only */
```

### Filter Dividers (within filter bar)
```css
width: 1px;
background: rgba(255,255,255,0.08);
margin: 6px 0;  /* doesn't stretch full height */
```

### Bento Card
```css
.bento-card {
  background: surface-900;               /* #050505 */
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 2rem;
  overflow: hidden;
  transition: border-color 500ms;
  box-shadow: xl;
}
.bento-card:hover {
  border-color: rgba(255,61,0,0.40);     /* brand-orange/40 */
}
```

---

## 6. Component Library

### 6.1 Dynamic Island Navigation

**Behavior**:
- Mobile (`< 768px`): Fixed at **bottom** of screen (`bottom-6`), hides on scroll-down, reappears on scroll-up
- Desktop (`≥ 768px`): Fixed at **top** of screen (`top-8`), slightly shrinks on scroll (`scale(0.95)`)

**Structure**:
```
[Home Icon] | [Grid Icon] | [Connect CTA (orange)]
```

**Key classes**: `fixed bottom-6 md:top-8 left-1/2 -translate-x-1/2 z-50 dynamic-island rounded-[2rem]`

**Connect CTA** (always orange):
```html
<a class="bg-brand-orange hover:bg-brand-hover shadow-[0_0_20px_rgba(255,61,0,0.3)]">
  <!-- Mobile: link icon | Desktop: "CONNECT" text -->
</a>
```

**Dividers between items**: `h-8 w-[1px] bg-white/10`

---

### 6.2 App Loader

Appears at `z-[9999]` on page load. Fades out once API data is fetched.

```html
<div id="loader" class="fixed inset-0 bg-surface-950 z-[9999] flex flex-col justify-center items-center">
  <h2 class="text-[10px] uppercase tracking-[0.5em] font-bold text-white mb-6">Connecting to Garage</h2>
  <div class="w-48 h-1 bg-surface-900 rounded-full overflow-hidden">
    <div id="loader-bar" class="h-full bg-brand-orange w-0"></div>
  </div>
</div>
```

- Bar color: `brand-orange`
- Text: micro-label style (`text-[10px] uppercase tracking-[0.5em]`)
- Animation: GSAP animates `#loader-bar` width from `0%` → `80%` → `100%` then fades out entire loader

---

### 6.3 Hero Kinetic Slider

**Section**: `#kinetic-hero` — full viewport height (`100svh`, `min-height: 100vh`)

**Data rule**: Only products with `slider: "yes"` AND `stock !== "OOS"` appear here. Up to 5 slides.

**Each slide anatomy** (injected by JS):
```
┌─────────────────────────────┐
│  [Full-bleed Product Image] │  grayscale, opacity-80, parallax
│  [Vignette overlay]         │  bg-hero-vignette
│  [Dark gradient top/bottom] │  opacity-90
│                             │
│  [Brand Eyebrow]  ← orange line + "BRAND EXCLUSIVE" text
│  [Model Name]     ← H1, massive, tracking-tighter
│  [Description]   ← gray-400, font-light, max-w-xl
└─────────────────────────────┘
```

**Slide controls (dots)**:
- Position: `absolute bottom-[15vh] left-6 md:left-12 z-40`
- Active dot: `w-16 h-1 bg-brand-orange rounded-full`
- Inactive dot: `w-16 h-1 bg-white/20 rounded-full`

**Mobile touch**: Horizontal swipe left/right to change slides (only if `|dx| > |dy|` and `|dx| > 40px`)

**Auto-play**: Every **6 seconds**

**Transition**: GSAP opacity crossfade `1.2s power2.inOut`, text re-animates from `y:60 opacity:0` → `y:0 opacity:1`

---

### 6.4 Bento Card (Product Card)

**Base class**: `.bento-card` — adds border, rounded corners, shadow, orange border on hover.

**Image behavior**:
- Default: `grayscale opacity-70`
- Hover: `grayscale-0 opacity-100 scale-105`
- Transition: `2000ms ease-out` (very slow, luxurious reveal)
- Height: `h-[110%]` with `parallax-img` class for GSAP scroll parallax
- Always add `onerror="this.src='/image/trx4m.jpg'"` as fallback

**Content overlay** (bottom aligned):
```
[Brand Badge — orange pill]
[Model Name — large bold]
[Price ₹XXX — light weight]       [Action buttons]
```

**Brand badge**:
```html
<span class="bg-brand-orange text-white text-[8px] px-3 py-1.5 rounded-full uppercase tracking-[0.2em] font-extrabold shadow-[0_0_15px_rgba(255,61,0,0.5)]">
```

**Price + actions visibility**:
- Mobile: `opacity-100` always
- Desktop: `opacity-0 translate-y-8` → `opacity-100 translate-y-0` on group hover (`800ms ease-out`)

**Action buttons** (48×48px, `rounded-[1.2rem]`):
| Button | Default | Hover |
|--------|---------|-------|
| YouTube | Transparent, `border-white/20` | `bg-[#ff0000]`, `border-[#ff0000]`, red glow |
| Instagram/Link | `bg-white text-black` | `bg-brand-orange text-white`, orange glow |

---

### 6.5 Bento Grid Layout

**Asymmetric 5-pattern cycle** (repeats every 5 cards):

| Position in cycle (`i % 5`) | Col Span | Min Height |
|-----------------------------|----------|------------|
| 0 | `md:col-span-8` (wide) | `450px` / `550px` desktop |
| 1 | `md:col-span-4 md:row-span-2` (tall) | `400px` / `800px` desktop |
| 2 | `md:col-span-4` | `400px` |
| 3 | `md:col-span-8` (wide) | `450px` / `550px` desktop |
| 4 | `md:col-span-4` | `400px` |

All cards: `col-span-1` on mobile (full width).

**Entrance animation**: GSAP stagger on initial load only:
```js
gsap.from(".bento-card", {
  scrollTrigger: { trigger: "#bento-gallery", start: "top 85%" },
  y: 100, opacity: 0, stagger: 0.15, duration: 1.5, ease: "power3.out"
});
```

**Filter re-render**: Uses a lightweight `opacity: 0 → 1` fade (`0.4s ease`), no stagger.

---

### 6.6 Search & Filter Bar (Desktop)

**Visible**: `md:flex` (hidden on mobile)  
**ID**: `#filter-bar`  
**Position**: Above `#bento-gallery`, below section header

```
[🔍 Search Input ............... ×] | [Brand ▾] | [Sort ▾] | [─Price Range─] | [Clear All]
```

**Sections separated by**: `.filter-divider` (1px `rgba(255,255,255,0.08)` vertical line)

**Search input** (`#search-input`):
- Placeholder color: `rgba(255,255,255,0.3)`
- Clear button (×): appears dynamically when text is entered, `rgba(255,255,255,0.08)` circular button

**Selects** (`.filter-select`):
- Background: `rgba(255,255,255,0.05)`
- Border: `1px solid rgba(255,255,255,0.1)`
- Custom chevron SVG (`rgba(255,255,255,0.4)`)
- Options background: `#050505`

**Price Range sliders** (`.price-slider`):
- Track: `2px rgba(255,255,255,0.15)`
- Thumb: `16px circle, #ff3d00, black border, orange glow`
- Hover thumb: `scale(1.25)`, stronger glow

**Clear All button**: Plain text, `rgba(255,255,255,0.3)` → `#ff3d00` on hover

---

### 6.7 Mobile Search + Filter Sheet

**Mobile search bar** (visible `md:hidden`):
- Height: `48px`, `border-radius: 1.5rem`
- Same glass style as `dynamic-island`
- Full-width minus the filter trigger button

**Filter trigger button** (`#open-mobile-filter`):
- `48×48px`, `border-radius: 1.5rem`, same glass style
- Contains funnel/filter SVG icon
- **Orange dot indicator** (`#filter-active-dot`, `7px circle`) appears when any filter (brand/sort/price) is active

**Bottom Sheet** (`#mobile-filter-sheet`):
- `z-index: 9998` (below loader, above content)
- Backdrop: blurred dark overlay (`blur(4px)`, `rgba(0,0,0,0.7)`)
- Panel slides up from bottom (`translateY(100%)` → `translateY(0)`) with `0.4s cubic-bezier(0.16, 1, 0.3, 1)`
- Handle bar: `40×4px`, `rgba(255,255,255,0.12)`
- `max-height: 85vh`, scrollable

**Sheet sections**:
1. Handle bar + title "Filters" + close ×
2. **Brand** dropdown (full width `filter-select`)
3. **Sort by** dropdown (full width `filter-select`)
4. **Price Range** dual sliders + live display
5. **[Clear All]** ghost button + **[Apply Filters]** orange CTA button

**Sheet section labels** (`.mobile-filter-label`):
```css
font-size: 9px; font-weight: 800; text-transform: uppercase;
letter-spacing: 0.25em; color: rgba(255,255,255,0.35);
```

---

### 6.8 Active Filter Pills

**Class**: `.filter-active-pill`

```css
background: rgba(255,61,0,0.15);
border: 1px solid rgba(255,61,0,0.35);
color: #ff3d00;
font-size: 10px; font-weight: 800;
text-transform: uppercase; letter-spacing: 0.1em;
padding: 4px 10px;
border-radius: 99px;
```

Each pill contains the filter value + a small `×` SVG. Clicking the pill removes that specific filter.  
Pills appear in `#active-filters-row` alongside the result count.

---

### 6.9 Result Count Badge

**ID**: `#result-count`

```css
font-size: 10px; font-weight: 800;
letter-spacing: 0.2em; text-transform: uppercase;
color: rgba(255,255,255,0.35);  /* default (no filter) */
```

When any filter is active → `.has-filter` class → `color: #ff3d00`

---

### 6.10 Kinetic Marquee Footer

**Section**: `#kinetic-footer`

**Content**:
- "Partners & Projects" micro-label
- Infinite scrolling brand names (`animate-marquee`, `25s linear infinite`)
- Brand wordmark `RC&D.` (large, `tracking-tighter`)
- Tagline: "Pure Scale Automotives"

**Marquee animation**:
```css
@keyframes marquee {
  0%   { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
```
The brand string is duplicated **4×** in the track so it loops seamlessly.

**Brand typography in marquee**:
- Mobile: `text-[5rem]`, `text-white/20`
- Desktop: `text-[12rem]`, `text-surface-900` (invisible until hover)
- Hover: `text-brand-orange`, transition `800ms`
- Separator: `×` character, `text-white/10`

---

### 6.11 Scroll-to-Top Button

**ID**: `#scrollToTopBtn`

- Uses `.dynamic-island` glass style
- `rounded-full`, `48×48px`
- Position: `fixed right-6 bottom-6 md:right-12 md:bottom-12 z-[100]`
- Hidden by default (`opacity-0 pointer-events-none translate-y-8`)
- Appears when `scrollY > 800px`
- Smooth scrolls to top via Lenis

---

### 6.12 Scroll Indicator Arrow

**ID**: `#scrollIndicator` — inside the hero section

- Position: `absolute bottom-24 md:bottom-12 right-6 md:right-12`
- Bouncing animation: `animate-bounce`
- Contains "EXPLORE" micro-label + circle with down arrow
- Circle style: `border border-white/30 bg-surface-950/30 backdrop-blur-md`

---

### 6.13 Section Headers

**Pattern** (used for "Precision Grid" section header):

```html
<!-- Eyebrow (orange, ultra-small caps) -->
<h2 class="text-[10px] md:text-sm text-brand-orange uppercase tracking-[0.5em] font-extrabold mb-4">
  Precision Grid
</h2>

<!-- Main Title (huge, tight) -->
<p class="text-4xl md:text-7xl font-extrabold tracking-tighter text-white">
  Curated Engineering.
</p>
```

- Center-aligned (`text-center`)
- Wrapped in `animate-liquid` for entrance fade-scale
- Margin below: `mb-12`

**`animate-liquid` keyframes**:
```css
@keyframes liquidScale {
  0%   { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
/* duration: 1.2s, cubic-bezier(0.16, 1, 0.3, 1), forwards */
```

---

### 6.14 No Results State

When filters produce 0 results, replaces grid content with:

```
[Empty search icon — stroke rgba(255,255,255,0.15)]
"No results found"      (0.7 opacity white, 800 weight)
"Try a different search term or clear your filters."  (0.25 opacity, max-w-240px)
[Clear Filters]  orange pill button
```

**Pill button** (in no-results):
```css
border-radius: 99px;
background: rgba(255,61,0,0.15);
border: 1px solid rgba(255,61,0,0.35);
color: #ff3d00;
```

---

## 7. Animation & Motion

### Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **GSAP** | 3.12.5 | All entrance animations, slide transitions, loader bar |
| **GSAP ScrollTrigger** | 3.12.5 | Parallax on product images, bento card scroll-entrance |
| **Lenis** | 1.1.9 | Smooth scroll engine; replaces native scroll |

### Smooth Scroll Settings (Lenis)
```js
{
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,  // CRITICAL: native touch scroll on mobile
  touchMultiplier: 2
}
```

> **⚠️ Single-tick rule**: Wire Lenis into GSAP ticker ONLY. Do NOT also add a `requestAnimationFrame(raf)` loop — that double-ticks Lenis and causes scroll jank.
```js
// ✅ CORRECT
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0, 0);
lenis.on('scroll', ScrollTrigger.update);

// ❌ WRONG — do not add this:
// function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
// requestAnimationFrame(raf);
```

### Parallax
Product images have a subtle upward parallax as the user scrolls:
```js
gsap.to(img, {
  yPercent: 15,
  ease: "none",
  scrollTrigger: { scrub: true, start: "top bottom", end: "bottom top" }
});
```
Images are sized `h-[110%]` (hero) or `h-[120%]` (bento) to ensure no white gaps during parallax.

**Important**: On filter re-render, `ScrollTrigger.getAll().forEach(st => st.kill())` must be called before `initParallax()` to avoid stacked triggers.

### Key Easing Values

| Use Case | Easing |
|----------|--------|
| Hero slide content reveal | `power3.out` |
| Slide fade crossfade | `power2.inOut` |
| Bento card entrance | `power3.out` |
| Filter sheet slide-up | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Loader bar | `power2.out` |
| Liquid scale (section headers) | `cubic-bezier(0.16, 1, 0.3, 1)` |

---

## 8. Icons & SVG Rules

- **All icons are inline SVG** — no icon library
- Icons use `stroke="currentColor"` for theming
- Standard icon size: `20×20` or `w-5 h-5` (nav contexts use `w-6 h-6`)
- Stroke width: `1.5` for nav icons, `2.5` for action buttons
- `stroke-linecap="round" stroke-linejoin="round"` always

**Common icon patterns**:
```html
<!-- Search -->
<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2.5">
  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
</svg>

<!-- Filter/Funnel -->
<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.5">
  <line x1="4" y1="6" x2="20" y2="6"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
  <line x1="11" y1="18" x2="13" y2="18"/>
</svg>

<!-- Arrow (diagonal, for link buttons) -->
<svg viewBox="0 0 24 24" fill="none" class="rotate-45" stroke="currentColor" stroke-width="2.5">
  <path d="M5 12h14M12 5l7 7-7 7"/>
</svg>

<!-- Play (YouTube) -->
<svg viewBox="0 0 24 24" fill="none" class="translate-x-[1px]" stroke="currentColor" stroke-width="2.5">
  <polygon points="5 3 19 12 5 21 5 3"/>
</svg>
```

---

## 9. Product Data Rules

Source: `/data/products.json`

### Product Object Schema

```json
{
  "productId": 1,
  "brandName": "Traxxas",
  "productName": "Trail Trucks",
  "modelName": "TRX-4 & TRX-4M",
  "rate": 2000,
  "slider": "yes",
  "stock": "stock",
  "ytLink": "https://...",
  "instaLink": "https://...",
  "WAlink": "",
  "rating": 5,
  "ImageURL": "https://rcanddiecast.com/image/...",
  "category": "RC",
  "productDec": "..."
}
```

### Display Rules

| Rule | Logic |
|------|-------|
| **OOS products** | `stock === "OOS"` → **hidden everywhere** (slider, grid, marquee) |
| **Slider** | `slider === "yes"` AND `stock !== "OOS"` → shown in hero slider (up to 5 slides) |
| **Product Grid** | ALL products where `stock !== "OOS"` → shown in bento grid |
| **Marquee** | Unique `brandName` values from all in-stock products |
| **Description truncation** | Hero slider shows first 140 characters + `...` |
| **Price format** | `₹${rate.toLocaleString()}` (Indian locale with commas) |
| **Image fallback** | `onerror="this.src='/image/trx4m.jpg'"` |

---

## 10. Z-Index Stack

| Layer | Z-Index | Element |
|-------|---------|---------|
| Loader | `9999` | `#loader` |
| Mobile Filter Sheet | `9998` | `#mobile-filter-sheet` |
| Scroll-to-Top Button | `100` | `#scrollToTopBtn` |
| Navigation | `50` | `<nav>` |
| Hero Slide Controls | `40` | `#hero-controls` |
| Scroll Indicator | `50` | `#scrollIndicator` |
| Hero slide (active) | `10` | `.hero-slide` (active) |
| Hero slide (inactive) | `0` | `.hero-slide` (inactive) |
| Bento content overlay | `10` | `.relative.z-10` inside bento card |
| Bento showroom section | `20` | `#bento-showroom` |

---

## 11. External Dependencies

All loaded via CDN in `index.html` (bottom of `<body>`):

```html
<script src="https://unpkg.com/lenis@1.1.9/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

> **⚠️ Do not upgrade versions without testing.** GSAP ScrollTrigger behavior can change between minor versions and break parallax.

---

## 12. File Structure

```
rc-and-diecast-website/
├── index.html          ← Single page; all HTML structure
├── app.js              ← All JavaScript; API fetch, rendering, animations, filter logic
├── input.css           ← Tailwind source; custom utilities and component classes
├── output.css          ← Compiled Tailwind output (DO NOT edit manually)
├── tailwind.config.js  ← Design tokens (colors, fonts, animations)
├── data/
│   └── products.json   ← Product data source (the API)
├── image/
│   └── ...             ← Local image fallbacks (e.g. trx4m.jpg, favicon.ico)
└── doc/
    └── design.md       ← This file
```

### CSS Build Command
```bash
npx tailwindcss -i ./input.css -o ./output.css
```
Run this every time you change `input.css` or `tailwind.config.js`.

---

## 13. Rules — What Never To Change

> These are **hard constraints**. Violating them will break the design integrity.

### ❌ Never Do

1. **Never add a light background** — every surface must be black or near-black
2. **Never use a color other than `#ff3d00` as an accent** — no blue, green, purple CTA buttons
3. **Never use font weights 500 or 600** for display text — only 300 (body) and 800 (headings)
4. **Never use `scroll-behavior: smooth` on `html`** — Lenis handles all smooth scrolling; native CSS smooth scroll conflicts
5. **Never skip `onerror` on product images** — the fallback is essential for broken remote images
6. **Never edit `output.css` directly** — it is auto-generated; edit `input.css` instead
7. **Never change the `heroSlides` data source** — only `slider: "yes"` + non-OOS products go in the hero
8. **Never show `stock: "OOS"` products anywhere** — not in slider, not in grid, not in marquee
9. **Never use heavy Tailwind stagger animations on filter re-renders** — the grid re-renders on every keystroke; it must use the lightweight `opacity` fade only
10. **Never add `overflow: hidden` to `<html>` or `<body>`** — Lenis needs unconstrained scroll height

### ✅ Always Do

1. **Rebuild CSS** (`npx tailwindcss -i ./input.css -o ./output.css`) after any class change
2. **Kill ScrollTrigger instances** before re-initializing parallax on any DOM re-render
3. **Sync desktop and mobile filter state** — both views must reflect the same `_filterState` object
4. **Use `loading="lazy"`** on all bento grid product images
5. **Maintain the `dynamic-island` class** on all floating UI elements (nav, scroll-to-top, filter trigger)
6. **Keep `smoothTouch: false`** in Lenis — critical for native mobile touch scrolling
7. **Use `tracking-tighter` on all display headings** — non-negotiable for the premium feel
8. **Add `aria-label` to all interactive controls** — accessibility is expected
9. **Always use `₹` (Indian Rupee) for prices with `.toLocaleString()`**
10. **Match new components to the existing glassmorphism pattern** — `backdrop-blur(24px)`, dark bg, `rgba(255,255,255,0.08)` border

---

*Last updated: March 2026 | Branch: `new-website`*
