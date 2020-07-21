# Using themes

> Knowledge of [themes](../../development/themes.md) is required.

To provide the active theme to all React components, we'll need to render a `ThemeProvider` at the
root of your application. By default, the active theme will automatically be detected based on a
user's preference, like preferred color scheme, contrast levels, and more!

```tsx
// index.ts
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@aesthetic/react';
import './setup';
import App from './App';

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('app'),
);
```

> Only 1 `ThemeProvider` may be rendered in an application.

## Changing themes

As mentioned in the primary themes documentation, a theme can be changed with the `changeTheme()`
method. When called, this method will trigger a re-render on the root `ThemeProvider`.

However, there is a secondary approach for changing themes, and that is through the `name` prop.
This approach is a bit cumbersome, as it requires re-rendering the provider near the root of the
application, which requires some form of state at that layer.

```tsx
import { ThemeProvider } from '@aesthetic/react';

<ThemeProvider name="twilight">
  <App />
</ThemeProvider>;
```

## Contextual themeing

A root `ThemeProvider` provides design tokens to the entire application by declaring `:root` level
CSS variables and applying a `<body />` class name. Because of this architectural decision, themes
and styles can be dynamically changed with ease.

Because we utilize CSS variables, we implicitly support nested themes by taking advantage of
element-level CSS variable cascading. To integrate nested themes, use the `ContextualThemeProvider`
with an explicit theme name.

```tsx
import { ThemeProvider, ContextualThemeProvider } from '@aesthetic/react';

<ThemeProvider name="day">
  <div>Inherits styles from the day theme.</div>

  <ContextualThemeProvider name="night">
    <div>Inherits styles from the night theme.</div>
  </ContextualThemeProvider>
</ThemeProvider>;
```

> `ContextualThemeProvider`s can be infinitely nested, but not recommended.

## Accessing the theme

To manually access the provided `Theme` object, either from the root or contextually, use the
`useTheme()` hook.

```tsx
import { useTheme } from '@aesthetic/react';

export default function Component() {
  const theme = useTheme();

  if (theme.scheme === 'dark') {
    // Do something
  }

  return <div />;
}
```

Or use the `withTheme()` HOC, which passes the theme as a `theme` prop.

```tsx
import { withTheme, WithThemeWrappedProps } from '@aesthetic/react';

function Component({ theme }: WithThemeWrappedProps) {
  if (theme.contrast === 'high') {
    // Do something
  }

  return <div />;
}

export default withTheme()(Component);
```
