import { useEffect, useLayoutEffect, EffectCallback, DependencyList } from 'react';

const cache: DependencyList[] = [];

export default function useSideEffect(cb: EffectCallback, deps: DependencyList) {
  let useInternalEffect: typeof useEffect;

  // We are server side rendering, so execute the callback immediately,
  // as hooks do not execute normally, and we need to generate styles somehow.
  if (global.AESTHETIC_SSR_CLIENT) {
    useInternalEffect = () => {
      const hasRan = cache.some(item => item.every((value, index) => value === deps[index]));

      if (!hasRan) {
        cb();
        cache.push(deps);
      }
    };

    // No window available, so execute as an async side-effect.
  } else if (typeof window === 'undefined') {
    useInternalEffect = useEffect;

    // Otherwise, we want to execute in sync with the render phase.
  } else {
    useInternalEffect = useLayoutEffect;
  }

  useInternalEffect(cb, deps);
}
