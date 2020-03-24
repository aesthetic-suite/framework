export default function getStyleElements(namespace?: string): HTMLStyleElement[] {
  if (typeof document === 'undefined') {
    return [];
  }

  return Array.from(
    document.querySelectorAll<HTMLStyleElement>(namespace ? `style[${namespace}]` : 'style'),
  );
}
