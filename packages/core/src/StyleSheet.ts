import {
  parseGlobalStyleSheet,
  parseLocalStyleSheet,
  GlobalStyleSheet,
  LocalStyleSheet,
} from '@aesthetic/sss';
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
import { ClassName, Property, Rule } from '@aesthetic/types';
import { arrayLoop, deepMerge, objectLoop } from '@aesthetic/utils';
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

    const result = (this.type === 'local'
      ? this.renderLocal(renderer, theme, params)
      : this.renderGlobal(renderer, theme, params)) as Classes;

    if (key) {
      this.renderCache[key] = result;
    }

    return result;
  }

  protected renderGlobal(
    renderer: Renderer,
    theme: Theme,
    params: Required<SheetParams>,
  ): ClassName {
    let className = '';
    const composer = this.compose(params);
    const styles = composer(theme) as GlobalStyleSheet;
    const renderParams: RenderOptions = {
      direction: params.direction,
      unit: params.unit,
      vendor: params.vendor,
    };

    parseGlobalStyleSheet<Rule>(styles, {
      onFontFace(fontFace) {
        return renderer.renderFontFace(fontFace.toObject(), renderParams);
      },
      onImport(path) {
        renderer.renderImport(path);
      },
      onKeyframes(keyframes, animationName) {
        return renderer.renderKeyframes(keyframes.toObject(), animationName, renderParams);
      },
      onRoot: (block) => {
        className = renderer.renderRuleGrouped(block.toObject(), {
          ...renderParams,
          deterministic: true,
          type: 'global',
        });

        this.metadata['@root'] = { classNames: { class: className } };
      },
      onRootVariables(variables) {
        renderer.applyRootVariables(variables);
      },
    });

    return className;
  }

  protected renderLocal(
    renderer: Renderer,
    theme: Theme,
    params: Required<SheetParams>,
  ): ClassNameSheet<string> {
    const classNames: ClassNameSheet<string> = {};
    const composer = this.compose(params);
    const styles = composer(theme) as LocalStyleSheet;
    const rankCache = {};
    const renderParams: RenderOptions = {
      direction: params.direction,
      rankings: rankCache,
      unit: params.unit,
      vendor: params.vendor,
    };

    parseLocalStyleSheet<Rule>(styles, {
      onClass(selector, className) {
        classNames[selector] = { class: className };
      },
      onFontFace(fontFace) {
        return renderer.renderFontFace(fontFace.toObject(), renderParams);
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
      onRule: (selector, rule) => {
        const metadata = this.metadata[selector] || { classNames: {} };
        const cache = classNames[selector] || {};

        if (!cache.class) {
          cache.class = rule.className.trim();
        }

        objectLoop(rule.variants, (variant, type) => {
          if (!cache.variants) {
            cache.variants = {};
          }

          if (!metadata.variantTypes) {
            metadata.variantTypes = new Set();
          }

          cache.variants[type] = variant.className.trim();
          metadata.variantTypes.add(type.split('_')[0]);
        });

        metadata.classNames = cache;
        classNames[selector] = cache;
        this.metadata[selector] = metadata;
      },
      onVariable(block, key, value) {
        block.addClassName(renderer.renderVariable(key, value));
      },
    });

    return classNames;
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
