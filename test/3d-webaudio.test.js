'use strict';

const assert = require('node:assert').strict;
const { describe, it } = require('node:test');
const { init } = require('3d-core-raub');
const { init: initWebaudio } = require('..');

const { window } = init();
const { webaudio } = initWebaudio({ window });
console.log('webaudio.AudioContext', webaudio.AudioContext);

const tested = describe('Webaudio 3D Inited', () => {
	it('returns `webaudio` from init', () => {
		assert.strictEqual(typeof webaudio, 'object');
	});
	
	it('has `AudioContext` in `webaudio`', () => {
		assert.strictEqual(typeof webaudio.AudioContext, 'function');
	});
	
	it('sets `AudioContext` on `window`', () => {
		assert.strictEqual(window.AudioContext, webaudio.AudioContext);
	});
	
	it('sets `AudioContext` on `global`', () => {
		assert.strictEqual(global.AudioContext, webaudio.AudioContext);
	});
});

(async () => {
	const interv = setInterval(() => undefined, 15);
	await tested;
	clearInterval(interv);
})();
