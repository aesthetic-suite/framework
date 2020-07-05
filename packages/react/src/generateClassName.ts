import { ClassNameSheet } from '@aesthetic/core';
import { ClassName } from '@aesthetic/types';
import { arrayLoop, isObject, objectLoop } from '@aesthetic/utils';

export default function generateClassName<T extends unknown[]>(
  keys: T,
  classNames: ClassNameSheet<string>,
): ClassName {
  const list: string[] = [];

  arrayLoop(keys, (key) => {
    // Variants
    if (isObject(key)) {
      objectLoop(key, (value, type) => {
        if (!value || !type) {
          return;
        }

        const variant = `${type}_${value}`;

        objectLoop(classNames, (clx) => {
          if (clx?.variants?.[variant]) {
            list.push(clx.variants[variant]);
          }
        });
      });

      // Rules/styles
    } else if (typeof key === 'string' && classNames[key]?.class) {
      list.push(classNames[key]!.class);
    }
  });

  return list.join(' ');
}
