/* eslint-disable lines-between-class-members */
/* eslint-disable no-bitwise */
import { m4, ProgramInfo, DrawObject, resizeCanvasToDisplaySize, drawObjectList } from 'twgl.js';
import { WebGLCube } from './webglcube.js';
import { WebGLObject } from './webglobject.js';
import { WebGLPlane } from './webglplane.js';
import { WebGLScene, webGLSceneDefault } from './webglscene.js';
import { WebGLSphere } from './webglsphere.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class WebGL
{
	public gl?: WebGLRenderingContext;

	private scene: WebGLScene;
	private shadowRoot: ShadowRoot;

	// Map of vs/fs pair strings to runtime objects
	private programInfo: Map<string, ProgramInfo> = new Map();

	// One-to-one mapping of scene objects to drawable objects
	private sceneObjects: WebGLObject[] = [];
	private drawObjects: DrawObject[] = [];

	private camera: m4.Mat4 = m4.identity();

	constructor( scene: WebGLScene, shadowRoot: ShadowRoot )
	{
		this.scene = { ...webGLSceneDefault, ...scene };
		this.shadowRoot = shadowRoot;

		this.render = this.render.bind( this );
	}

	init( context: string )
	{
		if ( this.scene === undefined )
			return;

		const selector = this.shadowRoot.querySelector(
			context
		) as HTMLCanvasElement;
		if ( selector === null )
			throw new Error( `Couldn't find page context for WebGL: ${context}` );

		this.gl = selector.getContext( 'webgl' ) as WebGLRenderingContext;
		if ( !this.gl )
			throw new Error( `Couldn't get WebGL context for canvas ${context}` );

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
			const programInfo = obj.createProgramInfo( this.gl! );
			this.programInfo.set( objShaderKey, programInfo );

			// Create geometry buffer for each object
			const bufferInfo = obj.createBufferInfo( this.gl! );
			if ( bufferInfo === undefined )
				throw new Error( 'Failed to create buffer info for object' );

			// Create shader common constants (uniforms)
			const uniforms = {
				// 'u_diffuse': diffuse;
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

		requestAnimationFrame( this.render );
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render( time: number )
	{
		if ( this.gl === undefined )
			return;
		const { gl } = this;

		// time in ms
		// time *= 0.001;

		resizeCanvasToDisplaySize( gl.canvas as HTMLCanvasElement );

		gl.viewport( 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight );
		gl.enable( gl.DEPTH_TEST );
		gl.enable( gl.CULL_FACE );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
		gl.clearColor(
			this.scene.clearColor![0],
			this.scene.clearColor![1],
			this.scene.clearColor![2],
			this.scene.clearColor![3]
		);
		gl.clearDepth( this.scene.clearDepth! );
		gl.clearStencil( this.scene.clearStencil! );

		// Calculate common matrices to update each object's uniforms
		const projection = m4.perspective(
			( this.scene.fovYDeg! * Math.PI ) / 180,
			gl.canvas.width / gl.canvas.height,
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

		drawObjectList( this.gl!, this.drawObjects );

		requestAnimationFrame( this.render );
	}
}
