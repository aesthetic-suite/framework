# Design system

A design system is the single source of truth for a product or companies visual identity. With
Aesthetic, the design system is structured around the following 3 pillars.

```
+----------------- Design System -------------------+
| +-------------+ +-------------+ +---------------+ |
| | Brand       | | Language    | | Theme         | |
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

## Brand

Brand is much more than a name and a logo. It’s the values that define your unique identity and what
makes you stand out from others. This is represented by an overarching vision, accompanying design
principles, guidelines, and more.

> Aesthetic currently does not configure the brand. Support for this is on the roadmap.

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

Jump to the [configuring a design system](../config-system.md) chapter for more information on
customizing these aspects.

## Theme

You may have noticed the absence of color mentioned in language, as color is a very important
feature of a product's visual identity. That's because in an Aesthetic design system, color is
managed by themes!

For more information on how themes and colors work in relation to the system, jump to the
[themes](./themes.md) chapter.

## Constraints

An Aesthetic design system is fixed and only supports a very explicit number of features, those of
which cannot be added, removed, increased, or decreased. It's fixed so that interoperability between
systems (external or internal), migration between new and old systems, and adoption are entirely
seamless.

In it's current state, the following cannot be changed.

- Borders
  - 3 border sizes (small, default, large)
- Elevation
  - 9 depths not including initial 0 depth
  - 5 shadow sizes (xsmall, small, medium, large, xlarge)
- Responsive
  - 5 breakpoints not including the default viewport (xsmall, small, medium, large, xlarge)
  - Mobile-first OR desktop-first
- Spacing
  - 6 multiplier and sizes (xsmall, small, default, medium, large, xlarge)
  - Vertical rhythm OR unit based
- Typography
  - 3 body text levels (small, default, large)
  - 6 heading levels (1-6)

> These numbers were derived from popular design systems by researching tech industry leaders. We
> finalized the features and numbers based on the commonalities and consistencies across them all.

## References

- [Design system checklist](https://designsystemchecklist.com/)
- [Everything you need to know about design systems](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)
- [A comprehensive guide to design systems](https://www.invisionapp.com/inside-design/guide-to-design-systems/)
