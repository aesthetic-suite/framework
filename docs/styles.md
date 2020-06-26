# Style components

How you style components is entirely dependent on what [format](./formats/README.md) you compiled
your design tokens to, and what framework [integration](./integrations.md) you are using, if any.

With that being said, a large portion of Aesthetic will be used as a CSS-in-JS solution. To
seamlessly integrate with the design system and JavaScript (or TypeScript) based design tokens, we
offer a custom style sheet layer. This style sheet declares styles for all elements within a
component tree, by mapping selectors to style objects.

```ts
import { createComponentStyles } from '@aesthetic/core';

const styleSheet = createComponentStyles((css) => ({
  button: css.mixin(['pattern-reset-button', 'border-df'], {
    position: 'relative',
    display: 'inline-flex',
    textAlign: 'center',
    backgroundColor: css.var('palette-brand-color-40'),
    color: css.var('palette-neutral-color-00'),
    minWidth: css.unit(8),
    padding: {
      topBottom: css.var('spacing-df'),
      leftRight: css.var('spacing-md'),
    },
  }),

  button_block: css.mixin('pattern-text-wrap', {
    display: 'block',
    width: '100%',
    whiteSpace: 'normal',
    overflow: 'hidden',
  }),

  button_small: {
    minWidth: css.unit(6),
    padding: {
      topBottom: css.var('spacing-sm'),
      leftRight: css.var('spacing-df'),
    },
  },

  button_large: {
    minWidth: css.unit(10),
    padding: {
      topBottom: css.var('spacing-md'),
      leftRight: css.var('spacing-lg'),
    },
  },
}));
```

> In the example above, we import from `@aesthetic/core`. If using React or another integration,
> import from the integration package instead.

To augment the style sheet even further, we provide the active theme (and its tokens) as an argument
to the factory function, denoted by the `css` variable. This theme provides the following utility
methods.

- `mixin(patterns: string | string[], styles: object): object` - Merges and returns the provided
  style object with a pre-defined set of style objects that match the list of pattern names.
- `unit(...values: number[]): string` - Returns number(s) as a formatted `rem` unit, based on the
  design system's spacing and text sizes.
- `var(name: string): string` - Return the value of a design system's language or theme primitive,
  packaged as a CSS variable.

## References

Style objects are based on the structure provided by the `@aesthetic/style`
[package](./packages/style/README.md).

- [Styles](./packages/style/concepts.md#styles)
- [Selectors](./packages/style/concepts.md#rules)
- [Media queries](./packages/style/concepts.md#media-queries)
- [Feature queries](./packages/style/concepts.md#feature-queries)
- [Font faces](./packages/style/concepts.md#font-faces)
- [Keyframes](./packages/style/concepts.md#keyframes)
