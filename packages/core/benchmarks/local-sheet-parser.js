/* eslint-disable sort-keys */

const { parse } = require('@aesthetic/sss');
const { isMediaRule, isSupportsRule } = require('@aesthetic/style');
const { createServerEngine } = require('@aesthetic/style/server');
const { objectLoop, arrayLoop } = require('@aesthetic/utils');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();
const engine = createServerEngine();
const engine2 = createServerEngine();

let padding = 0;
let margin = 0;

function createStyles() {
  padding += 1;
  margin += 1;

  return {
    element1: {
      background: 'black',
      color: 'red',
      display: 'block',
      padding,
      '@media': {
        '(max-width: 100px)': {
          display: 'flex',
          margin,
          '@supports': {
            '(display: flex)': {
              display: 'flex',
              ':focus': {
                outline: 'none',
              },
            },
          },
        },
      },
      '@variants': {
        size: {
          sm: { fontSize: 14 },
          df: { fontSize: 16 },
          lg: { fontSize: 18 },
        },
      },
    },
    element2: {
      margin,
      ':hover': {
        color: 'white',
        '@selectors': {
          ':not(:disabled)': {
            color: 'gray',
          },
        },
      },
    },
    element3: {
      animationName: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      display: 'flex',
      '@fallbacks': {
        display: ['inline-block', 'block'],
      },
      '[hidden]': {
        display: 'none',
      },
    },
    element4: {
      fontFamily: [
        {
          fontFamily: 'Roboto',
          srcPaths: ['./Roboto.woff2'],
        },
        {
          fontFamily: 'Circular',
          srcPaths: ['./Circular.woff2'],
        },
      ],
    },
  };
}

function groupSelectorsAndConditions(selectors) {
  const conditions = [];
  let selector = '';
  let valid = true;

  arrayLoop(selectors, (value) => {
    const part = value.slice(0, 10);

    if (part === '@keyframes' || part === '@font-face') {
      valid = false;
    } else if (value.slice(0, 6) === '@media' || value.slice(0, 9) === '@supports') {
      conditions.push(value);
    } else {
      selector += value;
    }
  });

  return {
    conditions: conditions.length === 0 ? undefined : [],
    selector,
    valid,
  };
}

// Test parsing the entire block before injection
function parseAsBlock(styles) {
  const classNames = {};
  const rankings = {};

  parse('local', styles, {
    onClass(selector, className) {
      classNames[selector] = { class: className };
    },
    onFontFace(fontFace) {
      return engine.renderFontFace(fontFace.toObject());
    },
    onKeyframes(keyframes, animationName) {
      return engine.renderKeyframes(keyframes.toObject(), animationName);
    },
    onRule(selector, rule) {
      const cache = classNames[selector] || {};

      cache.class = engine.renderRule(rule.toObject(), { rankings });

      if (rule.variants) {
        if (!cache.variants) {
          cache.variants = {};
        }

        objectLoop(rule.variants, (variant, type) => {
          cache.variants[type] = engine.renderRule(variant.toObject(), { rankings });
        });
      }

      classNames[selector] = cache;
    },
  });

  return classNames;
}

suite.add('parseAsBlock()', () => {
  parseAsBlock(createStyles());
});

// Test parsing and injecting per declaration
function parseAsDeclaration(styles) {
  const classNames = {};
  const rankings = {};

  parse('local', styles, {
    onClass(selector, className) {
      classNames[selector] = { class: className };
    },
    onFontFace(fontFace) {
      return engine2.renderFontFace(fontFace.toObject());
    },
    onKeyframes(keyframes, animationName) {
      return engine2.renderKeyframes(keyframes.toObject(), animationName);
    },
    onProperty(block, key, value) {
      const { conditions, selector, valid } = groupSelectorsAndConditions(block.getSelectors());

      if (!valid) {
        return;
      }

      block.addClassName(
        engine2.renderDeclaration(key, value, {
          conditions,
          rankings,
          selector,
        }),
      );
    },
    onRule(selector, rule) {
      const cache = classNames[selector] || {};

      if (!cache.class) {
        cache.class = rule.className;
      }

      objectLoop(rule.variants, (variant, type) => {
        if (!cache.variants) {
          cache.variants = {};
        }

        cache.variants[type] = variant.className;
      });

      classNames[selector] = cache;
    },
  });

  return classNames;
}

suite.add('parseAsDeclaration()', () => {
  parseAsDeclaration(createStyles());
});

// Run all benchmarks
suite
  .on('cycle', function cycle(event) {
    console.log(String(event.target));
  })
  .on('complete', function complete() {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
  })
  .run();
