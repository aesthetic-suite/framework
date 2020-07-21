# Directionality

> Knowledge of [directionality](../../development/direction.md) is required.

A `DirectionProvider` is available for controlling the direction of a target React component tree.
While not necessary to render at the root, since the default direction is inferred from the
document's `dir` attribute, it can be used to explicitly enforce a direction, like so.

```tsx
import { DirectionProvider } from '@aesthetic/react';
import Component from './Component';

<DirectionProvider direction="rtl">
  <Component />
</DirectionProvider>;
```

## Contextual direction

The `value` prop can be used to dynamically change the direction of a provider based on a user
provided string. For example, say we have a message thread, and we want to swap between LTR and RTL
depending on what's being entered in an input field.

```tsx
import React, { useState } from 'react';
import { DirectionProvider } from '@aesthetic/react';
import MessageThread from './MessageThread';
import MessageInput from './MessageInput';

export default function MessageContainer() {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <DirectionProvider value={value}>
      <MessageThread />
      <MessageInput value={value} onChange={handleChange} />
    </DirectionProvider>
  );
}
```

As demonstrated above, if the user is typing in English, the direction would be `ltr`, otherwise, if
the user is typing in Arabic, the direction would be `rtl`, so on and so forth.

## Accessing the direction

To manually access the current direction, either from the document or a provider, use the
`useDirection()` hook.

```tsx
import { useDirection } from '@aesthetic/react';

export default function Component() {
  const direction = useDirection();

  if (direction === 'rtl') {
    // Do something
  }

  return <div />;
}
```

Or use the `withDirection()` HOC, which passes the direction as a `direction` prop.

```tsx
import { withDirection, WithDirectionWrappedProps } from '@aesthetic/react';

function Component({ direction }: WithDirectionWrappedProps) {
  if (direction === 'ltr') {
    // Do something
  }

  return <div />;
}

export default withDirection()(Component);
```
