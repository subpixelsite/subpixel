/* eslint-disable lines-between-class-members */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Type } from 'class-transformer';
import { BufferInfo, primitives } from 'twgl.js';
import { WebGLObject } from './webglobject.js';

export class WebGLCubeData
{
	@Type( () => Number )
	size: number = 4;
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
