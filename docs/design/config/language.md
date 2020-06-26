# Language

The core of a design system is known as the design language, as it pertains to the visual aspect of
a brand. The design language defines common aspects and primitives like borders, shadows, and
spacing, through the `.aesthetic/<name>/language.yaml` file.

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
either a list or map, with values being a [unit](../config.md#unitless-values). On the web, these
values will be converted to `em` values, while Android uses `dp`, and
[ignored by iOS](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/).
By default, the setting is configured to the values in the example below.

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

Responsive text uses [type scaling](https://type-scale.com) under the hood. Because of this,
explicit font size configurations for each breakpoint is not supported. At the moment, text and line
height can be scaled with `textScale` and `lineHeightScale` respectively.

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

Uses an explicit platform dependent [unit](../config.md#unitless-values) to calculate with. When
using this type, the `spacing.unit` setting must also be defined.

```yaml
spacing:
  type: unit
  unit: 8
```

### Vertical rhythm

A concept from print typography where the spacing between elements are consistent. The rhythm unit
is based on the sum of `font size * line height` (using [typography](#typography) settings).
[Learn more about vertical rhythm](https://zellwk.com/blog/why-vertical-rhythms/).

```yaml
spacing:
  type: vertical-rhythm
```

### Multipliers

For developers, there are 6 spacing sizes to choose from, ranging from extra small to extra large.
These 6 sizes are provided so that all implementations use consistent spacing. However, the
multipliers for each of these sizes can be customized, like so (defaults used below).

```yaml
spacing:
  multipliers:
    xs: 0.25
    sm: 0.5
    df: 1 # Default
    md: 2
    lg: 3
    xl: 4
```

In basic terms, the multiplier will be used and calculated against the spacing type. For example, an
`xl` size would be equivalent to "vertical rhythm" (or "unit") x 4.

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

The `typography.text` settings control both the body and paragraph text of the application, as well
as spacing based calculations (primarily used by `spacing.type`). Body text comes in 3 sizes --
small, default (normal), and large -- and can be configured using a
[scaled format](../config.md#scaled-patterns), or with a fixed per size format.

The scaled approach will use scale equivalent settings to calculate small and large sizes, with
default being the middle, and scaling outwards. The values configured should be the default text
size.

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

When using the [scaled approach](../config.md#scaled-patterns), the settings should be configured
for level 6, as 5-1 will be automatically calculated based on the scaling factor (going upwards).

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

For the fixed approach, define a map with `level*` named properties.

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
in the neutral [theme palette](./themes.md#palettes-and-states).

Like other settings, borders can be configured with scaling or fixed values. Scaled borders are
calculated from the inside out, with default as the middle, and small and large as the edges.

```yaml
borders:
  # Default
  radius: 3
  radiusScale: 1.5
  width: 1
  widthScale: 2
```

Or use a size map for fixed values.

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

Like other settings, shadows can be configured with scaling or fixed values. Scaled shadows are
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

Or use a size map for fixed values.

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

Feel free to define as many colors as you want, either using actual color names.

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
