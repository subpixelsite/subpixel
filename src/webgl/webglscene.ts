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

	@Type( () => WebGLObjectData )
	objects?: WebGLObjectData[];
}

export const webGLSceneDefault: WebGLScene = {
	clearColor: [0.75, 0.75, 0.75, 1.0],
	clearDepth: 1.0,
	clearStencil: 0,
	fovYDeg: 30,
	near: 0.5,
	far: 100,
	lookAt: [0, 0, 0],
	rotDeg: [300, 30],
	camDist: 9,
	objects: []
};
