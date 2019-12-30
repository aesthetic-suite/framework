import CSS from 'csstype';

export type Direction = 'neutral' | 'ltr' | 'rtl';

export type RawCSS = string;

export type Theme = unknown; // TODO

// SYNTAX

export type AtRule =
  | '@charset'
  | '@font-face'
  | '@global'
  | '@import'
  | '@keyframes'
  | '@media'
  | '@page'
  | '@selectors'
  | '@supports'
  | '@viewport'
  | '@fallbacks';

export interface Rulesets<T> {
  [selector: string]: T;
}

export type Properties = CSS.Properties<string | number>;

export type FallbackProperties = CSS.PropertiesFallback<string | number>;

export type Pseudos = { [P in CSS.SimplePseudos]?: DeclarationBlock };

export type Attributes = { [A in CSS.HtmlAttributes]?: DeclarationBlock };

export type DeclarationBlock = Properties & Pseudos & Attributes;

export type FontFace = CSS.FontFace & {
  local?: string[];
  srcPaths: string[];
};

export interface Keyframes {
  [percent: string]: DeclarationBlock | string | undefined;
  from?: DeclarationBlock;
  to?: DeclarationBlock;
  name?: string;
}

// TODO add upstream to csstype
export type PageMargins =
  | '@top-left-corner'
  | '@top-left'
  | '@top-center'
  | '@top-right'
  | '@top-right-corner'
  | '@bottom-left-corner'
  | '@bottom-left'
  | '@bottom-center'
  | '@bottom-right'
  | '@bottom-right-corner'
  | '@left-top'
  | '@left-middle'
  | '@left-bottom'
  | '@right-top'
  | '@right-middle'
  | '@right-bottom';

export type PageBlock = Properties & {
  bleed?: string;
  marks?: string;
  size?: string;
} & {
    [K in PageMargins]?: PageBlock;
  };

export type Page = PageBlock & {
  ':blank'?: PageBlock;
  ':first'?: PageBlock;
  ':left'?: PageBlock;
  ':right'?: PageBlock;
};

// LOCAL STYLE SHEET

export type LocalBlock = DeclarationBlock & {
  '@fallbacks'?: FallbackProperties;
  '@media'?: { [mediaQuery: string]: LocalBlock };
  '@selectors'?: { [selector: string]: LocalBlock };
  '@supports'?: { [featureQuery: string]: LocalBlock };
};

export type LocalBlockNeverize<T> = {
  [K in keyof T]: K extends keyof LocalBlock ? T[K] : never;
};

export type LocalStyleSheet = Rulesets<string | LocalBlock>;

export type LocalStyleSheetNeverize<T> = {
  [K in keyof T]: T[K] extends string ? string : LocalBlockNeverize<T[K]>;
};

export type LocalStyleSheetFactory<T = unknown> = (
  theme: Theme,
) => T extends unknown ? LocalStyleSheet : LocalStyleSheet & LocalStyleSheetNeverize<T>;

// GLOBAL STYLE SHEET

export interface GlobalStyleSheet {
  '@charset'?: string;
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@global'?: LocalStyleSheet;
  '@import'?: string | string[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Page;
  '@viewport'?: CSS.Viewport;
}

export type GlobalStyleSheetNeverize<T> = {
  [K in keyof T]: K extends keyof GlobalStyleSheet ? GlobalStyleSheet[K] : never;
};

export type GlobalStyleSheetFactory<T = unknown> = (
  theme: Theme,
) => T extends unknown ? GlobalStyleSheet : GlobalStyleSheet & GlobalStyleSheetNeverize<T>;
