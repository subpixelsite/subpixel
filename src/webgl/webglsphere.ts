/* eslint-disable lines-between-class-members */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Type } from 'class-transformer';
import { BufferInfo, primitives } from 'twgl.js';
import { WebGLObject } from './webglobject.js';

export class WebGLSphereData
{
	@Type( () => Number )
	radius: number = 2;

	@Type( () => Number )
	subDAxis?: number;

	@Type( () => Number )
	subDHeight?: number;
}

export class WebGLSphere extends WebGLObject
{
	public createBufferInfo( gl: WebGLRenderingContext ): BufferInfo | undefined
	{
		if ( this.data.sphere === undefined )
			throw new Error( 'Undefined sphere data in createBufferInfo' );

		return primitives.createSphereBufferInfo(
			gl,
			this.data.sphere.radius,
			this.data.sphere.subDAxis ?? 24,
			this.data.sphere.subDHeight ?? 12
		);
	}
}
