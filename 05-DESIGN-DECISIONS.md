# Design decisions

Sprint 0 for Project Northstar. `tokens.css` is the source of truth. There is no Figma file.

The repository had no placeholder tokens. Every custom property in this log was introduced here, from scratch.

The set is independent of the REMA design system. Token names, the typeface, and the colours are Northstar's own.

Each entry names the part of the build filter it serves: **easier to understand**, **easier to maintain**, or **more memorable**.

A token is in the file because at least two places use it, or because it records a decision the rest of the system hangs on. The set stops at type, space, the three colour roles, and the page grid.

## Index

| ID | Token | Build filter |
| --- | --- | --- |
| DD-001 | `--north-font` | more memorable |
| DD-002 | `--north-ratio` | more memorable |
| DD-003 | `--north-size-body` | easier to understand |
| DD-004 | `--north-size-note` | easier to maintain |
| DD-005 | `--north-size-heading` | easier to maintain |
| DD-006 | `--north-size-title` | easier to maintain |
| DD-007 | `--north-leading` | easier to understand |
| DD-008 | `--north-space-tight` | easier to maintain |
| DD-009 | `--north-space-stack` | easier to understand |
| DD-010 | `--north-space-section` | easier to maintain |
| DD-011 | `--north-surface` | easier to understand |
| DD-012 | `--north-foreground` | easier to understand |
| DD-013 | `--north-border` | easier to understand |
| DD-014 | `--north-measure` | easier to understand |
| DD-015 | `--north-grid-columns` | more memorable |

## Contrast method

Ratios use the WCAG 2.1 relative luminance definition. sRGB channels are linearised, luminance is `0.2126 R + 0.7152 G + 0.0722 B`, and the ratio is `(L lighter + 0.05) / (L darker + 0.05)`. Figures below are rounded to two decimal places from that result. AA for this sprint means 4.5:1 for normal text and 3:1 for a border that marks structure (success criterion 1.4.11).

## DD-001

**Token:** `--north-font`

**Build filter:** more memorable

**Decision:** One typeface, Source Serif 4 roman, self-hosted at `fonts/SourceSerif4-Regular.woff2` under the SIL Open Font License (`fonts/LICENSE.md`). The file is the unmodified regular cut from the Adobe release. Weight 400 only. The stack falls back through Iowan Old Style, Palatino, Palatino Linotype, and Book Antiqua, then a generic serif. `font-display: swap` so text is readable before the file arrives.

**Rationale:** The portfolio is typography-led. Ajith trained in mathematics and started in graphic design, so the page should read like a considered text, with one voice from the label to the title. Source Serif 4 is drawn for continuous reading and can be hosted with the site. One weight keeps hierarchy on the ratio. Weight is not a token: a single roman does not need a scale.

**Alternatives considered:**

- A system stack alone. The voice and the `ch` measure would change with the operating system.
- A grotesque or `system-ui`. That reads as a product template.
- Two families, a display serif plus a sans for text. A pairing is the usual portfolio template.
- Newsreader, Inter, JetBrains Mono, or Georgia. Those faces are tied to other systems, including REMA. They are not used here, including as fallbacks.
- A variable optical-size axis. One drawing at every step keeps the ratio as the only change in Sprint 0.

## DD-002

**Token:** `--north-ratio`

**Build filter:** more memorable

**Decision:** The scale ratio is √2, written as `1.414213562`. Note, heading, and title are powers of this number from the body step.

**Rationale:** √2 is the ISO paper ratio. Two steps multiply to 2, so the title is double the body (36px from an 18px body at a 16px root). It is a ratio a graphic designer already uses for paper, and a ratio a mathematics graduate already knows as the diagonal of a unit square. One custom property keeps every derived step attached to that choice.

**Alternatives considered:**

- 1.25 and 1.333. Both are common UI-kit ratios, and neither doubles on the second step.
- 1.618. The golden ratio is a familiar template, and the note step would fall near 11px while the title would jump past 47px. That is a poor phone range.
- Unrelated hand-tuned sizes. They would be harder to keep intact.

## DD-003

**Token:** `--north-size-body`

**Build filter:** easier to understand

**Decision:** The base step is `1.125rem`. At a 16px root that is 18px. Paragraphs use it. The stack space aliases it. The other sizes are this value divided or multiplied by the ratio.

**Rationale:** One reference size is the number the rest of the system is explained from. 18px is a comfortable reading size on a phone. Because it is `rem`, a reader who changes the browser's default font size changes the whole scale with it.

**Alternatives considered:**

- 16px. That is the browser default, so it would not record a decision.
- 17px. That is another system's body size. It is not used.
- 20px. The title would become 40px and the note about 14px. Usable, and heavier on a 320px screen than this portfolio needs.

## DD-004

**Token:** `--north-size-note`

**Build filter:** easier to maintain

**Decision:** One step down, `body / ratio`, 12.73px at a 16px root. Used for the short label above the name and the colophon. The tight space aliases this step.

**Rationale:** The value is a `calc()` of the body and the ratio, so it cannot drift off the scale. It is only for short labels. Paragraphs stay on the body step. The foreground contrast on this size is the same AAA pair as the body (DD-012), which is what makes a 12.73px label acceptable.

**Alternatives considered:**

- A fixed 14px. That would leave the ratio.
- Two steps down, about 9px. That would fail the phone reading test.

## DD-005

**Token:** `--north-size-heading`

**Build filter:** easier to maintain

**Decision:** One step up, `body * ratio`, 25.46px at a 16px root. Section headings use it. The title step multiplies it by the ratio again.

**Rationale:** Deriving the heading from the body and the ratio means a later change to either value retunes the heading. The size is fixed, not fluid, so the ratio stays visible when you measure the page.

**Alternatives considered:**

- A `clamp()` between two sizes. Fluid type would hide the ratio and make the phone test harder to judge.
- The title size reused for sections. Sections and the page title would share a step, and the scale would lose the middle.

## DD-006

**Token:** `--north-size-title`

**Build filter:** easier to maintain

**Decision:** Two steps up, `heading * ratio`, which is twice the body: 36px at a 16px root. The page title uses it. The section space aliases it.

**Rationale:** The title is the loudest size in the system, and it is still a text size, not a poster size. Twice the body is the √2 identity, so the top of the scale is explainable in one sentence. The section space reuses this step, so the token is both a type size and the large interval.

**Alternatives considered:**

- Three steps up, about 50.9px. That starts to behave like a marketing hero on a phone.
- A separate display face at this size. That would break the one-typeface decision.

## DD-007

**Token:** `--north-leading`

**Build filter:** easier to understand

**Decision:** Line height is `1.5`, unitless, on body and title. Headings inherit it.

**Rationale:** 1.5 is the line spacing WCAG 2.1 success criterion 1.4.8 asks for. This sprint promises AA, and the reading column still uses that spacing so lines are easy to follow. One leading is easier to remember than a leading per role. A unitless value scales with the font size and survives a reader stylesheet that increases spacing.

**Alternatives considered:**

- Leading equal to the ratio, 1.414. That sits under the 1.5 benchmark. The ratio still drives size and space. Leading is the one place it does not.
- A tighter title leading such as 1.15. That would add a second token for a single role.
- 1.75. Loose under a 36px title, and it is another system's prose leading.

## DD-008

**Token:** `--north-space-tight`

**Build filter:** easier to maintain

**Decision:** The small interval aliases `--north-size-note`. Under headings, and as the padding between text and a rule.

**Rationale:** Space steps are the type steps. Aliasing the note size means the small interval cannot be edited away from the small type. The name says it is space, so a margin is not written with a font-size token.

**Alternatives considered:**

- An 8px or 4px inset from a different grid. That would start a second rhythm.
- Reusing the stack space under headings. The heading would detach from the paragraph it introduces.

## DD-009

**Token:** `--north-space-stack`

**Build filter:** easier to understand

**Decision:** The everyday interval aliases `--north-size-body`. Paragraph gaps, the page inset, and the grid gutter all use it.

**Rationale:** The body step is the interval people already understand, because it is the type size they are reading. One inset of one body em is a simple page margin. Using the same token for the gutter keeps the grid on that interval.

**Alternatives considered:**

- A separate inset token and a separate gutter token with the same value. They would be duplicates until a real second value exists.
- 16px. It would break the shared step.

## DD-010

**Token:** `--north-space-section`

**Build filter:** easier to maintain

**Decision:** The large interval aliases `--north-size-title`. Between sections, and as the page's block padding.

**Rationale:** The large step is how a section announces itself. Aliasing the title size ties that announcement to the type scale. A change to the title step retunes the section gap.

**Alternatives considered:**

- A blank line, `leading * body` (27px at a 16px root), as its own number. That number is not on the √2 scale.
- The stack space between sections. Sections would not separate clearly from paragraphs.

## DD-011

**Token:** `--north-surface`

**Build filter:** easier to understand

**Decision:** The page ground. Light `#E6F0F1`. Dark `#1A3C44`, applied under `prefers-color-scheme: dark`. `color-scheme` is set with the surface so browser chrome matches the ground. Light is the default, including when the visitor has expressed no preference.

**Rationale:** The role name says where the colour goes. Light is a pale mineral sheet. Dark is a lifted marine, bluer and lighter than the light-theme ink, so the dark ground is its own value rather than the light ink reused as a background. Neither value is pure white or pure black.

**Alternatives considered:**

- `#FFFFFF` and `#000000`. They glare, and they do not record a choice.
- A warm cream ground. Warm paper is a common editorial palette, and it is close to palettes this system is required to avoid.
- One hex shared by both themes. Dark mode needs its own ground.

## DD-012

**Token:** `--north-foreground`

**Build filter:** easier to understand

**Decision:** All text, including the note labels. Light `#0E2428` on `#E6F0F1`. Dark `#D7EBEC` on `#1A3C44`.

**Measured ratios:**

| Theme | Foreground luminance | Surface luminance | Ratio |
| --- | --- | --- | --- |
| Light | 0.0151 | 0.8549 | **13.90:1** |
| Dark | 0.7992 | 0.0387 | **9.58:1** |

Both clear WCAG 2.1 AA for normal text (4.5:1) and AAA (7:1).

**Rationale:** One ink keeps the set small and keeps the note size on the same contrast pair as the body. Hierarchy is size, which is already a token. The role name tells an author to use it for text and not for rules.

**Alternatives considered:**

- A second, muted foreground for labels. Muted greys are where text contrast usually fails, and the label would no longer match the body ink.
- An accent colour for links. This sprint has no component colours, and the specimen has no links.

## DD-013

**Token:** `--north-border`

**Build filter:** easier to understand

**Decision:** Structural rules. Light `#758384` on `#E6F0F1`. Dark `#798D93` on `#1A3C44`. The specimen uses the role for the header rule and the footer rule. Rule thickness is 1px and is not a token, because a second thickness is not used.

**Measured ratios:**

| Theme | Border luminance | Surface luminance | Ratio |
| --- | --- | --- | --- |
| Light | 0.2168 | 0.8549 | **3.39:1** |
| Dark | 0.2522 | 0.0387 | **3.41:1** |

Both clear WCAG 2.1 AA for non-text contrast (success criterion 1.4.11, 3:1).

**Rationale:** The border is a role, separate from the ink, so a rule can be quieter than the text and still meet the non-text bar. A pale hairline on these surfaces would fall under 3:1, so the value is a mid mineral rather than a tint of the ground.

**Alternatives considered:**

- A hairline near 1.5:1. It would fail AA.
- Reusing the foreground for rules. The role would collapse, and a full-ink rule is heavier than the page needs.

## DD-014

**Token:** `--north-measure`

**Build filter:** easier to understand

**Decision:** The text column stops at `60ch`. The specimen's shell is this width plus two stack insets, so the line itself is the measure. Below that width, the column is the viewport minus the inset.

**Rationale:** `ch` follows the zero of Source Serif 4, so the line length stays attached to the typeface. In this roman, a full line of the specimen at 60ch runs about 66 to 70 letters. The zero is wider than an average letter, so the cap is 60 zeros in order to land near 66 letters of prose, the length the column is aimed at. The token records a reading measure, which a pixel width would not say.

**Alternatives considered:**

- 66ch. Measured on this face, that cap sets prose near 75 letters, which is the long end of comfort.
- A `rem` cap tuned by eye to a different face. It would not follow Source Serif 4.
- A pixel max-width. It ignores the font, and it fights a reader who enlarges the root size.
- 45ch. That is what a phone already does by being narrow, and it would cap desktop lines too early.

## DD-015

**Token:** `--north-grid-columns`

**Build filter:** more memorable

**Decision:** The page grid has 4 columns. The gutter is `--north-space-stack` and is not a separate token. Running text spans all four columns. The specimen sets that grid on the page.

**Rationale:** Four is the smallest even grid that can later hold a figure on two columns and a caption on two. It is a memorable count, and it avoids a 12-column marketing grid. The gutter reuses the stack space so the grid does not invent an interval.

**Alternatives considered:**

- 12 columns. That is a template grid this portfolio does not need yet.
- No column token, only a single centered column. Later case studies would invent a grid beside the type scale.
- A separate gutter token equal to the stack space. It would duplicate DD-009.

## Backlog

These are notes for later. They are not tokens, and they are not implemented.

**Documented breaks.** A stricter pass could require every raw value in page CSS to be a token, with a deliberate exception written as a comment in the form `/* break: DD-xxx */`. The comment would name the decision being broken, so an exception stays attached to a reason. Sprint 0 does not add that lint, and the specimen does not use the comment.

**What I'd have built.** A later case study could show what shipped and, in a quieter voice beside it, what the designer would have built. Sprint 0 does not define a layout, a token, or any specimen content for that treatment.
