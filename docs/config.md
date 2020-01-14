# Configuration

### Unitless Values

TODO

### Scaling Patterns

TODO

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

The `typography.text` settings control both the body and paragraph text of the application, and
spacing based calculations (primarily used by `spacing.type`). Body text comes in 3 sizes -- small,
normal (default), and large -- and can be configured using a scaled format with
[TypeScale][type-scale], or with an explicit per size format.

The scaled approach will use the scale properties to calculate small and large sizes automatically,
so the values configured should be the default text size (normal).

```yaml
typography:
  text:
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

TODO

[ios-responsive]:
  https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/
[type-scale]: https://type-scale.com/
