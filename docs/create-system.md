# Create a design system

Aesthetic itself isn't a design system, instead, it provides a design system "builder", in which a
company or individual can create and manage a design system for their project. To create a design
system, run the following command in your project root.

```
npx @aesthetic/cli init
```

This command will generate an [YAML configuration file](./config-system.md) in which you may
customize all aspects of the system. By default, the `init` command will generate the configuration
using fixed settings. If you would prefer to use scaled settings (using
[modular scale](./config-system.md#scaling-patterns)), pass the `--modularScale` flag.

```
npx @aesthetic/cli init --modularScale
```

Furthermore, if you would prefer to create the configuration file in another location, you can pass
a relative folder path as an argument. This may be useful for supporting multiple design systems.
However, be aware that the file name is the same, and as such, you may run into overwrites or
collisions.

```
npx @aesthetic/cli init ./design-systems/2020
```

## Aspects

A design system defines aspects of a product's visual identity. These aspects are divided into the
following categories:

- **Borders** - Border styles, widths, and rounding.
- **Elevation** - Shadows and depths.
- **Iconography** - _(Coming soon)_
- **Motion** - _(Coming soon)_
- **Responsive/Adaptive** - Breakpoints, strategies, and scaling.
- **Spacing** - Spacing algorithms and multipliers.
- **Typography** - Text/heading fonts, sizing, and letter spacing.

Jump to the [configuring a design system](./config-system.md) chapter for more information on
customizing these aspects.

## Colors

You may have noticed the absence of color mentioned above, as color is a very important feature of a
product's visual identity and brand. That's because in an Aesthetic design system, color is managed
by themes!

For more information on how themes and colors work in relation to the system, check out the
[composing themes](./compose-themes.md) chapter.

## Constraints

An Aesthetic design system is fixed and only supports a very explicit number of features, those of
which cannot be added, removed, increased, or decreased. It's fixed so that interoperability between
systems (external or internal), migration between new and old systems, and adoption are entirely
seamless.

In it's current state, the following cannot be changed (will always have 3 border sizes for example,
no more, no less).

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
