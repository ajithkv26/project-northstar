# Foundations

Sprint 0 starts Project Northstar.
Project Northstar is the product-design portfolio of Ajith Kumar.

`tokens.css` is the source of truth.
This project does not use a Figma file.
This repository had no tokens before this sprint.
This repository had no placeholder values before this sprint.
This sprint creates the set below from scratch.

The system is independent of the REMA design system.
The system uses Northstar token names.
The system uses a Northstar typeface.
The system uses Northstar colours.

Each decision in [05-DESIGN-DECISIONS.md](05-DESIGN-DECISIONS.md) serves one part of the build filter.
The parts are **easier to understand**, **easier to maintain**, and **more memorable**.

## Files

| File | Role |
| --- | --- |
| `tokens.css` | Tokens. Load this file before any page CSS. |
| `fonts/SourceSerif4-Regular.woff2` | Self-hosted roman cut. |
| `fonts/LICENSE.md` | SIL Open Font License for that file. |
| `index.html` | Plain-text specimen for the phone test. |
| `05-DESIGN-DECISIONS.md` | The reason for each token. |

## Type

The system uses one typeface.
The typeface is **Source Serif 4**.
The cut is roman.
The weight is 400.
Size sets the hierarchy.

The scale is a modular scale.
The ratio is **√2**.
The decimal form is 1.414213562.
The base step is **1.125rem**.
A 16px root makes the base step **18px**.
The steps use `rem` values.
The steps use the ratio.
A larger root font makes the full scale larger.

Two steps multiply to 2.
The title is twice the body.

| Step | Token | At a 16px root | Use |
| --- | --- | --- | --- |
| Down one | `--north-size-note` | 12.73px | Short labels only |
| Base | `--north-size-body` | 18px | Paragraphs |
| Up one | `--north-size-heading` | 25.46px | Section headings |
| Up two | `--north-size-title` | 36px | Page title |

The line height is **1.5** on every step.
WCAG 2.1 success criterion 1.4.8 names this line spacing.
The criterion is AAA.
The requirement for this system is AA.
The measure still uses 1.5.
This line height lets a reader follow each line.

## Space

Space uses the same steps as type.
A change to the body size moves both scales.
A change to the ratio moves both scales.

| Token | Equals | At a 16px root | Use |
| --- | --- | --- | --- |
| `--north-space-tight` | Note step | 12.73px | Under a heading, under a rule |
| `--north-space-stack` | Body step | 18px | Paragraphs, page inset, grid gutter |
| `--north-space-section` | Title step | 36px | Between sections, page block padding |

## Colour

The colour roles are **Surface**, **Border**, and **Foreground**.
The dark values are a separate pair.
The query `prefers-color-scheme: dark` selects the dark pair.
Light is the default.

| Role | Light | Dark |
| --- | --- | --- |
| Surface | `#E6F0F1` | `#1A3C44` |
| Foreground | `#0E2428` | `#D7EBEC` |
| Border | `#758384` | `#798D93` |

The project measured each ratio against the surface in the same theme.
The method is WCAG 2.1 relative luminance.
Each ratio uses two decimal places.

| Pair | Light | Dark | AA bar |
| --- | --- | --- | --- |
| Foreground on surface | **13.90:1** | **9.58:1** | 4.5:1 for normal text |
| Border on surface | **3.39:1** | **3.41:1** | 3:1 for non-text contrast (1.4.11) |

Both text pairs also pass the AAA bar of 7:1.
DD-012 records the method and the luminances.
DD-013 records the method and the luminances.

The system has one text colour.
Labels use the note size.
Labels use this same foreground.
The set does not include a muted grey.

## Page grid

| Fact | Value |
| --- | --- |
| Columns | `--north-grid-columns`: **4** |
| Gutter | `--north-space-stack` |
| Text width | `--north-measure`: **60ch** (about 66 to 70 letters in this face) |
| Running text | Spans all four columns |

`60ch` is the width of the text.
`60ch` is not the width of the padded shell.
In Source Serif 4, a full line at that limit has about 66 to 70 letters.
The zero is wider than an average letter.
The specimen adds the inset outside the measure.
On a phone, the viewport is narrower than the measure.
The column becomes the screen width minus the inset.
The type size does not change.

The system does not give rows a token.
The space scale sets the vertical rhythm.

## Specimen

`index.html` is plain text.
The specimen shows a name, two sections, and a colophon.
The specimen links `tokens.css`.
The specimen uses these tokens for colour, type, space, and the grid.
Open the specimen on a phone.
The exit test checks that the column is clear to read.

The rule on that page is a 1px hairline.
Rule thickness is not a token.
DD-013 gives the reason.

## Not in this set

The set has no component tokens.
The set has no second typeface.
The set has no second weight.
The set has no accent.
The set has no radius.
The set has no shadow.
The set has no motion scale.

The decisions document notes two ideas.
This sprint does not build those ideas.
One idea is a strict lint comment with the form `/* break: DD-xxx */`.
One idea is a quiet treatment.
That treatment places "what I'd have built" beside "what shipped".
