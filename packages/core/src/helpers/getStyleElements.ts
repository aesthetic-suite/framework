export default function getStyleElements(namespace?: string): HTMLStyleElement[] {
  return Array.from(
    document.querySelectorAll<HTMLStyleElement>(namespace ? `style[${namespace}]` : 'style'),
  );
}
