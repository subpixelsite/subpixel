/* eslint-disable lines-between-class-members */
import { BufferInfo, primitives } from 'twgl.js';
import { WebGLObject } from './webglobject.js';

export interface WebGLCubeData
{
	cube?: {
		size: number;
	};
}

export class WebGLCube extends WebGLObject
{
	public createBufferInfo( gl: WebGLRenderingContext ): BufferInfo | undefined
	{
		if ( this.data.cube === undefined )
			throw new Error( 'Undefined cube data in createBufferInfo' );

		return primitives.createCubeBufferInfo( gl, this.data.cube.size );
	}
}
