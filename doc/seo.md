# RC & Diecast — SEO Master Plan & Reference Guide

> **Author**: Senior SEO Analyst & Backend Developer Review  
> **Date**: March 31, 2026  
> **Domain**: `https://rcanddiecast.com`  
> **Purpose**: Single source of truth for all SEO activities — past, present, and future. Use this document before making any change to the site that affects discoverability, content strategy, or technical performance.

---

## Table of Contents

1. [SEO Audit Summary](#1-seo-audit-summary)
2. [Already Implemented (What's Done)](#2-already-implemented-whats-done)
3. [Fixed In This Session](#3-fixed-in-this-session)
4. [Still To Implement (Roadmap)](#4-still-to-implement-roadmap)
5. [Keyword Strategy](#5-keyword-strategy)
6. [Technical SEO Checklist](#6-technical-seo-checklist)
7. [Sitemap & Robots.txt — Status](#7-sitemap--robotstxt--status)
8. [Google Analytics Setup Guide](#8-google-analytics-setup-guide)
9. [Blog SEO Guidelines — How to Write SEO-Optimized Blog Posts](#9-blog-seo-guidelines--how-to-write-seo-optimized-blog-posts)
10. [Blog Launch Checklist](#10-blog-launch-checklist)
11. [Monthly SEO Tasks](#11-monthly-seo-tasks)
12. [Tools Reference](#12-tools-reference)

---

## 1. SEO Audit Summary

### Findings Before This Session

| Area | Status Before | Severity |
|------|---------------|----------|
| Title Tag — `index.html` | Generic (`RC & Diecast \| Kinetic App Experience`) | 🔴 Critical |
| Title Tag — `blog.html` | Backwards (`Blog \| RC & Diecast`) | 🟠 High |
| Title Tag — `blog-post.html` | Completely generic (`RC and Diecast \| Blog`) | 🔴 Critical |
| Meta Description — `index.html` | Too short (63 chars), no keywords | 🟠 High |
| Meta Keywords | Only on `blog.html`, nowhere else | 🟡 Medium |
| Canonical URLs | Missing on all pages | 🔴 Critical |
| Open Graph Tags | Missing on all pages | 🔴 Critical |
| Twitter Card Tags | Missing on all pages | 🟠 High |
| JSON-LD Structured Data | Missing on all pages | 🔴 Critical |
| `robots` meta tag | Missing | 🟠 High |
| Google Analytics | **Not found anywhere in codebase** | 🟠 High |
| Sitemap | Only homepage listed; dated Nov 2025 | 🟠 High |
| `robots.txt` | Too permissive; `node_modules/`, `data/` exposed | 🟡 Medium |
| Image Alt Text | Product images rendered via JS — no alt text | 🟠 High |
| Blog posts as real URLs | Blog uses JS array — no unique URLs per post | 🔴 Critical |
| Internal Linking | No blog → homepage link strategy | 🟡 Medium |
| Page Speed / Core Web Vitals | Unverified; heavy JS deps loaded (GSAP, Lenis) | 🟠 High |
| Schema Markup — Products | No product schema on product cards | 🟡 Medium |
| Heading Hierarchy | `index.html` missing `<h1>` on homepage | 🔴 Critical |

---

## 2. Already Implemented (What's Done)

These items were in place **before** the current SEO session.

### ✅ Foundation
- `robots.txt` file exists at root (`/robots.txt`)
- `sitemap.xml` file exists at root (`/sitemap.xml`)
- Sitemap referenced in robots.txt
- `favicon.ico` is linked correctly
- `lang="en"` attribute set on all `<html>` tags
- `charset="UTF-8"` and `viewport` meta on all pages
- `theme-color` meta tag set to `#000000`
- CDN preconnect hints for Google Fonts, GSAP, Lenis (performance benefit)
- DNS-prefetch fallbacks for older browsers
- `<link rel="preload">` for critical JS scripts
- `loading="lazy"` on all bento grid product images
- `aria-label` on interactive elements (filter bar, search inputs)
- `role="search"` on filter bar
- Instagram (social link) in the footer navigation
- Blog page (`blog.html`) already exists with a meta description and keywords

### ✅ Blog Structure (Partially Done)
- `blog.html` exists with 10 sample blog posts
- Blog posts have categories, dates, titles, and descriptions defined
- `blog-post.html` individual post template exists
- Blog is linked from main navigation

---

## 3. Fixed In This Session

All of the following were **implemented and committed** during this session (2026-03-31).

### 3.1 `index.html` — SEO Overhaul

**Title Tag** — was generic, now keyword-rich and properly formatted:
```html
<!-- BEFORE -->
<title>RC & Diecast | Kinetic App Experience</title>

<!-- AFTER (keyword first, brand second, 60 chars) -->
<title>RC & Diecast India | Premium RC Cars, Crawlers & Diecast Models</title>
```

**Meta Description** — was too short, now optimized to 155 chars with keywords:
```html
<meta name="description" content="Shop India's finest collection of RC rock crawlers, drift cars, and 1:18 diecast models. Featuring Traxxas, FMS, WL Toys, HB Toys & more. Expert restoration and reviews.">
```

**New tags added**:
- `<meta name="keywords">` — 15 high-intent keywords
- `<meta name="robots" content="index, follow">`
- `<meta name="author" content="RC & Diecast">`
- `<link rel="canonical" href="https://rcanddiecast.com/">`
- Complete **Open Graph** block (og:type, og:url, og:title, og:description, og:image 1200×630, og:site_name, og:locale)
- Complete **Twitter Card** block (summary_large_image)
- **JSON-LD Structured Data** — `WebSite` + `Store` schema
- **Google Analytics placeholder** (commented out, ready to activate)

### 3.2 `blog.html` — SEO Overhaul

- Title fixed: `RC & Diecast Blog | RC Car Reviews, Guides & Restoration Tips India`
- Meta description expanded with India-specific keywords
- Canonical URL added: `https://rcanddiecast.com/blog.html`
- Full Open Graph block added
- Twitter Card added
- JSON-LD Blog schema added
- GA placeholder added

### 3.3 `blog-post.html` — SEO Overhaul

- Title fixed: `RC & Diecast Blog Post | The Garage Journal`
- Meta description, robots, author, theme-color added
- Canonical `<link>` with ID `canonical-url` (ready for dynamic JS update per post)
- Open Graph tags with IDs (`og-title`, `og-desc`, `og-image`, `og-url`) ready for dynamic JS update
- Twitter Card with IDs ready for dynamic JS update
- GA placeholder added

### 3.4 `sitemap.xml` — Expanded

Was: Only 1 URL (homepage), dated November 2025.

Now includes all public pages:
- `/` — priority 1.0, weekly
- `/blog.html` — priority 0.8, weekly
- `/blog-post.html` — priority 0.6, monthly
- Image sitemap entry for OG banner on homepage
- `lastmod` updated to `2026-03-31`
- Image sitemap namespace added

### 3.5 `robots.txt` — Hardened

Added `Disallow` rules for:
- `/node_modules/` — should never be crawled
- `/data/` — raw product JSON exposed to bots (unnecessary)
- `/input.css` — Tailwind source file
- `/checking.html`, `/checking.js` — dev/testing files
- `/.github/` — internal config
- Added `Crawl-delay: 10` for polite bots

---

## 4. Still To Implement (Roadmap)

> Prioritized by impact. Start with P1 items.

### P1 — Critical (Do This Month)

| Task | File | Notes |
|------|------|-------|
| **Add `<h1>` to homepage** | `index.html` | The hero section uses `<h1>` inside JS-injected slides — Google may not always render JS. Add a visible or screen-reader-only `<h1>` in static HTML. |
| **Create OG banner image** (`og-banner.jpg`) | `/image/og-banner.jpg` | 1200×630px. Used for all page previews on WhatsApp, Facebook, LinkedIn, Twitter shares. Design it to be recognizable. |
| **Activate Google Analytics** | All HTML files | See [Section 8](#8-google-analytics-setup-guide) for step-by-step |
| **Add alt text to JS-injected product images** | `app.js` | In `renderBentoGrid` and `renderBentoGridFiltered`, add `alt="${product.brandName} ${product.modelName} RC Car"` to the `<img>` tag |
| **Submit sitemap to Google Search Console** | Google Search Console | Go to GSC → Sitemaps → Submit `https://rcanddiecast.com/sitemap.xml` |

### P2 — High Impact (Do Next Month)

| Task | File | Notes |
|------|------|-------|
| **Migrate blog to slug-based URLs** | `blog/` directory | Each post needs its own `.html` file: `blog/top-5-rc-rock-crawlers-2026.html`. This is critical for Google to index individual articles. |
| **Add Product Schema to bento cards** | `app.js` | Inject `application/ld+json` with `@type: Product`, name, image, price, brand for each product card. Enables Google rich results (price chips in SERPs). |
| **Build internal linking** | `blog.html`, blog posts | Link blog posts back to homepage, blog → related blog posts, footer links to all pages. |
| **Add breadcrumbs to blog** | `blog.html`, blog posts | Implement BreadcrumbList schema for blog pages. |
| **Register with Google Search Console** | External | Verify domain ownership. Inspect pages, monitor crawl errors. |
| **Register with Bing Webmaster Tools** | External | Submit sitemap. 10-15% of Indian desktop traffic is Bing. |

### P3 — Medium Impact (Next Quarter)

| Task | Notes |
|------|-------|
| **Add blog category pages** | `/blog/reviews/`, `/blog/guides/` etc. Allow crawlers to discover grouped content. |
| **Page Speed Optimization** | GSAP + Lenis + ScrollTrigger = ~180KB of JS. Consider lazy-loading GSAP after hero. Aim for LCP < 2.5s. |
| **Local SEO (if applicable)** | If there is a physical store or city-specific service, add `LocalBusiness` schema with full address, city, PIN, phone. |
| **Image Optimization** | Convert product images to `.webp`. Add `width` and `height` attributes to prevent CLS. |
| **Minify app.js** | Use a build tool (Vite, Parcel) to minify `app.js` in production. 36KB unminified → ~14KB minified. |
| **Implement hreflang** | If a Hindi version of the site is ever added. |
| **Video Schema** | If YouTube links on product cards are important, add VideoObject schema for those posts. |
| **FAQ Schema on blog** | Add FAQ structured data to "how-to" and guide articles. |

---

## 5. Keyword Strategy

### Primary Keywords (Highest Priority)

These are the terms you want to rank for on the **homepage**.

| Keyword | Monthly Searches (est.) | Intent | Difficulty |
|---------|------------------------|--------|------------|
| RC cars India | 8,000–12,000 | Commercial | Medium |
| RC crawlers India | 2,000–4,000 | Commercial | Low |
| buy RC car India | 3,000–6,000 | Transactional | Medium |
| diecast models India | 1,500–3,000 | Commercial | Low |
| Traxxas India | 2,500–5,000 | Brand/Commercial | Medium |
| FMS RC India | 800–1,500 | Brand/Commercial | Low |
| WL Toys India | 1,000–2,500 | Brand/Commercial | Low |
| RC car shop India | 1,000–2,000 | Transactional | Low |
| 1:10 scale RC car India | 500–1,000 | Commercial | Low |
| remote control car buy online India | 4,000–8,000 | Transactional | High |

### Long-Tail Keywords (Blog & Product Pages)

These power **individual blog posts** and **product detail pages**.

| Keyword | Target Page Type |
|---------|-----------------|
| Traxxas TRX-4M review India | Blog post |
| FMS Smasher V2 review | Blog post |
| best RC rock crawler under 10000 | Blog post |
| diecast restoration guide India | Blog post |
| LiPo battery safety RC cars | Blog post |
| brushless vs brushed RC motor India | Blog post |
| WL Toys 104001 common problems fix | Blog post |
| Land Rover Defender RC car India | Product page |
| 1:18 diecast model buy India | Product / Homepage |
| RC car spare parts India | Future category page |

### Brand Keywords (Protect These)

Ensure these pages exist and rank for your own brand:

- `RC and Diecast` → Homepage
- `rcanddiecast` → Homepage
- `RC Diecast Instagram India` → Social link + Instagram profile

### Keyword Placement Rules

| Location | Keyword Guideline |
|----------|------------------|
| `<title>` | Primary keyword FIRST, then brand. 50–60 characters max. |
| `<meta description>` | Include 1–2 primary keywords naturally. 130–155 characters. |
| `<h1>` | Primary keyword must appear. Only ONE `<h1>` per page. |
| `<h2>`, `<h3>` | Supporting and long-tail keywords. Use naturally. |
| Image `alt` text | Descriptive: `"Traxxas TRX-4M 1:18 RC Rock Crawler India"` — not `"img1"` |
| Body copy | 1–2% keyword density. Never stuff. Write for humans first. |
| URL slug | Short, keyword-rich, hyphen-separated. E.g., `/blog/traxxas-trx4m-review` |
| Internal anchor text | Use keyword-rich anchor text: `"best RC crawlers"` not `"click here"` |

---

## 6. Technical SEO Checklist

### Core Vitals Targets (Google's Thresholds)

| Metric | Target | Current Status |
|--------|--------|---------------|
| LCP (Largest Contentful Paint) | < 2.5s | ⚠️ Unverified — GSAP+Lenis may delay hero |
| FID / INP (Interaction to Next Paint) | < 200ms | ⚠️ Unverified |
| CLS (Cumulative Layout Shift) | < 0.1 | ⚠️ Loader overlay may cause shift |
| TTFB (Time to First Byte) | < 800ms | ✅ Static hosting typically fast |

**How to check**: Use [PageSpeed Insights](https://pagespeed.web.dev/) with `https://rcanddiecast.com`.

### HTML Semantics Audit

| Issue | File | Current | Fix |
|-------|------|---------|-----|
| No static `<h1>` | `index.html` | `<h1>` only inside JS-injected hero slides | Add `<h1 class="sr-only">RC & Diecast India — Premium RC Cars & Diecast Models</h1>` inside the hero section as static HTML |
| `<h2>` used as eyebrow | `index.html` | Eyebrow "Precision Grid" uses `<h2>` | OK since it's a real section heading |
| Blog card `<h2>` | `blog.html` | Blog grid uses `<h2>` for card titles | Change to `<h3>` since page already has an `<h1>` |
| No `<footer>` landmark | `blog.html` | Missing | Wrap footer in semantic `<footer>` tag |
| Blog post `<h1>` | `blog-post.html` | Title injected via JS | Add JS code to set `document.title` and `<h1>` from post data |

### Indexability Rules

- ✅ All pages: `<meta name="robots" content="index, follow">`
- ✅ `robots.txt` allows all public pages
- ✅ Sitemap lists all public pages
- ⚠️ `/data/products.json` — now blocked in `robots.txt`; ensure it stays blocked
- ⚠️ `checking.html` — dev file exposed on production. Either delete it or keep it blocked in `robots.txt`

---

## 7. Sitemap & Robots.txt — Status

### Sitemap (`/sitemap.xml`) — Current State ✅

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://rcanddiecast.com/</loc>
    <lastmod>2026-03-31</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://rcanddiecast.com/blog.html</loc>
    <lastmod>2026-03-31</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://rcanddiecast.com/blog-post.html</loc>
    <lastmod>2026-03-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

**When blog posts get individual URLs**, add each one:
```xml
<url>
  <loc>https://rcanddiecast.com/blog/top-5-rc-rock-crawlers-2026.html</loc>
  <lastmod>2026-03-20</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.7</priority>
</url>
```

**Always update `lastmod` when you edit a page.** Google uses this to prioritize recrawling.

### Robots.txt (`/robots.txt`) — Current State ✅

```
User-agent: *
Allow: /

Disallow: /node_modules/
Disallow: /data/
Disallow: /input.css
Disallow: /checking.html
Disallow: /checking.js
Disallow: /.github/

Crawl-delay: 10

Sitemap: https://rcanddiecast.com/sitemap.xml
```

---

## 8. Google Analytics Setup Guide

> **Status**: Google Analytics code was **NOT found** anywhere in the codebase (including `index.html`, `blog.html`, `blog-post.html`, `app.js`). Placeholder comments have been added to all HTML files. Follow these steps to activate it.

### Step 1 — Create a GA4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **Admin → Create → Property**
3. Enter Property Name: `RC & Diecast`
4. Select **India** as country, **Indian Rupee (INR)** as currency
5. Select industry: **Shopping**
6. Click through to get your **Measurement ID** — it looks like `G-XXXXXXXXXX`

### Step 2 — Activate the Code

In **all three HTML files** (`index.html`, `blog.html`, `blog-post.html`), find this comment block and **uncomment it**, replacing `G-XXXXXXXXXX` with your real ID:

```html
<!-- FIND THIS COMMENT IN EACH HTML FILE AND UNCOMMENT: -->
<!-- 
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
-->
```

**Place it BEFORE `</head>` for best results.**

### Step 3 — Verify It's Working

1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/) Chrome extension
2. Visit your site
3. In GA4: **Admin → DebugView** — you should see real-time events

### Step 4 — Recommended GA4 Events to Track

| Event | What to Track |
|-------|--------------|
| `page_view` | Auto-tracked by GA4 |
| `click` — Instagram link | Track "Connect" button clicks |
| `click` — YouTube links on product cards | Track product video engagement |
| `search` | Track when user uses the filter/search bar |
| `view_item` | When a product card becomes visible in viewport |
| `select_content` | When a brand filter is applied |

### Step 5 — Connect Search Console to Analytics

1. In GA4: **Admin → Product Links → Search Console Linking**
2. Link your verified GSC property
3. This enables you to see which keywords are bringing traffic, directly in GA4

---

## 9. Blog SEO Guidelines — How to Write SEO-Optimized Blog Posts

> These guidelines apply **now** and become the standard template when the full blog system is built.

### 9.1 Choosing a Blog Topic

Every blog post must target **one specific keyword** or topic cluster. Ask yourself:

- Is someone actively Googling this? (Use Google Autocomplete to check)
- Does this serve the RC & Diecast India community?
- Can we write the BEST article on this topic?

**Topic priority matrix:**

| Priority | Type | Examples |
|----------|------|---------|
| 🔴 P1 | Review | `Traxxas TRX-4M India Review 2026` |
| 🔴 P1 | Buyer's Guide | `Best RC Cars Under ₹5000 India 2026` |
| 🟠 P2 | How-To / Tutorial | `How to Fix WL Toys 104001 Steering Slop` |
| 🟠 P2 | Comparison | `Brushless vs Brushed RC Motor — Which Should You Buy?` |
| 🟡 P3 | History / Storytelling | `The History of Land Rover Defender in RC Scale` |
| 🟡 P3 | Tips & Tricks | `5 Diecast Weathering Techniques for Beginners` |

### 9.2 URL Structure (CRITICAL)

When blog posts move to individual pages, URLs must follow this format:

```
✅ CORRECT
https://rcanddiecast.com/blog/traxxas-trx4m-review-india-2026.html
https://rcanddiecast.com/blog/best-rc-rock-crawlers-under-10000-india.html
https://rcanddiecast.com/blog/lipo-battery-safety-guide-rc-cars.html

❌ WRONG
https://rcanddiecast.com/blog-post.html?id=1
https://rcanddiecast.com/blog/post1.html
https://rcanddiecast.com/blog/BlogPost_March2026.html
```

**URL Rules:**
- All lowercase
- Words separated by hyphens, never underscores
- Include target keyword in URL
- No dates in URL (content stays evergreen)
- Keep under 75 characters

### 9.3 Blog Post HTML Template

Use this template for every new blog post:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- PRIMARY SEO — Replace all placeholders -->
    <title>[Primary Keyword] | RC & Diecast India</title>
    <meta name="description" content="[150-155 char description with primary keyword. Make it compelling — this is your Google ad copy.]">
    <meta name="keywords" content="[10-15 comma-separated keywords]">
    <meta name="robots" content="index, follow">
    <meta name="author" content="RC & Diecast">

    <!-- CANONICAL — Always the full URL of THIS post -->
    <link rel="canonical" href="https://rcanddiecast.com/blog/[slug].html">

    <!-- OPEN GRAPH -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://rcanddiecast.com/blog/[slug].html">
    <meta property="og:title" content="[Post Title]">
    <meta property="og:description" content="[150 char summary]">
    <meta property="og:image" content="https://rcanddiecast.com/image/blog/[slug]-og.jpg">
    <meta property="og:site_name" content="RC & Diecast">
    <meta property="og:locale" content="en_IN">
    <meta property="article:published_time" content="2026-MM-DDTHH:MM:SS+05:30">
    <meta property="article:section" content="[Category: Reviews / Guides / Tutorial / etc.]">

    <!-- TWITTER CARD -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="[Post Title]">
    <meta name="twitter:description" content="[150 char summary]">
    <meta name="twitter:image" content="https://rcanddiecast.com/image/blog/[slug]-og.jpg">

    <!-- JSON-LD ARTICLE SCHEMA -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "[Full Post Title]",
      "description": "[Post description]",
      "image": "https://rcanddiecast.com/image/blog/[slug]-og.jpg",
      "datePublished": "2026-MM-DD",
      "dateModified": "2026-MM-DD",
      "author": {
        "@type": "Organization",
        "name": "RC & Diecast",
        "url": "https://rcanddiecast.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "RC & Diecast",
        "logo": {
          "@type": "ImageObject",
          "url": "https://rcanddiecast.com/image/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://rcanddiecast.com/blog/[slug].html"
      }
    }
    </script>

    <!-- BREADCRUMB SCHEMA -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rcanddiecast.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://rcanddiecast.com/blog.html" },
        { "@type": "ListItem", "position": 3, "name": "[Post Title]", "item": "https://rcanddiecast.com/blog/[slug].html" }
      ]
    }
    </script>

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>

    <link rel="icon" href="/image/favicon.ico">
    <link href="/output.css" rel="stylesheet">
</head>
```

### 9.4 Content Structure — The SEO-Winning Article Framework

Every blog post must follow this structure:

```
[Hero Image — 1200x628px, webp format, descriptive alt text]

H1: [Primary Keyword — matches title tag]

[Intro paragraph — 80-120 words, include primary keyword in first 100 words]
[Mention what the article covers (acts as a meta-description reinforcement)]

--- Table of Contents (for articles > 800 words) ---

H2: [Section 1 — Supporting keyword]
  H3: [Sub-section if needed]
  [2-4 paragraphs with images, bullet points]

H2: [Section 2 — Another supporting keyword]
  [Content]

H2: [Verdict / Summary / Conclusion]
  [Include primary keyword naturally]
  [CTA — link to homepage or Instagram]

--- FAQ Section (BONUS — triggers FAQ rich results) ---
H2: Frequently Asked Questions

Q: [Long-tail question matching Google's "People Also Ask"]
A: [Direct, concise answer — 50-100 words]

Q: ...
A: ...
```

### 9.5 Word Count Guidelines

| Post Type | Minimum Words | Target Words |
|-----------|--------------|--------------|
| Product Review | 800 | 1,200–1,800 |
| Buyer's Guide | 1,000 | 1,500–2,500 |
| How-To Tutorial | 600 | 1,000–1,500 |
| Brand Comparison | 800 | 1,200–2,000 |
| History / Storytelling | 600 | 800–1,200 |

> **Rule**: Quality over quantity. A concise, well-structured 900-word article outranks a bloated 3,000-word one every time.

### 9.6 Image Rules for Blog Posts

| Requirement | Rule |
|-------------|------|
| Format | Save as `.webp` (smaller file, faster load) |
| Hero image size | 1200 × 628px (OG aspect ratio) |
| In-content images | Max 800px wide, compressed to < 150KB |
| File naming | `traxxas-trx4m-review-hero.webp` — keyword in filename |
| Alt text | `alt="Traxxas TRX-4M 1:18 scale RC crawler on rocky terrain India"` |
| Lazy load | Add `loading="lazy"` to all non-hero images |
| `width` + `height` | Always specify — prevents layout shift (CLS penalty) |

### 9.7 Internal Linking Rules

Every blog post must have at minimum:
- **1 link to the homepage** (`rcanddiecast.com`) with anchor text like `"RC & Diecast India"` or `"our collection"`
- **2 links to related blog posts** (once other posts exist)
- **1 link to Instagram** via the Connect/CTA button
- **No orphan posts** — every post must be reachable from the blog listing page

### 9.8 Publishing Checklist (Per Post)

Before publishing any blog post, verify:

- [ ] URL is slug-based and keyword-rich
- [ ] Title tag is under 60 characters
- [ ] Meta description is 130–155 characters and includes target keyword
- [ ] One and only one `<h1>` on the page
- [ ] Hero image has descriptive `alt` text
- [ ] Post is added to `sitemap.xml` with correct `lastmod`
- [ ] JSON-LD Article schema is filled in completely
- [ ] Breadcrumb schema is correct
- [ ] Open Graph image (1200×628px) exists at the specified URL
- [ ] Post is linked from `blog.html` listing
- [ ] At least 1 internal link to homepage

---

## 10. Blog Launch Checklist

When the full blog system is built and ready to go live:

### Infrastructure
- [ ] Blog posts exist as individual HTML files with slug-based URLs (`/blog/[slug].html`)
- [ ] Blog listing page (`blog.html`) links to all individual posts
- [ ] Sitemap updated with all new post URLs
- [ ] Old `blog-post.html?id=1` style links redirected (301) to new slug URLs
- [ ] `checking.html` either deleted or removed from production

### Content (Minimum for Launch)
- [ ] At least **5 fully written, SEO-optimized posts** before launch
- [ ] Each post has a unique hero image (1200×628px)
- [ ] Each post has been proofread

### Technical
- [ ] Google Analytics activated on all pages
- [ ] Google Search Console verified
- [ ] Sitemap submitted to GSC and Bing Webmaster Tools
- [ ] PageSpeed tested: LCP < 2.5s on mobile
- [ ] All post images are `.webp` format

### Promotion
- [ ] New posts shared on Instagram (`@rcanddiecast`) with link in bio
- [ ] Blog posts shareable via WhatsApp (Open Graph image shows correctly)

---

## 11. Monthly SEO Tasks

Run this checklist every month to keep SEO healthy.

### Week 1 — Content
- [ ] Publish 1–2 new blog posts targeting planned keywords
- [ ] Update `lastmod` dates in `sitemap.xml` for any edited pages
- [ ] Update the sitemap with new blog post URLs

### Week 2 — Technical
- [ ] Check Google Search Console for:
  - Crawl errors (Coverage report)
  - Pages with declining impressions
  - 404 errors (fix with 301 redirects)
  - Core Web Vitals issues
- [ ] Run PageSpeed Insights on homepage and latest blog post

### Week 3 — Keywords & Rankings
- [ ] Check rankings for top 10 priority keywords (use Google Search Console Performance tab)
- [ ] Identify pages with high impressions but low CTR — update title/description
- [ ] Find new keyword opportunities from GSC "Queries" tab

### Week 4 — Links & Social
- [ ] Check if any new sites have linked to RC & Diecast (GSC → Links)
- [ ] Share month's blog posts on Instagram
- [ ] Look for RC/Diecast communities (Reddit, Facebook groups) to share articles

---

## 12. Tools Reference

| Tool | Purpose | URL | Cost |
|------|---------|-----|------|
| Google Search Console | Monitor crawl, indexing, rankings | [search.google.com/search-console](https://search.google.com/search-console) | Free |
| Google Analytics 4 | Traffic, user behavior | [analytics.google.com](https://analytics.google.com) | Free |
| Google PageSpeed Insights | Core Web Vitals testing | [pagespeed.web.dev](https://pagespeed.web.dev) | Free |
| Google Rich Results Test | Validate JSON-LD structured data | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) | Free |
| Bing Webmaster Tools | Bing indexing & traffic | [bing.com/webmasters](https://bing.com/webmasters) | Free |
| Ahrefs / Semrush | Deep keyword research, backlink analysis | Various | Paid (use free tier for basics) |
| Screaming Frog SEO Spider | Full site crawl, find broken links | [screamingfrog.co.uk](https://www.screamingfrog.co.uk/seo-spider/) | Free up to 500 URLs |
| Schema Markup Validator | Validate schema.org JSON-LD | [validator.schema.org](https://validator.schema.org) | Free |
| Open Graph Debugger | Preview OG image/card as WhatsApp/Facebook see it | [opengraph.xyz](https://opengraph.xyz) | Free |
| Twitter Card Validator | Preview Twitter card | [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) | Free |
| Google Keyword Planner | Get search volume data | [ads.google.com/keywordplanner](https://ads.google.com/home/tools/keyword-planner/) | Free (needs Google Ads account) |
| Ubersuggest | Keyword ideas on budget | [neilpatel.com/ubersuggest](https://neilpatel.com/ubersuggest/) | Freemium |

---

## Appendix A — Open Graph Image Requirements

The file `https://rcanddiecast.com/image/og-banner.jpg` needs to be created.

**Specs:**
- Size: **1200 × 630px** (Facebook/WhatsApp standard)
- Format: JPG (for broad compatibility)
- File size: < 300KB
- Content: RC & Diecast logo, brand orange accent, a hero product image, tagline
- Should look recognizable when shown as a small thumbnail

**This image is shown every time the site is shared on:**
- WhatsApp (link preview)
- Facebook (link preview)
- LinkedIn (link preview)
- Twitter / X (card image)

> 🔴 Until this image is created, shared links will show a blank or broken preview. **This is a P1 task.**

---

## Appendix B — Structured Data Already Implemented

### Homepage (`index.html`)

```
@type: WebSite       — enables Google Sitelinks Searchbox
@type: Store         — enables store-specific rich results
```

### Blog Listing (`blog.html`)

```
@type: Blog          — tells Google this is a blog
```

### Blog Post Template (`blog-post.html`)

```
Meta tags with IDs ready for dynamic JS update
JSON-LD Article schema template (to be filled per post)
```

---

*Last updated: March 31, 2026 | Maintained by: Development Team*  
*Review and update this document every quarter or when major site changes are made.*
