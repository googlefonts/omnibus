# Press Series — Technical Report

A responsive type-specimen website for the Omnibus-Type **Press Series**: six
open-source variable typeface families published on Google Fonts, built for
text-intensive editorial typography (books, magazines and newspapers) on
screen and in print. This document reports the final state of the
implementation.


## 1 · Delivery

A single **self-contained** `index.html` (**118.4 KB**, 1,713 lines).
The **only** external requests at run time are the two Google Fonts
stylesheets (`css2` for the six families with italics, plus Google Sans Flex
for the wordmark and background ampersand). Every other asset — including
the Saira alternates OTF and the external-link icon — is inlined.

**Breakdown** (approx.):

| Zone         | Bytes   | Share  |
|--------------|---------|--------|
| CSS block    | 42 KB   | 35 %   |
| JS block     | 65 KB   | 55 %   |
| HTML markup  | 12 KB   | 10 %   |


## 2 · Content structure

Top to bottom of `index.html`:

- **Masthead (sticky).** Wordmark ("Press Series Collection") links to top.
  Wide screens show the nav (Type Tester, Specimens, About, Press Series
  Collection → external Google Fonts selection); narrow screens collapse it
  into a full-screen floating menu with generous inter-item spacing (~1.4 em)
  so touches don't collide.
- **Hero.** Eyebrow "A New Era for Editorial Typography", a lead paragraph
  (Archivo, 1.08 rem / 1.62) and the numbered index of the six families
  (number, swatch, name set in its own typeface, axis ranges, static
  count). A decorative background ampersand set in Google Sans Flex.
- **Type Tester.** Live variable-font tester across the six families,
  opening on Archivo. Controls: weight, width (hidden for serifs) and
  italic toggle, in a constant-height control area so the tester never
  resizes between families. The field is editable with the leading-caret
  model (§7.3). A CSS panel shows the current settings ready to copy.
- **Specimens.** One horizontal carousel per family on its own tinted
  field (`--<fam>-l`). Every carousel has **exactly six panels** (§5)
  following the same canonical order. Panels sized so **three fit exactly
  in the wrap width** in desktop, aligned with the tester block. Native
  arrows, drag and swipe.
- **About / Footer.** Two-column editorial prose, Google Fonts +
  Omnibus-Type credits, "Made by friends of Google Fonts" badge aligned
  by cap-top with the "Press Series" watermark.


## 3 · The collection

Six families in fixed on-page order. All published under **SIL Open Font
License 1.1**.

| # | Family   | Class | Weight  | Width  | Italic | Statics |
|---|----------|-------|---------|--------|--------|---------|
| 1 | Archivo  | Sans  | 100–900 | 62–125 | yes    | 108     |
| 2 | Asap     | Sans  | 100–900 | 75–125 | yes    | 90      |
| 3 | Saira    | Sans  | 100–900 | 50–125 | yes    | 126     |
| 4 | Faustina | Serif | 300–800 | —      | yes    | 12      |
| 5 | Labrada  | Serif | 100–900 | —      | yes    | 18      |
| 6 | Manuale  | Serif | 300–800 | —      | yes    | 12      |

The three sans carry a width axis; the three serifs do not. Static counts
from Omnibus-Type / GF Stats.


## 4 · Files

- **`index.html`** — the whole site (markup, styles, scripts) in one file.
  Deploy this.
- **`PressSeries_color.html`** — colour palettes technical document
  (English, matching masthead and section-head styles).
- **`technical-brief.md`** — condensed technical brief for sharing with
  external teams.
- **`README.md`** — this document.
- **`carrusel-<family>.md`** (×6) — panel-by-panel documentation for each
  family, useful when editing carousel content.
- **`panels-copy.md`**, **`modals-copy.md`** — editable text sources for
  panel labels/captions and info modals.


## 5 · Carousel system

The carousels are **data-driven and per-family**. One shared engine renders
every family; each family plugs in its own panel builder, color ramps, info
modal and (optionally) extra wiring. Everything lives inside one IIFE in
`index.html`.

### 5.1 Data model

```js
var FAMS = {
  archivo:  {label:"Archivo",  accent:"var(--archivo)", wght:[100,900,400],
             wdth:[62,125,100], serif:false, ...},
  asap:     {label:"Asap",     ..., wdth:[75,125,100], ...},
  saira:    {label:"Saira",    ..., wdth:[50,125,100], ...},
  faustina: {label:"Faustina", ..., wdth:null, serif:true, ...},
  labrada:  {label:"Labrada",  ..., wdth:null, serif:true, ...},
  manuale:  {label:"Manuale",  ..., wdth:null, serif:true, ...}
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

### 5.3 The canonical panel order

**Every one of the six carousels follows the same 6-panel order:**

```
Slot:    1        2       3            4        5         6
─────────────────────────────────────────────────────────────────
Archivo: Glyphs · Words · Weight/W  · Reading · Display · Ticker
Asap:    Glyphs · Words · Uniwidth  · Reading · Display · Uniwidth-tab
Saira:   Glyphs · Words · Alternates· Reading · Display · Ticker
Faustina:Glyphs · Words · Italic    · Reading · Display · Ticker
Labrada: Glyphs · Words · Italic    · Reading · Display · Ticker
Manuale: Glyphs · Words · Italic    · Reading · Display · Ticker
```

Slots 1, 2, 4, 5 and 6 are **constants**; slot 3 carries each family's
**distinctive feature**. Narrative: letter → word → unique feature →
paragraph → headline → figures. From the smallest unit to the most
functional, with the identity mark placed at the mid-point where the
viewer is already engaged.

### 5.4 Colour rhythm

Each panel takes a background from its family's 6-tone ramp. The six
carousels are calibrated so their palette **alternates** between light (L),
mid (M/m) and dark (D) — no more than two consecutive same-band panels
anywhere:

```
Archivo:  m L m L D M
Asap:     m L D L D L
Saira:    m L M L m D
Faustina: m L D L m M
Labrada:  m L D L m M
Manuale:  m L D L m M
```

Read in cascade, the six carousels compose a sustained visual pulse.

### 5.5 Panel treatments

- **default (`""`)** — light background (`--c-light` or `bg`), text in
  `--c-dark`, soft labels. Used for glyph mosaics, weight ladders, most
  demos.
- **`impact`** — dark cell (`--ink` or `bg`), white text/labels/pills.
  For a big display word on a dark field.
- **`impact-blue`** — same, background `--c-dark`.
- **`text`** — light cell with a properly dark body copy for running-text
  panels.
- **`ticker`** / **`ticker impact`** — horizontal-crawl ticker background.

### 5.6 Registration maps

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

`GLYPHPAL` is the palette used for that family's glyph mosaic and its
refresh button. `EXTRA_WIRE` runs after the standard wiring to install
one-off behaviors (Asap's Uniwidth width-jolt sweep, Saira's `salt`
feature toggle).


## 6 · Individual carousels

### 6.1 Archivo (6 panels)

1. **Glyphs.** `impact` treatment on `#035D82` (ramp[4]), light palette
   (`ARCHIVO_RAMP_LIGHT`), letters computed dark by luma > 0.55. Live
   `wght`/`wdth` sliders. Refresh button reshuffles the mosaic.
2. **Words.** Big centred word ("Form") editable in place with
   drag-to-pan. Size slider in px.
3. **Weight × Width.** `impact` on `#22749D` (ramp[4]). Five lines cycle
   through `wght 100↔900, wdth 62↔125` simultaneously via a combined
   `wghtwdthwave_archivo` keyframe with staggered delays (0, −.76, −1.52,
   −2.28, −3.04 s over a 3.8 s cycle). **Archivo's characteristic**.
4. **Extensive Reading.** Editorial paragraph, live `size` and `leading`
   sliders (defaults 20 px / 135 %).
5. **Display.** Big display word on `impact-blue` treatment (`#034764`),
   live `wght`/`wdth` sliders (defaults wght 900, wdth 125).
6. **Ticker: tabular numerals.** Two-lane crawl with market quotations
   (MERVAL, GGAL, ORO) and tabular numerals.

Color: accent `#BCE2FF`, light `#EAF5FE`, dark `#003248`.

### 6.2 Asap (6 panels)

1. **Glyphs.** `impact` on `#995C62`, light palette. Width slider preset
   to 75 (fully condensed in Asap's range).
2. **Words.** Editable "Chip" at 120 px default with drag-to-pan.
3. **Uniwidth.** Nine weights sweep with `wireWidthJolt`: each row
   highlights in turn (`.wj-hit` pulse), showing that Asap keeps the same
   width across the weight range. Letters at fixed 120 px, aligned
   vertically with "Chip" from panel 2 (`padding-top: 12 px` on the
   track shifts the flex-centred content down 6 px for optical match).
   **Asap's characteristic**.
4. **Extensive Reading.** Defaults 20 px / 135 %.
5. **Display.** `impact` on `#521C25` (ramp[5], darkest), big word on
   dark red-brown background. Live sliders (default wght 900, wdth 125).
6. **Uniwidth tabular numerals.** Nine-digit lines formatted `XXX.XXX.XXX`
   (dot separators). Weight jolts hard (`tabWghtJolt` 1.1 s), width
   breathes slowly (`tabWdthBreathe` 4.5 s). Cifras tabulares.

Color: accent `#FFD2D5`, light `#FEF0F1`, dark `#521C25`.

### 6.3 Saira (6 panels)

1. **Glyphs.** `impact` on `#6A7300` (ramp[4]), light palette. Width
   preset 70.
2. **Words.** Editable "Grid" on tinted background.
3. **Alternates — A / G / R / 4 / 6 / 9 / Y.** Toggle showing default
   glyphs vs. `salt` alternates. Uses `SairaAltOTF` (embedded, see §10).
   **Saira's characteristic**.
4. **Extensive Reading.** Defaults 20 px / 135 %.
5. **Display.** `impact-blue`, big word, live sliders.
6. **Ticker: tabular numerals.** Airport display with flight times
   (10:45, 15:20, "DEMORA 40 MIN"), tabular numerals. Speed override
   at 18 s (vs 22 s default for other tickers), text color `#E6E6AF`
   for high contrast on the dark green background.

Color: accent `#F5F5AE`, light `#F6F5D6`, dark `#2E3100`.

### 6.4 Faustina / Labrada / Manuale (6 panels each)

The three serif carousels share the same panel order and mechanics:

1. **Glyphs.** Mosaic with `wght` slider and italic toggle. Serifs have
   no width axis, so no `wdth` slider.
2. **Words.** Editable centred pair of letters (F+f, Q+q, G+g) with size
   slider (default 225 px) and italic toggle. Hyperfine 1-px caret
   between the letters (`.wcaret`, height 1.2 em vertical-align -.32 em)
   spanning ascender to descender. Optical centering via
   `transform: translateY(-.06em)` (independent of caret height thanks
   to `em` units); Labrada and Manuale additionally use
   `letter-spacing: -.03em` and `translateX(-2%)` for a tighter pairing.
3. **Italic — live weight.** Roman-vs-italic pull-quote showing the
   bespoke italic design. **The serifs' characteristic**.
4. **Immersive Reading.** Serif running-text panel. Defaults 24 px /
   155 %.
5. **Display.** Big display word on `impact`.
6. **Ticker.**
   - **Faustina**: `Ticker: tabular numerals` — book titles + publisher
     quotations (PEARSON +1,4 %). Caption: "Books and publishing groups".
   - **Labrada**: `Ticker: weight contrast` — epic titles (POPOL VUH,
     BEOWULF) alternating with woodcut vocabulary (`.rev` rows switch
     to lighter weight). Caption: "Woodblocks, gouges, and prints".
   - **Manuale**: `Ticker: weight contrast` — Italian classics
     (IL GALATEO, IL PRINCIPE) alternating with typographic
     vocabulary (COMPOSIZIONE, INTERLINEA). Caption: "Manuali e libri
     di consulta".

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

Six-tone ramps (`ARCHIVO_RAMP` etc.) run light → dark in each family's
palette range; every panel background, glyph mosaic, tint and text tone
comes from this ramp. `<fam>_RAMP_LIGHT` is the first four steps, used for
glyph mosaics where letters are auto-computed dark.

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

`.spec-fam` uses **asymmetric padding-block** to sit each carousel tighter
against the next one: `padding-top: clamp(40 px, 6 vw, 72 px)` (unchanged)
but `padding-bottom: clamp(16 px, 3 vw, 24 px)` (much tighter). The six
carousels read as a coherent cascade rather than isolated blocks.

### 7.3 Caret & edit model

Editable text (`.words-solo` in carousels, `.inst-type` in the tester)
shares one model:

- A **leading caret** is a `::before` bar that is **always present**
  (reserves space; in the tester it also anchors the baseline), **visible
  at rest**, and **transparent on `:focus`** so the native caret takes
  over. Clicking to edit does not shift the word — it stays exactly in
  place and becomes editable.
- **Gray hover** on the editable element signals "click to type".
- Blink keyframes are per-context: `caretblink_<family>` (opacity) for
  carousel words, `caretBlink` for the tester. Respects
  `prefers-reduced-motion` (global kill-switch: `*{animation:none!important}`).

**Serif Words panels use a variant model**: the leading `::before` caret
is disabled (`content: none`) and replaced by a `.wcaret` inline-block bar
positioned **between the two letters** (F↕f, Q↕q, G↕g). The bar is
hyperfine (1 px), spans ascender to descender (`height: 1.2 em;
vertical-align: -.32 em`), and blinks with the same `caretblink` keyframe.

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

The `.pill-switch` inside a `.pill-toggle` receives `margin-top: 8 px`
(vs 5 px on regular slider rows) so it optically aligns with the sliders.


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
| `fitWidthJolt`   | `.wj-track`                    | Sets letter size to 120 px (matches Chip); scales down only if content exceeds the available width |
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
| `wghtwave_archivo`   | `#archivo`                | 3.8 s    | ease-in-out       | Weight 100↔900                       |
| `wdthwave_archivo`   | `#archivo`                | 3.5 s    | ease-in-out       | Width 62↔125                         |
| `wghtwdthwave_archivo`| `#archivo`               | 3.8 s    | ease-in-out       | Weight + width in sync (slot 3)      |
| `wghtwave_asap`      | `#asap`                   | 2.8 s    | cubic-bezier      | Weight 100↔900                       |
| `wdthwave_asap`      | `#asap`                   | 2.4 s    | cubic-bezier      | Width 75↔125                         |
| `tabWghtJolt`        | global (Asap+Saira use it)| 1.1 s    | ease-in-out       | Weight discrete jolt (900↔100)       |
| `tabWdthBreathe`     | global (Asap uses 4.5 s, Saira 7 s) | var. | ease-in-out | Width slow breathing (75↔125) |
| `wghtwave_faustina`  | `#faustina`               | 3 s      | ease-in-out       | Weight 300↔800                       |
| `wghtwave_labrada`   | `#labrada`                | 3 s      | ease-in-out       | Weight 300↔800                       |
| `wghtwave_manuale`   | `#manuale`                | 3 s      | ease-in-out       | Weight 300↔800                       |
| `caretblink_<fam>`   | per family + global       | 1.1 s    | step-end          | Idle caret blink                     |
| `caretBlink`         | global                    | 1.1 s    | step-end          | Tester caret blink                   |
| `tickcrawl_<fam>`    | per family                | 22 s (18 s Saira) | linear   | Ticker horizontal crawl              |

All wave animations are `animation-iteration-count: infinite`. The three
serifs share the same 3 s / ease-in-out / delay pattern for their weight
wave (though the wave is now only visible via the Italic panel — the
standalone Weight panel was removed in the canonical reorder), so
whatever weight animation shows up feels in the same pulse.

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
`@font-face` (`SairaAltOTF`, 3.5 KB decoded / 4.7 KB base64). The subset
contains only A G R 4 6 9 Y y and their `salt` alternates — everything the
Alternates panel needs. This is why the page has no external font files
to deploy.

The external-link icon is an **inline SVG symbol** (`<symbol id="ic-ext">`)
referenced with `<use href="#ic-ext">` in the header and pill markup.


## 12 · Info modals

Six modals — one per family — accessed via the `+ info` pill in each
carousel foot. Each modal has four editorial fields:

1. **Title** (`.info-title`): e.g. "Archivo VF"
2. **Body** (`.info-body`): style paragraph — how the family looks, what
   its axes span, what distinguishes it
3. **Uses** (`.cap` #1): use cases + pairings (e.g. body pairings for sans,
   headline pairings for serifs)
4. **Credit** (`.cap` #2): "Design: [author(s)] & Omnibus-Type. Contribute
   at [github link]"

Modal text is rewritten from an editable markdown source
(`modals-copy.md`). Italic emphasis inside text is expressed with
`*asterisks*` in the source and converted to `<em>` on apply. Apostrophes
inside single-quoted JS strings are auto-escaped.

Line height inside modals: 1.55 (comfortable for a paragraph read).


## 13 · Responsive strategy

Fluid layout for phone / tablet / desktop.

- Global padding token `--pad: clamp(20 px, 5vw, 76 px)`. Fluid gutters.
- `.wrap { max-width: 1180 px; padding-inline: var(--pad); }` is the
  compositional unit. The tester block and every `.spec-fam` wrap share
  this measure — the tester and each trio of carousel panels align to the
  same vertical axes.
- **≤ 780 px**: About collapses to a single column; grid `gap` drops to
  `0` so paragraph spacing is uniform (last-`<p>` `margin-bottom: 1em`
  provides the space between paragraphs).
- **≤ 720 px**: masthead nav becomes a menu button opening a full-screen
  frosted menu with 1.4 em vertical gap between items (so touches don't
  collide) and a row of the six palette colors at the foot.
- **≤ 640 px**: the "Press Series" footer watermark shrinks to
  `font-size: 1.75 rem; line-height: .9`, matching the ~50 px height of
  the "Made by friends of Google Fonts" badge; a JS `align()` routine
  matches their cap-tops, so their baselines coincide.
- Anchor links carry a `scroll-margin-top: 64 px` so the sticky masthead
  doesn't cover the section start.


## 14 · Accessibility

- Every slider and toggle is a real form control (`input[type=range]`,
  `<button>` with `aria-pressed`).
- Info modals are focus-trapped basic dialogs with Escape close.
- The global `@media(prefers-reduced-motion:reduce)` kills every animation
  and smooth-scroll.
- The nav handler falls back to instant scroll when reduced-motion is on.
- Contrast: every panel treatment pairs light backgrounds with `--c-dark`
  text or dark backgrounds with `#fff` / `--c-light` text; ramp tones on
  glyph mosaics compute letter color by luma (> 0.55 → dark, ≤ 0.55 →
  white). The dark-tint Saira ticker overrides text to `#E6E6AF` for
  guaranteed contrast on `#404600`.


## 15 · Palette (canonical tokens)

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
light→dark span (documented in `PressSeries_color.html`).


## 16 · Content language

All UI text, captions, panel titles, editorial content, info modals and
credits are in **English**. Panel captions are set uppercase with the
same treatment as panel labels (`.lab` and `.cap` share
`font-weight: 500; font-size: .7 rem; letter-spacing: .04 em;
text-transform: uppercase; color: var(--soft)`), so top and bottom of
every panel read as a unified pair.

Two ticker panels preserve their editorial voice in their original
language: Manuale's "Manuali e libri di consulta" (Italian).


## 17 · Browser support & known limits

- CSS features required: custom properties, `clamp()`, container query
  units (`cqw`) for panel-relative sizing in glyph mosaics / display words,
  `aspect-ratio`, `backdrop-filter` (progressive), `scroll-snap`,
  `text-wrap: balance/pretty`, `mask-image`.
- Target browsers: Chrome 117+, Safari 17.5+, Firefox 131+, Edge 117+.
- `font-display: swap` on the Google stylesheets keeps the page usable
  during font load; every family's demonstrative content falls back to
  its `sans-serif` / `serif` generic until the font is ready.
- The `data:` URL for the Saira alternates OTF requires no permissions
  and works in every current browser.


## 18 · Deployment

Static site. Open `index.html` in a browser (an internet connection is
needed for the Google Fonts stylesheets). To publish on GitHub Pages, put
`index.html` at the repo root (or a `/docs` folder) and enable Pages. **No
build, bundler or install.** Because the Saira alternates font is embedded,
`index.html` is the **only** file you need to deploy.

The colour system document (`PressSeries_color.html`) is a companion static
page — self-contained, includes the same masthead, links back to
`index.html`.


## 19 · Credits and license

- Design and typography: **Omnibus-Type** — [omnibus-type.com](https://omnibus-type.com)
- Technical coordination: **Pablo Cosgaya**
- A project by Omnibus-Type in collaboration with **Google Fonts**.

Typefaces under the **SIL Open Font License 1.1**; each family is on
Google Fonts as one variable font (recommended) plus a static set.
Sources at [github.com/Omnibus-Type](https://github.com/Omnibus-Type).


## 20 · Known open items

- Optional: re-embed the Saira alternates as WOFF2 (~2 KB) if further size
  trimming matters; the current OTF embed is 3.5 KB.
- Companion documents (`carrusel-*.md`, `panels-copy.md`, `modals-copy.md`,
  `mockup-*.html`) evolve alongside the site; the editable markdowns
  should be regenerated after major reorders to stay in sync.
