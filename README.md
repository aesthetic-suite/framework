# Aesthetic
[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)

Aesthetic is a powerful React library for styling components, whether it be CSS-in-JS
using objects, importing stylesheets, or simply referencing external class names.
Simply put, Aesthetic is an abstraction layer that utilizes higher-order-components for
the compilation of styles via third-party libraries, all the while providing customizability,
theming, and a unified syntax.

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { classes, ClassNamesPropType } from 'aesthetic';
import style from '../path/to/styler';

class Carousel extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    classNames: ClassNamesPropType.isRequired,
  };

  // ...

  render() {
    const { children, classNames } = this.props;
    const { animating } = this.state;

    return (
      <div
        role="tablist"
        className={classes(
          classNames.carousel,
          animating && classNames.carousel__animating,
        )}
      >
        <ul className={classNames.list}>
          {children}
        </ul>

        <button
          type="button"
          onClick={this.handlePrev}
          className={classes(classNames.button, classNames.prev)}
        >
          ←
        </button>

        <button
          type="button"
          onClick={this.handleNext}
          className={classes(classNames.button, classNames.next)}
        >
          →
        </button>
      </div>
    );
  }
}

export default style({
  carousel: {
    position: 'relative',
    maxWidth: '100%',
    // ...
  },
  carousel__animating: { ... },
  list: { ... },
  button: { ... },
  prev: { ... },
  next: { ... },
})(Carousel);
```

Aesthetic was built for the sole purpose of solving the following scenarios, most of which
competing styling libraries fail to solve.

**Multiple styling patterns**

Want to use external CSS or Sass files? Or maybe CSS modules? Or perhaps CSS-in-JS?
What about JSS instead of Aphrodite? All of these patterns and choices are supported through
the use of [adapters](#style-adapters). However, inline styles *are not supported*
as we prefer the more performant option of compiling styles and attaching them to the DOM.

**Styling third-party libraries**

Using a third-party provided UI component library has the unintended side-effect
of hard-coded and non-customizable styles. Aesthetic solves this by allowing consumers
to [extend and inherit styles](#customizing-styles) from the provided base component.

## Requirements

* React 15/16+
* IE 10+

## Installation

Aesthetic requires React as a peer dependency.

```
npm install aesthetic react --save
// Or
yarn add aesthetic react
```

## Documentation

* [Initial Setup](#initial-setup)
  * [Webpack](#webpack)
  * [Browserify](#browserify)
* [Style Adapters](#style-adapters)
* [Creating A Styler](#creating-a-styler)
* [Defining Components](#defining-components)
  * [Customizing Styles](#customizing-styles)
  * [Combining Classes](#combining-classes)
* [Styling Components](#styling-components)
  * [External Classes](#external-classes)
  * [Style Objects](#style-objects)
  * [Style Functions](#style-functions)
* [Theming Components](#theming-components)
  * [Using Theme Styles](#using-theme-styles)
  * [Activating Themes](#activating-themes)
  * [Default Theme](#default-theme)
* [Unified Syntax](#unified-syntax)
  * [Properties](#properties)
  * [Pseudos](#pseudos)
  * [Fallbacks](#fallbacks)
  * [Media Queries](#media-queries)
  * [Supports](#supports)
  * [Font Faces](#font-faces)
  * [Animations](#animations)
  * [Selectors](#selectors)
* [Competitors Comparison](#competitors-comparison)
  * [Features](#features)
  * [Adapters](#adapters)
* [React Native Support](#react-native-support)

### Initial Setup

Aesthetic makes heavy use of `process.env.NODE_ENV` for logging errors in development.
These errors will be entirely removed in production if the following build steps are configured.

#### Webpack

[DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) plugin
is required when using Webpack.

```javascript
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
}),
```

#### Browserify

[Envify](https://github.com/hughsk/envify) transformer is required when using Browserify.

```javascript
envify({
  NODE_ENV: process.env.NODE_ENV || 'production',
});
```

### Style Adapters

An adapter in the context of Aesthetic is a third-party library that supports CSS in JavaScript,
whether it be injecting CSS styles based off JavaScript objects, importing CSS during a build
process, or simply referencing CSS class names.

The following libraries and their features are officially supported by Aesthetic.

| Adapter | Unified Syntax | Globals | Pseudos | Fallbacks | Fonts | Animations | Media Queries | Supports | React Native |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [CSS class names](#external-classes) | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| [CSS modules][css-modules] | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| [Aphrodite][aphrodite] | ✓ | ✓¹ | ✓ | | ✓ | ✓ | ✓ | | |
| [Fela][fela] | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| [Glamor][glamor] | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| [JSS][jss] | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| [TypeStyle][typestyle] | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| [React Native][react-native] | | | | | ✓ | ✓ | | ✓ | | |

> 1. Only supports `@font-face` and `@keyframes`.

The following libraries are currently not supported.

* [CSSX](https://github.com/krasimir/cssx) -
  Does not generate unique class names during compilation and instead
  uses the literal class names and or tag names defined in the style declaration.
  This allows for global style collisions, which we want to avoid.
* [Styletron](https://github.com/rtsao/styletron) -
  Currently does not support animations, font faces, or globals. Will revisit in the future.

### Creating A Styler

To start using Aesthetic, a styler function must be created. This styler function
acts as a factory for the creation of higher-order-components
([HOC](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)).
These HOC's are used in transforming styles via adapters and passing down CSS
class names to the original wrapped component.

To begin, we must create an instance of `Aesthetic` with an [adapter](#style-adapters),
pass it to `createStyler`, and export the new function. I suggest doing this an a file
that can be imported for reusability.

```javascript
import Aesthetic, { createStyler } from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss'; // Or your chosen adapter

export default createStyler(new Aesthetic(new JSSAdapter()));
```

Once we have a styler function, we can import it and wrap our React components.
The styler function accepts a [style declaration](#styling-components) as its first argument,
and an object of configurable options as the second. The following options are supported.

* `styleName` (string) - The unique style name of the component. This name is primarily
  used in logging and caching. Defaults to the component or function name.
* `extendable` (boolean) - Allows the component and its styles to be extended,
  creating a new component in the process. Defaults to `false`.
* `stylesPropName` (string) - Name of the prop in which the compiled class names or styles
  object is passed to. Defaults to `classNames`.
* `themePropName` (string) - Name of the prop in which the theme style declaration is passed to.
  Defaults to `theme`.
* `pure` (boolean) - When true, the higher-order-component will extend `React.PureComponent`
  instead of `React.Component`. Only use this for static/dumb components.

```javascript
export default style({
  button: { ... },
}, {
  styleName: 'CustomButton',
  extendable: true,
  pure: true,
  stylesPropName: 'classes',
  themePropName: 'appTheme',
})(Button);
```

If you get tired of passing `stylesPropName`, `themePropName`, `pure`, and `extendable`
to every component, you can pass these as default options to the `Aesthetic` instance.

```javascript
new Aesthetic(adapter, {
  extendable: true,
  pure: true,
  stylesPropName: 'classes',
  themePropName: 'appTheme',
})
```

### Defining Components

Now that we have a styler function, we can start styling our components by wrapping
the component declaration with the styler function and passing an object of styles.
When this component is rendered, the style object is transformed into an object of class names,
and passed to the `classNames` prop.

```javascript
import React, { PropTypes } from 'react';
import { ClassNamesPropType } from 'aesthetic';
import style from '../path/to/styler';

function Button({ children, classNames, icon }) {
  return (
    <button type="button" className={classNames.button}>
      {icon && (
        <span className={classNames.icon}>{icon}</span>
      )}

      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  classNames: ClassNamesPropType.isRequired,
  icon: PropTypes.node,
};

export default style({
  button: { ... },
  icon: { ... }
})(Button);
```

#### Customizing Styles

Since styles are isolated and colocated within a component, they can be impossible to
customize, especially if the component comes from a third-party library. If a component
styled by Aesthetic is marked as `extendable`, styles can be customized by calling
the static `extendStyles` method on the wrapped component instance.

> Extending styles will return the original component wrapped with new styles,
> instead of wrapping the styled component and stacking on an unnecessary layer.

```javascript
import BaseButton from '../path/to/styled/Button';

export const Button = BaseButton.extendStyles({
  button: {
    background: 'white',
    // ...
  },
});

export const PrimaryButton = BaseButton.extendStyles({
  button: {
    background: 'blue',
    // ...
  },
});
```

Parent styles (the component that was extended) are available when using a
[style function](#style-functions), allowing multiple layers of styles to be inherited.

#### Combining Classes

When multiple class names need to be applied to a single element, the `classes`
function provided by Aesthetic can be used. This function accepts an arbitrary
number of arguments, all of which can be strings, arrays, or objects that evaluate to true.

```javascript
import { classes } from 'aesthetic';

classes(
  'foo',
  expression && 'bar',
  {
    baz: false,
    qux: true,
  },
); // foo qux
```

Using our `Button` examples above, let's add an active state and combine classes
like so. Specificity is important, so define styles from top to bottom!

```javascript
function Button({ children, classNames, icon, active = false }) {
  return (
    <button
      type="button"
      className={classes(
        classNames.button,
        active && classNames.button__active,
      )}
    >
      {icon && (
        <span className={classNames.icon}>{icon}</span>
      )}

      {children}
    </button>
  );
}
```

### Styling Components

As mentioned previously, to style a component, an object or function must be passed
as the first argument to the [styler function](#creating-a-styler). This object
represents a mapping of selectors (and modifiers) to declarations. For example:

```javascript
style({
  button: { ... },
  button__active: { ... },
  icon: { ... },
})(Button)
```

The following types of declarations are permitted.

#### External Classes

External CSS class names can be referenced by passing a string of the class name.

```javascript
style({
  button: 'button',
  button__active: 'button--active',
  icon: 'button__icon',
})(Button)
```

To make use of class names, the provided `ClassNameAdapter` must be used.

```javascript
import Aesthetic, { createStyler, ClassNameAdapter } from 'aesthetic';

export default createStyler(new Aesthetic(new ClassNameAdapter()));
```

#### Style Objects

CSS styles can be defined using an object of properties to values. These objects are
transformed using [adapters](#style-adapters) and optionally support the
[unified syntax](#unified-syntax) defined by Aesthetic.

```javascript
style({
  button: {
    background: '#eee',
    // ...
  },
  button__active: {
    background: '#fff',
    // ...
  },
  icon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    // ...
  },
})(Button)
```

#### Style Functions

Style functions are simply functions that return a style object. The benefits of using a
function is that it provides the [current theme](#using-themes) as the first argument,
and the [previous styles](#customizing-styles) as the second argument.

```javascript
style((theme, prevStyles) => {
  // ...
})(Button)
```

### Theming Components

Themes are great in that they enable components to be styled in different ways based
on pre-defined style guide parameters, like font size, color hex codes, and more.

To make use of a theme, register it through the `Aesthetic` instance using `registerTheme`.
This method accepts a name, an object of parameters, and an optional
[style object](#style-objects) used for globals (like font faces and animation keyframes).

```javascript
aesthetic.registerTheme('dark', {
  unit: 'em',
  unitSize: 8,
  spacing: 5,
  font: 'Open Sans',
  bgColor: 'darkgray',
}, {
  '@font-face': {
    'Open Sans': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      src: ['fonts/OpenSans.woff'],
    },
  },
});
```

> Global styles are immediately compiled and attached the DOM. Be wary of conflicts.

If you'd like to extend a base theme to create a new theme, use `extendTheme`. This
method accepts the theme name to inherit from as the first argument, with the remaining
arguments matching `registerTheme`.

```javascript
aesthetic.extendTheme('dark', 'darker', {
  bgColor: 'black',
});
```

> Extending themes will deep merge the two parameter objects.

#### Using Theme Styles

Once a theme has been registered, we can access the style parameters by using a
[style function](#style-functions). The parameters object is passed as the first
argument to the function.

```javascript
style(theme => ({
  button: {
    fontSize: `${theme.unitSize}${theme.unit}`,
    fontFamily: theme.font,
    padding: theme.spacing,
  },
}))(Component);
```

> The theme style declaration can be accessed within a component via the `theme` prop.

#### Activating Themes

To activate and inform components to use a specific theme, we must use the `ThemeProvider`,
which accepts a `name` of the theme.

```javascript
import { ThemeProvider } from 'aesthetic';

<ThemeProvider name="default">
  // All components within here will use the "default" theme

  <ThemeProvider name="dark">
    // And all components here will use the "dark" theme
  </ThemeProvider>
</ThemeProvider>
```

Or by passing a `themeName` prop to an individual component.

```javascript
<Button themeName="dark">Save</Button>
```

Or by setting the default theme on the `Aesthetic` instance.

```javascript
new Aesthetic(adapter, { defaultTheme: 'default' });
```

### Unified Syntax

Aesthetic provides an optional unified CSS-in-JS syntax. This unified syntax permits
easy [drop-in replacements](https://en.wikipedia.org/wiki/Drop-in_replacement)
between adapters that utilize CSS-in-JS objects, as well as a standard across libraries.

**Pros**
* Easily swap between CSS-in-JS adapters (for either performance or extensibility reasons)
  without having to rewrite all CSS style object syntax.
* Third-party UI libraries can define their styles using the unified syntax,
  while consumers can choose their preferred adapter.
* Third-party UI libraries can standardize on a single syntax for interoperability.
* Only have to learn one form of syntax.

**Cons**
* Slight overhead (like milliseconds) converting the unified syntax to the adapters native
  syntax. However, Aesthetic caches heavily.
* Must learn a new form of syntax (hopefully the last one).

**Why a new syntax?**

While implementing adapters and writing tests for all their syntax and use cases, I noticed
that all adapters shared about 90-95% of the same syntax. That remaining percentage could
easily be abstracted away by a library, and hence, this unified syntax was created.

Furthermore, a unified syntax allows providers of third-party components to define their styles
in a standard way with consumers having the choice of their preferred adapter.

**Why a different at-rule structure?**

The major difference between the unified syntax and native adapters syntax, is that at-rules
in the unified syntax are now multi-dimensional objects indexed by the name of the at-rule
(`@media`), while at-rules in the native syntax are single objects indexed by the at-rule
declaration (`@media (min-width: 100px)`).

Supporting the native syntax incurred an linear (`O(n)`) lookup, as we would have to loop
through each object recursively to find all at-rules, while the unified syntax is a simple
constant (`O(1)`) lookup as we know the names ahead of time. This constant time lookup is
what enables a fast conversion process between the unified and native syntaxes.

**How do I enable the unified syntax?**

Please refer to the readme of your chosen adapter.

#### Properties

Standard structure for defining properties.

* Supports camel case property names.
* Units can be written as literal numbers.

```javascript
button: {
  margin: 0,
  padding: 5,
  display: 'inline-block',
  lineHeight: 'normal',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '#ccc',
  color: '#000',
},
buttonGroup: {
  // ...
},
```

> JSS requires the `jss-default-unit`, `jss-camel-case`, and `jss-global` plugins.

> Fela requires the `fela-plugin-unit` plugin.

#### Pseudos

Pseudo elements and classes are defined inside a selector as nested objects.

```javascript
button: {
  // ...
  ':hover': {
    backgroundColor: '#eee',
  },
  '::before': {
    content: '"★"',
    display: 'inline-block',
    marginRight: 5,
  },
},
```

> JSS requires the `jss-nested` plugin.

#### Fallbacks

Property fallbacks for old browsers are defined under the `@fallbacks` object.
Each property accepts a single value or an array of values.

```javascript
wrapper: {
  // ...
  background: 'linear-gradient(...)',
  display: 'flex',
  '@fallbacks': {
    background: 'red',
    display: ['box', 'flex-box'],
  },
},
```

> Aphrodite does not support fallback styles.

> Fela requires the `fela-plugin-fallback-value` plugin.

#### Media Queries

Media queries are defined inside a selector using a `@media` object,
with query conditional as the key, and style declarations as the value.

```javascript
tooltip: {
  // ...
  maxWidth: 300,
  '@media': {
    '(min-width: 400px)': {
      maxWidth: 'auto',
    },
  },
},
```

> JSS requires the `jss-nested` plugin.

#### Supports

Feature queries are defined inside a selector using a `@supports` object,
with the feature conditional as the key, and style declarations as the value.

```javascript
grid: {
  // ...
  float: 'left',
  '@supports': {
    '(display: flex)': {
      float: 'none',
      display: 'flex',
    },
  },
},
```

#### Font Faces

Font faces are defined outside the selector (in the root) using a `@font-face` object
and are referenced by the font family name (the object key).

```javascript
'@font-face': {
  'Open Sans': {
    fontStyle: 'normal',
    fontWeight: 'normal',
    src: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
  },
},
button: {
  // ...
  fontFamily: 'Open Sans',
},
tooltip: {
  // ...
  fontFamily: 'Open Sans, sans-serif',
},
```

> The `fontFamily` property can be omitted as it'll be inherited from the property name.

To support multiple font variations, like bold and italics, pass an array of properties.

```javascript
'@font-face': {
  'Open Sans': [
    {
      fontStyle: 'normal',
      fontWeight: 'normal',
      src: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
    {
      fontStyle: 'italic',
      fontWeight: 'normal',
      src: ['fonts/OpenSans-Italic.woff2', 'fonts/OpenSans-Italic.ttf'],
    },
    {
      fontStyle: 'normal',
      fontWeight: 'bold',
      src: ['fonts/OpenSans-Bold.woff2', 'fonts/OpenSans-Bold.ttf'],
    },
  ],
},
```

Lastly, to define `local()` source aliases, pass an array of strings to a `localAlias` property.

```javascript
'@font-face': {
  'Open Sans': {
    fontStyle: 'normal',
    fontWeight: 'normal',
    localAlias: ['OpenSans', 'Open-Sans'],
    src: ['fonts/OpenSans.ttf'],
  },
},
```

#### Animations

Animation keyframes are defined outside the selector (in the root) using a `@keyframes` object
and are referenced by animation name (the object key).

```javascript
'@keyframes': {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
},
button: {
  // ...
  animationName: 'fade',
  animationDuration: '3s',
},
```

#### Selectors

Parent, child, and sibling selectors are purposefully not supported. Use unique and
isolated element selectors and style declarations instead.

### Competitors Comparison

A brief comparison of Aesthetic to competing React style abstraction libraries.

#### Features

| | aesthetic | [react-with-styles][react-with-styles] | [styled-components][styled-components] | [radium][radium] |
| --- | :---: | :---: | :---: | :---: |
| Abstraction | HOC | HOC | Template Literals | HOC |
| Type | Classes | Classes, Inline styles | Classes | Inline styles |
| Unified Syntax | ✓ | | | |
| Caching | ✓ | | ✓ | N/A |
| Themes | ✓ | ✓ | ✓ | |
| Style Extending | ✓ | | ✓ | ||

#### Adapters

| | aesthetic | [react-with-styles][react-with-styles] | [styled-components][styled-components] | [radium][radium] |
| --- | :---: | :---: | :---: | :---: |
| [CSS class names](#external-classes) | ✓ | | | |
| [CSS Modules][css-modules] | ✓ | | | |
| [Aphrodite][aphrodite] | ✓ | ✓ | | |
| [Fela][fela] | ✓ | | | |
| [Glamor][glamor] | ✓ | | ✓ | |
| [JSS][jss] | ✓ | ✓ | | |
| [TypeStyle][typestyle] | ✓ | | | |
| [React Native][react-native] | ✓ | ✓ | | ||

### React Native Support

Please refer to the [aesthetic-native][react-native] package for more information on how
to integrate React Native with Aesthetic.

[css-modules]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-adapter-css-modules
[aphrodite]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-adapter-aphrodite
[fela]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-adapter-fela
[glamor]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-adapter-glamor
[jss]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-adapter-jss
[typestyle]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-adapter-typestyle
[radium]: https://github.com/FormidableLabs/radium
[react-native]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-native
[react-with-styles]: https://github.com/airbnb/react-with-styles
[styled-components]: https://github.com/styled-components/styled-components
