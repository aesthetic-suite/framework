# Themes

> Platforms: Android, iOS, Web

Themes are configured with a `themes` map in the `.aesthetic/<name>/themes.yaml` file, where the key
is the theme name, and the value is a configuration object of colors, palettes, and additional
settings.

## Color scheme

One such setting is `scheme`, which requires either "light" or "dark", and is utilized in color
scheme preference detection. This allows for the automatic detection of light or dark modes for a
user.

```yaml
themes:
  default:
    scheme: light
```

## Color shades

For every [color](./language.md#colors) that's been defined in the design language, an associated
entry must exist within each theme under `colors.<name>`. A color supports a range of 10 hexcode
values (`00` - `90`) known as _shades_.

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

## Palettes and states

Palettes are the defining feature of Aesthetic, as they enable true interoperability and backwards
compatibility with other Aestheic powered design systems. In Aesthetic, colors _are not_ directly
accessible to consumers, as colors are not deterministic between systems, but palettes are!

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
setting must reference a valid [color name](./language.md#colors), and will be the designated color
for the palette. The `fg` and `bg` variants will map states to shade references.

```yaml
themes:
  default:
    scheme: light
    colors:
      blue:
        # 00-90 ...
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

> This may seem like a lot to configure, and it is, but it's thorough and covers many common and
> industry standard use cases. It also mitigates problems between light and dark themes.

## Extending themes

Aesthetic also supports the concept of extending themes, where a theme (the child) can extend
another theme (the parent), to inherit all its colors, palettes, and settings. The child theme can
then define individual settings, instead of having to define them all.

To extend another theme, use the `extends` setting, which requires the parent theme's name. The
child theme object will deep merge with the parent theme object.

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

## Contrast levels

While [color schemes](#color-scheme) offer a light or dark option, what about preferences for low or
high contrast colors? With the `contrast` setting, a theme can be marked as "low" or "high"
contrast, and will be utilized during the detection phase.

A contrast variant usually extends a base theme, as we want to use the same palette, but adjust the
colors. For example, say we have a "night" dark theme, and want to provide a vibrant high contrast
variant.

```yaml
themes:
  night:
    scheme: dark
    colors:
      blue:
        # ...
        40: '#0984e3'
        # ...
    palettes:
      # ...
  nightHighContrast:
    extends: night
    contrast: high
    colors:
      blue:
        # ...
        40: '#0652DD'
        # ...
```
