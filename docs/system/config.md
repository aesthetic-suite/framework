# Configuration

The design system is configured in a human and machine readable format known as
[YAML](https://en.wikipedia.org/wiki/YAML). This format works across all operating systems,
platforms, programming languages, and is easily accessible for both designers and developers.

Before we dive into all configurable settings, a few must know concepts are described below.

### Unitless values

All configuration settings that require a unit based value (`px`, `pt`, `sp`, etc) must be defined
using a unitless number. During the compilation phase, this unitless value will be calculated
according to the platform target, and output with the required unit suffix.

When configuring, assume a unit based on the following table.

| Platform | Spacing | Typography |
| -------- | ------- | ---------- |
| Android  | `dp`    | `sp`       |
| iOS      | `pt`    | `pt`       |
| Web      | `px`    | `px`       |

### Scaling patterns

A good portion of the configuration provides an automatic scaling alternative, based on [modular
scale][modular-scale] ([more info](https://alistapart.com/article/more-meaningful-typography/)).
This alternative calculates, measures, and provides optimal proportions and density automatically,
which alleviates the burden from designers and developers.

Settings that support scaling will always have a sibling setting of the same name, suffixed with
`Scale`. Scale values are either a float that defines an explicit ratio, or a kebab-cased string
that maps to a common ratio name, like `golden-ratio`.

```yaml
# Floats
sizeScale: 1.25

# Strings
sizeScale: major-fourth
```

> If you want to use scaling for a specific setting group, but not an individual setting, pass `0`
> as the scale ratio.

## System

> Platforms: Android, iOS, Web

### Name

What is a design system without a name? The name should be unique and is used by specific
compilation targets.

```yaml
name: aesthetic-2020
```

### Extending systems

Instead of duplicating entire configurations, you can extend an existing design system configuration
by providing its name (must be relative to the current config file), or a relative file path.

```yaml
extends: other-config

# Relative config
extends: ../other-system/config.yaml
```

## Responsive

### Strategy

> Platforms: Web

First and foremost, the design system needs to know which device is top priority, mobile or desktop?
This strategy is then referenced internally throughout the configuration, as other settings react to
it, like breakpoints.

By default, the `responsive.strategy` setting is set to "mobile-first", but also accepts
"desktop-first".

```yaml
responsive:
  strategy: mobile-first
```

### Breakpoints

> Platforms: Android, Web

Breakpoints integrate with the strategy above to provide responsive support, based on the device
viewport and orientation. When `responsive.strategy` is "mobile-first", the breakpoints will be
sorted from lowest to highest, and reversed for "desktop-first". This ensures the correct
specificity takes place.

The `responsive.breakpoints` setting _requires 5 breakpoints_ ranging from smallest to largest, in
either a list or map, with values being a [unit](#unitless-values). On the web, these values will be
converted to `em` values, while Android uses `dp`, and [ignored by iOS][ios-responsive]. By default,
the setting is configured to the values in the example below.

```yaml
# List
responsive:
  breakpoints:
    - 640
    - 960
    - 1280
    - 1600
    - 1920

# Object
responsive:
  breakpoints:
    xs: 640
    sm: 960
    md: 1280
    lg: 1600
    xl: 1920
```

### Fluid typography

> Platforms: Android, Web

Fluid typography is the concept of modifying the root text size for each breakpoint, so that
typography remains legible between viewports and devices. When targeting mobile-first, the font size
will increase so that text is legible on desktop viewports, while desktop-first will decrease the
font size for mobile viewports.

Responsive text uses [type scaling][type-scale] under the hood. Because of this, explicit font size
configurations for each breakpoint is not supported. At the moment, text and line height can be
scaled with `textScale` and `lineHeightScale` respectively.

```yaml
responsive:
  textScale: major-second
  lineHeightScale: 1.1
```

## Spacing

> Platforms: Android, iOS, Web

Spacing is the backbone of any layout, and in Aesthetic, both margin and padding are encapsulated
under this same mechanism. When integrating design tokens on the web, spacing will use `rem`, while
Android uses `dp`, and iOS uses `pt`.

There are many types of spacing calculations to choose from, each with their own pros and cons, so
choose the best for your application. Only 1 type may be chosen.

### Unit based

Uses an explicit platform dependent [unit](#unitless-values) to calculate with. When using this
type, the `spacing.unit` setting must also be defined.

```yaml
spacing:
  type: unit
  unit: 8
```

### Vertical rhythm

A concept from print typography where the spacing between elements are consistent. The rhythm unit
is based on the sum of `font size * line height` (using `typography` settings).
[Learn more about vertical rhythm](https://zellwk.com/blog/why-vertical-rhythms/).

```yaml
spacing:
  type: vertical-rhythm
```

## Typography

### Fonts

> Platforms: Android, iOS, Web

The `typography.font` setting controls what font families will be used for text, headings, and even
locales. If this setting is not defined, it will default to the platform system font.

In it's simplest form, a string will set the font for all typography.

```yaml
typography:
  font: 'Roboto, sans-serif'
```

However, the font for both body text, heading text, and even monospace text can be defined
separately, as a means to differentiate them all. This can be achieved with the following settings.

```yaml
typography:
  font:
    text: 'Roboto, sans-serif'
    heading: 'Droid, sans-serif'
    monospace: '"Lucida Console", Monaco, monospace'
```

When internationalizing an application, it's a great idea to use locale specific fonts to properly
support the language. This can be achieved with the `typography.font.locale` setting, which maps a
locale to a font family.

<!-- prettier-ignore -->
```yaml
typography:
  font:
    text: 'Roboto, sans-serif'
    locale:
      # Japanese
      ja_JP: 'YuGothic, "Meiryo UI", Meiryo, Osaka, Tahoma, Arial, sans-serif'
      # Thai
      th_TH: '"Leelawadee UI Regular", "Kmer UI", Tahoma, Arial, sans-serif'
```

### Text

> Platforms: Android, iOS, Web

The `typography.text` settings control both the body and paragraph text of the application, aswell
as spacing based calculations (primarily used by `spacing.type`). Body text comes in 3 sizes --
small, normal (default), and large -- and can be configured using a scaled format, or with an
explicit per size format.

The scaled approach will use scale equivalent settings to calculate small and large sizes, with
default being the middle, and going outwards. The values configured should be the default text size.

```yaml
typography:
  text:
    # Default
    size: 16
    sizeScale: 1.25
    lineHeight: 1.25
    lineHeightScale: 0
```

Otherwise, the settings can be explicitly defined for each size using a map.

```yaml
typography:
  text:
    small:
      size: 14
      lineHeight: 1
    default:
      size: 16
      lineHeight: 1.25
    large:
      size: 18
      lineHeight: 1.5
```

### Headings

> Platforms: Android, iOS, Web

Headings work in a similar fashion to text, but are focused on heading and title based text that
lead a section of the page. There are 6 levels of heading, with level 1 being the largest, and 6
being the smallest (very similar to `h1`-`h6` HTML tags).

The `typography.heading` setting shares the same settings from text, with the addition of letter
spacing, and per level configuration (instead of per size).

When using the scaled approach, the settings should be configured for level 6, as 5-1 will be
automatically calculated based on the scaling factor (going upwards).

```yaml
typography:
  heading:
    # Level 6
    size: 16
    sizeScale: major-third
    lineHeight: 1.5
    lineHeightScale: 0
    letterSpacing: 0.5
    letterSpacingScale: 0.1
```

For the explicit approach, define a map with `level*` named properties.

```yaml
typography:
  heading:
    level1:
      size: 48
      lineHeight: 1.75
      letterSpacing: 1
    level2:
      # ...
    level3:
      # ...
    level4:
      # ...
    level5:
      # ...
    level6:
      size: 16
      lineHeight: 1.5
      letterSpacing: 0.5
```

## Borders

> Platforms: Android, iOS, Web

The `borders` setting controls all borders and comes in 3 sizes: small, default, and large. At the
moment, only width and radius (corner rounding) are configured here, while the color is configured
in the neutral theme palette.

Like other settings, borders can be configured with scaling or explicit values. Scaled borders are
calculated from the inside out, with default as the middle, and small and large as the edges.

```yaml
borders:
  # Default
  radius: 3
  radiusScale: 1.5
  width: 1
  widthScale: 2
```

Or use a size map for explicit values.

```yaml
borders:
  small:
    radius: 2
    width: 1
  default:
    radius: 3
    width: 2
  large:
    radius: 4
    width: 3
```

## Elevation

### Depths

> Platforms: Web

While depths are not configured in the design system, they're still a must know concept. In
Aesthetic, depth refers to the layering of surfaces on the Z-axis to denote layout hierarchy. In
stack and priority order, the following depths are available.

- `content` - Common layout and content elements, like cards and labels.
- `navigation` - Navigation bars and menus that appear at the top or sides of the document.
- `sheet` - Surface with complementary content that slides in from the edge of the viewport. Also
  known as a drawer or panel.
- `overlay` - Surface that masks content or the entire document. Also known as a scrim or blackout.
- `modal` - Informational popup that is typically coupled with an overlay.
- `toast` - Notification popup that temporaily appears above content. Also known as a snackbar.
- `dialog` - Document blocking popup that requires an action or confirmation. Also known as an
  alert.
- `menu` - Menus that are expanded to float over content, like dropdown, flyout, and autocomplete
  menus.
- `tooltip` - Informational bubble that appears when hovering over or clicking content. Also known
  as a popover.

> Android should use the [Material design](https://material.io/design/environment/elevation.html)
> elevation and shadow guidelines.

### Shadows

> Platforms: iOS, Web

To visually represent depth, we use and rely on shadows. The `shadows` setting can be used to
configure shadows, and comes in 5 sizes: extra small, small, medium, large, and extra large.

Like other settings, shadows can be configured with scaling or explicit values. Scaled shadows are
calculated from extra small upwards to extra large.

```yaml
shadows:
  # Extra small
  x: 0
  xScale: 0
  y: 2
  yScale: golden-ratio
  blur: 2
  blurScale: 1.75
  spread: 1
  spreadScale: 1.15
```

Or use a size map for explicit values.

```yaml
shadows:
  xsmall:
    x: 0
    y: 2
    blur: 2
    spread: 1
  small:
    # ...
  medium:
    # ...
  large:
    # ...
  xlarge:
    x: 0
    y: 6.85
    blur: 18
    spread: 1
```

## Motion

> Platforms: Android, iOS, Web

Coming soon!

## Colors

> Platforms: Android, iOS, Web

The `colors` setting does not define actual color values, like hexcodes or RGBs, but instead defines
a list of color names that all themes must implement. This enforces a consistent contract between
the design system and its theme variations. It also permits other design systems to use their own
unique colors without the chance of collision.

Feel free to define as many colors as you want, either using common color names.

```yaml
colors:
  - red
  - green
  - blue
  - yellow
  - orange
```

Or with custom color names that are unique to your brand.

```yaml
colors:
  - gerudo
  - kokiri
  - zora
  - hylian
  - goron
```

## Themes

> Platforms: Android, iOS, Web

While the design system configuration above defines primitives, like borders, shadows, and spacing,
a theme defines [colors](#colors). With this approach, a design system can have multiple color
variations, while adhering to the same primitives.

Themes are configured with the `themes` map, where the key is the theme name, and the value is a
configuration map of colors, palettes, and additional settings. One such setting is `theme.scheme`,
which requires either "light" or "dark", and is utilized in color scheme preference detection.

```yaml
themes:
  default:
    scheme: light
```

### Color ranges

For every [color](#colors) that's been defined, an associated entry must exist within each theme
under `theme.colors.<name>`. A color supports a range of 10 hexcode values (`00` - `90`) known as
shades.

In a light color scheme, the `00` shade is the lightest color, while `90` is the darkest. This is
reversed for dark color schemes, where `00` is darkest, and `90` is lightest. In both schemes, the
`40` shade is the base "common" shade.

```yaml
themes:
  default:
    scheme: light
    colors:
      blue:
        00: '#E3F2FD' # Lightest
        10: '#BBDEFB'
        20: '#90CAF9'
        30: '#64B5F6'
        40: '#42A5F5' # Base
        50: '#2196F3'
        60: '#1E88E5'
        70: '#1976D2'
        80: '#1565C0'
        90: '#0D47A1' # Darkest
```

### Color palettes

Palettes are the defining feature of Aesthetic, as they enable true interoperability and backwards
compatibility with other design systems. In Aesthetic, colors (above) are not directly accessible to
consumers,as colors are not deterministic between systems, but palettes are!

A palette is a collection of color references for both foreground (text) and background (layout)
colors, grouped by states and interactions. The available palettes are:

- `brand` - Organization or company brand color.
- `primary` - Primary color. Typically buttons, links, bars, active states, etc.
- `secondary` - Accent color. Provides emphasis and contrast to the primary color.
- `tertiary` - Additional complementary color for more variation.
- `neutral` - Whites, grays, or blacks that make up background, border, shadow, and other layout
  related pieces.
- `muted` - Disabled and empty like states.
- `info` - State that denotes something as informational.
- `warning` - State that warns the user of something minor.
- `danger` - State that indicates a destructive, atomic, or irreversible action.
- `success` - State when something succeeds or passes.

Hopefully you have a better understanding of all the palettes, so let's dive into the configuration.
Each palette requires a `color`, `fg` (foreground), and `bg` (background) setting. The `color`
setting must reference a valid [color name](#colors), and will be the designated color for the
palette. The `fg` and `bg` variants will map states to shade references.

```yaml
themes:
  default:
    scheme: light
    colors:
      # ...
    palettes:
      primary:
        color: blue
        # Backgrounds use a lighter shade
        bg:
          base: 40
          focused: 50
          selected: 50
          hovered: 60
          disabled: 30
        # While text uses a darker shade for legibility (a11y)
        fg:
          base: 50
          focused: 60
          selected: 60
          hovered: 70
          disabled: 40
      secondary:
        color: orange
        bg: # ...
        fg: # ...
      tertiary:
        # ...
```

In the example above, you may have noticed 5 different states. In order of priority and specificity,
they are:

- `base` - The base palette color.
- `focused` - State when a target is focused through user interaction. _(optional)_
- `hovered` - State when a target is being hovered. _(optional)_
- `selected` - State when a target is selected, active, expanded, etc. _(optional)_
- `disabled` - State when a target is disabled. Should override all previous states. _(optional)_

All of the states are optional, and will default to the shade references above. If you prefer to
always use the defaults, a shorthand configuration is available, where the value can simply be set
to the color name. The above example can now be written as:

```yaml
themes:
  default:
    scheme: light
    colors:
      # ...
    palettes:
      primary: blue
      secondary: orange
      tertiary:
        # ...
```

> This may seem like a lot to configure, and it is, but it's thorough and covers all common and
> industry standard use cases. It also mitigates problems between light and dark themes.

### Extending themes

Aesthetic also supports the concept of extending themes, where a theme (the child) can extend
another theme (the parent), to inherit all its colors, palettes, and settings. The child theme can
then define individual settings, instead of having to define them all.

To extend another theme, use the `theme.extends` setting, which requires the parent theme's name.
The child theme object will deep merge with the parent theme object.

```yaml
themes:
  day:
    scheme: light
    colors: # ...
    palettes: # ...
  # Only change a single setting
  dawn:
    extends: day
    palettes:
      primary:
        bg:
          hovered: red.50
```

### Contrast variants

While color schemes offer a light or dark option, what about preferences for low or high contrast
colors? With the `theme.contrast` setting, a theme can be marked as "low" or "high" contrast, and
will be utilized during the detection phase.

A contrast variant usually extends a base theme, as we want to use the same palette, but adjust the
colors. For example, say we have a "night" dark theme, and want to provide a vibrant high contrast
variant.

```yaml
themes:
  night:
    scheme: dark
    colors:
      blue: '#0984e3'
    palettes:
      # ...
  nightHighContrast:
    extends: night
    contrast: high
    colors:
      blue: '#0652DD'
```

[ios-responsive]:
  https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/
[modular-scale]: https://www.modularscale.com
[type-scale]: https://type-scale.com
