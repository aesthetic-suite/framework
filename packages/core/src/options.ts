/* eslint-disable no-param-reassign */
import { ClassName, Engine } from '@aesthetic/types';
import { createState } from '@aesthetic/utils';
import { getActiveDirection } from './direction';
import { AestheticOptions } from './types';

export const options: AestheticOptions = {};

export const styleEngine = createState<Engine<ClassName>>();

export function configureEngine(engine: Engine<ClassName>) {
  engine.direction = getActiveDirection();

  if (!engine.directionConverter && options.directionConverter) {
    engine.directionConverter = options.directionConverter;
  }

  if (!engine.unitSuffixer && options.defaultUnit) {
    engine.unitSuffixer = options.defaultUnit;
  }

  if (!engine.vendorPrefixer && options.vendorPrefixer) {
    engine.vendorPrefixer = options.vendorPrefixer;
  }

  styleEngine.set(engine);
}

export function configure(customOptions: AestheticOptions) {
  Object.assign(options, customOptions);

  // Configure the engine with itself to reapply options
  const engine = styleEngine.get();

  if (engine) {
    configureEngine(engine);
  }
}
