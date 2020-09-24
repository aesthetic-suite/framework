let cache: boolean | null = null;

export default function isSSR(): boolean {
  if (process.env.AESTHETIC_SSR) {
    return true;
  }

  if (cache === null) {
    cache = typeof window === 'undefined' || typeof document === 'undefined';
  }

  return cache;
}
