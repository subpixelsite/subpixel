/* eslint-disable no-bitwise */
import { createTexture, DrawObject, drawObjectList, m4, ProgramInfo } from 'twgl.js';
import { WebGL } from './webgl.js';
import { WebGLScene, webGLSceneDefault } from './webglscene.js';
import { WebGLObject } from './webglobject.js';
import { WebGLCube } from './webglcube.js';
import { WebGLPlane } from './webglplane.js';
import { WebGLSphere } from './webglsphere.js';

export class WebGLElement
{
	private scene: WebGLScene;
	private element: HTMLDivElement;
	private animated: boolean;
	private camera: m4.Mat4 = m4.identity();

	private programInfo: Map<string, ProgramInfo> = new Map();

	private sceneObjects: WebGLObject[] = [];
	private drawObjects: DrawObject[] = [];

	constructor( scene: WebGLScene, shadowRoot: ShadowRoot, elementName: string )
	{
		this.scene = { ...webGLSceneDefault, ...scene };

		this.element = shadowRoot.querySelector(
			elementName
		) as HTMLDivElement;
		if ( this.element === null )
			throw new Error( `Couldn't find element by name in specified root: ${elementName}` );

		this.animated = false;
	}

	init()
	{
		if ( this.scene === undefined )
			throw new Error( 'Cannot init WebGLElement with missing scene' );

		const webgl = WebGL.getInstance();
		const { gl } = webgl;
		if ( gl === undefined )
			return;

		this.scene.objects?.forEach( data =>
		{
			// Create the correct type of WebGLObject for the requested primitive
			let obj;
			if ( data.plane !== undefined )
				obj = new WebGLPlane( data );
			else if ( data.sphere !== undefined )
				obj = new WebGLSphere( data );
			else if ( data.cube !== undefined )
				obj = new WebGLCube( data );
			else
				obj = new WebGLObject( data );

			// Find and load shaders from shader library for each object
			const objShaderKey = `${data.vs}|${data.fs}`;
			const programInfo = obj.createProgramInfo( gl! );
			this.programInfo.set( objShaderKey, programInfo );

			// Create geometry buffer for each object
			const bufferInfo = obj.createBufferInfo( gl! );
			if ( bufferInfo === undefined )
				throw new Error( 'Failed to create buffer info for object' );

			// Load any requested textures
			let diffuse: WebGLTexture | undefined;
			if ( data.diffuse !== undefined )
			{
				diffuse = createTexture( gl!, {
					min: data.diffuse.min ?? WebGLRenderingContext.LINEAR,
					mag: data.diffuse.mag ?? WebGLRenderingContext.LINEAR,
					src: data.diffuse.url
				} );
			}

			// Create shader common constants (uniforms)
			const uniforms = {
				u_diffuse: diffuse,
				u_viewInverse: this.camera,
				u_world: m4.identity(),
				u_worldInverseTranspose: m4.identity(),
				u_worldViewProjection: m4.identity()
			};

			const drawObj: DrawObject = {
				programInfo,
				bufferInfo,
				uniforms
			};

			// eslint-disable-next-line no-param-reassign
			obj.uniforms = uniforms;

			this.sceneObjects.push( obj );
			this.drawObjects.push( drawObj );
		} );

		webgl.addElement( this );
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render( timeMS: number )
	{
		const webgl = WebGL.getInstance();
		const { gl, canvas } = webgl;
		if ( gl === undefined || canvas === undefined )
			return;

		const rect = this.element.getBoundingClientRect();
		if ( rect.bottom < 0 || rect.top > canvas.clientHeight
			|| rect.right < 0 || rect.left > canvas.clientWidth )
			return;

		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console
			console.log( 'Rendering element' );

		const width = rect.right - rect.left;
		const height = rect.bottom - rect.top;
		const { left } = rect;
		const bottom = canvas.clientHeight - rect.bottom - 1;

		gl.enable( gl.SCISSOR_TEST );
		gl.clearColor(
			this.scene.clearColor![0],
			this.scene.clearColor![1],
			this.scene.clearColor![2],
			this.scene.clearColor![3]
		);
		gl.clearDepth( this.scene.clearDepth! );
		gl.clearStencil( this.scene.clearStencil! );

		gl.viewport( left, bottom, width, height );
		gl.scissor( left, bottom, width, height );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
		gl.clear( gl.COLOR_BUFFER_BIT );

		gl.enable( gl.CULL_FACE );

		// Calculate common matrices to update each object's uniforms
		const projection = m4.perspective(
			( this.scene.fovYDeg! * Math.PI ) / 180,
			width / height,
			this.scene.near!,
			this.scene.far!
		);
		const up = [0, 1, 0];

		const view = m4.identity();
		const viewProjection = m4.identity();
		m4.lookAt( this.scene.eye!, this.scene.lookAt!, up, this.camera );
		m4.inverse( this.camera, view );
		m4.multiply( projection, view, viewProjection );

		this.sceneObjects?.forEach( object =>
		{
			const { data } = object;
			const { uniforms } = object;
			const world = uniforms.u_world;
			m4.identity( world );
			if ( data.xform.rotAxis !== undefined && data.xform.rotRad !== undefined )
				m4.axisRotate( world, data.xform.rotAxis, data.xform.rotRad, world );
			m4.translate( world, data.xform.pos ?? [0, 0, 0], world );
			m4.transpose(
				m4.inverse( world, uniforms.u_worldInverseTranspose ),
				uniforms.u_worldInverseTranspose
			);
			m4.multiply(
				viewProjection,
				uniforms.u_world,
				uniforms.u_worldViewProjection
			);
		} );

		drawObjectList( gl!, this.drawObjects );
	}

	public getAnimated(): boolean
	{
		return this.animated;
	}
}
