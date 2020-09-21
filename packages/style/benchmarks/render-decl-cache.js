const Benchmark = require('benchmark');
const { ServerRenderer } = require('../lib/server');

const suite = new Benchmark.Suite();
const renderer = new ServerRenderer();
const rendererNoCache = new ServerRenderer();

// Test with the cache
function renderWithCache() {
  renderer.renderDeclaration('display', 'block', { selector: ':hover' });
}

suite.add('renderWithCache()', () => {
  renderWithCache();
});

// Test with no cache
function renderNoCache() {
  rendererNoCache.cache.cache = {};
  rendererNoCache.renderDeclaration('display', 'block', { selector: ':hover' });
}

suite.add('renderNoCache()', () => {
  renderNoCache();
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
