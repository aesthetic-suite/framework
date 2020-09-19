import { Rule } from '@aesthetic/types';
import { Utilities, TEXT_SIZES } from '@aesthetic/system';
import { checkList } from './checks';
import { TextOptions } from './types';

export function text(this: Utilities, { size = 'df' }: TextOptions = {}): Rule {
  if (__DEV__) {
    checkList('size', size, TEXT_SIZES);
  }

  return this.mixin.resetTypography({
    color: this.var('palette-neutral-fg-base'),
    fontFamily: this.var('typography-font-text'),
    fontSize: this.var(`text-${size}-size` as 'text-df-size'),
    lineHeight: this.var(`text-${size}-line-height` as 'text-df-line-height'),
  });
}

export function textBreak(): Rule {
  return {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  };
}

export function textTruncate(): Rule {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

export function textWrap(): Rule {
  return {
    overflowWrap: 'normal',
    wordWrap: 'normal',
    wordBreak: 'normal',
  };
}
