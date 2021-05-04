import Platform from '../Platform';

// RN doesnt support units as everything is numbers
export default class NativePlatform extends Platform {
  unit(value: number): number | string {
    return this.number(value);
  }
}
