declare module "3d-webaudio-raub" {
	type TWebaudio = typeof import('webaudio-raub');
	type TAudioContext = typeof import('webaudio-raub').AudioContext;
	type Document = import('glfw-raub').Document;
	
	type TAudioContextInstance = InstanceType<TAudioContext>;
	
	type TInitOpts = Readonly<{
		window: Document,
	}>;
	
	type TWebaudio3D = {
		/**
		 * Re-export of `webaudio-raub`.
		 */
		webaudio: TWebaudio;
	};
	
	/**
	 * Initialize Webaudio3D.
	 * 
	 * This function can be called repeatedly, but will ignore further calls.
	 * The return value is cached and will be returned immediately for repeating calls.
	 */
	export const init: (opts: TInitOpts) => TWebaudio3D;
}
