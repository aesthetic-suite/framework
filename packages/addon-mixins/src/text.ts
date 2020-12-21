import { LocalBlock } from '@aesthetic/sss';
import { Utilities } from '@aesthetic/system';
import { checkList } from './checks';
import { TextOptions } from './types';

export function text(this: Utilities<LocalBlock>, { size = 'df' }: TextOptions = {}): LocalBlock {
  if (__DEV__) {
    checkList('size', size, Object.keys(this.tokens.text));
  }

  return this.mixin.resetTypography({
    color: this.var('palette-neutral-text'),
    fontFamily: this.var('typography-font-text'),
    fontSize: this.var(`text-${size}-size` as 'text-df-size'),
    lineHeight: this.var(`text-${size}-line-height` as 'text-df-line-height'),
  });
}

export function textBreak(): LocalBlock {
  return {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  };
}

export function textTruncate(): LocalBlock {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

export function textWrap(): LocalBlock {
  return {
    overflowWrap: 'normal',
    wordWrap: 'normal',
    wordBreak: 'normal',
  };
}
