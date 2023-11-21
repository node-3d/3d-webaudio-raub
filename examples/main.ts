'use strict';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as three from 'three';
import { init, addThreeHelpers } from '3d-core-raub';
import { init as initWebaudio } from '3d-webaudio-raub';


const __dirname = dirname(fileURLToPath(import.meta.url));

const {
	doc, Image: Img, gl, loop,
} = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
});

addThreeHelpers(three, gl);

initWebaudio({ window: doc });

const icon = new Img(__dirname + '/webaudio.png');
icon.on('load', () => { doc.icon = (icon as unknown as typeof doc.icon); });
doc.title = 'Web Audio';

const SPHERE_RADIUS = 0.3;
const count = 6;
const radius = 3;
const speed = 0.001;
const height = 3;
const offset = 0.5;


const sphereGeometry = new three.IcosahedronGeometry(SPHERE_RADIUS, 5);
sphereGeometry.translate(0, SPHERE_RADIUS, 0);
const sphereMaterial = new three.MeshStandardMaterial({ color: 0xdede8d });

const floorGeometry = new three.PlaneGeometry(10, 10);
const floorMaterial = new three.MeshStandardMaterial({ color: 0x4676b6 });

const camera = new three.PerspectiveCamera(75, doc.w / doc.h, 0.1, 100);
camera.position.set(0, 2, 4.5);

const scene = new three.Scene();

const ambientLight = new three.AmbientLight(0xcccccc, 0.4);
scene.add(ambientLight);

const directionalLight = new three.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);

const d = 5;
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.mapSize.x = 1024;
directionalLight.shadow.mapSize.y = 1024;

const audioLoader = new three.AudioLoader();
const listener = new three.AudioListener();
camera.add(listener);

const floor = new three.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI * -0.5;
floor.receiveShadow = true;
scene.add(floor);

const renderer = new three.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000 );
renderer.setPixelRatio( window.devicePixelRatio );

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
});

// const controls = new three.OrbitControls( camera, renderer.domElement );
// controls.minDistance = 1;
// controls.maxDistance = 25;

type TBall = {
	mesh: three.Mesh,
	audio: three.PositionalAudio | null,
	down: boolean,
};

const balls: TBall[] = [];

const time1 = Date.now();
const time0 = time1 - 16;

for (let i = 0; i < count; i++) {
	const mesh = new three.Mesh(sphereGeometry, sphereMaterial);
	mesh.castShadow = true;
	
	const spread = i / count * Math.PI * 2;
	mesh.position.x = radius * Math.cos(spread);
	mesh.position.z = radius * Math.sin(spread);
	
	let down = false;
	const angle0 = i * offset + (time0 * speed);
	const previousHeight = Math.abs(Math.sin(angle0) * height);
	const angle1 = i * offset + (time1 * speed);
	mesh.position.y = Math.abs(Math.sin(angle1) * height);
	if (mesh.position.y < previousHeight) {
		down = true;
	}
	
	scene.add(mesh);
	
	balls.push({ mesh, audio: null, down });
}

audioLoader.load(`${__dirname}/sounds/hit.wav`, (buffer: AudioBuffer) => {
	balls.forEach((ball: TBall) => {
		const audio = new three.PositionalAudio(listener);
		audio.setBuffer(buffer);
		ball.audio = audio;
		ball.mesh.add(audio);
	});
});

const animate = () => {
	const time = Date.now();
	
	balls.forEach((ball: TBall, i: number) => {
		const previousHeight = ball.mesh.position.y;
		
		const angle = i * offset + ( time * speed );
		ball.mesh.position.y = Math.abs(Math.sin(angle) * height);
		
		if (ball.mesh.position.y === previousHeight) {
			return;
		}
		
		if (ball.down && ball.mesh.position.y > previousHeight) {
			ball.audio?.play();
			ball.down = false;
			return;
		}
		
		if (!ball.down && ball.mesh.position.y < previousHeight) {
			ball.down = true;
		}
	});
	
	renderer.render(scene, camera);
};

loop(animate);