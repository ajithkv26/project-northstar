# Design decisions

Sprint 0 is for Project Northstar.
`tokens.css` is the source of truth.
This project does not use a Figma file.

The repository had no placeholder tokens.
This log introduces every token from scratch.

The set is independent of the REMA design system.
The token names belong to Northstar.
The typeface belongs to Northstar.
The colours belong to Northstar.

Each entry names one part of the build filter.
The parts are **easier to understand**, **easier to maintain**, and **more memorable**.

A token is in the file for one of two reasons.
At least two places use the token.
Or the token records a decision that the other tokens depend on.
The set stops at type, space, the three colour roles, and the page grid.

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

Ratios use the WCAG 2.1 relative luminance definition.
The method makes each sRGB channel linear.
Luminance is `0.2126 R + 0.7152 G + 0.0722 B`.
The ratio is `(L lighter + 0.05) / (L darker + 0.05)`.
The figures below use two decimal places.
AA for this sprint is 4.5:1 for normal text.
AA for a border that marks structure is 3:1.
That border rule is success criterion 1.4.11.

## DD-001

**Token:** `--north-font`

**Build filter:** more memorable

**Decision:** The system uses one typeface.
The typeface is Source Serif 4 roman.
The site hosts `fonts/SourceSerif4-Regular.woff2`.
The license is the SIL Open Font License.
The license file is `fonts/LICENSE.md`.
The file is the regular cut from the Adobe release.
The project does not modify that file.
The weight is 400 only.
The fallback list is Iowan Old Style, Palatino, Palatino Linotype, and Book Antiqua.
The last fallback is a generic serif.
`font-display: swap` shows text before the font file arrives.

**Rationale:** The portfolio is typography-led.
Ajith trained in mathematics.
Ajith started in graphic design.
The page reads as careful text.
One voice runs from the label to the title.
Source Serif 4 supports continuous text.
The site can host this typeface.
One weight puts the hierarchy on the ratio.
Weight is not a token.
One roman cut does not need a weight scale.

**Alternatives considered:**

- An alternative was a system stack alone.
  The voice changes with the operating system.
  The `ch` measure changes with the operating system.
- An alternative was a grotesque.
  An alternative was `system-ui`.
  Those choices look like a product template.
- An alternative was two families.
  One family is a display serif.
  The other family is a sans for text.
  That pair is the usual portfolio template.
- Newsreader, Inter, JetBrains Mono, and Georgia were alternatives.
  Other systems use those typefaces.
  REMA uses those typefaces.
  This system does not use them.
  This system does not use them as fallbacks.
- An alternative was a variable optical-size axis.
  Sprint 0 uses the same letter shapes at every step.
  The ratio is the only change in Sprint 0.

## DD-002

**Token:** `--north-ratio`

**Build filter:** more memorable

**Decision:** The scale ratio is √2.
The decimal form is `1.414213562`.
The note, the heading, and the title are powers of this ratio.
Each power starts from the body step.

**Rationale:** √2 is the ISO paper ratio.
Two steps multiply to 2.
The title is double the body.
An 18px body at a 16px root gives a 36px title.
A graphic designer uses this ratio for paper.
A mathematics graduate knows this ratio.
The ratio is the diagonal of a unit square.
One token keeps each derived step on this ratio.

**Alternatives considered:**

- 1.25 was an alternative.
  1.333 was an alternative.
  UI kits use these ratios often.
  The second step of these ratios is not double the base.
- 1.618 was an alternative.
  1.618 is the golden ratio.
  The golden ratio is a familiar template.
  The note step is near 11px with this ratio.
  The title step is past 47px with this ratio.
  That range is poor on a phone.
- Hand-tuned sizes with no shared ratio were an alternative.
  Those sizes are harder to keep intact.

## DD-003

**Token:** `--north-size-body`

**Build filter:** easier to understand

**Decision:** The base step is `1.125rem`.
A 16px root makes this step 18px.
Paragraphs use this step.
The stack space uses this same value.
The other sizes divide this value by the ratio.
The other sizes multiply this value by the ratio.

**Rationale:** One reference size explains the other sizes.
18px is a comfortable text size on a phone.
The unit is `rem`.
A reader can change the default font size in the browser.
That change changes the full scale.

**Alternatives considered:**

- 16px was an alternative.
  16px is the browser default.
  16px does not record a decision.
- 17px was an alternative.
  17px is the body size of another system.
  This system does not use 17px.
- 20px was an alternative.
  A 20px body makes the title 40px.
  A 20px body makes the note about 14px.
  20px is usable.
  20px is heavier on a 320px screen than this portfolio needs.

## DD-004

**Token:** `--north-size-note`

**Build filter:** easier to maintain

**Decision:** The note size is one step down from the body.
The formula is `body / ratio`.
A 16px root makes this step 12.73px.
The short label above the name uses this step.
The colophon uses this step.
The tight space uses this same value.

**Rationale:** The value is a `calc()` of the body and the ratio.
The note size stays on the scale.
The note size is for short labels only.
Paragraphs stay on the body step.
This size uses the same AAA pair as the body.
DD-012 records that pair.
That contrast makes a 12.73px label acceptable.

**Alternatives considered:**

- A fixed 14px was an alternative.
  A fixed 14px leaves the ratio.
- Two steps down was an alternative.
  Two steps down is about 9px.
  About 9px fails the test on a phone.

## DD-005

**Token:** `--north-size-heading`

**Build filter:** easier to maintain

**Decision:** The heading size is one step up from the body.
The formula is `body * ratio`.
A 16px root makes this step 25.46px.
Section headings use this step.
The title step multiplies this step by the ratio.

**Rationale:** The heading comes from the body and the ratio.
A later change to the body changes the heading.
A later change to the ratio changes the heading.
The heading size stays constant.
The size is not fluid.
You can measure the ratio on the page.

**Alternatives considered:**

- A `clamp()` between two sizes was an alternative.
  Fluid type hides the ratio.
  Fluid type makes the phone test harder to judge.
- The title size for sections was an alternative.
  Sections and the page title share one step in that plan.
  The scale loses the middle step.

## DD-006

**Token:** `--north-size-title`

**Build filter:** easier to maintain

**Decision:** The title size is two steps up from the body.
The formula is `heading * ratio`.
This size is twice the body.
A 16px root makes this step 36px.
The page title uses this step.
The section space uses this same value.

**Rationale:** The title is the loudest size in the system.
The title is still a text size.
The title is not a poster size.
Twice the body is the √2 identity.
You can explain the top of the scale in one sentence.
The section space uses this same step.
The token is a type size.
The token is also the large interval.

**Alternatives considered:**

- Three steps up was an alternative.
  Three steps up is about 50.9px.
  That size looks like a marketing hero on a phone.
- A separate display typeface was an alternative.
  A second typeface breaks the one-typeface decision.

## DD-007

**Token:** `--north-leading`

**Build filter:** easier to understand

**Decision:** The line height is `1.5`.
The value has no unit.
Body text uses this line height.
The title uses this line height.
Headings get this line height from the parent.

**Rationale:** WCAG 2.1 success criterion 1.4.8 asks for a line height of 1.5.
This sprint meets AA.
The text column still uses this line height.
A reader can follow the lines.
One line height is easier to remember than a line height for each role.
A value with no unit grows with the font size.
A reader style sheet can increase the spacing.
The line height still works after that increase.

**Alternatives considered:**

- A line height equal to the ratio was an alternative.
  That value is 1.414.
  1.414 is below the 1.5 benchmark.
  The ratio still controls size.
  The ratio still controls space.
  The ratio does not control line height.
- A tighter title line height was an alternative.
  That value is 1.15.
  That choice adds a second token for one role.
- 1.75 was an alternative.
  1.75 is loose under a 36px title.
  1.75 is the prose line height of another system.

## DD-008

**Token:** `--north-space-tight`

**Build filter:** easier to maintain

**Decision:** The small space uses the value of `--north-size-note`.
This space sits under headings.
This space is the padding between text and a rule.

**Rationale:** The space steps are the type steps.
The small space stays equal to the small type.
You do not edit the two values apart.
The token name says that the value is space.
A margin does not use a font-size token.

**Alternatives considered:**

- An 8px inset from a different grid was an alternative.
  A 4px inset from a different grid was an alternative.
  That inset starts a second rhythm.
- The stack space under headings was an alternative.
  The heading separates from the paragraph that follows.

## DD-009

**Token:** `--north-space-stack`

**Build filter:** easier to understand

**Decision:** The stack space uses the value of `--north-size-body`.
Paragraph gaps use this space.
The page inset uses this space.
The grid gutter uses this space.

**Rationale:** The stack space is the everyday interval.
The body step is the interval that a reader already knows.
The interval matches the text size on the page.
One inset of one body em is the page margin.
The same token for the gutter keeps the grid on this interval.

**Alternatives considered:**

- A separate inset token was an alternative.
  A separate gutter token was an alternative.
  The two tokens have the same value.
  The two tokens are duplicates until a second value exists.
- 16px was an alternative.
  16px breaks the shared step.

## DD-010

**Token:** `--north-space-section`

**Build filter:** easier to maintain

**Decision:** The section space uses the value of `--north-size-title`.
This space sits between sections.
This space is the block padding of the page.

**Rationale:** The large step shows the start of a section.
The section space stays equal to the title size.
The section gap follows the type scale.
A change to the title step changes the section gap.

**Alternatives considered:**

- A blank line as its own number was an alternative.
  The formula is `leading * body`.
  A 16px root makes that line 27px.
  27px is not on the √2 scale.
- The stack space between sections was an alternative.
  Sections do not separate clearly from paragraphs in that plan.

## DD-011

**Token:** `--north-surface`

**Build filter:** easier to understand

**Decision:** This token is the page surface.
The light value is `#E6F0F1`.
The dark value is `#1A3C44`.
The query `prefers-color-scheme: dark` applies the dark value.
The project sets `color-scheme` with the surface.
The browser chrome matches the surface.
Light is the default.
Light stays the default when a visitor sets no preference.

**Rationale:** The role name tells you where the colour goes.
The light surface is a pale mineral sheet.
The dark surface is a lifted marine.
The dark surface is bluer than the light-theme foreground.
The dark surface is lighter than the light-theme foreground.
The dark surface has its own value.
The dark surface is not the light foreground as a background.
The light value is not pure white.
The light value is not pure black.
The dark value is not pure white.
The dark value is not pure black.

**Alternatives considered:**

- `#FFFFFF` and `#000000` were alternatives.
  Those colours glare.
  Those colours do not record a choice.
- A warm cream surface was an alternative.
  Warm paper is a common editorial palette.
  That palette is close to palettes that this system must avoid.
  This system must stay away from those palettes.
- One hex for both themes was an alternative.
  Dark mode needs its own surface.

## DD-012

**Token:** `--north-foreground`

**Build filter:** easier to understand

**Decision:** This token colours all text.
Note labels use this token.
The light foreground `#0E2428` sits on `#E6F0F1`.
The dark foreground `#D7EBEC` sits on `#1A3C44`.

**Measured ratios:**

| Theme | Foreground luminance | Surface luminance | Ratio |
| --- | --- | --- | --- |
| Light | 0.0151 | 0.8549 | **13.90:1** |
| Dark | 0.7992 | 0.0387 | **9.58:1** |

Both pairs pass WCAG 2.1 AA for normal text.
The AA limit is 4.5:1.
Both pairs pass AAA.
The AAA limit is 7:1.

**Rationale:** One foreground keeps the set small.
The note size uses the same contrast pair as the body.
Size shows the hierarchy.
Size is already a token.
The role name tells an author to use this colour for text.
An author does not use this colour for rules.

**Alternatives considered:**

- A second foreground for labels was an alternative.
  That plan uses a muted grey.
  Muted greys are where text contrast usually fails.
  The label does not match the body foreground in that plan.
- An accent colour for links was an alternative.
  This sprint has no component colours.
  The specimen has no links.

## DD-013

**Token:** `--north-border`

**Build filter:** easier to understand

**Decision:** This token colours structural rules.
The light border `#758384` sits on `#E6F0F1`.
The dark border `#798D93` sits on `#1A3C44`.
The specimen uses this role for the header rule.
The specimen uses this role for the footer rule.
The rule thickness is 1px.
Thickness is not a token.
The system does not use a second thickness.

**Measured ratios:**

| Theme | Border luminance | Surface luminance | Ratio |
| --- | --- | --- | --- |
| Light | 0.2168 | 0.8549 | **3.39:1** |
| Dark | 0.2522 | 0.0387 | **3.41:1** |

Both pairs pass WCAG 2.1 AA for non-text contrast.
The rule is success criterion 1.4.11.
The limit is 3:1.

**Rationale:** The border is its own role.
The border is separate from the foreground.
A rule can be quieter than the text.
The rule still meets the non-text contrast limit.
A pale hairline on these surfaces is under 3:1.
The value is a mid mineral.
The value is not a tint of the surface.

**Alternatives considered:**

- A hairline near 1.5:1 was an alternative.
  That hairline fails AA.
- The foreground for rules was an alternative.
  The border role collapses into the foreground in that plan.
  A full-ink rule is heavier than the page needs.

## DD-014

**Token:** `--north-measure`

**Build filter:** easier to understand

**Decision:** The text column stops at `60ch`.
The specimen shell adds two stack insets to this width.
The text line itself is the measure.
Below that width, the column is the viewport minus the inset.

**Rationale:** `ch` follows the zero of Source Serif 4.
The line length stays with this typeface.
In this roman, a full line at 60ch has about 66 to 70 letters.
The zero is wider than an average letter.
The limit is 60 zeros.
This limit puts the line near 66 letters of prose.
66 letters is the target length of the column.
The token records a text measure.
A pixel width does not record that measure.

**Alternatives considered:**

- 66ch was an alternative.
  On this typeface, 66ch sets the text near 75 letters.
  75 letters is the long end of comfort.
- A `rem` limit for a different typeface was an alternative.
  An author sets that limit by eye.
  That limit does not follow Source Serif 4.
- A pixel maximum width was an alternative.
  A pixel width ignores the typeface.
  A pixel width fights a reader who makes the root size larger.
- 45ch was an alternative.
  A narrow phone already gives that line length.
  45ch limits desktop lines too early.

## DD-015

**Token:** `--north-grid-columns`

**Build filter:** more memorable

**Decision:** The page grid has 4 columns.
The gutter is `--north-space-stack`.
The gutter is not a separate token.
Text spans all four columns.
The specimen sets this grid on the page.

**Rationale:** Four is the smallest even grid for a later figure.
The figure can use two columns.
The caption can use two columns.
Four is a memorable count.
The grid is not a 12-column marketing grid.
The gutter uses the stack space again.
The grid does not add a new interval.

**Alternatives considered:**

- 12 columns was an alternative.
  A 12-column grid is a template.
  This portfolio does not need that grid yet.
- No column token was an alternative.
  The page has one centered column in that plan.
  Later case studies add a grid beside the type scale.
- A separate gutter token was an alternative.
  That token equals the stack space.
  That token duplicates DD-009.

## Backlog

These notes are for later work.
These notes are not tokens.
This sprint does not build these notes.

**Documented breaks.** A later strict pass can make this rule.
Each raw value in page CSS must be a token.
A writer can record an exception in a comment.
The comment form is `/* break: DD-xxx */`.
The comment names the decision that the exception breaks.
The exception stays attached to a reason.
Sprint 0 does not add that lint.
The specimen does not use the comment.

**What I'd have built.**

A later case study can show the work that shipped.
The case study can also show the design that the designer did not ship.
The second part uses a quieter voice.
That voice sits beside the shipped work.
Sprint 0 does not define a layout for that treatment.
Sprint 0 does not define a token for that treatment.
Sprint 0 does not define specimen content for that treatment.
