import { Theme } from '@aesthetic/system';
import { Engine } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import { SheetFactory, SheetParams, SheetRenderer, SheetRenderResult } from './types';

function createCacheKey(params: Required<SheetParams>): string {
	let key = '';

	// Since all other values are scalars, we can just join the values.
	// This is 3x faster than JSON.stringify(), and 1.5x faster than Object.values()!
	objectLoop(params, (value) => {
		key += String(value);
	});

	return key;
}

export class Sheet<Result, Block extends object> {
	protected factory: SheetFactory<Block>;

	protected cache: Record<string, SheetRenderResult<Result>> = {};

	protected renderer: SheetRenderer<Result, Block>;

	constructor(factory: SheetFactory<Block>, renderer: SheetRenderer<Result, Block>) {
		this.factory = this.validateFactory(factory);
		this.renderer = renderer;
	}

	compose(params: SheetParams): SheetFactory<Block> {
		return this.factory;
	}

	render(
		engine: Engine<Result>,
		// This is hidden behind abstractions, so is ok
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		theme: Theme<any>,
		baseParams: SheetParams,
	): SheetRenderResult<Result> {
		const params: Required<SheetParams> = {
			contrast: theme.contrast,
			direction: 'ltr',
			scheme: theme.scheme,
			theme: theme.name,
			unit: 'px',
			vendor: false,
			...baseParams,
		};
		const key = createCacheKey(params);
		const cache = this.cache[key];

		if (cache) {
			return cache;
		}

		const composer = this.compose(params);
		const result = this.renderer(engine, composer(theme), params);

		this.cache[key] = result;

		return result;
	}

	protected validateFactory(factory: SheetFactory<Block>): SheetFactory<Block> {
		if (__DEV__) {
			const typeOf = typeof factory;

			if (typeOf !== 'function') {
				throw new TypeError(`A style sheet factory function is required, found "${typeOf}".`);
			}
		}

		return factory;
	}
}
