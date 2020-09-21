const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();
const importRegex = /^@import/u;

function isImportRegex(value) {
  return importRegex.test(value);
}

suite.add('isImportRegex()', () => {
  isImportRegex('@import ""');
  isImportRegex('unknown');
});

function isImportSlice(value) {
  return value.slice(0, 7) === '@import';
}

suite.add('isImportSlice()', () => {
  isImportSlice('@import ""');
  isImportSlice('unknown');
});

function isImportStartsWith(value) {
  return value.startsWith('@import');
}

suite.add('isImportStartsWith()', () => {
  isImportStartsWith('@import ""');
  isImportStartsWith('unknown');
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
