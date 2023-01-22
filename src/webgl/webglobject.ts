/* eslint-disable indent */
import { BufferInfo, createProgramInfo, ProgramInfo, v3 } from 'twgl.js';
import { shaders } from './shaders.js';
import { WebGLAnim, AnimKey, AnimLoopMode, AnimBlendMode } from './webglanim.js';
import { WebGLCubeData } from './webglcube.js';
import { WebGLPlaneData } from './webglplane.js';
import { WebGLSphereData } from './webglsphere.js';

export interface WebGLObjectTransform
{
	pos?: v3.Vec3;
	rotAxis?: v3.Vec3;
	rotRad?: number;
	scale?: v3.Vec3;

	// animation
	key?: AnimKey;
}

export interface WebGLObjectColor
{
	color: v3.Vec3;
	alpha: number;

	// animation
	key?: AnimKey;
}

export interface WebGLObjectData
	extends WebGLPlaneData,
	WebGLSphereData,
	WebGLCubeData
{
	// shaders
	vs: string;
	fs: string;

	// animation
	anim?: WebGLAnim;

	// transform
	xform: WebGLObjectTransform[];

	// colors
	color?: WebGLObjectColor[];

	// textures
	diffuse?: {
		url: string;
		min?: number,
		mag?: number
	}
}

export class WebGLObject
{
	data: WebGLObjectData;

	uniforms?: any; // Map:  [string]: any
	element?: string;

	time: number;
	maxTime: number;
	playCount: number;

	constructor( data?: WebGLObjectData )
	{
		this.time = 0.0;
		this.maxTime = 0.0;
		this.playCount = 0;

		if ( data !== undefined )
		{
			this.data = data;
			this.updateMaxAnimTime();
		} else
		{
			this.data = {
				vs: 'pos.vs',
				fs: 'col.fs',
				xform: [{
					pos: [0, 0, 0],
					rotAxis: [0, 1, 0],
					rotRad: 0,
					scale: [1, 1, 1]
				}]
			};
		}
	}

	private updateMaxAnimTime()
	{
		if ( this.data === undefined )
			throw new Error( 'Unexpected undefined data in updateMaxAnimTime' );

		this.maxTime = 0.0;

		this.data.xform?.forEach( xform =>
		{
			this.maxTime = Math.max( this.maxTime, xform.key?.time || 0.0 );
		} );
	}

	public createProgramInfo( gl: WebGLRenderingContext ): ProgramInfo
	{
		if ( !shaders.has( this.data.vs ) )
			throw new Error( `Invalid vertex shader in scene object: ${this.data.vs}` );
		if ( !shaders.has( this.data.fs ) )
			throw new Error( `Invalid fragment shader in scene object: ${this.data.fs}` );

		return createProgramInfo( gl, [
			shaders.get( this.data.vs ),
			shaders.get( this.data.fs )
		] );
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	public createBufferInfo( gl: WebGLRenderingContext ): BufferInfo | undefined
	{
		return undefined;
	}

	public animate( time: number )
	{
		if ( this.maxTime <= 0.0 )
		{
			this.time = 0.0;
			return;
		}

		if ( this.time + time > this.maxTime )
			this.playCount += 1;

		const DECIMAL_PRECISION = 6;

		// const startTime = this.time;

		const scale = 10 ** DECIMAL_PRECISION;

		const bigTime = ( this.time + time ) * scale;
		this.time = ( bigTime % ( this.maxTime * scale ) ) / scale;

		// console.log( `${startTime} + ${time} -> ${this.time}` );
	}

	private lerp = ( x: number, y: number, a: number ) => x * ( 1 - a ) + y * a;
	private cos = ( x: number, y: number, a: number ) => this.lerp( x, y, ( Math.cos( ( 1 - a ) * Math.PI ) + 1 ) * 0.5 );

	// eslint-disable-next-line max-len
	private pingpongLerp = ( x: number, y: number, a: number ) => ( ( this.playCount % 2 ) ? this.lerp( x, y, 1 - a ) : this.lerp( x, y, a ) );
	private pingpongCos = ( x: number, y: number, a: number ) => ( ( this.playCount % 2 ) ? this.cos( x, y, 1 - a ) : this.cos( x, y, a ) );

	public getTransform(): WebGLObjectTransform
	{
		if ( this.data.xform.length === 1 )
			return this.data.xform[0];

		const xformRet: WebGLObjectTransform = {
			pos: [0, 0, 0],
			rotAxis: [0, 1, 0],
			rotRad: 0,
			scale: [1, 1, 1]
		};

		if ( this.data.xform.length > 0 )
		{
			xformRet.pos = this.data.xform[0].pos ?? xformRet.pos;
			xformRet.rotAxis = this.data.xform[0].rotAxis ?? xformRet.rotAxis;
			xformRet.rotRad = this.data.xform[0].rotRad ?? xformRet.rotRad;
			xformRet.scale = this.data.xform[0].scale ?? xformRet.scale;
		}

		// const lerp = ( x: number, y: number, a: number ) => x * ( 1 - a ) + y * a;
		// const cos = ( x: number, y: number, a: number ) => lerp( x, y, ( Math.cos( ( 1 - a ) * Math.PI ) + 1 ) * 0.5 );

		// const pingpongLerp = ( x: number, y: number, a: number ) => ( ( this.playCount % 2 ) ? lerp( x, y, 1 - a ) : lerp( x, y, a ) );
		// const pingpongCos = ( x: number, y: number, a: number ) => ( ( this.playCount % 2 ) ? cos( x, y, 1 - a ) : cos( x, y, a ) );

		const { xform } = this.data;
		const animMode = this.data.anim?.mode || AnimBlendMode.Linear;
		let animTime = this.time;
		let backwards = false;
		let pingpong = false;

		if ( this.data.anim !== undefined && this.data.anim.loop === AnimLoopMode.PingPong )
		{
			pingpong = true;
			if ( ( this.playCount % 2 ) !== 0 )
			{
				animTime = this.maxTime - this.time;
				backwards = true;
			}
		}

		let xformA = xform[0];
		for ( let i = 1; i < xform.length; i += 1 )
		{
			const xformB = xform[i];
			if ( xformB.key !== undefined )
			{
				if ( xformB.key.time > animTime )
				{
					// We found the second endpoint -- interpolate between A and B

					let mode = animMode;
					if ( xformB.key.modeIn !== undefined )
						mode = xformB.key.modeIn;

					const ts = xformA.key?.time || 0.0;
					const te = xformB.key.time;
					let t = ( animTime - ts ) / ( te - ts );
					if ( mode === AnimBlendMode.Discrete )
						t = Math.round( t );

					let interpolate;
					switch ( mode )
					{
						case AnimBlendMode.Sine:
							interpolate = pingpong ? this.pingpongCos : this.cos;
							break;
						case AnimBlendMode.Linear:
						case AnimBlendMode.Discrete:
						default:
							interpolate = pingpong ? this.pingpongLerp : this.lerp;
					}

					if ( backwards )
						t = 1.0 - t;

					if ( xformA.pos !== undefined && xformB.pos !== undefined )
					{
						xformRet.pos = [
							interpolate( xformA.pos[0], xformB.pos[0], t ),
							interpolate( xformA.pos[1], xformB.pos[1], t ),
							interpolate( xformA.pos[2], xformB.pos[2], t )];
					}

					if ( xformA.rotAxis !== undefined && xformB.rotAxis !== undefined )
					{
						xformRet.rotAxis = [
							interpolate( xformA.rotAxis[0], xformB.rotAxis[0], t ),
							interpolate( xformA.rotAxis[1], xformB.rotAxis[1], t ),
							interpolate( xformA.rotAxis[2], xformB.rotAxis[2], t )];
					}

					if ( xformA.rotRad !== undefined && xformB.rotRad !== undefined )
						xformRet.rotRad = interpolate( xformA.rotRad, xformB.rotRad, t );

					if ( xformA.scale !== undefined && xformB.scale !== undefined )
					{
						xformRet.scale = [
							interpolate( xformA.scale[0], xformB.scale[0], t ),
							interpolate( xformA.scale[1], xformB.scale[1], t ),
							interpolate( xformA.scale[2], xformB.scale[2], t )];
					}

					return xformRet;
				}

				xformA = xformB;
			}
		}

		return xformRet;
	}

	public getColor(): WebGLObjectColor
	{
		const colorRet: WebGLObjectColor = {
			color: [1, 1, 1],
			alpha: 1
		};

		if ( this.data.color === undefined )
			return colorRet;

		if ( this.data.color.length > 0 )
		{
			if ( this.data.color.length === 1 )
				return this.data.color[0];

			colorRet.color = this.data.color[0].color;
			colorRet.alpha = this.data.color[0].alpha;
		}

		const { color } = this.data;
		const animMode = this.data.anim?.mode || AnimBlendMode.Linear;
		let animTime = this.time;
		let backwards = false;
		let pingpong = false;

		if ( this.data.anim !== undefined && this.data.anim.loop === AnimLoopMode.PingPong )
		{
			pingpong = true;
			if ( ( this.playCount % 2 ) !== 0 )
			{
				animTime = this.maxTime - this.time;
				backwards = true;
			}
		}

		let colorA = color[0];
		for ( let i = 1; i < color.length; i += 1 )
		{
			const colorB = color[i];
			if ( colorB.key !== undefined )
			{
				if ( colorB.key.time > animTime )
				{
					// We found the second endpoint -- interpolate between A and B

					let mode = animMode;
					if ( colorB.key.modeIn !== undefined )
						mode = colorB.key.modeIn;

					const ts = colorA.key?.time || 0.0;
					const te = colorB.key.time;
					let t = ( animTime - ts ) / ( te - ts );
					if ( mode === AnimBlendMode.Discrete )
						t = Math.round( t );

					let interpolate;
					switch ( mode )
					{
						case AnimBlendMode.Sine:
							interpolate = pingpong ? this.pingpongCos : this.cos;
							break;
						case AnimBlendMode.Linear:
						case AnimBlendMode.Discrete:
						default:
							interpolate = pingpong ? this.pingpongLerp : this.lerp;
					}

					if ( backwards )
						t = 1.0 - t;

					colorRet.color = [
						interpolate( colorA.color[0], colorB.color[0], t ),
						interpolate( colorA.color[1], colorB.color[1], t ),
						interpolate( colorA.color[2], colorB.color[2], t )];

					colorRet.alpha = interpolate( colorA.alpha, colorB.alpha, t );

					return colorRet;
				}

				colorA = colorB;
			}
		}

		return colorRet;
	}
}
