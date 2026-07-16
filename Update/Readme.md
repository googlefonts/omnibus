# Press Series — Technical Report

A responsive type-specimen website for the Omnibus-Type **Press Series**: six
open-source variable typeface families published on Google Fonts, built for
text-intensive typography (books, magazines and newspapers) on screen and in
print. This document reports the final state of the implementation.


## 1 · Delivery

A single **self-contained** `index.html` (**122.6 KB**, 1,741 lines).
The **only** external requests at run time are the two Google Fonts
stylesheets (`css2` for the six families with italics, plus Google Sans Flex
for the wordmark and background ampersand). Every other asset — including
the Saira alternates OTF and the external-link icon — is inlined.

**Breakdown** (approx.):

| Zone         | Bytes   | Share  |
|--------------|---------|--------|
| CSS block    | 42 KB   | 34 %   |
| JS block     | 72 KB   | 57 %   |
| HTML markup  | 12 KB   | 9 %    |

The JS carries the six per-family panel builders and their editorial copy;
the CSS carries the base system plus six scoped blocks. See §7.


## 2 · Content structure

Top to bottom of `index.html`:

- **Masthead (sticky).** Wordmark ("Press Series Collection") links to top.
  Wide screens show the nav (Type Tester, Specimens, About, Press Series
  Collection → external Google Fonts selection); narrow screens collapse it
  into a full-screen floating menu with generous inter-item spacing (~1.4 em)
  so touches don't collide.
- **Hero.** Eyebrow "A New Era for Editorial Typography", the title Press
  Series, a lead paragraph (Archivo, 1.08 rem / 1.62) and the numbered index
  of the six families (number, swatch, name set in its own typeface, axis
  ranges, static count). A decorative background ampersand set in Google
  Sans Flex.
- **Type Tester.** Live variable-font tester across the six families, opening
  on Archivo. Controls: weight, width (hidden for serifs) and italic toggle,
  in a constant-height control area so the tester never resizes between
  families. The field is editable with the leading-caret model (§8). A CSS
  panel shows the current settings ready to copy.
- **Specimens.** One horizontal carousel per family on its own tinted field
  (`--<fam>-l`). Panels sized so **three fit exactly** in the wrap width in
  desktop, aligned with the tester block. Native arrows, drag and swipe.
- **About / Footer.** Two-column editorial prose, Google Fonts +
  Omnibus-Type credits, "Made by friends of Google Fonts" badge aligned by
  cap-top with the "Press Series" watermark.


## 3 · The collection

Six families in fixed on-page order. All published under **SIL Open Font
License 1.1**.

| # | Family   | Class | Weight  | Width  | Italic | Statics | Carousel |
|---|----------|-------|---------|--------|--------|---------|----------|
| 1 | Archivo  | Sans  | 100–900 | 62–125 | yes    | 108     | 6 panels |
| 2 | Asap     | Sans  | 100–900 | 75–125 | yes    | 90      | 7 panels |
| 3 | Saira    | Sans  | 100–900 | 50–125 | yes    | 126     | 7 panels |
| 4 | Faustina | Serif | 300–800 | —      | yes    | 12      | 7 panels |
| 5 | Labrada  | Serif | 300–800 | —      | yes    | 18      | 7 panels |
| 6 | Manuale  | Serif | 300–800 | —      | yes    | 12      | 7 panels |

The three sans carry a width axis; the three serifs do not. Former stand-alone
static families (Asap Condensed, Archivo Narrow/Black, Saira Condensed/Semi/
ExtraCondensed) are legacy positions on the variable axes and are not
presented as separate products. Static counts from Omnibus-Type / GF Stats.


## 4 · Files

- **index.html** — the whole site (markup, styles, scripts) in one file. Deploy this.
- **press-series-guion-contenido.md/.txt** — content script (English site copy plus
  editing notes in Spanish, plus verified technical data).
- **README.md** — this document.


## 5 · Carousel system

The carousels are **data-driven and per-family**. One shared engine renders
every family; each family plugs in its own panel builder, color ramps, info
modal and (optionally) extra wiring. Everything lives inside one IIFE in
`index.html`.

### 5.1 Data model

```js
var FAMS = {
  archivo:  {label:"Archivo",  accent:"var(--archivo)", wght:[100,900,400],
             wdth:[62,125,100], specimen:"Magazine",   statics:108, serif:false},
  asap:     {label:"Asap",     …,  wdth:[75,125,100],  …},
  saira:    {label:"Saira",    …,  wdth:[50,125,100],  …},
  faustina: {label:"Faustina", …,  wdth:null,          …, serif:true},
  labrada:  {label:"Labrada",  …,  wdth:null,          …, serif:true},
  manuale:  {label:"Manuale",  …,  wdth:null,          …, serif:true}
};
var ORDER = ["archivo","asap","saira","faustina","labrada","manuale"];
```

`wdth:null` marks the three serifs: the tester hides the width control and
the header axis line omits `wdth`. Empty `<div class="spec-fam" id="…">`
containers live in the body; `buildSpecimens()` fills each one.

### 5.2 Rendering pipeline

`buildSpecimens()` loops `ORDER`. For each family it calls the family's
panel builder, then wraps the resulting panels in a strip inside a wrap
with a header (`spec-name` + `spec-meta`) and a foot (`+ info` pill and
`Google Fonts ↗` pill, matched in height and baseline).

Panels are produced by:

```js
panel(lab, inner, cap, cls, pillHtml, bg, extra)
```

Each panel is a **4-row grid**: `grid-template-rows: auto 1fr 46px 28px`
→ label row / live zone / pill zone (sliders) / caption. In desktop, the
strip width is exactly the wrap width and the panels satisfy
`3 × panel + 2 × gap(16 px) = 100 %` — the tester block and every carousel
therefore align on the same compositional axes.

### 5.3 Panel treatments

- **default (`""`)** — light background (`--c-light` or `bg`), text in
  `--c-dark`, soft labels. Used for glyphs, weight ladders, most demos.
- **`impact`** — dark cell (`--ink` or `bg`), white text/labels/pills.
  For a big display word on a dark field.
- **`impact-blue`** — same, background `--c-dark`.
- **`text`** — light cell with a properly dark body copy:
  `#<fam> .panel.text .runtext { color: var(--c-dark) }`. For running-text
  panels.

Each family has its own scoped copies of the treatments it uses.

### 5.4 Registration maps

A family becomes "custom" by appearing in these maps (families absent from
`CUSTOM` fall back to a generic panel set):

```js
var CUSTOM     = { archivo, asap, saira, faustina, labrada, manuale };
var MODALS     = { archivo:ARCHIVO_MODAL, asap:ASAP_MODAL, saira:SAIRA_MODAL,
                   faustina:FAUSTINA_MODAL, labrada:LABRADA_MODAL,
                   manuale:MANUALE_MODAL };
var GLYPHPAL   = { archivo:ARCHIVO_RAMP_LIGHT, asap:ASAP_RAMP_LIGHT,
                   saira:SAIRA_RAMP_LIGHT,     faustina:FAUSTINA_RAMP_LIGHT,
                   labrada:LABRADA_RAMP_LIGHT, manuale:MANUALE_RAMP_LIGHT };
var EXTRA_WIRE = { asap:wireWidthJolt, saira:wireAltFeature };
```

`GLYPHPAL` is the palette used for that family's glyph mosaic and its refresh
button. `EXTRA_WIRE` runs after the standard wiring to install one-off
behaviors (Asap's Uniwidth width-jolt sweep, Saira's `salt` feature toggle).


## 6 · Individual carousels

### 6.1 Archivo (6 panels)

1. **Glyphs — peso y ancho en vivo.** Cell mosaic with live `wght`/`wdth`
   sliders. Refresh button reshuffles the layout with `buildGlyphs`.
2. **Words — tamaño en vivo.** Big centred word (`Form`) editable in place
   with drag-to-pan, size slider in px.
3. **Extensive Reading.** Editorial paragraph, live `size` and `leading`
   sliders. Defaults 20 px / 135 %.
4. **Peso × Ancho.** Merged Weight+Width panel. Five lines cycle through
   `wght 100↔900, wdth 62↔125` simultaneously via a combined
   `wghtwdthwave_archivo` keyframe with staggered animation delays
   (0, −.76, −1.52, −2.28, −3.04 s over a 3.8 s cycle).
5. **Palabra de impacto.** Big display word on `impact` treatment, live
   `wght`/`wdth` sliders. Default wght 200, wdth 62.
6. **Tabular / ticker.** Cifras tabulares scrolling.

Color: accent `#BCE2FF`, light `#EAF5FE`, dark `#003248`.

### 6.2 Asap (7 panels)

1. **Glyphs.** `impact` treatment on `#995C62`, light palette
   (`ASAP_RAMP_LIGHT`), letters computed dark by luma > 0.55.
   Width slider preset to 75 (fully condensed in Asap's range).
2. **Uniwidth — 9 pesos, mismo ancho.** Nine weights sweep with
   `wireWidthJolt`: each row highlights in turn (`.wj-hit` pulse), showing
   that Asap keeps the same width across the weight range.
3. **Extensive Reading.** Defaults 20 px / 135 %.
4. **Words — tamaño en vivo.** `Chip` on ramp[4] tint.
5. **Weight / 100 → 900.** Wave of `wghtwave_asap` across five lines
   (`Therapist … Exemplify`).
6. **Número de ancho constante.** Tabular-nums nine-digit lines
   formatted `XXX.XXX.XXX` (dot separators). Weight jolts hard
   (`tabWghtJolt` 1.1 s), width breathes slowly (`tabWdthBreathe` 4.5 s).
7. **Palabra de impacto.** `impact-blue`, big word, live sliders.

Color: accent `#FFD2D5`, light `#FEF0F1`, dark `#521C25`.

### 6.3 Saira (7 panels)

1. **Glyphs.** `impact` on `#6A7300`, light palette. Width preset 70.
   Letters use the family's `--c-dark`.
2. **Words.** `Grid` on tinted background.
3. **Extensive Reading.** Defaults 20 px / 135 %.
4. **Palabra de impacto.** `impact-blue`.
5. **Weight × Width.** Five lines animate `wght` with a discrete jolt
   (`tabWghtJolt`, 1.1 s cycle) while `wdth` breathes slowly
   (`tabWdthBreathe`, 7 s cycle). The two animations act on the same element
   via CSS custom properties composed into `font-variation-settings`, so
   they don't collide.
6. **Alternates — A / G / R / 4 / 6 / 9 / Y.** Feature toggle showing
   default glyphs vs. `salt` alternates. Uses `SairaAltOTF` (embedded,
   see §11).
7. **Zócalo — vuelos y destinos.** Two-lane ticker with tabular numerals.
   Overridden speed at 18 s and text color `#E6E6AF` for high contrast on
   the dark green background.

Color: accent `#F5F5AE`, light `#F6F5D6`, dark `#2E3100`.

### 6.4 Faustina / Labrada / Manuale (7 panels each)

Serif carousels share the same panel order and mechanics:

1. **Glyphs — peso en vivo.** Cell mosaic with `wght` slider and italic
   toggle. Serifs have no width axis, so no `wdth` slider here.
2. **Weight / 300 → 800.** Five lines animate `wght` with `wghtwave_<fam>`.
   The three serifs share the same 3 s duration and staggered delays
   (0, −1.8, −2.8, −3.6, −4.4 s) and the same `ease-in-out` timing —
   they read in the same pulse. Weight range 300–800 matches the fonts'
   actual range.
3. **Immersive Reading.** Serif running-text panel. Defaults 24 px / 155 %.
4. **Itálica — peso en vivo.** Roman-vs-italic pull-quote.
5. **Words — tamaño en vivo.** Editable centred word with size slider
   and italic toggle.
6. **Palabra de impacto.** Big display word on `impact`.
7. **Tabular / ticker.** Two-lane ticker.

Colors:
- Faustina: accent `#E2DAE6`, light `#FAF0FF`, dark `#211826`
- Labrada:  accent `#E5DBD0`, light `#FFF2E3`, dark `#372C1F`
- Manuale:  accent `#D0E2CD`, light `#DEFCDA`, dark `#1C341A`


## 7 · Styling architecture

### 7.1 Consolidation

CSS is split in two layers:

- **Global base** (roughly 22 KB): tokens on `:root`, reset, masthead,
  strip and panel geometry, pill controls and switch (toggle), info-modal
  box, caret model, footer, and every rule that is **identical or majority
  across ≥ 4 families**.
- **Six scoped blocks** `#archivo …` `#manuale …` (roughly 20 KB combined):
  keyframes renamed with a `_<family>` suffix (`caretblink_archivo`,
  `tickcrawl_saira`, …) and the panel treatments and demonstrative rules
  that this family authors differently from the majority.

The demonstrative font of each family is exposed as a **custom property**
`--demo` set on `#<family>`. Rules that need the family's own face read
`font-family: var(--demo)` — one global rule covers all six. This is why
`.glyph-grid` (formerly reproduced per family) is now a single global rule.

Six-tone ramps (`ARCHIVO_RAMP` etc.) run light → dark in each family's palette
range; every panel background, glyph mosaic, tint and text tone comes from
this ramp. `<fam>_RAMP_LIGHT` is the first four steps, used for glyph mosaics
where letters are auto-computed dark; `ASAP_RAMP_DARK` (used elsewhere) is the
four darkest steps.

### 7.2 Panel geometry

Global (`.panel`):

```css
.panel {
  flex: 0 0 auto;
  width: 100 %;                        /* mobile: one per screen */
  aspect-ratio: 4 / 5;
  padding: 26 px 26 px 18 px;
  display: grid;
  grid-template-rows: auto 1fr 46 px 28 px;
  gap: 10 px;
  scroll-snap-align: start;
  background: var(--c-light);
  border-radius: 14 px;
  position: relative;
}
@media (min-width: 768 px) {
  .panel { width: calc((100 % - 32 px) / 3); }   /* exactly three fit */
}
```

### 7.3 Caret & edit model

Editable text (`.words-solo` in carousels, `.inst-type` in the tester) shares
one model:

- A **leading caret** is a `::before` bar that is **always present** (reserves
  space; in the tester it also anchors the baseline), **visible at rest**, and
  **transparent on `:focus`** so the native caret takes over. Clicking to edit
  does not shift the word — it stays exactly in place and becomes editable.
- **Gray hover** on the editable element signals "click to type".
- Blink keyframes are per-context: `caretblink_<family>` (opacity) for
  carousel words, `caretBlink` for the tester. Respects `prefers-reduced-motion`
  (global kill-switch: `*{animation:none!important}`).

The three serifs originally used an absolute-centered `visibility:hidden`
caret model; this was unified onto the leading-caret model so all six
families now behave the same way.

### 7.4 Controls (`.pill`, `.pill-switch`)

Two control kinds live inside the `.pill` container:

- **Range slider** (`input[type=range]`): setups a CSS custom property on
  the target (`--gw`, `--tsize`, …) or, if `directPx:true`, writes
  `style.fontSize` directly in px. Label is updated live.
- **Toggle switch** (`.pill-switch`): a small pill with `.track` + `.thumb`
  and an `.on` state. `wirePills` binds click to flip
  `target.style[prop] = on ? on : off` (e.g. `fontStyle=italic|normal`).

Italic toggles appear only where the family has no dedicated axis for it —
i.e. only in the **three serifs** (Glyphs and Words). The three sans use
their two-axis sliders (weight + width) without an italic toggle.

The `.pill-switch` is excluded from `enableDrag`'s pointer capture so clicks
inside it work even during carousel drag gestures.


## 8 · Interactive helpers

Class-based, scoped to the host `spec-fam`, so no id collisions across
sections. One copy serves every family.

| Helper           | Selector                       | Behaviour                                          |
|------------------|--------------------------------|----------------------------------------------------|
| `pillHTML(axes)` | —                              | Renders `.pill` from a spec array                  |
| `wirePills`      | `.pill input, .pill-switch`    | Sliders + toggles, updates labels                  |
| `wireEditable`   | `[contenteditable]`            | Marks `.edited`, keeps focus/blur behavior         |
| `wireWordPan`    | `.words-solo`                  | Drag / pinch to pan-zoom the big word              |
| `wireRefresh`    | `.refresh-btn` / `.glyph-grid` | Reshuffles the mosaic                              |
| `wireInfoModal`  | `.info-btn` / `.info-modal`    | Opens/closes the info modal for the family         |
| `buildGlyphs`    | —                              | Fills the mosaic; picks luma-adaptive letter color |
| `wireWidthJolt`  | `.wj-track`                    | Asap Uniwidth sweep (`EXTRA_WIRE`)                 |
| `wireAltFeature` | `.alt-pair`                    | Saira `salt` toggle (`EXTRA_WIRE`)                 |
| `setupStrip`     | `.strip-wrap`                  | Arrows + drag + swipe; auto-hides idle arrows      |
| `enableDrag`     | `.strip`                       | Pointer drag with input-type exclusions            |
| `crawl`, `shuffleDigits`, `luma` | — | Small utilities                                    |

Navigation: an explicit handler on all `.masthead a[href^="#"]` and
`.menu-nav a[href^="#"]` performs smooth scroll to the anchor with a 64 px
offset (compensating the sticky masthead), closes the mobile menu if open,
and updates the hash via `history.replaceState`. This is robust on iOS
Safari where the native smooth-scroll to hash sometimes fails.


## 9 · Animations & timing

Per-family keyframes (renamed with `_<fam>` suffix), some reused as globals
because they are byte-identical across families:

| Keyframe             | Scope                     | Duration | Timing            | Purpose                              |
|----------------------|---------------------------|----------|-------------------|--------------------------------------|
| `wghtwave_archivo`   | `#archivo`                | 3.8 s    | ease-in-out       | Peso 100↔900                         |
| `wdthwave_archivo`   | `#archivo`                | 3.5 s    | ease-in-out       | Ancho 62↔125                         |
| `wghtwdthwave_archivo`| `#archivo`               | 3.8 s    | ease-in-out       | Peso + ancho simultáneos (panel 4)   |
| `wghtwave_asap`      | `#asap`                   | 2.8 s    | cubic-bezier      | Peso 100↔900                         |
| `wdthwave_asap`      | `#asap`                   | 2.4 s    | cubic-bezier      | Ancho 75↔125                         |
| `tabWghtJolt`        | global (used by Asap+Saira)| 1.1 s   | ease-in-out       | Weight discrete jolt (900↔100)       |
| `tabWdthBreathe`     | global (used by Asap+Saira)| 4.5–7 s | ease-in-out       | Width slow breathing (75↔125)        |
| `wghtwave_faustina`  | `#faustina`               | 3 s      | ease-in-out       | Peso 300↔800                         |
| `wghtwave_labrada`   | `#labrada`                | 3 s      | ease-in-out       | Peso 300↔800                         |
| `wghtwave_manuale`   | `#manuale`                | 3 s      | ease-in-out       | Peso 300↔800                         |
| `caretblink_<fam>`   | per family + global       | 1.1 s    | step-end          | Idle caret blink                     |
| `caretBlink`         | global                    | 1.1 s    | step-end          | Tester caret blink                   |
| `tickcrawl_<fam>`    | per family                | 22 s (18 s Saira) | linear   | Ticker horizontal crawl              |

All wave animations are `animation-iteration-count: infinite`. The three
serifs now share the same 3 s / ease-in-out / delay pattern for their weight
wave, so their carousels feel in the same pulse. The elastic
`cubic-bezier(.65, -.55, .35, 1.55)` used previously in serifs (which
overshoots at both ends) has been replaced by `ease-in-out` for a smooth
back-and-forth without rebound.

Global `@media(prefers-reduced-motion:reduce)`: kills every animation and
transition; per-family reduced-motion queries were removed as redundant.


## 10 · Type Tester

Not built as a carousel. A single `.inst` block (border + border-radius +
overflow-hidden) holds:

- `.inst-type` — a live editable region with the shared leading-caret model.
- A three-slider control row (`wght`, `wdth`, italic toggle) whose height is
  constant across families, so switching families doesn't jitter the layout.
  `wdth` is hidden when `FAMS[key].wdth === null` (serifs) and italic is
  always present.
- A CSS panel that mirrors the current settings ready to copy.

The tester opens on Archivo. Family switching updates `document.fonts` load
state, sliders' min/max/value, and hero swatch alignment.


## 11 · Fonts & embedded assets

Two Google Fonts stylesheets:

- `family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900
  |Asap:ital,wdth,wght@…|Saira:…|Faustina:ital,wght@…|Labrada:ital,wght@…
  |Manuale:ital,wght@…&display=swap`
- `family=Google+Sans+Flex:…` for the wordmark and background ampersand.

**Saira Alternates** is embedded as a **base64 OTF subset** in an
`@font-face` (`SairaAltOTF`, 3.5 KB decoded = 4.7 KB base64). The subset
contains only A G R 4 6 9 Y y and their `salt` alternates — everything the
Alternates panel needs. This is why the page has no external font files
to deploy.

The external-link icon is an **inline SVG symbol** (`<symbol id="ic-ext">`)
referenced with `<use href="#ic-ext">` in the header and pill markup.


## 12 · Responsive strategy

Fluid layout for phone / tablet / desktop.

- Global padding token `--pad: clamp(20 px, 5vw, 76 px)`. Fluid gutters.
- `.wrap { max-width: 1180 px; padding-inline: var(--pad); }` is the
  compositional unit. The tester block and every `.spec-fam` wrap share this
  measure — the tester and each trio of carousel panels align to the same
  vertical axes.
- **≤ 780 px**: About collapses to a single column; grid `gap` drops to `0`
  so paragraph spacing is uniform (last-`<p>` `margin-bottom: 1em` provides
  the space between paragraphs, whether within a column or across the fold).
- **≤ 720 px**: masthead nav becomes a menu button opening a full-screen
  frosted menu with 1.4 em vertical gap between items (so touches don't
  collide) and a row of the six palette colors at the foot.
- **≤ 640 px**: the "Press Series" footer watermark shrinks to
  `font-size: 1.75 rem; line-height: .9`, matching the ~50 px height of the
  "Made by friends of Google Fonts" badge; a JS `align()` routine matches
  their cap-tops, so their baselines coincide.
- Anchor links carry a `scroll-margin-top: 64 px` so the sticky masthead
  doesn't cover the section start.


## 13 · Accessibility

- Every slider and toggle is a real form control (`input[type=range]`,
  `<button>` with `aria-pressed`).
- Info modals are focus-trapped basic dialogs with Escape close.
- The global `@media(prefers-reduced-motion:reduce)` kills every animation
  and smooth-scroll.
- The nav handler falls back to instant scroll when reduced-motion is on.
- Contrast: every panel treatment pairs light backgrounds with `--c-dark`
  text or dark backgrounds with `#fff`/`--c-light` text; ramp tones on
  glyph mosaics compute letter color by luma (> 0.55 → dark, ≤ 0.55 →
  white). The dark-tint Saira ticker overrides text to `#E6E6AF` for
  guaranteed contrast on `#404600`.


## 14 · Palette (canonical tokens)

Family accents / light tints / darks (CSS custom properties on `:root`):

| Family   | accent   | light `-l` | dark `-d` |
|----------|----------|------------|-----------|
| Archivo  | #BCE2FF  | #EAF5FE    | #003248   |
| Asap     | #FFD2D5  | #FEF0F1    | #521C25   |
| Saira    | #F5F5AE  | #F6F5D6    | #2E3100   |
| Faustina | #E2DAE6  | #FAF0FF    | #211826   |
| Labrada  | #E5DBD0  | #FFF2E3    | #372C1F   |
| Manuale  | #D0E2CD  | #DEFCDA    | #1C341A   |

Neutrals: paper `#FFFFFF`, ink `#1A181F`, soft gray `#757575`, hairline
`#D9D7D0`, glyph-cell bg `#E8E8E8`, footer watermark `--blob:#EBEBEB`.
Each carousel derives its 6-step demonstrative ramp from its own
light→dark span.


## 15 · Browser support & known limits

- CSS features required: custom properties, `clamp()`, container query
  units (`cqw`) for panel-relative sizing in glyph mosaics / display words,
  `aspect-ratio`, `backdrop-filter` (progressive), `scroll-snap`. All
  supported in current Chrome / Safari / Firefox / Edge.
- `font-display: swap` on the Google stylesheets keeps the page usable
  during font load; every family's demonstrative content falls back to
  its `sans-serif`/`serif` generic until the font is ready.
- The `data:` URL for the Saira alternates OTF requires no permissions and
  works in every current browser.


## 16 · Deployment

Static site. Open `index.html` in a browser (an internet connection is
needed for the Google Fonts stylesheets). To publish on GitHub Pages, put
`index.html` at the repo root (or a `/docs` folder) and enable Pages. **No
build, bundler or install.** Because the Saira alternates font is embedded,
`index.html` is the **only** file you need to deploy.


## 17 · Credits and license

- Design and typesetting: **Omnibus-Type** (omnibus-type.com).
- Original web-design reference: Amin Al Hazwani (aminalhazwani.com) — TBC.
- A project by Omnibus-Type in collaboration with **Google Fonts**.

Typefaces under the **SIL Open Font License 1.1**; each family is on Google
Fonts as one variable font (recommended) plus a static set. Sources at
[github.com/Omnibus-Type](https://github.com/Omnibus-Type).


## 18 · Pending

- Confirm Labrada's individual designer credit and the Amin Al Hazwani
  web-design credit.
- Optional: re-embed the Saira alternates as WOFF2 (~2 KB) if further size
  trimming matters; the current OTF embed is 3.5 KB.
- Optional: replace the current "Google Fonts" wordmark in the footer with
  Google's official "Made by friends of Google Fonts" lockup if the exact
  co-brand is required.
