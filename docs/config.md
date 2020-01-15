# Configuration

### Unitless Values

TODO

### Scaling Patterns

A good portion of the configuration is based on [modular scale][modular-scale]
([more info](https://alistapart.com/article/more-meaningful-typography/)), as it calculates and
provides optimal proportions for layout and typography automaticaly. This removes the burden from
designers and developers.

Settings that support scaling will always have a sibling setting of the same name, suffixed with
`Scale`. Scales require either a float to use as an explicit ratio, or a kebab-cased string that
maps to a common ratio, like `golden-ratio`.

```yaml
# Floats
sizeScale: 1.25

# Strings
sizeScale: major-fourth
```

## Strategy

> Platforms: Web

First and foremost, the design system needs to know which device is top priority, mobile or desktop?
This strategy is then referenced internally throughout the configuration, as other settings react to
it, like breakpoints.

By default, the `strategy` setting is set to "mobile-first", but also accepts "desktop-first".

```yaml
strategy: mobile-first
```

## Breakpoints

> Platforms: Android, Web

Breakpoints integrate with the strategy above to provide responsive and adaptive support, based on
the device viewport and orientation. When the `strategy` is "mobile-first", the breakpoints will be
sorted from lowest to highest, and reversed for "desktop-first". This ensures the correct
specificity takes place.

The `breakpoints` setting _requires 5 breakpoints_ ranging from smallest to largest, in either a
list or object format, with values being a unitless integer. On the web, these values will be
converted to `em` values, while Android uses `dp`, and [ignored by iOS][ios-responsive]. By default,
the setting is configured to the values in the example below.

```yaml
# List
breakpoints:
  - 640
  - 960
  - 1280
  - 1600
  - 1920

# Object
breakpoints:
  xs: 640
  sm: 960
  md: 1280
  lg: 1600
  xl: 1920
```

## Spacing

> Platforms: Android, iOS, Web

Spacing is the backbone of any layout, and in Aesthetic, both margin and padding are encapsulated
under this same mechanism. When integrating design tokens on the web, spacing will use `rem`, while
Android uses `sp`, and iOS uses `pt`.

There are many types of spacing calculations to choose from, each with their own pros and cons, so
choose the best for your application. Only 1 type may be chosen.

### Unit Based

Uses an explicit platform dependent unit to calculate with -- uses `px` for web, `dp` for Android,
and `pt` for iOS. When using this type, the `spacing.unit` setting must also be defined.

```yaml
spacing:
  type: unit
  unit: 8
```

### Vertical Rhythm

A concept from print typography where the spacing between elements are consistent. The rhythm unit
is based on the sum of `font size * line height` (using `typography` settings).
[Learn more about vertical rhythm](https://zellwk.com/blog/why-vertical-rhythms/).

```yaml
spacing:
  type: vertical-rhythm
```

## Typography

> Platforms: Android, iOS, Web

### Fonts

The `typography.font` setting controls what font families will be used for text, headings, and even
locales. If this setting is not defined, it will default to the platform system font.

In it's simplest form, a string will set the font for all typography.

```yaml
typography:
  font: 'Roboto, sans-serif'
```

However, the font for both body text and headings can be defined separately, as a means to
differentiate the two if need be. This can be achieved with the `typography.font.text` and
`typography.font.heading` settings respectively.

```yaml
typography:
  font:
    text: 'Roboto, sans-serif'
    heading: 'Droid, sans-serif'
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

The `typography.text` settings control both the body and paragraph text of the application, aswell
as spacing based calculations (primarily used by `spacing.type`). Body text comes in 3 sizes --
small, normal (default), and large -- and can be configured using a scaled format with
[TypeScale][type-scale], or with an explicit per size format.

The scaled approach will use scale equivalent settings to calculate small and large sizes, with the
starting point being the middle, and going outwards. The values configured should be the default
text size (normal).

```yaml
typography:
  text:
    # Normal
    size: 16
    sizeScale: 1.25
    lineHeight: 1.25
    lineHeightScale: 0
```

Otherwise, the settings can be explicitly defined for each size using an object.

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
      size: 16
      lineHeight: 1.5
```

### Headings

Headings work in a similar fashion to text, but are focused on heading and title based text that
lead a section of the page. There are 6 levels of heading, with level 1 being the largest, and 6
being the smallest (very similar to `h1`-`h6` HTML tags).

The `typography.heading` setting shares the same settings from text, with the addition of letter
spacing, and per level configuration (instead of per size).

When using the scaled approach, the settings should be configured for level 6, as 5-1 will be
automatically calculated based on the scaling factor.

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

For the explicit approach, define an object with `level*` named properties.

```yaml
typography:
  heading:
    level1:
      size: 48
      lineHeight: 1.75
      letterSpacing: 1
    level2:
      size: 40
      lineHeight: 1.7
      letterSpacing: 0.95
    level3:
      size: 32
      lineHeight: 1.6
      letterSpacing: 0.85
    level4:
      size: 24
      lineHeight: 1.5
      letterSpacing: 0.75
    level5:
      size: 20
      lineHeight: 1.5
      letterSpacing: 0.5
    level6:
      size: 16
      lineHeight: 1.5
      letterSpacing: 0.5
```

### Responsive Scaling

Also known as fluid typography, responsive scaling is the concept of modifying the root font size
automatically for each breakpoint. When targeting mobile first, the font size will increase so that
text is legible on desktop viewports, while desktop first will decrease the font size for mobile
viewports.

Responsive text uses [type scaling][type-scale] under the hood. Because of this, explicit font sizes
configurations for each breakpoint is not supported.

There are multiple ways to enable responsive scaling, all of which depend on how text and headings
above are configured. When scaling, a `responsiveScale` setting can be included.

```yaml
typography:
  text:
    size: # ...
    sizeScale: # ...
    responsiveScale: major-second
  heading:
    size: # ...
    sizeScale: # ...
    responsiveScale: minor-third
```

When using the explicit approach, the `responsiveScale` setting must be included at the root of the
map, instead of within each item.

```yaml
typography:
  text:
    small: # ...
    default: # ...
    large: # ...
    responsiveScale: 1.125
  heading:
    level1: # ...
    level2: # ...
    level3: # ...
    level4: # ...
    level5: # ...
    level6: # ...
    responsiveScale: 1.2
```

[ios-responsive]:
  https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/
[modular-scale]: https://www.modularscale.com
[type-scale]: https://type-scale.com
