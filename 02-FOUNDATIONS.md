# Foundations

Sprint 0 for Project Northstar, Ajith Kumar's product-design portfolio.

`tokens.css` is the source of truth. There is no Figma file. The repository had no tokens and no placeholder values before this sprint, so the set below was created from scratch.

The system is independent of the REMA design system. It uses its own token names, its own typeface, and its own colours.

Every decision in [05-DESIGN-DECISIONS.md](05-DESIGN-DECISIONS.md) serves one part of the build filter: **easier to understand**, **easier to maintain**, or **more memorable**.

## Files

| File | Role |
| --- | --- |
| `tokens.css` | Custom properties. Load this before any page CSS. |
| `fonts/SourceSerif4-Regular.woff2` | Self-hosted roman cut. |
| `fonts/LICENSE.md` | SIL Open Font License for that file. |
| `index.html` | Plain-text specimen. The phone reading test. |
| `05-DESIGN-DECISIONS.md` | Why each token exists. |

## Type

One typeface: **Source Serif 4**, roman, weight 400. Hierarchy comes from size.

The scale is a modular scale on **√2** (1.414213562). The base step is **1.125rem**. At the usual 16px browser root, that is **18px**. A reader who enlarges the root font enlarges the whole scale, because the steps are `rem` values and ratios.

Two steps multiply to 2. The title is twice the body.

| Step | Token | At a 16px root | Use |
| --- | --- | --- | --- |
| Down one | `--north-size-note` | 12.73px | Short labels only |
| Base | `--north-size-body` | 18px | Paragraphs |
| Up one | `--north-size-heading` | 25.46px | Section headings |
| Up two | `--north-size-title` | 36px | Page title |

**Leading** is 1.5 on every step. That is the line spacing named in WCAG 2.1 success criterion 1.4.8. The criterion is AAA. This system requires AA, and the reading measure still uses 1.5 so lines stay easy to track.

## Space

Space uses the same steps as type. Changing the body size or the ratio moves both.

| Token | Equals | At a 16px root | Use |
| --- | --- | --- | --- |
| `--north-space-tight` | Note step | 12.73px | Under a heading, under a rule |
| `--north-space-stack` | Body step | 18px | Paragraphs, page inset, grid gutter |
| `--north-space-section` | Title step | 36px | Between sections, page block padding |

## Colour

Three roles: **Surface**, **Border**, **Foreground**. Dark values are a separate pair, selected with `prefers-color-scheme: dark`. Light is the default.

| Role | Light | Dark |
| --- | --- | --- |
| Surface | `#E6F0F1` | `#1A3C44` |
| Foreground | `#0E2428` | `#D7EBEC` |
| Border | `#758384` | `#798D93` |

Measured contrast against the surface in the same theme, WCAG 2.1 relative luminance, rounded to two decimal places:

| Pair | Light | Dark | AA bar |
| --- | --- | --- | --- |
| Foreground on surface | **13.90:1** | **9.58:1** | 4.5:1 for normal text |
| Border on surface | **3.39:1** | **3.41:1** | 3:1 for non-text contrast (1.4.11) |

Both text pairs also clear the AAA bar of 7:1. The method and the luminances are recorded in DD-012 and DD-013.

There is one text colour. Labels use the note size, in the same ink. A muted grey is not part of this set.

## Page grid

| Fact | Value |
| --- | --- |
| Columns | `--north-grid-columns`: **4** |
| Gutter | `--north-space-stack` |
| Text width | `--north-measure`: **60ch** (about 66 to 70 letters in this face) |
| Running text | Spans all four columns |

`60ch` is the width of the text, not the width of the padded shell. In Source Serif 4 a full line of prose at that cap is about 66 to 70 letters, because the zero is wider than an average letter. The specimen adds the inset outside the measure. On a phone the viewport is narrower than the measure, so the column becomes the screen minus the inset and the type size does not change.

Rows are not tokenised. Vertical rhythm is the space scale.

## Specimen

`index.html` is plain text: a name, two sections, a colophon. It links `tokens.css` and uses those custom properties for colour, type, space, and the grid. Open it on a phone. The exit test is that the column reads cleanly.

Rule thickness on that page is a 1px hairline. Thickness is not a token. DD-013 says why.

## Not in this set

No component tokens. No second typeface, no second weight, no accent, no radius, no shadow, no motion scale.

Two ideas are noted in the decisions document and are not built: a strict lint comment of the form `/* break: DD-xxx */`, and a quiet treatment that would place "what I'd have built" beside "what shipped".
