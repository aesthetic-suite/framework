import {
  parseGlobalStyleSheet,
  parseLocalStyleSheet,
  GlobalStyleSheet,
  LocalStyleSheet,
} from '@aesthetic/sss';
import { Renderer } from '@aesthetic/style';
import { ColorScheme, ContrastLevel, Theme } from '@aesthetic/system';
import { ClassName, Rule } from '@aesthetic/types';
import { deepMerge, objectLoop } from '@aesthetic/utils';
import { BaseSheetFactory, ClassNameSheet, SheetParams, SheetType } from './types';

export default class StyleSheet<Factory extends BaseSheetFactory, Classes> {
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

    const composer: BaseSheetFactory = (p, tokens) =>
      deepMerge(...factories.map((factory) => factory(p, tokens)));

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
    const key = JSON.stringify(params);
    const cache = this.renderCache[key];

    if (cache) {
      return cache;
    }

    const result = (this.type === 'local'
      ? this.renderLocal(renderer, theme, params)
      : this.renderGlobal(renderer, theme, params)) as Classes;

    this.renderCache[key] = result;

    return result;
  }

  protected renderGlobal(
    renderer: Renderer,
    theme: Theme,
    params: Required<SheetParams>,
  ): ClassName {
    let className = '';
    const composer = this.compose(params);
    const styles = composer(theme, theme.tokens) as GlobalStyleSheet;
    const renderParams = {
      rtl: params.direction === 'rtl',
      unit: params.unit,
      vendor: params.vendor,
    };

    parseGlobalStyleSheet<Rule>(styles, {
      onFontFace(fontFace) {
        return renderer.renderFontFace(fontFace.toObject());
      },
      onImport(path) {
        renderer.renderImport(path);
      },
      onKeyframes(keyframes, animationName) {
        return renderer.renderKeyframes(keyframes.toObject(), animationName, renderParams);
      },
      onRoot(block) {
        className = renderer.renderRuleGrouped(block.toObject(), {
          ...renderParams,
          deterministic: true,
          type: 'global',
        });
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
    const styles = composer(theme, theme.tokens) as LocalStyleSheet;
    const rankCache = {};
    const renderParams = {
      rankings: rankCache,
      rtl: params.direction === 'rtl',
      unit: params.unit,
      vendor: params.vendor,
    };

    parseLocalStyleSheet<Rule>(styles, {
      onClass(selector, className) {
        classNames[selector] = { class: className };
      },
      onFontFace(fontFace) {
        return renderer.renderFontFace(fontFace.toObject());
      },
      onKeyframes(keyframes, animationName) {
        return renderer.renderKeyframes(keyframes.toObject(), animationName, renderParams);
      },
      onRule(selector, rule) {
        const cache = classNames[selector] || {};

        cache.class = renderer.renderRule(rule.toObject(), renderParams);

        if (rule.variants) {
          if (!cache.variants) {
            cache.variants = {};
          }

          objectLoop(rule.variants.toObject(), (variant, type) => {
            cache.variants![type] = renderer.renderRule(variant as Rule, renderParams);
          });
        }

        classNames[selector] = cache;
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
