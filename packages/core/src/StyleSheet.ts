import { parse } from '@aesthetic/sss';
import {
  Condition,
  isFontFaceFule,
  isKeyframesRule,
  isMediaRule,
  isSupportsRule,
  Renderer,
  RenderOptions,
} from '@aesthetic/style';
import { ColorScheme, ContrastLevel, Theme } from '@aesthetic/system';
import { Property, Rule } from '@aesthetic/types';
import { arrayLoop, deepMerge, objectLoop } from '@aesthetic/utils';
import { options } from './options';
import {
  BaseSheetFactory,
  ClassNameSheet,
  SheetParams,
  SheetType,
  SheetElementMetadata,
} from './types';

function createCacheKey(params: Required<SheetParams>, type: string): string | null {
  // Unit factories cannot be cached as they're dynamic!
  if (typeof params.unit === 'function') {
    return null;
  }

  let key = type;

  // Since all other values are scalars, we can just join the values.
  // This is 3x faster than JSON.stringify(), and 1.5x faster than Object.values()!
  objectLoop(params, (value) => {
    key += value;
  });

  return key;
}

function groupSelectorsAndConditions(selectors: string[]) {
  const conditions: Condition[] = [];
  let selector = '';
  let valid = true;

  arrayLoop(selectors, (value) => {
    if (isKeyframesRule(value) || isFontFaceFule(value)) {
      valid = false;
    } else if (isMediaRule(value) || isSupportsRule(value)) {
      conditions.push(value);
    } else {
      selector += value;
    }
  });

  return {
    conditions,
    selector,
    valid,
  };
}

export default class StyleSheet<Factory extends BaseSheetFactory, Classes> {
  readonly metadata: Record<string, SheetElementMetadata> = {};

  readonly type: SheetType;

  protected contrastVariants: { [K in ContrastLevel]?: Factory } = {};

  protected factory: Factory;

  protected renderCache: Record<string, Classes> = {};

  protected schemeVariants: { [K in ColorScheme]?: Factory } = {};

  protected themeVariants: Record<string, Factory> = {};

  constructor(type: SheetType, factory: Factory) {
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

  render(renderer: Renderer, theme: Theme, baseParams: SheetParams): Classes {
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

    const classNames: ClassNameSheet<string> = {};
    const composer = this.compose(params);
    const styles = composer(theme);
    const rankings = {};
    const renderParams: RenderOptions = {
      direction: params.direction,
      rankings: this.type === 'global' ? undefined : rankings,
      unit: params.unit,
      vendor: params.vendor,
    };

    const addClassToMap = (selector: string, className: string) => {
      classNames[selector] = { class: className };

      this.metadata[selector] = {
        classNames: classNames[selector]!,
      };

      return this.metadata[selector];
    };

    parse<Rule>(this.type, styles, {
      customProperties: options.customProperties,
      onClass: addClassToMap,
      onFontFace(fontFace) {
        return renderer.renderFontFace(fontFace.toObject(), renderParams);
      },
      onImport(path) {
        renderer.renderImport(path);
      },
      onKeyframes(keyframes, animationName) {
        return renderer.renderKeyframes(keyframes.toObject(), animationName, renderParams);
      },
      onProperty(block, key, value) {
        const { conditions, selector, valid } = groupSelectorsAndConditions(block.getSelectors());

        if (!valid) {
          return;
        }

        block.addClassName(
          renderer.renderDeclaration(key as Property, value as string, {
            ...renderParams,
            conditions,
            selector,
          }),
        );
      },
      onRoot: (block) => {
        addClassToMap(
          '@root',
          renderer.renderRuleGrouped(block.toObject(), {
            ...renderParams,
            deterministic: true,
            type: 'global',
          }),
        );
      },
      onRootVariables(variables) {
        renderer.applyRootVariables(variables);
      },
      onRule: (selector, rule) => {
        const meta = addClassToMap(selector, rule.className.trim());

        objectLoop(rule.variants, (variant, type) => {
          if (!meta.classNames.variants) {
            meta.classNames.variants = {};
          }

          if (!meta.variantTypes) {
            meta.variantTypes = new Set();
          }

          meta.classNames.variants[type] = variant.className.trim();
          meta.variantTypes.add(type.split('_')[0]);
        });
      },
      onVariable(block, key, value) {
        block.addClassName(renderer.renderVariable(key, value));
      },
    });

    const result = (this.type === 'local' ? classNames : classNames['@root']?.class) as Classes;

    if (key) {
      this.renderCache[key] = result;
    }

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
