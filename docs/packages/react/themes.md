# Using themes

Themes are an encapsulation of reusable variables and mixins for consistent styling, represented as
a `Theme` class. Themes are automatically generated when compiling a
[design system](../../design/about.md) into [design tokens](../../tokens/web/css-in-js.md).

With that being said, to make the active theme available to all React components, we'll need to
render a `ThemeProvider` at the root of your application. By default, the active theme will
automatically be detected based on a user's preference, like preferred color scheme, contrast
levels, and more!

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

## Registering themes

Themes can only be accessed within a style sheet when registered into Aesthetic. We can achieve this
using the `registerTheme()` and `registerDefaultTheme()` methods, both of which require a unique
name. A default theme can only be defined twice, once for a light color scheme, the other for a dark
color scheme.

```ts
// setup.ts
import { registerTheme, registerDefaultTheme } from '@aesthetic/react';
import dayTheme from './system/dls/themes/day';
import nightTheme from './system/dls/themes/night';
import twilightTheme from './system/dls/themes/twilight';

registerDefaultTheme('day', dayTheme);
registerDefaultTheme('night', nightTheme);
registerTheme('twilight', twilightTheme);
```

Registration should happen near the root of the application, _before_ any Aesthetic styled React
component is imported or rendered.

## Changing themes

The currently active theme can be changed in one of two ways. The first is through the
`ThemeProvider`s `name` prop, which requires a name used during registration. This approach is a bit
cumbersome, as it requires re-rendering the provider near the root of the application.

```tsx
import { ThemeProvider } from '@aesthetic/react';

<ThemeProvider name="twilight">
  <App />
</ThemeProvider>;
```

The second and preferred approach is using the `changeTheme()` method. This method can be
programmatically called from anywhere in your application, and will trigger a re-render on a root
`ThemeProvider`.

```ts
import { changeTheme } from '@aesthetic/react';

changeTheme('twilight');
```

## Contextual and nested themes

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
