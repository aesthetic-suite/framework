# Transformation Flow

This documents the stylesheet transformation flow for my sanity. This is internal only.

1.  Components defines a `StyleSheet` (adapter specific `NativeStyleSheet` or a `UnifiedStyleSheet`)
    using `withStyles` (the styler factory), which is passed the current `Theme` object and own
    props. (DONE)

```js
export default withStyles((theme, props) => ({
  button: {
    display: 'inline-block',
  },
}))(Button);
```

2.  The `StyleSheet` is registered with `Aesthetic#setStyles`. (DONE)

3.  When the component is rendered, the `StyleSheet` is parsed using `Aesthetic#createStyleSheet` ->
    `Adapter#create`, which returns a `ParsedStyleSheet`. (DONE)

4.  The `ParsedStyleSheet` is passed as the `styles` prop to the rendered component. (DONE)

5.  The selector declarations within a `ParsedStyleSheet` are transformed to class names using the
    `transform` function, which is piped to `Aeshetic#transformStyles` -> `Adapter#transform`.
    (DONE)
