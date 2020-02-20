import { toArray } from '@aesthetic/utils';
import { Properties, FontFace } from '../types';

export default function fontFamily(
  property: Properties['fontFamily'],
  parse: (name: string, face: FontFace) => string,
): string {
  if (!property) {
    return '';
  }

  const output: Set<string> = new Set();
  const fontFaces: Map<string, FontFace[]> = new Map();

  toArray(property).forEach(prop => {
    if (typeof prop === 'string') {
      output.add(prop);

      return;
    }

    const name = prop.fontFamily!;

    if (__DEV__) {
      if (!name) {
        throw new Error(`Inline @font-face requires a font family name.`);
      }
    }

    output.add(name);

    if (fontFaces.has(name)) {
      fontFaces.get(name)!.push(prop);
    } else {
      fontFaces.set(name, [prop]);
    }
  });

  fontFaces.forEach((list, name) => {
    list.forEach(item => {
      parse(name, item);
    });
  });

  return Array.from(output).join(', ');
}
