/* eslint-disable lines-between-class-members */
import { WebGLObjectData } from './webglobject.js';

export class WebGLScene
{
	clearColor?: number[];
	clearDepth?: number;
	clearStencil?: number;

	fovYDeg?: number;
	near?: number;
	far?: number;
	eye?: number[];
	lookAt?: number[];

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
