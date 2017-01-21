import UnifiedReactNativeAdapter from '../../../src/adapters/react-native/UnifiedAdapter';
import {
  SYNTAX_FONT_FACE,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
  SYNTAX_NATIVE_PARTIAL,
} from '../../mocks';

describe('adapters/react-native/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new UnifiedReactNativeAdapter();
  });

  it('returns the style declarations as-is', () => {
    // Use partial instead of full here
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).toEqual(SYNTAX_NATIVE_PARTIAL);
  });

  it('errors on font faces', () => {
    expect(() => instance.convert(SYNTAX_FONT_FACE))
      .toThrowError('React Native does not support font faces. Please use the IOS/Android built-in font manager.');
  });

  it('doesnt error on font faces if silence is enabled', () => {
    instance.options.silence = true;

    expect(() => instance.convert(SYNTAX_FONT_FACE)).not.toThrow();
  });

  it('errors on animations', () => {
    expect(() => instance.convert(SYNTAX_KEYFRAMES))
      .toThrowError('React Native does not support animation keyframes. Please use the provided `Animated` library.');
  });

  it('doesnt error on animations if silence is enabled', () => {
    instance.options.silence = true;

    expect(() => instance.convert(SYNTAX_KEYFRAMES)).not.toThrow();
  });

  it('errors on media queries', () => {
    expect(() => instance.convert(SYNTAX_MEDIA_QUERY))
      .toThrowError('React Native does not support media queries. Please use a third-party library for this functionality.');
  });

  it('doesnt error on media queries if silence is enabled', () => {
    instance.options.silence = true;

    expect(() => instance.convert(SYNTAX_MEDIA_QUERY)).not.toThrow();
  });
});
