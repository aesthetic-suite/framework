# React Integration

We can style our components by wrapping the component declaration in a
[`withStyles` HOC](#withStyles) or utilizing the [`useStyles` hook](#useStyles). Both of these
approaches require a factory function that returns a CSS object, known as a style sheet, which is
then used to dynamically generate CSS class names at runtime.

### Types

If using TypeScript, it's encouraged to create your own types that wrap Aesthetic's types with a
custom [theme object](../theme.md), like so.

```ts
// types.ts
import { WithStylesWrappedProps, WithThemeWrappedProps } from 'aesthetic-react';

export interface Theme {
  // ...
}

export type WithStylesProps = WithStylesWrappedProps<Theme>;
export type WithThemeProps = WithThemeWrappedProps<Theme>;
```

### HOC

When the styled and wrapped component is rendered, the style sheet is parsed and passed to the
`styles` prop. These styles can then be transformed to class names using the provided
[`cx` prop](../style.md#generating-class-names).

```tsx
import React from 'react';
import { withStyles } from 'aesthetic-react';
import { Theme, WithStylesProps } from './types';

export type Props = {
  children: NonNullable<React.ReactNode>;
  icon?: React.ReactNode;
};

function Button({ children, cx, styles, icon }: Props & WithStylesProps) {
  return (
    <button type="button" className={cx(styles.button)}>
      {icon && <span className={cx(styles.icon)}>{icon}</span>}

      {children}
    </button>
  );
}

export default withStyles((theme: Theme) => ({
  button: {
    display: 'inline-block',
    padding: theme.unit,
    // ...
  },
  icon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: theme.unit,
  },
}))(Button);
```

### Hook

When the component is rendered, the style sheet is parsed and returned from the hook alongside the
[`cx` helper](../style.md#generating-class-names), which is used for transforming the styles to
class names.

```tsx
import React from 'react';
import { StyleSheetFactory } from 'aesthetic';
import { useStyles } from 'aesthetic-react';
import { Theme } from './types';

const styleSheet: StyleSheetFactory<Theme> = theme => ({
  button: {
    display: 'inline-block',
    padding: theme.unit,
    // ...
  },
  icon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: theme.unit,
  },
});

export type Props = {
  children: NonNullable<React.ReactNode>;
  icon?: React.ReactNode;
};

export default function Button({ children, icon }: Props) {
  const [styles, cx] = useStyles(styleSheet);

  return (
    <button type="button" className={cx(styles.button)}>
      {icon && <span className={cx(styles.icon)}>{icon}</span>}

      {children}
    </button>
  );
}
```

### DirectionProvider

React supports global [Right-to-Left](../rtl.md) out of the box, but also supports the ability to
provide a new direction for a target component tree using the `DirectionProvider`. The required
direction can be explicitly defined using the `dir` prop.

```tsx
import { DirectionProvider } from 'aesthetic-react';
import Component from './Component';

<DirectionProvider dir="rtl">
  <Component />
</DirectionProvider>;
```

Furthermore, the direction can be detected automatically based on a string of text. This is
extremely useful for inputs and textareas, where the content should flip based on what's passed to
the `value` prop (not `dir`).

```tsx
import { DirectionProvider } from 'aesthetic-react';
import Component from './Component';

class Search extends React.Component<{}, { input: string }> {
  state = {
    input: '',
  };

  handleChange = event => {
    this.setState({
      input: event.currentTarget.value,
    });
  };

  render() {
    const value = this.state.input;

    return (
      <DirectionProvider value={value}>
        <input type="search" value={value} onChange={this.handleChange} />
        <Component />
      </DirectionProvider>
    );
  }
}
```

### ThemeProvider

The `ThemeProvider` provides a layer to change the theme for a specific region of the page. The
provider _must_ contain all components that rely on Aesthetic styling.

```tsx
import { ThemeProvider } from 'aesthetic-react';
import App from './App';

<ThemeProvider>
  <App />
</ThemeProvider>;
```

By default the `theme` option on the Aesthetic instance will be used as the target theme, but the
`name` prop can be used to override this.

```tsx
<ThemeProvider name="dark">
  <App />
</ThemeProvider>
```

> Do note that global styles for all active themes in the current page may collide.

By default, multiple providers can be rendered at the same time, which results in global styles from
all themes also being rendered. If you'd prefer to purge the previous global styles when changing to
a new theme (preferrably at the root), set the `propagate` prop.

```tsx
<ThemeProvider name="dark" propagate>
  <App />
</ThemeProvider>
```

## Accessing The Theme

There are 3 ways to access the currently enabled theme in a component. The first is with the aptly
named `withTheme` HOC, which passes the theme object as a prop.

```tsx
import React from 'react';
import { withTheme } from 'aesthetic-react';
import { WithThemeProps } from './types';

export interface Props {
  children: NonNullable<React.ReactNode>;
}

function Component({ children, theme }: Props & WithThemeProps) {
  return <div style={{ padding: theme.unit }}>{children}</div>;
}

export default withTheme()(Component);
```

The second form of access is the `withStyles` HOC. When the `passThemeProp` option is enabled, the
current theme object is passed as a prop. The HOC supports the same options as `withTheme`.

```tsx
import React from 'react';
import { withStyles } from 'aesthetic-react';
import { WithStylesProps } from './types';

export interface Props {
  children: NonNullable<React.ReactNode>;
}

function Component({ children, cx, styles, theme }: Props & WithStylesProps) {
  return <div className={cx(styles.wrapper, { padding: theme!.unit })}>{children}</div>;
}

export default withStyles(
  () => ({
    wrapper: {
      display: 'block',
    },
  }),
  {
    passThemeProp: true,
  },
)(Component);
```

> When using TypeScript, the `theme` property for `WithStylesProps` is marked as optional, since the
> functionality is opt-in. Using `!` is required here.

And lastly, the easiest form for accessing the theme is with the `useTheme` hook. This simply
returns the theme object.

```tsx
import React from 'react';
import { useTheme } from 'aesthetic-react';
import { Theme } from './types';

export interface Props {
  children: NonNullable<React.ReactNode>;
}

export default function Component({ children }: Props) {
  const theme = useTheme<Theme>();

  return <div style={{ padding: theme.unit }}>{children}</div>;
}
```

## Using Refs

When using HOCs, the underlying wrapped component is abstracted away. Sometimes access to this
wrapped component is required, and as such, a specialized ref can be used. When using the
`wrappedRef` prop, the wrapped component instance is returned.

```tsx
let buttonInstance = null; // Button component

<StyledButton
  wrappedRef={ref => {
    buttonInstance = ref;
  }}
/>;
```
