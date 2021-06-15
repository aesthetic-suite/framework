const Benchmark = require('benchmark');
const { createServerEngine } = require('../lib/server');

const suite = new Benchmark.Suite();

// Test with the cache
const engine = createServerEngine();

function renderWithCache() {
	engine.renderDeclaration('display', 'block', { selector: ':hover' });
}

suite.add('renderWithCache()', () => {
	renderWithCache();
});

// Test with no cache
const engineNoCache = createServerEngine();
engineNoCache.cacheManager.read = () => null;

function renderNoCache() {
	engineNoCache.renderDeclaration('display', 'block', { selector: ':hover' });
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
