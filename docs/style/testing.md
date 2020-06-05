# Test utilities

Aesthetic provides a few utilities for testing rendered styles in a streamlined way, all of which
can be imported from the `@aesthetic/style/lib/testing` module.

The most important utility is the `purgeStyles()` function, which should be called after each test
so that document CSS is reset. If not called, you may see unexpected results, where the CSS from
different tests will bleed into each other.

```ts
import { purgeStyles } from '@aesthetic/style/lib/testing';

afterEach(() => {
  purgeStyles();
});
```

The other useful utility is `getRenderedStyles()`, which returns the rendered CSS as a string.
Useful for snapshots and visual comparisons. This function requires a type (`global`, `conditions`,
or `standard`) to determine which `<style />` element to read CSS from.

```tsx
import { getRenderedStyles } from '@aesthetic/style/lib/testing';

it('renders a component', () => {
  render(<Example />);

  expect(getRenderedStyles('standard')).toMatchSnapshot();
});
```
