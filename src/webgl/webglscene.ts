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
	eye?: number[];

	@Type( () => Number )
	lookAt?: number[];

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
	eye: [3, 3, -6],
	lookAt: [0, 0, 0],
	objects: []
};
