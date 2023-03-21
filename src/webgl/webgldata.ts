/* eslint-disable no-shadow */
import { v3 } from 'twgl.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Type } from 'class-transformer';
import 'reflect-metadata';

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
	blendIn?: AnimBlendMode;

	@Type( () => Number )
	time: number = 0;
}

export class WebGLAnim
{
	@Type( () => Number )
	blend?: AnimBlendMode;

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
	rotDeg?: number;

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

export class WebGLPlaneData
{
	@Type( () => Number )
	width: number = 10;

	@Type( () => Number )
	height: number = 10;

	@Type( () => Number )
	subDWidth?: number;

	@Type( () => Number )
	subDHeight?: number;
}

export class WebGLSphereData
{
	@Type( () => Number )
	radius: number = 2;

	@Type( () => Number )
	subDAxis?: number;

	@Type( () => Number )
	subDHeight?: number;
}

export class WebGLCubeData
{
	@Type( () => Number )
	size: number = 4;
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
