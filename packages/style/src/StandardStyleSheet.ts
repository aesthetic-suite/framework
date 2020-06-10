import { CSS } from '@aesthetic/types';
import BaseStyleSheet from './BaseStyleSheet';

export default class StandardStyleSheet extends BaseStyleSheet {
  insertRule(rule: CSS): number {
    return this.enqueueRule(rule);
  }
}
