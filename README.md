# Node.js 3D WebAudio

This is a part of [Node3D](https://github.com/node-3d) project.

[![NPM](https://badge.fury.io/js/3d-webaudio-raub.svg)](https://badge.fury.io/js/3d-webaudio-raub)
[![ESLint](https://github.com/node-3d/3d-webaudio-raub/actions/workflows/eslint.yml/badge.svg)](https://github.com/node-3d/3d-webaudio-raub/actions/workflows/eslint.yml)
[![Test](https://github.com/node-3d/3d-webaudio-raub/actions/workflows/test.yml/badge.svg)](https://github.com/node-3d/3d-webaudio-raub/actions/workflows/test.yml)

```console
npm i -s 3d-webaudio-raub
```

WebAudio plugin for Node.js 3D Core. It injects WebAudio API into Node3D's `window`.

```typescript
import { init } from '3d-core-raub';
import { init as initWebaudio } from '3d-webaudio-raub';

// Fetch `window` from standard Node3D init
const { window } = init();

// Initialize Webaudio
const { webaudio } = initWebaudio({ window });
// webaudio.AudioContext === window.AudioContext === global.AudioContext
```

**This module is WORK IN PROGRESS.** Some features are missing for good.

For the full contents of currently exported `webaudio` object, see the
docs of [webaudio-raub](https://github.com/node-3d/webaudio-raub). This plugin
reexports those as is.
