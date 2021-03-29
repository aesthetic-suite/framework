import type { Aesthetic } from '@aesthetic/core';
import { createServerEngine, extractStyles } from '@aesthetic/style/server';
import { PortablePath, requireModule } from '@boost/common';

const instances: Record<string, Aesthetic<unknown>> = {};

const serverEngine = createServerEngine();

export function loadAesthetic(
  setupFilePath: PortablePath,
  integrationModule: string,
): Aesthetic<unknown> {
  const instance = instances[integrationModule];

  if (instance) {
    return extractStyles(instance, serverEngine);
  }

  // Require the Aesthetic setup file within their application
  // to inherit their chosen configuration and themes.
  requireModule(setupFilePath);

  // Import the Aesthetic integration module directly, so that we have
  // direct access to the current Aesthetic instance.
  const { internalAestheticRuntime } = requireModule<{
    internalAestheticRuntime: Aesthetic<unknown>;
  }>(integrationModule);

  // Store the instance so we can avoid consecutive overhead
  instances[integrationModule] = internalAestheticRuntime;

  return extractStyles(internalAestheticRuntime, serverEngine);
}
