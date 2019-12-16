# Right-to-Left

Aesthetic supports both LTR (default) and RTL modes for all adapters. RTL mode can be enabled
globally with the `rtl` option (below) or for specific regions of the page
([integration dependent](./integrations/README.md)).

```ts
import aesthetic from 'aesthetic';

aesthetic.configure({ rtl: true });
```

> Aesthetic will automatically set the `dir` attribute on the root `html` element.

## Supporting Style Sheets

While the above option enables RTL globally, style sheets can configure the mode on a per sheet
basis using the `dir` option (which needs to be passed when being created and transformed).

```ts
import aesthetic from 'aesthetic';

const adapter = aesthetic.getAdapter();
const styles = adapter.createStyleSheet('button-component', { dir: 'rtl' });
const className = adapter.transformStyles(styles.button, { dir: 'rtl' });
```

> If using a framework like React, this functionality is abstracted away.
