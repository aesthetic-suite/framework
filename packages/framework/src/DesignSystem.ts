import { DesignTokens } from './types';

export default class DesignSystem {
  tokens: DesignTokens;

  constructor(tokens: DesignTokens) {
    this.tokens = tokens;
  }
}
