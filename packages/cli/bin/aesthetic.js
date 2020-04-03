#!/usr/bin/env node

try {
  // Attempt to load it incase some dependencies require it
  // eslint-disable-next-line
  require('regenerator-runtime');
} catch {
  // Ignore if missing
}

require('../lib');
