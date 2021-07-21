import {
	CSS,
	FontFace,
	Import,
	Keyframes,
	NativeProperty,
	Properties,
	Property,
	Unit,
	UnitFactory,
	Value,
	VariablesMap,
} from './css';
import { ClassName, ColorScheme, ContrastLevel, Direction } from './ui';

// CACHE

export interface CacheItem<Output> {
	result: Output;
	rank?: number;
}

export type CacheState<Output> = Record<string, CacheItem<Output>[]>;

export interface CacheManager<Output> {
	read: (key: string, minimumRank?: number) => CacheItem<Output> | null;
	write: (key: string, item: CacheItem<Output>) => void;
}

// CUSTOM PROPERTIES

export type AddPropertyCallback = <K extends Property>(
	property: K,
	value: NonNullable<Properties[K]>,
) => void;

export type PropertyHandler<V> = (
	value: NonNullable<V>,
	add: AddPropertyCallback,
	engine: AnyEngine,
) => void;

export type PropertyHandlerMap = {
	[P in Property]?: PropertyHandler<NonNullable<Properties[P]>>;
};

// DIRECTION

export interface DirectionConverter {
	convert: <T extends Value>(
		from: Direction,
		to: Direction,
		property: NativeProperty,
		value: T,
	) => { property: NativeProperty; value: T };
}

// STYLE SHEETS

export interface Sheet {
	conditionText?: string;
	cssRules: Sheet[];
	cssText: CSS;
	cssVariables: VariablesMap;
	textContent: CSS;
	type: number;
	insertRule: (rule: CSS, index: number) => number;
}

export type SheetType = 'conditions' | 'global' | 'standard';

export type SheetMap = Record<SheetType, Sheet>;

export interface SheetManager {
	sheets: SheetMap;
	insertRule: (rule: CSS, options: RenderOptions, index?: number) => number;
}

// VENDOR PREFIXES

export type PropertyPrefixes = Record<string, string[] | string>;

export interface VendorPrefixer {
	prefix: (property: NativeProperty, value: string) => PropertyPrefixes;
	prefixSelector: (selector: string, rule: CSS) => CSS;
}

// STYLE ENGINE

export type RankCache = Record<string, number>;

export interface RenderOptions {
	className?: ClassName;
	debugName?: string;
	deterministic?: boolean;
	direction?: Direction;
	media?: string;
	rankings?: RankCache;
	selector?: string;
	supports?: string;
	type?: SheetType;
	unit?: Unit;
	vendor?: boolean;
}

export interface RenderResultVariant<Output> {
	types: string[];
	result: Output;
}

export interface RenderResult<Output> {
	result: Output;
	variants: RenderResultVariant<Output>[];
}

export interface EngineOptions<Output> {
	cacheManager?: CacheManager<Output>;
	customProperties?: PropertyHandlerMap;
	direction?: Direction;
	directionConverter?: DirectionConverter;
	sheetManager: SheetManager;
	unitSuffixer?: Unit | UnitFactory;
	vendorPrefixer?: VendorPrefixer;
}

export interface Engine<Input, Output> {
	cacheManager?: CacheManager<Output>;
	customProperties?: PropertyHandlerMap;
	direction: Direction;
	directionConverter?: DirectionConverter;
	name: string;
	ruleCount: number;
	sheetManager?: SheetManager;
	unitSuffixer?: Unit | UnitFactory;
	vendorPrefixer?: VendorPrefixer;

	prefersColorScheme: (scheme: ColorScheme) => boolean;
	prefersContrastLevel: (level: ContrastLevel) => boolean;

	renderDeclaration: <K extends Property>(
		property: K,
		value: NonNullable<Properties[K]>,
		options?: RenderOptions,
	) => Output;
	renderFontFace: (fontFace: FontFace, options?: RenderOptions) => string;
	renderImport: (path: Import | string, options?: RenderOptions) => string;
	renderKeyframes: (
		keyframes: Keyframes,
		animationName?: string,
		options?: RenderOptions,
	) => string;
	renderRule: (rule: Input, options?: RenderOptions) => RenderResult<Output>;
	renderRuleGrouped: (rule: Input, options?: RenderOptions) => RenderResult<Output>;
	renderVariable: (name: string, value: Value, options?: RenderOptions) => Output;

	setDirection: (direction: Direction) => void;
	setRootVariables: (variables: VariablesMap) => void;
	setTheme: (results: Output[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyEngine = Engine<any, any>;

declare global {
	// eslint-disable-next-line no-var, vars-on-top
	var AESTHETIC_CUSTOM_ENGINE: AnyEngine;
}
