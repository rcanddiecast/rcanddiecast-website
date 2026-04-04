# RC & Diecast — Blog Rules & Author Guide

> **Purpose**: This is the definitive checklist every author must follow when creating, updating, or reviewing a blog post on the RC & Diecast website. It ensures content quality, SEO performance, and design consistency.

---

## Table of Contents

1. [File & URL Structure](#1-file--url-structure)
2. [Required Meta Data (blogs.json)](#2-required-meta-data-blogsjson)
3. [SEO Checklist](#3-seo-checklist)
4. [Content Quality Standards](#4-content-quality-standards)
5. [Design & Layout Rules](#5-design--layout-rules)
6. [Image Requirements](#6-image-requirements)
7. [Reading Time Calculation](#7-reading-time-calculation)
8. [How to Create a New Post](#8-how-to-create-a-new-post-step-by-step)
9. [Post-Publish Checklist](#9-post-publish-checklist)
10. [Blog Design Patterns](#10-blog-design-patterns)

---

## 1. File & URL Structure

### Directory
All blog posts live in the `/blog/` directory:
```
blog/
├── index.html                          ← Blog listing (do NOT edit manually)
├── best-rc-rock-crawlers-india-2025.html
├── traxxas-trx4m-review-india.html
└── rc-car-maintenance-tips.html
```

### Slug Rules
| Rule | Example |
|------|---------|
| All lowercase | `traxxas-trx4m-review-india` ✅ |
| Words separated by hyphens | `rc-car-maintenance-tips` ✅ |
| No underscores | `rc_maintenance` ❌ |
| No spaces | `rc maintenance` ❌ |
| No special characters | `rc-car&tips` ❌ |
| Keyword-rich | Include primary keyword in slug | `best-rc-rock-crawlers-india-2025` ✅ |
| Year optional | Include year only if content is time-specific | `best-rc-crawlers-2025` ✅ |
| Max 5–7 words | Shorter slugs rank better | Keep it concise |

### File Naming
The HTML file name **must exactly match the slug**:
- Slug: `traxxas-trx4m-review-india`
- File: `blog/traxxas-trx4m-review-india.html`
- URL: `https://rcanddiecast.com/blog/traxxas-trx4m-review-india`

---

## 2. Required Meta Data (blogs.json)

Every post **must** have a complete entry in `data/blogs.json` before publishing. Missing any field will cause the post to not appear on the listing page.

```json
{
  "id": <number>,               // Auto-increment from last entry
  "slug": "<slug>",             // Must match the HTML filename exactly
  "title": "<SEO title>",       // Max 60 characters
  "excerpt": "<summary>",       // Max 160 characters. Must match meta description purpose
  "author": "RC & Diecast Team",
  "publishedDate": "YYYY-MM-DD",
  "readingTime": <number>,      // In minutes (see calculation below)
  "category": "<category>",     // One of: "Review" | "Buyer's Guide" | "Maintenance" | "News" | "How-To"
  "tags": ["Tag1", "Tag2"],     // Array of strings, max 7 tags
  "featuredImage": "<URL>",     // Full URL to image, prefer rcanddiecast.com/image/
  "featured": <boolean>         // true for only ONE post at a time (appears featured on listing)
}
```

> **⚠️ Only one post should have `"featured": true`** — this is the hero card on the listing page. Set all others to `false`.

---

## 3. SEO Checklist

Before publishing any post, verify **every item** in this checklist:

### Title Tag
- [ ] Unique (never duplicate another page's title)
- [ ] Contains primary keyword near the beginning
- [ ] Between 50–60 characters (use a character counter)
- [ ] Format: `[Primary Keyword]: [Secondary Detail] | RC & Diecast`
- [ ] Example: `Traxxas TRX-4M Review India: Mini Crawler That Punches Above Its Weight | RC & Diecast`

### Meta Description
- [ ] Unique per post
- [ ] Between 140–160 characters
- [ ] Contains primary and secondary keywords naturally
- [ ] Ends with a soft call to action or value statement
- [ ] Does NOT repeat the title verbatim

### Canonical URL
- [ ] Set to: `https://rcanddiecast.com/blog/[slug]`
- [ ] No trailing slash on post pages (trailing slash OK on `/blog/` listing)

### Heading Structure
- [ ] Exactly ONE `<h1>` per post (the post title in the hero)
- [ ] `<h2>` for major sections
- [ ] `<h3>` for sub-sections within a major section
- [ ] No skipping heading levels (never go h1 → h3)
- [ ] Each heading contains at least one keyword where natural

### Keywords
- [ ] Primary keyword appears in: title, h1, first paragraph, at least one h2, URL slug
- [ ] Secondary keywords appear in body copy naturally
- [ ] No keyword stuffing — content reads naturally first, keywords second

### JSON-LD Structured Data
- [ ] `@type: "BlogPosting"` on all standard posts
- [ ] `@type: "Review"` on review posts (with `reviewRating` and `itemReviewed`)
- [ ] All required fields present: `headline`, `description`, `image`, `author`, `publisher`, `datePublished`, `dateModified`, `mainEntityOfPage`, `keywords`, `inLanguage`
- [ ] `dateModified` equals today's date when editing an existing post

### Open Graph & Twitter
- [ ] `og:type` = `"article"` (not `"website"`)
- [ ] `og:image` is set to a specific, relevant image for this post
- [ ] `article:published_time` in ISO 8601 format
- [ ] `article:section` matches the category

---

## 4. Content Quality Standards

### Minimum Length
- Reviews: **800 words minimum**
- Buyer's Guides: **1,000 words minimum**
- How-To / Maintenance: **600 words minimum**
- News: **300 words minimum**

### Writing Style
- Write for the **Indian RC hobbyist** — references to Indian terrain, climate, and pricing in ₹ are expected
- Use **active voice** wherever possible
- **Short paragraphs** — maximum 4 sentences per paragraph
- Use **pull quotes** to highlight the most compelling insight from each section
- Every post should answer the reader's primary question within the first 2 paragraphs

### Mandatory Sections
Every post must include:
1. **Introduction** — State clearly what the post covers and why the reader should care
2. **Body** — Main content with h2/h3 hierarchy
3. **Conclusion or Verdict** — A clear takeaway or recommendation
4. **Tags** — Relevant keyword tags at the bottom

### Internal Linking
- Link to the showroom (`/#bento-showroom`) when a featured product is mentioned
- Link to other blog posts in the **Related Posts** section (always 2 related posts)
- Never use generic "click here" as link text — always descriptive

### Content We Publish
✅ RC car reviews (Traxxas, FMS, HB Toys, WL Toys, CXD, etc.)
✅ Diecast model reviews and comparisons
✅ Buyer's guides with concrete recommendations
✅ Maintenance and how-to guides
✅ Indian hobbyist community news

❌ Political content
❌ Content not related to RC/diecast hobby
❌ Plagiarized or AI-generated content without human review and editing

---

## 5. Design & Layout Rules

All blog pages **must strictly follow** the RC & Diecast design system (`doc/design.md`):

### Non-Negotiable Rules
1. **Background is always black or near-black** — `#000` or `#050505`
2. **Only `#ff3d00` as accent color** — No blue, green, or purple
3. **Font: Plus Jakarta Sans** — Weights 300 (body), 700 (bold), 800 (display)
4. **All headings**: `tracking-tighter` (letter-spacing: -0.03em to -0.04em)
5. **Body text**: `font-weight: 300`, `color: rgba(255,255,255,0.55)`, `line-height: 1.85`
6. **Dynamic Island nav** must appear on every page (identical to main site)
7. **Scroll-to-top button** required on all post pages
8. **Reading progress bar** required on all post pages (fixed top, brand orange, 3px height)
9. **Page loader** required on all pages (brand bar loader)
10. **Footer** must include: RC&D. wordmark, tagline, nav links including Blog

### Components Available for Blog Posts
| Component | Usage |
|-----------|-------|
| `.pull-quote` | Highlight key insight. Max 1–2 per post |
| `.tip-card` | Numbered tips. Use for listicle-style posts |
| `.product-box` | Product featurette with pros/cons |
| `.specs-table` | Technical specifications |
| `.rating-box` | For review posts — overall score + breakdown bars |
| `.warning-box` | Safety warnings or critical notes |

---

## 6. Image Requirements

### Featured Image (Hero)
- **Minimum dimensions**: 1200 × 675px (16:9 ratio)
- **File format**: JPG preferred (WebP if available), PNG acceptable
- **Max file size**: 200KB (optimize with TinyPNG or Squoosh before uploading)
- **Location**: Prefer `https://rcanddiecast.com/image/[filename]`
- **Alt text**: Descriptive, includes the primary keyword

### In-Body Images (if any)
- Always include `loading="lazy"`
- Always include meaningful `alt` text
- Always include `onerror="this.src='/image/trx4m.jpg'"` fallback

### OG Image
- Same as featured image, or a dedicated OG banner
- Must be at least 1200 × 630px for proper social sharing preview

---

## 7. Reading Time Calculation

**Formula**: `Math.ceil(wordCount / 200)` minutes

Average adult reading speed = 200 words per minute.

| Word Count | Reading Time |
|------------|-------------|
| < 200 words | 1 min read |
| 200–400 | 2 min read |
| 400–600 | 3 min read |
| 600–800 | 4 min read |
| 800–1,000 | 5 min read |
| 1,000–1,200 | 6 min read |

Round **up** always. Update `readingTime` in `blogs.json` before publishing.

---

## 8. How to Create a New Post (Step-by-Step)

### Step 1 — Plan the Post
- [ ] Define primary keyword (use Google Search Console / keyword research)
- [ ] Define post category (Review, Buyer's Guide, Maintenance, etc.)
- [ ] Write the title first — must be SEO-optimized and < 60 chars
- [ ] Write the meta description — 140–160 chars, include primary keyword
- [ ] Design the slug — keyword-rich, hyphens only, max 7 words

### Step 2 — Create the HTML File
- [ ] Copy the most appropriate existing post as a template:
  - Review → use `traxxas-trx4m-review-india.html`
  - Buyer's Guide → use `best-rc-rock-crawlers-india-2025.html`
  - Tips / Maintenance → use `rc-car-maintenance-tips.html`
- [ ] Rename the copy to `blog/[your-slug].html`
- [ ] Update ALL meta tags: title, description, canonical, OG, Twitter, JSON-LD
- [ ] Update the hero image, breadcrumb, post title, category badge, date, reading time
- [ ] Write the article content following content quality standards
- [ ] Add 2 relevant related posts at the bottom (link to existing posts)
- [ ] Update the post tags at the bottom

### Step 3 — Add to blogs.json
- [ ] Add a new entry at the top of `data/blogs.json` (newest first)
- [ ] Assign the next available `id`
- [ ] Verify slug exactly matches the HTML filename
- [ ] Set `"featured": false` (unless this is the featured post — set previous featured to false)
- [ ] Calculate and set correct `readingTime`

### Step 4 — Update Sitemap
- [ ] Add a new `<url>` entry in `sitemap.xml` with:
  - Correct `<loc>` URL
  - Today's date in `<lastmod>`
  - `<changefreq>monthly</changefreq>`
  - `<priority>0.8</priority>` for posts
  - `<image:image>` block with the featured image URL and title

### Step 5 — Verify
- [ ] View the post in a browser — check loader, hero, typography, mobile layout
- [ ] Run `view-source:` on the page and verify all meta tags are present
- [ ] Check the blog listing page (`/blog/`) — new post should appear in the correct position
- [ ] Test on mobile (375px viewport) — all elements must be readable and clickable
- [ ] Validate JSON-LD at `https://search.google.com/test/rich-results`

---

## 9. Post-Publish Checklist

After a post is live:

- [ ] Submit the URL to Google Search Console for indexing
- [ ] Share on Instagram (@rcanddiecast) with a link in bio
- [ ] Monitor Core Web Vitals in Search Console within 48 hours
- [ ] Check that the post appears on the blog listing page at the correct position
- [ ] Verify the related posts links work correctly

---

## 10. Blog Design Patterns

### Color Reference
| Element | Value |
|---------|-------|
| Background | `#000000` / `#050505` |
| Accent | `#ff3d00` |
| Body text | `rgba(255,255,255,0.55)` |
| Muted text | `rgba(255,255,255,0.3)` |
| Headings | `#ffffff` |
| Card border | `rgba(255,255,255,0.05)` |
| Card hover border | `rgba(255,61,0,0.4)` |

### Typography Reference
| Element | Size | Weight | Letter Spacing |
|---------|------|--------|----------------|
| Post H1 (hero) | `clamp(1.75rem, 5vw, 3.5rem)` | 800 | `-0.04em` |
| Section H2 | `clamp(1.375rem, 3vw, 2rem)` | 800 | `-0.03em` |
| Sub-section H3 | `clamp(1.1rem, 2vw, 1.375rem)` | 800 | `-0.02em` |
| Body paragraph | `clamp(0.9375rem, 1.5vw, 1.0625rem)` | 300 | normal |
| Micro label | `9px–10px` | 800 | `0.25em–0.5em` |
| Category badge | `8px` | 800 | `0.2em` |

### Blog Card in Listing
```html
<a href="/blog/[slug]" class="blog-card [featured?]">
  <div class="blog-card-img-wrap">
    <img class="blog-card-img" ...> <!-- grayscale → color on hover -->
    <div class="blog-card-img-overlay"></div>
  </div>
  <div class="blog-card-body">
    <div class="blog-card-meta">
      <span class="blog-category-badge">Category</span>
      <span class="blog-meta-label">X min read</span>
      <span class="blog-meta-label">DD Month YYYY</span>
    </div>
    <h2>Post Title</h2>
    <p class="blog-card-excerpt">Excerpt...</p>
    <div class="blog-card-footer">
      <span class="blog-meta-label">Author</span>
      <span class="blog-read-cta">Read Article →</span>
    </div>
  </div>
</a>
```

### Post Hero Structure
```html
<header class="post-hero">
  <img class="post-hero-img" src="..." alt="...">
  <div class="post-hero-overlay"></div>
  <div class="post-hero-content">
    <!-- Breadcrumb: Home › Blog › Category -->
    <!-- Meta: [Category Badge] [X min read] [Date] -->
    <!-- H1 title -->
    <!-- Author row: avatar + name + date -->
  </div>
</header>
```

---

*Last updated: April 2026 | Maintained by: RC & Diecast Team*
