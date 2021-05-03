import Platform from '../Platform';

export default class NativePlatform extends Platform {
  unit(value: number): number | string {
    return this.number(value);
  }
}
