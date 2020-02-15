function createStyleSheet<T extends object>(
  sets: T | (() => T),
): (...names: (keyof T)[]) => string {
  return () => '';
}

const styles = createStyleSheet(() => ({
  blue: { color: 'blue' },
  red: { color: 'red' },
}));

// eslint-disable-next-line
const className = styles('blue', 'red');
