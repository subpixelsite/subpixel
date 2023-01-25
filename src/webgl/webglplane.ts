/* eslint-disable lines-between-class-members */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Type } from 'class-transformer';
import { BufferInfo, primitives } from 'twgl.js';
import { WebGLObject } from './webglobject.js';

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

export class WebGLPlane extends WebGLObject
{
	public createBufferInfo( gl: WebGLRenderingContext ): BufferInfo | undefined
	{
		if ( this.data.plane === undefined )
			throw new Error( 'Undefined plane data in createBufferInfo' );

		return primitives.createPlaneBufferInfo(
			gl,
			this.data.plane.width,
			this.data.plane.height,
			this.data.plane.subDWidth ?? 1,
			this.data.plane.subDHeight ?? 1
		);
	}
}
