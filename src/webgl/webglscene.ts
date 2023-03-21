// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Type } from 'class-transformer';
import { WebGLObjectData } from './webgldata.js';

export class WebGLScene
{
	@Type( () => Number )
	clearColor?: number[];

	@Type( () => Number )
	clearDepth?: number;

	@Type( () => Number )
	clearStencil?: number;

	@Type( () => Number )
	fovYDeg?: number;

	@Type( () => Number )
	near?: number;

	@Type( () => Number )
	far?: number;

	@Type( () => Number )
	lookAt?: number[];

	@Type( () => Number )
	rotDeg?: number[];

	@Type( () => Number )
	camDist?: number;

	@Type( () => Number )
	orthoDiag?: number;

	@Type( () => Number )
	lightDeg?: number[];

	@Type( () => Number )
	lightColor?: number[];

	@Type( () => Number )
	ambientLight?: number[];

	@Type( () => Number )
	ambientStr?: number;

	@Type( () => WebGLObjectData )
	objects?: WebGLObjectData[];
}

export const webGLSceneDefault: WebGLScene = {
	clearColor: [0.35, 0.35, 0.35, 1.0],
	clearDepth: 1.0,
	clearStencil: 0,
	fovYDeg: 30,
	near: 0.1,
	far: 100,
	lookAt: [0, 0, 0],
	rotDeg: [300, 30],
	camDist: 9,
	// orthoDiag: 3,
	lightDeg: [210, 45],
	lightColor: [1.0, 1.0, 1.0],
	ambientLight: [1.0, 1.0, 1.0],
	ambientStr: 1.0,
	objects: []
};
