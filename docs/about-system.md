# What is a design system?

A design system is the single source of truth for a product or companies visual identity. With
Aesthetic, the design system is structured around the following 3 pillars.

```
+----------------- Design System -------------------+
| +-------------+ +-------------+ +---------------+ |
| | Brand       | | Language    | | Themes        | |
| +-------------+ +-------------+ +---------------+ |
| | Vision      | | Borders     | | Colors        | |
| | Principles  | | Elevation   | | Color schemes | |
| | Terminology | | Iconography | | Palettes      | |
| | Guidelines  | | Motion      | | States        | |
| +-------------+ | Responsive  | | Contrast      | |
|                 | Spacing     | | Accessibility | |
|                 | Typography  | +---------------+ |
|                 +-------------+                   |
+---------------------------------------------------+
```

> Jump to the [configuring a design system](./config/README.md) chapter for more information on
> customizing these pillars.

## Brand

Brand is much more than a name and a logo. It’s the values that define your unique identity and what
makes you stand out from others. This is represented by an overarching vision, accompanying design
principles, guidelines, and more.

## Language

The visual aspects of a design system is known as a design language, and is divided into the
following categories:

- **Borders** - Border widths and rounding.
- **Elevation** - Shadows and depths.
- **Iconography** - _(Coming soon)_
- **Motion** - _(Coming soon)_
- **Responsive/Adaptive** - Breakpoints, strategies, and scaling.
- **Spacing** - Spacing algorithms and multipliers.
- **Typography** - Text/heading fonts, sizing, and letter spacing.

## Themes

While the design language defines aspects and primitives, a theme defines colors, palettes, and
states. With this approach, a design system may have multiple visual variations through themes,
while adhering to and inheriting the same primitives.

Themes are represented using a tree structure, where the root of the hierarchy is the design
language/system, with each branch or leaf being a theme. Because this is a tree, themes may extend
from other themes, promoting color and style reusability.

```
                        +-----------+
                        | Design    |
                        | Language  |
                        +-+---+---+-+
                          |   |   |
         +----------------+   |   +----------------+
         v                    v                    v
+--------+--------+  +--------+--------+  +--------+--------+
| Day             |  | Night           |  | Print           |
+-----------------+  +-----------------+  +-----------------+
| Light scheme    |  | Dark scheme     |  | Light scheme    |
| Normal contrast |  | Normal contrast |  | Normal contrast |
+-----------------+  +--+-----------+--+  | Reduced motion  |
                        |           |     +-----------------+
                    +---+           +--+
                    v                  v
             +------+-------+  +-------+-------+
             | Dusk         |  | Twilight      |
             +--------------+  +---------------+
             | Dark scheme  |  | Dark scheme   |
             | Low contrast |  | High contrast |
             +--------------+  +---------------+
```

Lastly, as seen above, each theme provides first-class accessibility and user preference support for
[color schemes](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme),
[contrast levels](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast),
[reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) and
more.

## Resources

- [Design system checklist](https://designsystemchecklist.com/)
- [Everything you need to know about design systems](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)
- [A comprehensive guide to design systems](https://www.invisionapp.com/inside-design/guide-to-design-systems/)
