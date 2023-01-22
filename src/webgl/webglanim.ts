/* eslint-disable no-shadow */

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

export class WebGLAnim
{
	mode: AnimBlendMode = AnimBlendMode.Linear;
	loop: AnimLoopMode = AnimLoopMode.Repeat;
}
