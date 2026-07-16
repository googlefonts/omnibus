# Press Series — Technical Brief

Type-specimen website for **Omnibus-Type**'s **Press Series** — a
curated selection of six variable font families published on Google
Fonts, designed specifically for editorial composition: books, magazines
and newspapers, both on screen and in print.


## 1 · Executive summary

- **Type**: single-page website, responsive.
- **Purpose**: present six variable font families as a coherent system,
  with interactive demonstrations of their distinctive features.
- **Audience**: graphic designers, editors, web developers, editorial
  teams looking for typefaces for extended reading.
- **Status**: production — visual coherence across the six families,
  stabilised architecture, content in English.


## 2 · Technical specifications

| Parameter | Value |
|---|---|
| Format | HTML5 single-file, self-contained |
| Total weight | **118.5 KB** (`index.html`, 1,713 lines) |
| Distribution | CSS 41.8 KB · JS 65.3 KB · Markup 11 KB |
| Frameworks | None — vanilla HTML/CSS/JS |
| Build tools | None — no transpilation, bundler or install required |
| External dependencies | Only two Google Fonts stylesheets (7 font files) |
| Embedded fonts | 1 (Saira Alternates OTF subset, base64) |

**No database, no backend, no authentication.** The site works as a pure
static asset. Deploy: one `index.html` on any web server or static-site
service (GitHub Pages, Netlify, Vercel, S3).


## 3 · The six families

All under the **SIL Open Font License 1.1**, published on Google Fonts
as variable fonts (recommended) plus a complementary set of statics.

| # | Family | Class | Weight axis | Width axis | Italic | Statics |
|---|---|---|---|---|---|---|
| 1 | Archivo | Sans | 100–900 | 62–125 | yes | 108 |
| 2 | Asap | Sans | 100–900 | 75–125 | yes | 90 |
| 3 | Saira | Sans | 100–900 | 50–125 | yes | 126 |
| 4 | Faustina | Serif | 300–800 | — | yes | 12 |
| 5 | Labrada | Serif | 100–900 | — | yes | 18 |
| 6 | Manuale | Serif | 300–800 | — | yes | 12 |


## 4 · Site structure

Top to bottom:

1. **Masthead** (sticky). "Press Series Collection" wordmark + navigation
   (Type Tester · Specimens · About · Press Series Collection). On mobile
   collapses into a full-screen menu with generous inter-item spacing.
2. **Hero**. Title "Press Series" with the eyebrow "A New Era for
   Editorial Typography", a descriptive lead paragraph, and a numbered
   index of the six families with their axes and static counts.
3. **Type Tester** (live). Real-time variable tester that cycles through
   the six families. Controls: weight, width (sans only) and italic.
   Editable field. A CSS panel showing the current settings ready to copy.
4. **Specimens**. One horizontal carousel per family (six in total),
   each with **6 panels** demonstrating distinct features of the family.
   Navigation by drag, swipe or native arrows.
5. **About / Footer**. Project description and credits, subtle "Press
   Series" watermark aligned with the "Made by friends of Google Fonts"
   badge.


## 5 · Carousel system

### Architecture

A single **data-driven** engine that renders the six carousels from a
`FAMS` object containing each family's configuration. One builder per
family (`archivoPanels()`, etc.) returns an array of panels. The
`buildSpecimens()` function walks all builders and mounts the HTML.

### Canonical panel order

All six carousels follow the same order:

```
Slot:    1        2       3            4        5         6
─────────────────────────────────────────────────────────────
Archivo: Glyphs · Words · Weight/W   · Reading · Display · Ticker
Asap:    Glyphs · Words · Uniwidth   · Reading · Display · Uniwidth-tab
Saira:   Glyphs · Words · Alternates · Reading · Display · Ticker
Faustina:Glyphs · Words · Italic     · Reading · Display · Ticker
Labrada: Glyphs · Words · Italic     · Reading · Display · Ticker
Manuale: Glyphs · Words · Italic     · Reading · Display · Ticker
```

Slots 1, 2, 4, 5 and 6 are **constants**; slot 3 carries each family's
**distinctive feature**. Narrative: letter → word → unique feature →
paragraph → headline → figures. From micro to macro, with the identity
mark placed at the mid-point.

### Colour rhythm

Every panel takes a background colour from its family's 6-tone ramp.
The six carousels are calibrated to **alternate** between light (L),
mid (M/m) and dark (D):

```
Archivo:  m L m L D M
Asap:     m L D L D L
Saira:    m L M L m D
Faustina: m L D L m M
Labrada:  m L D L m M
Manuale:  m L D L m M
```


## 6 · Interactivity

Each panel combines one or more of these mechanisms:

- **Glyph mosaic** with resampleable palette (refresh button).
- **Editable word** with drag/pinch for pan-zoom.
- **Weight, width, or dual-axis animation.**
- **Jolt + breathe animation**: two axes with independent timing.
- **Weight sweep** (Asap's Uniwidth panel).
- **OpenType `salt` alternates toggle** (Saira).
- **Two-lane ticker crawl** with tabular numerals.
- **Control sliders** (`wght`, `wdth`, `size`, `leading`).
- **Italic toggle** in the three serifs.

All controls are real form elements (`input[type=range]`, `<button>` with
`aria-pressed`).


## 7 · Notable technical features

- **Variable fonts** with two and up to three axes per family (`wght`,
  `wdth`, `ital`).
- **Container queries** (`container-type: inline-size`, `cqw` units) for
  typographic scaling relative to the panel, not the viewport.
- **CSS custom properties** per family (`--archivo-l`, `--archivo-d`,
  etc.) as a token system. A single `--demo` custom property in each
  scoped section lets global rules read the correct family automatically.
- **CSS `mask-image`** for the "page continues" fade in the Faustina
  mockup.
- **`text-wrap: balance`** and **`text-wrap: pretty`** to avoid orphans
  and widows automatically in headlines and paragraphs.
- **`font-variation-settings`** per element for fine weight/width control,
  with CSS animations that interpolate the axes smoothly.
- **`prefers-reduced-motion`** global kill-switch: disables all animations
  and smooth-scroll.


## 8 · Accessibility

- All controls are real form elements.
- Info modals with focus trap and Escape-to-close.
- WCAG AAA contrast on every text/background combination
  (17:1 on each family's primary pair).
- Glyph-mosaic letter colours computed automatically by luminance —
  never below legibility thresholds.
- Anchor navigation with `scroll-margin-top` to compensate for the
  sticky masthead.


## 9 · Responsive

Breakpoint ranges:

| Viewport width | Behaviour |
|---|---|
| ≥ 1180 px | Wrap at max width; three panels per carousel view |
| 780–1180 px | Fluid wrap; still three panels per carousel |
| 720–780 px | Switches to mobile menu; About grid collapses to one column |
| ≤ 720 px | Full-screen menu with wide gap; one panel per carousel view |
| ≤ 640 px | Footer watermark scales down to align with the badge |

Internal sizes use `cqw` (container query width): the typography of each
panel scales identically across viewport sizes because the container
query always relates it to the panel's own width.


## 10 · Compatibility

- **Browsers**: Chrome 117+, Safari 17.5+, Firefox 131+, Edge 117+.
- **Required features**: variable fonts, custom properties, container
  queries, `text-wrap: balance/pretty`, `backdrop-filter`, `mask-image`,
  `aspect-ratio`, `scroll-snap`.
- **Devices**: tested on desktop (Windows, macOS, Linux) and mobile
  (iOS Safari, Android Chrome). Touch interactions (drag, swipe, pinch)
  supported.


## 11 · Content

- **Language**: English throughout the interface and modals.
- **Original editorial text**: hero, About, paragraphs for "Extensive
  Reading" / "Immersive Reading", tickers, and info modals — written
  specifically for the site, not recycled.
- **Editable system**: panel and modal texts are managed from separate
  markdown files (`panels-copy.md`, `modals-copy.md`) that are applied
  to `index.html` through programmatic replacements.


## 12 · Deploy

**One single file.** Upload `index.html` to the server. No build, no
install, no environment variables.

Requires an internet connection to load the Google Fonts stylesheets.
All other assets are embedded.


## 13 · Credits

- **Design and typography**: Omnibus-Type — [omnibus-type.com](https://omnibus-type.com)
- **Technical coordination**: Pablo Cosgaya
- **Project in collaboration with**: Google Fonts
- **Font license**: SIL Open Font License 1.1
- **Repositories**: [github.com/Omnibus-Type](https://github.com/Omnibus-Type)


## 14 · Contact

For enquiries about licensing, integration or institutional use of the
Press Series families, please contact Omnibus-Type directly.
