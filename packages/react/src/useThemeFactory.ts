import Aesthetic from 'aesthetic';

/**
 * Hook within a component to provide the current theme object.
 */
export default function useThemeFactory<
  Theme extends object,
  NativeBlock extends object,
  ParsedBlock extends object | string = NativeBlock
>(aesthetic: Aesthetic<Theme, NativeBlock, ParsedBlock>) /* infer */ {
  return function useTheme(): Theme {
    return aesthetic.getTheme();
  };
}
