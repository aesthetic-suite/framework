import { AestheticOptions } from './types';

export const options: AestheticOptions = {};

export function configure(customOptions: AestheticOptions) {
  Object.assign(options, customOptions);
}
