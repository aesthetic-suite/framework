# Themes

While the [language](./design-system.md#language) of a design systems defines aspects and
primitives, a theme defines colors, palettes, and states. With this approach, a design system may
have multiple variations through themes, while adhering to and inheriting the same primitives.

Themes can be represented using a tree structure, where the root of the hierarchy is the design
language/system, with each branch or leaf being a theme. Because this is a tree, themes may extend
from other themes, promoting color reuse.

```
                        +-----------+
                        |  Design   |
                        |  System   |
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

> Jump to the [configuring a design system](../config/README.md) chapter for more information on
> customizing themes.

## Constraints

Like the [design system](./design-system.md#constraints), themes also enforce the following
constraints as the system currently relies on fixed settings.

- 10 color shades (00, 10, 20, 30, 40 (default), 50, 60, 70, 80, 90)
- 10 palettes (brand, primary, secondary, tertiary, neutral/layout, muted, info, success, warning,
  danger)
- 5 palette states (base, hovered, selected, disabled, focused)
- Light scheme OR dark scheme
- High, low, OR normal contrast
