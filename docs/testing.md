# Testing

Testing Aesthetic styled components can be tricky, as adapter generated class names may change, or
be hashed, and basically be non-deterministic. To mitigate this issue, we provide a `TestAesthetic`
adapter, which uses the style sheet keys as the class names, which allows for deterministic
assertions.

```ts
import { TestAesthetic } from 'aesthetic/lib/testUtils';
import { Theme } from './types';

const aesthetic = new TestAesthetic<Theme>();
```

Besides `TestAesthetic`, there are a handful of constants and functions that can be found in the
[testing utilities](https://github.com/milesj/aesthetic/blob/master/packages/core/src/testUtils.ts).

## Enzyme

### `withStyles` Components

When shallow testing components wrapped with `withStyles`, you'll need to `dive()` after the
shallow. This will return the underlying component with the styles and props applied.

```ts
const wrapper = shallow(<StyledComponent />).dive();
```

### `className` Changes

To test class name changes, like an active state being applied, simply match against the `className`
prop. This requires the `TestAesthetic` adapter mentioned above.

```tsx
function Component({ active, children }: Props) {
  const [styles, cx] = useStyles(() => ({
    button: {},
    button__active: {},
  }));

  return (
    <button type="button" className={cx(styles.button, active && styles.button__active)}>
      {children}
    </button>
  );
}
```

```tsx
it('sets active class name', () => {
  const wrapper = shallow(<Component />);

  expect(wrapper.prop('className')).toBe('button');

  wrapper.setProps({ active: true });

  expect(wrapper.prop('className')).toBe('button button__active');
});
```
