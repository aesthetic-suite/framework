import { isObject, stripClassPrefix } from 'aesthetic-utils';
import aesthetic from './instance';
import CacheManager from './CacheManager';
import Sheet from './Sheet';
import UnifiedSyntax from './UnifiedSyntax';
import { ClassName, CompiledStyleSheet, StyleName, TransformOptions } from './types';

export default abstract class Adapter<NativeBlock extends object> {
  protected cacheManager = new CacheManager<CompiledStyleSheet>();

  protected syntax = new UnifiedSyntax<NativeBlock>();

  adaptStyleSheet(nativeSheet: Sheet<NativeBlock>, styleName: StyleName): CompiledStyleSheet {
    return nativeSheet.toObject();
  }

  compileStyleSheet(styleName: StyleName, baseOptions?: TransformOptions): CompiledStyleSheet {
    const options = this.prepareTransformOptions(baseOptions);
    const cache = this.cacheManager.get(styleName, options);

    if (cache) {
      return cache;
    }

    // Apply global styles on first render
    this.applyGlobalStyles(baseOptions);

    // Convert unified syntax to adapter native syntax
    const nativeSheet = this.syntax.convertStyleSheet(
      aesthetic.getStyleSheet(styleName, options.theme),
      {
        ...options,
        name: styleName,
      },
    );

    // Parse and adapt native syntax
    const adaptedSheet = this.adaptStyleSheet(nativeSheet, styleName);

    return this.cacheManager.set(
      styleName,
      {
        ...adaptedSheet,
        ...nativeSheet.classNames,
      },
      options,
    );
  }

  /**
   * Transform the list of class names or style objects to a single class name.
   */
  transformStyles(styles: (undefined | false | ClassName | object)[]): ClassName {
    const classNames: ClassName[] = [];
    const objects: object[] = [];

    styles.forEach(style => {
      if (!style) {
        return;
      }

      if (typeof style === 'string') {
        classNames.push(
          ...String(style)
            .split(' ')
            .map(s => stripClassPrefix(s).trim()),
        );
      } else if (isObject(style)) {
        objects.push(style);
      } else if (__DEV__) {
        throw new Error('Unsupported style type to transform.');
      }
    });

    // Transform parsed blocks to class names
    if (objects.length > 0) {
      classNames.push(this.transformToClassName(objects));
    }

    return classNames.join(' ');
  }

  /**
   * Transform the compiled style objects into a class name.
   */
  abstract transformToClassName(styles: object[]): ClassName;

  /**
   * Return transform options with defaults applied.
   */
  protected prepareTransformOptions(options: TransformOptions = {}): Required<TransformOptions> {
    const dir = aesthetic.options.rtl ? 'rtl' : 'ltr';

    return {
      dir: options.dir || dir,
      global: options.global || false,
      name: options.name || '',
      theme: options.theme || aesthetic.options.theme,
    };
  }
}
