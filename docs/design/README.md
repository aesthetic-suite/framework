# What is a design system?

A design system is the single source of truth for a product or company's visual identity. It's more
than just a style guide, pattern library, or raw design files, it's a set of standards that promote
consistent, reusable, and scalable components that enable teams to design, develop, and actualize a
product.

Design systems have grown in popularity over the years, resulting in different and or
interchangeable terminology. With Aesthetic, we want to use specific terminology, so our design
system is structured around the following 3 pillars and their offerings.

```
+----------------- Design System -------------------+
| +-------------+ +-------------+ +---------------+ |
| | Brand       | | Language    | | Themes        | |
| +-------------+ +-------------+ +---------------+ |
| | Vision      | | Borders     | | Colors        | |
| | Principles  | | Elevation   | | Color schemes | |
| | Guidelines  | | Iconography | | Palettes      | |
| | Practices   | | Motion      | | States        | |
| | Terminology | | Responsive  | | Contrast      | |
| +-------------+ | Spacing     | | Accessibility | |
|                 | Typography  | +---------------+ |
|                 +-------------+                   |
+---------------------------------------------------+
```

> Jump to the [configuring a design system](../config/README.md) chapter for more information on
> customizing these pillars.

## Brand

Brand is much more than a name and a logo. It’s the values that define your unique identity and what
makes you stand out from others. This is represented by the following that ask the questions of "who
is our target audience?", "how will they use it?", "how can we improve the experience?", so on and
so forth.

- **Vision** - The overarching goal you are aiming for and the reason for creating the product.
- **Principles** - List of design principles that guide UI/UX product decisions.
- **Guidelines** - A set of recommendations on how to apply principles to provide a positive user
  experience.
- **Best practices** - Rules for correctly utilizing the system for consumers.
- **Core values** - The fundamental beliefs of the company or product that guide behavior.
- **Terminology** - Definitions and meanings specific to the brand.

## Language

The visual aspects of a design system is known as a design language. This language defines low-level
primitives that cascade to all parts of the system. These aspects are divided into the following
categories:

- **Borders** - Border widths and corner rounding.
- **Elevation** - Shadows and depths.
- **Iconography** - _(Coming soon)_
- **Motion** - _(Coming soon)_
- **Responsive/Adaptive** - Breakpoints, strategies, and dynamic scaling.
- **Spacing** - Spacing algorithms and multipliers.
- **Typography** - Text/heading fonts, sizing, and letter spacing.

## Themes

While the language defines aspects and primitives, a theme defines colors, palettes, and states.
With this approach, a design system may have multiple visual variations through themes, while
adhering to and inheriting the same primitives.

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
