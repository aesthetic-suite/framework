# Configure the design system

The design system is configured in a human and machine readable format known as
[YAML](https://en.wikipedia.org/wiki/YAML). This format works across all operating systems,
platforms, programming languages, and is easily accessible for both designers and developers.

- [Brand](./config/brand.md)
- [Language](./config/language.md)
- [Themes](./config/themes.md)

Before we dive into all configurable settings, a few must know concepts are described below.

## Unitless values

All configuration settings that require a unit based value (`px`, `pt`, `sp`, etc) must be defined
using a unitless number. During the compilation phase, this unitless value will be calculated
according to the platform target, and output with the required unit suffix.

When configuring, assume a unit based on the following table.

| Platform | Spacing | Typography |
| -------- | ------- | ---------- |
| Android  | `dp`    | `sp`       |
| iOS      | `pt`    | `pt`       |
| Web      | `px`    | `px`       |

## Scaled patterns

A good portion of the configuration provides an automatic scaling alternative, based on
[modular scale](https://www.modularscale.com)
([more info](https://alistapart.com/article/more-meaningful-typography/)). This alternative
calculates, measures, and provides optimal proportions and density automatically, which alleviates
the burden from designers and developers.

Settings that support scaling will always have a sibling setting of the same name, suffixed with
`Scale`. Scale values are either a float that defines an explicit ratio, or a kebab-cased string
that maps to a common ratio name, like `golden-ratio`
([view all scale types](https://github.com/aesthetic-suite/framework/blob/master/packages/compiler/src/types.ts#L38)).

```yaml
# Floats
sizeScale: 1.25

# Strings
sizeScale: major-fourth
```

> If you want to use scaling for a specific group of settings, but not an individual setting, pass
> `0` as the scale ratio.

## Extending configs

Instead of duplicating entire configurations, you can extend an existing configuration (of the same
type) by providing a design system name, or a relative file path.

```yaml
# Design system name
extends: other-config

# Relative config file
extends: ../some/other/config/language.yaml
```

Works for all `brand.yaml`, `language.yaml`, and `themes.yaml` files.
