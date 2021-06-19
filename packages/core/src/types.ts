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
	ThemeName,
	ThemeRule,
	Unit,
	UnitFactory,
	VendorPrefixer,
} from '@aesthetic/types';
import type { OverrideSheet } from './OverrideSheet';
import type { Sheet } from './Sheet';

// RENDER RESULT

export interface SheetRenderResultItem<Output> extends Partial<RenderResult<Output>> {
	variantTypes?: Set<string>;
}

export type SheetRenderResult<Output, Keys extends string = string> = Record<
	Keys,
	SheetRenderResultItem<Output>
>;

export type WrapFalsy<T> = T | false | null | undefined;

export type WrapArray<T> = T extends (infer I)[] ? WrapFalsy<I>[] : WrapFalsy<T>[];

export type ResultComposerArgs<Keys, Output> = (WrapArray<Output> | WrapFalsy<Keys>)[];

export type ResultComposerVariants = Record<string, number | string | false | undefined>;

// API consumers interact with (cx, etc)
export interface ResultComposer<Keys extends string, Output, GeneratedOutput = Output> {
	(variants: ResultComposerVariants, ...args: ResultComposerArgs<Keys, Output>): GeneratedOutput;
	(...args: ResultComposerArgs<Keys, Output>): GeneratedOutput;
	result: SheetRenderResult<Output, Keys>;
}

// Called from the composer to generate a final result
export type ResultGenerator<Keys extends string, Output> = (
	args: ResultComposerArgs<Keys, Output>,
	variants: Set<string>,
	renderResult: SheetRenderResult<Output>,
) => Output[];

// SHEETS

export interface SheetParams {
	contrast?: ContrastLevel;
	direction?: Direction;
	scheme?: ColorScheme;
	theme?: ThemeName;
	unit?: Unit;
	vendor?: boolean;
}

export type SheetFactory<Input extends object> = (utils: Utilities<Input>) => object;

export type SheetRenderer<Input extends object, Output, Block> = (
	engine: Engine<Input, Output>,
	styles: Block,
	options: RenderOptions,
) => SheetRenderResult<Output>;

// THEME SHEETS

export type ThemeRuleNeverize<T, B> = {
	[K in keyof T]: K extends keyof B ? T[K] : never;
};

export type ThemeSheetFactory<Shape, Input extends object> = (
	utils: Utilities<Input>,
) => Shape extends unknown ? ThemeRule<Input> : ThemeRule<Input> & ThemeRuleNeverize<Shape, Input>;

export type ThemeSheet<Shape, Input extends object, Output> = Sheet<
	Input,
	Output,
	ThemeSheetFactory<Shape, Input>
>;

// COMPONENT SHEETS

export type ElementRuleMap<Block extends object> = Record<string, Block>;

export type ElementRuleNeverize<T, B> = {
	[K in keyof T]: K extends keyof B ? T[K] : never;
};

export type ElementRuleMapNeverize<T, B> = {
	[K in keyof T]: ElementRuleNeverize<T[K], B>;
};

export type ElementSheetFactory<Input extends object> = (utils: Utilities<Input>) => Input;

export type ComponentSheetFactory<Shape, Input extends object> = (
	utils: Utilities<Input>,
) => Shape extends unknown
	? ElementRuleMap<Input>
	: ElementRuleMap<Input> & ElementRuleMapNeverize<Shape, Input>;

export type ComponentSheet<Shape, Input extends object, Output> = OverrideSheet<
	Input,
	Output,
	ComponentSheetFactory<Shape, Input>
>;

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
