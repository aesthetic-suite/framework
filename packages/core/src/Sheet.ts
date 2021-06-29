import { Theme } from '@aesthetic/system';
import { Engine } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import { SheetFactory, SheetParams, SheetRenderer, SheetRenderResult } from './types';

function createCacheKey(name: string, params: Required<SheetParams>): string {
	let key = name;

	// Since all other values are scalars, we can just join the values.
	// This is 3x faster than JSON.stringify(), and 1.5x faster than Object.values()!
	objectLoop(params, (value) => {
		key += String(value);
	});

	return key;
}

export class Sheet<Input extends object, Output, Factory extends SheetFactory<Input>> {
	protected factory: Factory;

	protected cache: Record<string, SheetRenderResult<Output>> = {};

	protected renderer: SheetRenderer<Input, Output, ReturnType<Factory>>;

	constructor(factory: Factory, renderer: SheetRenderer<Input, Output, ReturnType<Factory>>) {
		this.factory = this.validateFactory(factory);
		this.renderer = renderer;
	}

	compose(params: SheetParams): Factory {
		return this.factory;
	}

	render(
		engine: Engine<Input, Output>,
		theme: Theme<Input>,
		baseParams: SheetParams,
	): SheetRenderResult<Output> {
		const params: Required<SheetParams> = {
			contrast: theme.contrast,
			deterministic: false,
			direction: 'ltr',
			scheme: theme.scheme,
			theme: theme.name,
			unit: 'px',
			vendor: false,
			...baseParams,
		};
		const key = createCacheKey(engine.name, params);
		const cache = this.cache[key];

		if (cache) {
			return cache;
		}

		const composer = this.compose(params);
		const result = this.renderer(engine, composer(theme) as ReturnType<Factory>, params);

		this.cache[key] = result;

		return result;
	}

	protected validateFactory(factory: Factory): Factory {
		if (__DEV__) {
			const typeOf = typeof factory;

			if (typeOf !== 'function') {
				throw new TypeError(`A style sheet factory function is required, found "${typeOf}".`);
			}
		}

		return factory;
	}
}
