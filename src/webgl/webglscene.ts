/* eslint-disable no-shadow */
/* eslint-disable lines-between-class-members */
import { v3 } from 'twgl.js';
import { WebGLCubeData } from './webglcube.js';
import { WebGLPlaneData } from './webglplane.js';
import { WebGLSphereData } from './webglsphere.js';

export enum AnimBlendMode
{
	Discrete = 1,
	Linear,
	Sine
}

export enum AnimLoopMode
{
	Repeat = 1,
	PingPong
}

export interface AnimKey
{
	modeIn?: AnimBlendMode;
	time: number;
}

export interface WebGLAnim
{
	mode?: AnimBlendMode;
	loop?: AnimLoopMode;
}

export interface WebGLObjectTransform
{
	pos?: v3.Vec3;
	rotAxis?: v3.Vec3;
	rotRad?: number;
	scale?: v3.Vec3;

	key?: AnimKey;
}

export interface WebGLObjectColor
{
	color: v3.Vec3;
	alpha: number;

	key?: AnimKey;
}

export interface WebGLObjectData
	extends WebGLPlaneData,
	WebGLSphereData,
	WebGLCubeData
{
	vs: string;
	fs: string;

	anim?: WebGLAnim;

	xform: WebGLObjectTransform[];

	color?: WebGLObjectColor[];

	diffuse?: {
		url: string;
		min?: number,
		mag?: number
	}
}

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
