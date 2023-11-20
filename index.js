'use strict';

const webaudio = require('webaudio-raub');


const _init = (opts) => {
	const { window } = opts;
	const { AudioContext } = webaudio;
	
	window.AudioContext = AudioContext;
	global.AudioContext = AudioContext;
	
	return {
		webaudio,
	};
};

let inited = null;
const init = (opts) => {
	if (inited) {
		return inited;
	}
	inited = _init(opts);
	return inited;
};

module.exports = { init };
