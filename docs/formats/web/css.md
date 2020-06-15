# CSS format

The following format is provided when [compiling design tokens](../../compile-tokens.md) to CSS. It
utilizes
[CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for
reusability. If you need to support legacy browsers, we suggest the
[css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill) library.

## File structure

During compilation, an `index.css` file will be created based on the design system YAML
configuration file. An additional `themes/<name>.css` file will be created for each theme configured
in the YAML file. And lastly, a `mixins.css` file will also be created.

This would look something like the following:

```
<target>/
├── themes/
│   ├── day.css
│   └── night.css
├── index.css
└── mixins.css
```

## Integration

With this format, only one design system may be active at a time, as they all rely on `:root`. To
activate a design system and make the CSS variables available, link the CSS file within your
document.

```html
<link href="<target>/index.css" rel="stylesheet" />
```

If using a bundler like Webpack or Parcel, import the CSS file within the root entry point, or as
early as possible.

```js
import './css/<target>/index.css';
```

## Tokens

## Mixins
