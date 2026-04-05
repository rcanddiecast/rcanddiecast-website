# FAQ Module Guidelines & Best Practices

This document outlines the architecture, setup steps, and best practices for the FAQ module in the RC & Diecast website. This ensures a highly maintainable, SEO-friendly, and performant implementation that aligns with the user's requirements.

## 1. Architecture Overview
- **Data Source (`data/faqs.json`)**: Serves as the single source of truth for FAQs. This allows for N number of FAQs to be managed elegantly without touching the presentation logic.
- **Presentation (`faq/index.html`)**: The primary view for the FAQ. It strictly follows the dark-mode, premium aesthetics of the main application. 
- **SSR & SEO Focus**: To fulfill the "Server Side Render" and SEO rules, the FAQ schema (`@type: FAQPage`) is statically injected into the HTML. Additionally, the textual content should technically be readable by crawlers upon loading, preventing purely client-side rendering dependency if possible, or gracefully degrading.
- **Language Localization**: Supports dynamic runtime swapping between English and Malayalam seamlessly.

## 2. Checklist for Adding a New FAQ
To add a new FAQ, follow these structured steps:
1. Open up `/data/faqs.json`.
2. Append a new object to the array following the established signature:
   ```json
   {
     "id": "faq-006",
     "category": "Shipping",
     "categoryMl": "ഷിപ്പിംഗ്",
     "icon": "delivery",
     "question": "How long does delivery take?",
     "questionMl": "ഡെലിവറിക്ക് എത്ര സമയമെടുക്കും?",
     "answer": "It usually takes 3-5 business days.",
     "answerMl": "സാധാരണയായി 3-5 പ്രവൃത്തി ദിവസമെടുക്കും.",
     "keywords": ["shipping", "delivery", "time"]
   }
   ```
3. No HTML or presentation changes are required! The core rendering script in the FAQ page will automatically pick up this new object, populate the search index, build translation mappings, and render the accordion card cleanly.

## 3. SEO & Ranking Implementation
- **Schema Output**: The JSON-LD schema is structured as an `FAQPage`.
- **Semantic HTML**: Proper use of `<details>` and `<summary>` or accessible WAI-ARIA role patterns to ensure screen readers and search engines recognize the Q&A relationship.
- **Keywording**: Each FAQ entry holds specific keyword anchors to boost context matching in generic search queries like "buying RC car India."

## 4. Performance Optimizations
- Implemented **Loading Animations** mimicking the globally established `liquidScale` animations.
- The `search` filtering relies exclusively on real-time JS `keyup` events across localized fields (Malayalam & English simultaneously) optimized via debounce handlers if required, maintaining a swift `< 16ms` budget.

## 5. Mobile & UX Integration
- Adheres to the fixed Dynamic Island App Dock standard.
- Incorporates a native "Scroll to Top" button that dynamically reveals itself post scroll.
- Avoids large structural shifts or "clutter" — utilizes clean negative space, distinct border-highlighting on hover, and neon orange visual indicators (`#ff3d00`).
