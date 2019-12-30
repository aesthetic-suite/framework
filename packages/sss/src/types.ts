import CSS from 'csstype';

type Length = string | number;

// SYNTAX

export interface Rulesets<T> {
  [selector: string]: T;
}

export type Properties = CSS.StandardProperties<Length>;

export type FallbackProperties = CSS.StandardPropertiesFallback<Length>;

export type Pseudos = { [P in CSS.SimplePseudos]?: DeclarationBlock };

export type Attributes = { [A in CSS.HtmlAttributes]?: DeclarationBlock };

export type DeclarationBlock = Properties & Pseudos & Attributes;

export type FontFace = CSS.FontFace & {
  local?: string[];
  srcPaths: string[];
};

export interface Import {
  path: string;
  query?: string;
  url?: boolean;
}

export interface Keyframes {
  [percent: string]: DeclarationBlock | string | undefined;
  from?: DeclarationBlock;
  to?: DeclarationBlock;
  name?: string;
}

export type Viewport = CSS.Viewport<Length>;

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

export type LocalAtRule = '@fallbacks' | '@media' | '@selectors' | '@supports';

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

// GLOBAL STYLE SHEET

export type GlobalAtRule =
  | '@charset'
  | '@font-face'
  | '@global'
  | '@import'
  | '@keyframes'
  | '@page'
  | '@viewport';

export interface GlobalStyleSheet {
  '@charset'?: string;
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@global'?: LocalStyleSheet;
  '@import'?: (string | Import)[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Page;
  '@viewport'?: Viewport;
}

export type GlobalStyleSheetNeverize<T> = {
  [K in keyof T]: K extends keyof GlobalStyleSheet ? GlobalStyleSheet[K] : never;
};

// MISC

export type AtRule = LocalAtRule | GlobalAtRule;
