import { parse } from '@aesthetic/sss';
import { Theme } from '@aesthetic/system';
import { ColorScheme, ContrastLevel, Property, RenderOptions, Engine } from '@aesthetic/types';
import { deepMerge, objectLoop } from '@aesthetic/utils';
import {
  BaseSheetFactory,
  RenderResultSheet,
  SheetParams,
  SheetParamsExtended,
  SheetElementMetadata,
} from './types';

function createCacheKey(params: Required<SheetParams>, type: string): string | null {
  let key = type;

  // Since all other values are scalars, we can just join the values.
  // This is 3x faster than JSON.stringify(), and 1.5x faster than Object.values()!
  objectLoop(params, (value) => {
    key += value;
  });

  return key;
}

export default class StyleSheet<Result, Factory extends BaseSheetFactory> {
  readonly metadata: Record<string, SheetElementMetadata<Result>> = {};

  readonly type: 'local' | 'global';

  protected contrastVariants: { [K in ContrastLevel]?: Factory } = {};

  protected factory: Factory;

  protected renderCache: Record<string, RenderResultSheet<Result>> = {};

  protected schemeVariants: { [K in ColorScheme]?: Factory } = {};

  protected themeVariants: Record<string, Factory> = {};

  constructor(type: 'local' | 'global', factory: Factory) {
    this.type = type;
    this.factory = this.validateFactory(factory);
  }

  addColorSchemeVariant(scheme: ColorScheme, factory: Factory): this {
    if (__DEV__) {
      if (this.type !== 'local') {
        throw new Error('Color scheme variants are only supported by local style sheets.');
      }

      if (scheme !== 'light' && scheme !== 'dark') {
        throw new Error('Color scheme variant must be one of "light" or "dark".');
      }
    }

    this.schemeVariants[scheme] = this.validateFactory(factory);

    return this;
  }

  addContrastVariant(contrast: ContrastLevel, factory: Factory): this {
    if (__DEV__) {
      if (this.type !== 'local') {
        throw new Error('Contrast level variants are only supported by local style sheets.');
      }

      if (contrast !== 'normal' && contrast !== 'high' && contrast !== 'low') {
        throw new Error('Contrast level variant must be one of "high", "low", or "normal".');
      }
    }

    this.contrastVariants[contrast] = this.validateFactory(factory);

    return this;
  }

  addThemeVariant(theme: string, factory: Factory): this {
    if (__DEV__) {
      if (this.type !== 'local') {
        throw new Error('Theme variants are only supported by local style sheets.');
      }
    }

    this.themeVariants[theme] = this.validateFactory(factory);

    return this;
  }

  compose(params: SheetParams): Factory {
    if (this.type === 'global') {
      return this.factory;
    }

    const factories = [this.factory];

    if (params.scheme && this.schemeVariants[params.scheme]) {
      factories.push(this.schemeVariants[params.scheme]!);
    }

    if (params.contrast && this.contrastVariants[params.contrast]) {
      factories.push(this.contrastVariants[params.contrast]!);
    }

    if (params.theme && this.themeVariants[params.theme]) {
      factories.push(this.themeVariants[params.theme]!);
    }

    if (factories.length === 1) {
      return factories[0];
    }

    const composer: BaseSheetFactory = (p) => deepMerge(...factories.map((factory) => factory(p)));

    return composer as Factory;
  }

  render(
    engine: Engine<Result>,
    // This is hidden behind abstractions, so is ok
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: Theme<any>,
    { customProperties, ...baseParams }: SheetParamsExtended,
  ): RenderResultSheet<Result> {
    const params: Required<SheetParams> = {
      contrast: theme.contrast,
      direction: 'ltr',
      scheme: theme.scheme,
      theme: theme.name,
      unit: 'px',
      vendor: false,
      ...baseParams,
    };
    const key = createCacheKey(params, this.type);
    const cache = key && this.renderCache[key];

    if (cache) {
      return cache;
    }

    const resultSheet: RenderResultSheet<Result> = {};
    const composer = this.compose(params);
    const styles = composer(theme);
    const rankings = {};
    const renderOptions: RenderOptions = {
      direction: params.direction,
      unit: params.unit,
      vendor: params.vendor,
    };

    const createResultMetadata = (selector: string) => {
      if (!this.metadata[selector]) {
        resultSheet[selector] = {};

        this.metadata[selector] = {
          renderResult: resultSheet[selector]!,
        };
      }

      return this.metadata[selector];
    };

    parse(this.type, styles, {
      customProperties,
      onClass: (selector, className) => {
        createResultMetadata(selector).renderResult.result = (className as unknown) as Result;
      },
      onFontFace: (fontFace) => engine.renderFontFace(fontFace.toObject(), renderOptions),
      onImport: (path) => {
        engine.renderImport(path);
      },
      onKeyframes: (keyframes, animationName) =>
        engine.renderKeyframes(keyframes.toObject(), animationName, renderOptions),
      onProperty: (block, property, value) => {
        if (engine.atomic) {
          block.addResult(
            engine.renderDeclaration(property as Property, value as string, {
              ...renderOptions,
              media: block.media,
              rankings,
              selector: block.selector,
              supports: block.supports,
            }),
          );
        }
      },
      onRoot: (block) => {
        createResultMetadata('@root').renderResult.result = engine.renderRuleGrouped(
          block.toObject(),
          {
            ...renderOptions,
            type: 'global',
          },
        );
      },
      onRootVariables: (variables) => {
        engine.setRootVariables(variables);
      },
      onRule: (selector, block) => {
        if (!engine.atomic) {
          block.addResult(engine.renderRule(block.toObject(), renderOptions));
        }

        createResultMetadata(selector).renderResult.result = block.result as Result;
      },
      onVariable: (block, name, value) => {
        if (engine.atomic) {
          block.addResult(engine.renderVariable(name, value));
        }
      },
      onVariant: (parent, type, block) => {
        if (!engine.atomic) {
          block.addResult(engine.renderRule(block.toObject(), renderOptions));
        }

        const meta = createResultMetadata(parent.id);

        if (!meta.renderResult.variants) {
          meta.renderResult.variants = {};
        }

        if (!meta.variantTypes) {
          meta.variantTypes = new Set();
        }

        meta.renderResult.variants[type] = block.result as Result;
        meta.variantTypes.add(type.split('_')[0]);
      },
    });

    if (key) {
      this.renderCache[key] = resultSheet;
    }

    return resultSheet;
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
