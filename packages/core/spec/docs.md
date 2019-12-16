Stylesheet factory that returns a unified syntax object.

```ts
const styleSheet = () => ({
  button: {
    display: 'block',
  },
  button__active: {},
});
```

Passed to `useStyles`.

```ts
const [styles, cx] = useStyles(styleSheet);
```

Which registers the stylesheet.

```ts
aesthetic.registerStyleSheet(name, styleSheet);
```

And compiles the stylesheet with the adapter.

```ts
aesthetic.adapter.compileStyleSheet();
```
