import { Utilities } from '@aesthetic/system';
import {
	ColorScheme,
	ContrastLevel,
	Direction,
	DirectionConverter,
	Engine,
	PropertyHandlerMap,
	RenderOptions,
	RenderResult,
	Rule,
	RuleMap,
	ThemeName,
	ThemeRule,
	Unit,
	UnitFactory,
	VendorPrefixer,
} from '@aesthetic/types';
import type { OverrideSheet } from './OverrideSheet';
import type { Sheet } from './Sheet';

// RENDER RESULT

export type SheetRenderResult<Result> = Record<
	string,
	Partial<RenderResult<Result>> & {
		variantTypes?: Set<string>;
	}
>;

export type WrapFalsy<T> = T | false | null | undefined;

export type WrapArray<T> = T extends (infer I)[] ? WrapFalsy<I>[] : WrapFalsy<T>[];

export type ResultComposerArgs<Keys, Result> = (WrapArray<Result> | WrapFalsy<Keys>)[];

export type ResultComposerVariants = Record<string, number | string | false | undefined>;

// API consumers interact with (cx, etc)
export interface ResultComposer<Keys, Result, GeneratedResult = Result> {
	(variants: ResultComposerVariants, ...args: ResultComposerArgs<Keys, Result>): GeneratedResult;
	(...args: ResultComposerArgs<Keys, Result>): GeneratedResult;
	result: SheetRenderResult<Result>;
}

// Called from the composer to generate a final result
export type ResultGenerator<Keys, Result, GeneratedResult = Result> = (
	args: ResultComposerArgs<Keys, Result>,
	variants: Set<string>,
	results: SheetRenderResult<Result>,
) => GeneratedResult;

// SHEETS

export interface SheetParams {
	contrast?: ContrastLevel;
	direction?: Direction;
	scheme?: ColorScheme;
	theme?: ThemeName;
	unit?: Unit;
	vendor?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SheetFactory<Return extends object> = (utils: Utilities<any>) => Return;

export type SheetRenderer<Result, Block extends object> = (
	engine: Engine<Result>,
	styles: Block,
	options: RenderOptions,
) => SheetRenderResult<Result>;

// THEME SHEETS

export type ThemeSheetFactory<Block extends object> = SheetFactory<ThemeRule<Block>>;

export type ThemeSheet<Result, Block extends object> = Sheet<Result, ThemeRule<Block>>;

// COMPONENT SHEETS

export type ElementRuleMap<Block extends object> = Record<string, Block>;

export type ElementRuleNeverize<T, B> = {
	[K in keyof T]: K extends keyof B ? T[K] : never;
};

export type ElementRuleMapNeverize<T, B> = {
	[K in keyof T]: ElementRuleNeverize<T[K], B>;
};

export type ComponentSheetFactory<Shape, Block extends object> = SheetFactory<
	Shape extends unknown
		? ElementRuleMap<Block>
		: ElementRuleMap<Block> & ElementRuleMapNeverize<Shape, Block>
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ComponentSheet<_Shape, Result, Block extends object> = OverrideSheet<Result, Block>;

// OTHER

export interface AestheticOptions {
	customProperties?: PropertyHandlerMap;
	defaultUnit?: Unit | UnitFactory;
	deterministicClasses?: boolean;
	directionConverter?: DirectionConverter | null;
	rootVariables?: boolean;
	vendorPrefixer?: VendorPrefixer | null;
}

export type EventType = 'change:direction' | 'change:theme';

export type EventListener = (...args: unknown[]) => void;

export type OnChangeDirection = (newDir: Direction) => void;

export type OnChangeTheme = (newTheme: ThemeName, results: unknown[]) => void;

// And add aliases too
export type ElementStyles = Rule;
export type ComponentStyles = RuleMap;
export type ThemeStyles = ThemeRule;
