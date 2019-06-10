# Right-to-Left

Aesthetic supports both LTR (default) and RTL modes for all adapters. RTL mode can be enabled
globally with the `rtl` option (below) or for specific regions of the page
([integration dependent](./integrations/README.md)).

```ts
const aesthetic = new Aesthetic({ rtl: true });
```

> Aesthetic will automatically set the `dir` attribute on the root `html` element.

## Supporting Style Sheets

While the above option enables RTL globally, style sheets can configure the mode on a per sheet
basis using the `rtl` option (which needs to be passed when being created and transformed).

```ts
const styles = aesthetic.createStyleSheet('button-component', { rtl: true });
const className = aesthetic.transformStyles(styles.button, { rtl: true });
```

> If using a framework like React, this functionality is abstracted away.
