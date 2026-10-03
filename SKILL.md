---
name: dark-glow-ui-design
description: Design language for bold, cinematic, dark-mode web interfaces with a single glowing accent color, oversized white sans-serif headlines, pill-shaped buttons and tags, large rounded containers, glassmorphism cards and device mockups. Use this skill whenever the user asks for a landing page, portfolio, SaaS or startup website, hero section, agency or creative-director site, pricing section, feature grid, one-page site, or any UI that should feel modern, premium, dark, bold or "like my references" — even if they do not mention dark mode, glow or any specific style. Also use it when building React components, HTML pages, or slides that should match this visual identity.
---

# Dark Glow UI — Design Language

A dark-first, cinematic visual style. Near-black canvas, **one saturated accent color per project** that glows and bleeds into gradients, huge confident white headlines, soft rounded geometry, and polished product imagery. The mood: premium, bold, a little theatrical, but always clean and legible.

The color values below are estimated from reference screenshots; treat them as strong starting points, not brand-exact codes. If the user supplies exact values, use theirs.

## Core principles

1. **Dark canvas, light type.** Backgrounds are near-black (never pure `#000` for large areas, never a flat gray). Text is white or soft gray.
2. **One accent per project.** Pick a single hue (ember orange, electric violet, or crimson red) and use it for glow, gradients, eyebrows, primary buttons and small highlights. Never mix two accent hues in one design.
3. **Glow, not decoration.** Light comes from radial gradients and blurred halos behind key elements (hero, device mockup, highlighted pricing card). No hard drop shadows, no outlines for effect.
4. **Big, tight, bold headlines.** Hero titles are oversized with tight line-height and tight tracking. Everything else is small and quiet by contrast. The size gap *is* the hierarchy.
5. **Rounded everything.** Large radii on containers, medium on cards, full pills on buttons and tags. No sharp corners anywhere.
6. **Generous space.** Sections breathe: large vertical padding, short line lengths, few elements per row.
7. **Show the product.** Pair the headline with a strong visual: a cinematic photo, a glowing UI screenshot, or a device mockup. Imagery is stylized (high contrast, black & white, or moody low-key lighting).

## Color system

Define colors as tokens. Dark base is shared; swap the accent block depending on the project.

```css
:root {
  /* Base (shared across all variants) */
  --bg:            #0E0E0F;   /* page background, near-black */
  --bg-raised:     #151516;   /* panels, logo strip, sections */
  --bg-card:       rgba(255,255,255,0.04);  /* glass cards */
  --border:        rgba(255,255,255,0.10);  /* hairline borders */
  --text:          #FFFFFF;
  --text-muted:    #8A8A90;   /* body copy, captions */
  --text-faint:    #5C5C63;   /* tertiary, disabled */

  /* Accent: EMBER (default for portfolios / creative / editorial) */
  --accent:        #FF5A1F;
  --accent-bright: #FF7A3D;
  --accent-deep:   #B8260A;
  --accent-glow:   rgba(255, 90, 31, 0.45);
}

/* Accent: VIOLET (SaaS, AI, builder tools) — base tinted indigo */
[data-accent="violet"] {
  --bg:            #07051A;
  --bg-raised:     #0D0A26;
  --accent:        #6D4AFF;
  --accent-bright: #8B6CFF;
  --accent-deep:   #3A1FB5;
  --accent-glow:   rgba(109, 74, 255, 0.50);
}

/* Accent: CRIMSON (web3, bold tech, launches) — base tinted blood-black */
[data-accent="crimson"] {
  --bg:            #0B0506;
  --bg-raised:     #140A0B;
  --accent:        #FF3B3B;
  --accent-bright: #FF5C5C;
  --accent-deep:   #8F1018;
  --accent-glow:   rgba(255, 59, 59, 0.50);
}
```

**Usage rules**
- Accent covers roughly 5–15% of the surface area: primary button, eyebrow text, small numerals, glow, the hero gradient.
- Hero background = a gradient from the bright accent fading through the deep accent into the near-black base (diagonal or radial from a corner/behind the subject). Example: `radial-gradient(120% 90% at 20% 0%, var(--accent-bright), var(--accent-deep) 55%, var(--bg) 100%)`.
- Body text is `--text-muted`, never full white. Headlines and key labels are `--text`.
- Add an optional subtle noise/grain overlay (2–4% opacity) on gradients for a filmic feel.
- The outer "stage" behind a presented design can be a blurred, darker version of the accent gradient, or a soft pastel gradient that contrasts with the dark UI.

## Typography

- **Family:** a clean geometric or neo-grotesque sans. Preferred: **Plus Jakarta Sans** (editorial/portfolio), **Inter** (SaaS), **Manrope** or **Geist** (tech/bold). One family per project; use weight and size for hierarchy, not a second font.
- **Hero H1:** `clamp(3rem, 8vw, 7rem)`, weight 700–800 (or 500 for the lighter SaaS variant), line-height `0.95–1.05`, letter-spacing `-0.03em` to `-0.04em`. Keep to 2–3 short lines. Center it in SaaS layouts, left-align it in portfolio layouts.
- **Section H2:** `clamp(2rem, 4vw, 3.25rem)`, weight 600–700, line-height 1.1, tracking `-0.02em`.
- **Lead / subhead:** 1.125–1.5rem, weight 600 (when it's a bold statement) or 400 (when explanatory).
- **Body:** 0.875–1rem, line-height 1.6, `--text-muted`.
- **Eyebrow / label:** 0.8–0.95rem, weight 500–600, accent-colored (e.g., "Behind the Designs"), or small uppercase-free sentence case. Numbered indexes use an accent-colored `#` followed by two digits (`#01`, `#02`) in small type above a service name.
- **Nav links:** 0.8–0.9rem, weight 400–500, white at ~80% opacity.
- Prefer sentence case. Avoid all-caps except tiny badges and "FEATURES"-style micro labels.

## Shape, radius and spacing

| Element | Radius |
|---|---|
| Hero container (portfolio style) | 32–48px, with a **larger radius on the bottom corners** so it overlaps the next dark section like a card |
| Image cards, feature cards, pricing cards | 20–28px |
| Mockup frame / inner panels | 12–16px |
| Buttons, tags, badges, nav CTA | full pill (`9999px`) |

- Section padding: `96–140px` vertical on desktop, `56–80px` on mobile.
- Container max-width ~1200px; hero text can go narrower (~720px) when centered.
- Use an 8px spacing grid. Grids use 3 or 4 columns with 16–24px gaps.
- Hairline separators and card borders: `1px solid var(--border)`.

## Components

### Buttons
- **Primary (accent):** pill, accent background (flat or a subtle top-to-bottom gradient `accent-bright → accent`), white text, weight 600, padding `12px 24px`, 1px inner border `rgba(255,255,255,0.18)`, soft accent glow `0 0 32px var(--accent-glow)` on hover.
- **Primary with icon (portfolio style):** pill with a small **circular icon chip at the right end** containing an arrow (→). Two inversions: *white pill + accent circle + white arrow* on dark/gradient backgrounds; *accent pill + white circle + accent arrow* on near-black.
- **Inverted (crimson/launch style):** white pill, dark accent-colored text, no icon.
- **Secondary / ghost:** dark translucent fill (`--bg-card`), 1px `--border`, white text. Hover raises border opacity.
- Always generous padding and weight 500–600. Keep the label short (2–4 words): "Get in touch", "Start Building Now", "Watch video".

### Tags and badges
- Pill, translucent fill (`rgba(255,255,255,0.08)`), 1px light border, optional small leading icon (sparkle ✦, monitor, etc.), small text. Used for category chips ("UI Design", "One Page"), announcement badges ("✦ More than a website builder"), and "Popular" plan markers.
- Section labels in feature areas: a small centered pill badge with a thin horizontal line extending to each side.

### Navigation
- Transparent bar over the hero, 1px bottom hairline for SaaS variant.
- Left: logo (icon chip + wordmark). Center or right: 3–5 plain text links. Far right: one pill CTA (accent in SaaS, white in portfolio). Optional "Login" as plain text next to it.

### Hero patterns
- **Portfolio hero:** full-bleed photo (subject lit by the accent hue) inside a big rounded container. Small greeting line ("Hey, I'm a") above a giant two-line title. A short bold tagline plus a muted sentence sits bottom-right. A row of 4 numbered service labels (`#01 Brand Strategy`, …) runs along the bottom edge.
- **SaaS hero:** centered. Announcement badge → huge H1 (2 lines) → muted subhead (max ~2 lines) → two buttons (primary + ghost) → a large product screenshot in a **glowing frame** (violet halo + thin bright border) that fades into the page at the bottom.
- **Launch / case-study hero:** left-aligned giant title (2 lines), category pills beneath it, a tilted device mockup resting on a dark rock/surface, with a bright accent arc glowing behind it.

### Logo strip ("Trusted by…")
- Sits in a slightly lighter dark rounded panel directly under the hero. Left: a small bold caption ("Trusted by Brands I've Helped Shape"). Then 4–6 white or gray monochrome logos with simple icon + wordmark, spaced evenly. In SaaS variant, logos are low-opacity gray, repeated in rows and **fading out toward the bottom** with a gradient mask.

### Cards (features, pricing)
- Glass: `--bg-card` fill, 1px `--border`, `backdrop-filter: blur(12px)`, radius 24px, padding 24–32px.
- A faint inner top-edge gradient highlight and a soft accent glow bleeding from behind/below the illustration area.
- Card layout: illustration/mockup on top (dark mini-UI, bar chart, orbit diagram of integration icons), title in white weight 600, then 2 lines of muted description.
- **Pricing:** 3 cards in a row. Plan name, large price (weight 700, ~2.5rem) with small muted "/per month", one-line audience description, full-width button, then "Included Features" list. The recommended plan is **highlighted**: accent-tinted gradient background, sparkle particles in a corner, brighter border, a "Popular" pill, and a filled accent button, while others use the ghost button.

### Image cards (portfolio gallery)
- Row of 3 equal portrait cards, 20–24px radius, 16px gap.
- Photography is **black & white, high contrast, studio-lit**, with a single subject (garment, person with headphones, product bottle) on a light-gray seamless background. This contrasts hard with the dark page and lets the accent color live only in the hero.

### Device mockups
- Laptop or browser frames shown at an angle or head-on, screen content in the same dark/accent palette. Place on a dark textured surface (rock, matte stone) with a strong accent glow arc behind. Never use a white or cluttered environment.

## Layout and rhythm

1. Hero (accent gradient or glow)
2. Logo strip (raised dark panel)
3. Intro section: eyebrow (accent) + H2 on the left, bold statement + muted text + CTA on the right (two-column split)
4. Visual proof: image row, feature cards, or product mockup
5. Pricing / contact CTA
6. Minimal footer

Alternate dense visual sections with airy text sections. Keep to one primary CTA per viewport.

## Motion (if the output is interactive)

- Slow, soft: 200–400ms ease-out transitions. Buttons gently brighten and gain glow on hover; arrow chips nudge 2–4px right.
- Cards lift 2–4px and raise border opacity on hover.
- Hero elements fade/translate up 12–20px on load, staggered by ~80ms.
- Glows can pulse very slowly (6–10s). Respect `prefers-reduced-motion`.

## Do

- Commit to one accent hue and let it glow.
- Make the H1 truly large; shrink everything else to make it feel confident.
- Use real-feeling, specific copy: short punchy statements ("Great design should feel invisible.", "Your site should do more than look good").
- Keep gray text readable: contrast of muted text against bg must stay ≥ 4.5:1 for body copy.
- Use pills for every interactive/label element.
- Keep imagery stylized and consistent (all B&W, or all accent-lit).

## Don't

- Don't use white or light page backgrounds for main sections.
- Don't combine multiple accent colors, rainbow gradients, or neon-on-neon.
- Don't use sharp corners, heavy borders, or hard black drop shadows.
- Don't use serif or decorative display fonts, or more than one font family.
- Don't center-align long paragraphs or fill the hero with more than headline + subhead + 1–2 CTAs.
- Don't use flat stock-photo imagery with bright, cheerful lighting.
- Don't clutter: if a section has more than ~4 competing elements, remove some.

## Implementation notes

- **HTML/CSS/React:** start from the token block above; build with CSS variables so the accent can be swapped via `data-accent`. Tailwind works well: map tokens in the theme config and use `rounded-full`, `rounded-3xl`, `backdrop-blur`, `tracking-tight`.
- **Glow recipe:** an absolutely positioned blurred element behind the focus object, e.g. `position:absolute; inset:-10%; background: radial-gradient(closest-side, var(--accent-glow), transparent); filter: blur(40px); z-index:-1;`
- **Faded bottom edge for screenshots:** `mask-image: linear-gradient(to bottom, #000 60%, transparent)`.
- **Responsive:** stack the 3–4 column grids to 1 column on mobile, keep H1 at ≥ 2.75rem, keep pill buttons full-width under 480px, keep the hero's rounded bottom corners.
- **Slides / social visuals:** same rules: dark gradient field, one giant white title, pill tags, a single glowing mockup or photo.

## Final checklist before delivering

- [ ] Dark near-black base, white/gray text
- [ ] Exactly one accent hue, used with glow or gradient
- [ ] Oversized, tight, bold H1 with a clear size jump to body text
- [ ] All buttons, tags and badges are pills; containers have large radii
- [ ] Imagery or mockup is stylized and consistent
- [ ] Muted body text is still legible
- [ ] Generous whitespace, no clutter
