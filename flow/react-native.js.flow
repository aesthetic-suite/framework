import type { StyleDeclarationMap } from '../src/types';

declare module 'react-native' {
  declare export var StyleSheet: {
    // This may seem wrong, but RN StyleSheet
    // simply passes the object through as-is.
    create: (styles: StyleDeclarationMap) => StyleDeclarationMap,
  };
}
