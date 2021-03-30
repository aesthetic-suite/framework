import type { Aesthetic, Engine } from '@aesthetic/core';
import { createServerEngine, extractStyles } from '@aesthetic/style/server';
import { Path, requireModule } from '@boost/common';
import { debug } from './helpers';

const instances: Record<string, Aesthetic<unknown>> = {};
const serverEngine = createServerEngine();

extractStyles(null, serverEngine);

export function loadAesthetic(setupFilePath: Path, integrationModule: string): Aesthetic<unknown> {
  const instance = instances[integrationModule];

  debug.invariant(!instance, `Loading ${integrationModule} instance`, 'Not cached', 'Cached');

  if (instance) {
    return instance;
  }

  // Require the Aesthetic setup file within their application
  // to inherit their chosen configuration and themes
  if (setupFilePath.exists()) {
    debug('Setting up instance with %s', setupFilePath);

    requireModule(setupFilePath);
  }

  // Import the Aesthetic integration module directly, so that we have
  // direct access to the current Aesthetic instance
  debug('Importing %s into the plugin scope', integrationModule);

  const { internalAestheticRuntime } = requireModule<{
    internalAestheticRuntime: Aesthetic<unknown>;
  }>(integrationModule);

  // Store the instance so we can avoid consecutive overhead
  instances[integrationModule] = internalAestheticRuntime;

  internalAestheticRuntime.configureEngine(serverEngine as Engine<unknown>);

  debug('Configuring the instance for SSR and caching it');
  debug.verbose('Aesthetic: %O', internalAestheticRuntime);
  debug.verbose('Engine: %O', serverEngine);

  return internalAestheticRuntime;
}
