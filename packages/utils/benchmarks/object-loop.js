/* eslint-disable unicorn/no-fn-reference-in-iterator */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */

const { objectLoop } = require('../lib');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();
const object = {};
const cb = () => {};

for (let i = 0; i < 1000; i += 1) {
  object[i] = i;
}

suite.add('forIn()', () => {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      cb(object[key], key);
    }
  }
});

suite.add('objectLoop()', () => {
  objectLoop(object, cb);
});

suite.add('objectKeysForEach()', () => {
  Object.keys(object).forEach((key) => {
    cb(object[key], key);
  });
});

suite.add('objectKeysForLoop()', () => {
  const keys = Object.keys(object);
  const l = keys.length;

  for (let i = 0; i < l; i += 1) {
    const key = keys[i];

    cb(object[key], key);
  }
});

suite.add('objectKeysForLoopReverse()', () => {
  const keys = Object.keys(object);
  const l = keys.length;

  for (let i = l - 1; i >= 0; i -= 1) {
    const key = keys[l - i];

    cb(object[key], key);
  }
});

suite.add('objectKeysWhileLoop()', () => {
  const keys = Object.keys(object);
  const l = keys.length;
  let i = 0;

  while (i < l) {
    const key = keys[i];

    cb(object[key], key);
    i += 1;
  }
});

suite.add('objectKeysWhileLoopReverse()', () => {
  const keys = Object.keys(object);
  const l = keys.length;
  let i = l - 1;

  while (i >= 0) {
    const key = keys[l - i];

    cb(object[key], key);
    i -= 1;
  }
});

suite.add('objectEntriesForEach()', () => {
  Object.entries(object).forEach((entry) => {
    cb(entry[1], entry[0]);
  });
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
