let cache: boolean | null = null;

export default function isSSR(): boolean {
  if (cache === null) {
    cache = typeof window === 'undefined' || typeof document === 'undefined';
  }

  return cache;
}
