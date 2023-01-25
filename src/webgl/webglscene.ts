/* eslint-disable no-shadow */
import { v3 } from 'twgl.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Type } from 'class-transformer';
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

export class AnimKey
{
	@Type( () => Number )
	modeIn?: AnimBlendMode;

	@Type( () => Number )
	time: number = 0;
}

export class WebGLAnim
{
	@Type( () => Number )
	mode?: AnimBlendMode;

	@Type( () => Number )
	loop?: AnimLoopMode;
}

export class WebGLObjectTransform
{
	@Type( () => Number )
	pos?: v3.Vec3;

	@Type( () => Number )
	rotAxis?: v3.Vec3;

	@Type( () => Number )
	rotRad?: number;

	@Type( () => Number )
	scale?: v3.Vec3;

	@Type( () => AnimKey )
	key?: AnimKey;
}

export class WebGLObjectColor
{
	@Type( () => Number )
	color: v3.Vec3 = [1, 1, 1];

	@Type( () => Number )
	alpha: number = 1;

	@Type( () => AnimKey )
	key?: AnimKey;
}

export class WebGLTextureData
{
	@Type( () => String )
	url: string = '';

	@Type( () => Number )
	min?: number;

	@Type( () => Number )
	mag?: number;
}

export class WebGLObjectData
{
	@Type( () => String )
	vs: string = 'pos.vs';

	@Type( () => String )
	fs: string = 'col.fs';

	@Type( () => WebGLPlaneData )
	plane?: WebGLPlaneData;

	@Type( () => WebGLSphereData )
	sphere?: WebGLSphereData;

	@Type( () => WebGLCubeData )
	cube?: WebGLCubeData;

	@Type( () => WebGLAnim )
	anim?: WebGLAnim;

	@Type( () => WebGLObjectTransform )
	xform: WebGLObjectTransform[] = [];

	@Type( () => WebGLObjectColor )
	color?: WebGLObjectColor[];

	@Type( () => WebGLTextureData )
	diffuse?: WebGLTextureData;
}

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
