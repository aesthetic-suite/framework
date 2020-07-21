# Styling components

> Knowledge of [style sheets](../../development/style-sheets.md) is required.

Components are styled with the `useStyles()` hook (preferred) or the `withStyles()`
higher-order-component. Both APIs require a
[style sheet](../../development/style-sheets/components.md) that is conditionally rendered to CSS to
generate atomic class names.

To continue with the example found in the style sheet documentation, let's design and style a button
component. The button file would look something like the following.

```tsx
import React from 'react';
import { useStyles, createComponentStyles, CommonSize, PaletteType } from '@aesthetic/react';

export const styleSheet = createComponentStyles((css) => ({
  button: css.mixin('pattern-reset-button', {
    display: 'inline-flex',
    padding: css.var('spacing-df'),
    textAlign: 'center',

    '@variants': {
      size_sm: { fontSize: css.var('text-sm-size') },
      size_df: { fontSize: css.var('text-df-size') },
      size_lg: { fontSize: css.var('text-lg-size') },
      palette_brand: { backgroundColor: css.var('palette-brand-bg-base') },
      palette_success: { backgroundColor: css.var('palette-success-bg-base') },
      palette_warning: { backgroundColor: css.var('palette-warning-bg-base') },
    },
  }),
  button_selected: {},
  button_disabled: {},
  before: {},
  after: {},
  // ...
}));

export interface ButtonProps {
  afterIcon?: React.ReactNode;
  beforeIcon?: React.ReactNode;
  children: NonNullable<React.ReactNode>;
  disabled?: boolean;
  palette?: PaletteType;
  selected?: boolean;
  size?: CommonSize;
}

export default function Button({ children, beforeIcon, afterIcon }: ButtonProps) {
  const cx = useStyles(styleSheet);

  return (
    <button type="button">
      {beforeIcon && <span>{beforeIcon}</span>}
      {children}
      {afterIcon && <span>{afterIcon}</span>}
    </button>
  );
}
```

> If you're designing components for a library that'll be consumed externally, we suggest exporting
> the style sheet so that consumers may customize variants.

## Generating class names

Both the hook and HOC provide a class name generation function that we aptly name `cx`. This
function requires a list of selector names (keys from the style sheet object) in which to render CSS
and apply a class name with, for example.

```tsx
function Button({ selected, disabled }: ButtonProps) {
  const cx = useStyles(styleSheet);

  return (
    <button
      type="button"
      className={cx('button', selected && 'button_selected', disabled && 'button_disabled')}
      disabled={disabled}
    >
      {beforeIcon && <span className={cx('before')}>{beforeIcon}</span>}
      {children}
      {afterIcon && <span className={cx('after')}>{afterIcon}</span>}
    </button>
  );
}
```

As demonstrated above, the `button` selector will always be rendered. However, the `button_selected`
and `button_disabled` selectors will only be rendered when the button is conditionally updatd via
the `selected` and `disabled` props respectively.

We can take this a step further by supporting
[variants](../../development/style-sheets/components.md#variants). All that's required is to pass an
object to `cx()` with the name of every variant, and the variation to activate.

```tsx
function Button({ selected, disabled, size = 'df', palette = 'primary' }: ButtonProps) {
  const cx = useStyles(styleSheet);

  return (
    <button
      type="button"
      className={cx(
        'button',
        { size, palette },
        selected && 'button_selected',
        disabled && 'button_disabled',
      )}
      disabled={disabled}
    >
      {beforeIcon && <span className={cx('before')}>{beforeIcon}</span>}
      {children}
      {afterIcon && <span className={cx('after')}>{afterIcon}</span>}
    </button>
  );
}
```

> NOTE: The order of selectors passed to `cx()` does not determine the specificity. The order they
> are defined in the style sheet does! Be aware of this when developing.

## HOC example

We provide an HOC based API to support legacy and class components. This HOC uses hooks internally,
so you'll at least need the latest React version to function correctly. Below is what an HOC button
class component would look like, using the example from above.

```tsx
import React from 'react';
import { withStyles, WithStylesWrappedProps, createComponentStyles } from '@aesthetic/react';

export const styleSheet = createComponentStyles((css) => ({
  // ...
}));

export interface ButtonProps {
  // ...
}

class Button extends React.Component<ButtonProps & WithStylesWrappedProps> {
  render() {
    const { cx } = this.props;

    return (
      <button type="button">
        {beforeIcon && <span>{beforeIcon}</span>}
        {children}
        {afterIcon && <span>{afterIcon}</span>}
      </button>
    );
  }
}

export default withStyles(styleSheet)(Button);
```
