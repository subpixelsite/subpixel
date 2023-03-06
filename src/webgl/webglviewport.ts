/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
import { createTexture, DrawObject, drawObjectList, m4, ProgramInfo } from 'twgl.js';
import { WebGL } from './webgl.js';
import { WebGLScene, webGLSceneDefault } from './webglscene.js';
import { WebGLObject } from './webglobject.js';
import { WebGLCube } from './webglcube.js';
import { WebGLPlane } from './webglplane.js';
import { WebGLSphere } from './webglsphere.js';
import { WebGLElement } from './webglelement.js';

class Rect
{
	top: number = 0;
	bottom: number = 0;
	left: number = 0;
	right: number = 0;

	static fromDOMREct( domRect: DOMRect ): Rect
	{
		const rect = new Rect();

		rect.top = domRect.top;
		rect.bottom = domRect.bottom;
		rect.left = domRect.left;
		rect.right = domRect.right;

		return rect;
	}
}

export class WebGLViewport
{
	static fadeInDurSecs: number = 0.2;

	private scene?: WebGLScene;
	private element: WebGLElement;
	private container: HTMLDivElement;
	private camera: m4.Mat4 = m4.identity();

	private programInfo: Map<string, ProgramInfo> = new Map();

	private sceneObjects: WebGLObject[] = [];
	private drawObjects: DrawObject[] = [];

	private texturesLoading: number = 0;
	private fadeStart: number = 0;
	private fadeEnd: number = -1;

	constructor( shadowRoot: ShadowRoot, elementName: string )
	{
		const div = shadowRoot.querySelector( elementName );
		if ( div === null )
			throw new Error( `Couldn't find element by name in specified root: ${elementName}` );
		this.container = div as HTMLDivElement;
		this.element = shadowRoot.host as WebGLElement;
	}

	public setLoadEnabled( enabled: boolean )
	{
		this.element.setLoadEnabled( enabled );
	}

	init( scene: WebGLScene )
	{
		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console
			console.log( `begin init: ${this.container.id}` );

		const webgl = WebGL.getInstance();
		const { gl } = webgl;
		if ( gl === undefined )
			return;

		this.scene = { ...webGLSceneDefault, ...scene };

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
			else // New object types go here
				throw new Error( 'Unknown data type encountered in scene object' );

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
				this.texturesLoading += 1;
				diffuse = createTexture( gl!, {
					min: data.diffuse.min ?? WebGLRenderingContext.LINEAR,
					mag: data.diffuse.mag ?? WebGLRenderingContext.LINEAR,
					src: data.diffuse.url,
					color: [0.5, 0.5, 0.5, 1.0]
				}, () =>
				{
					this.texturesLoading -= 1;
					if ( this.texturesLoading < 0 )
						throw new Error( 'Texture load reference count mismatch' );

					if ( WebGL.DEBUG_RENDERS )
						// eslint-disable-next-line no-console
						console.log( `texture loaded: ${this.container.id}: '${data.diffuse!.url}'` );

					webgl.restartRendering();
				} );
			}

			// Create shader common constants (uniforms)
			const uniforms = {
				u_diffuse: diffuse,
				u_color: [1, 1, 1, 1],
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

		webgl.updateAnimatedFlag();

		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console
			console.log( `begin init: ${this.container.id}` );
	}

	public isInitialized(): boolean
	{
		return this.scene !== undefined;
	}

	public isFading(): boolean
	{
		return this.fadeEnd !== 0.0;
	}

	public onResizeEvent()
	{
		this.element?.onResizeEvent();
	}

	debugLogRect( name: string, rect: Rect, debugLevel: number = 2 )
	{
		if ( WebGL.DEBUG_VIEWPORT_LEVEL >= debugLevel )
			// eslint-disable-next-line no-console
			console.log( `${name.padStart( 32 ).substring( 0, 32 )}:  ${rect.left} - ${rect.right}, ${rect.top} - ${rect.bottom}` );
	}

	rectIntersect( rect1: Rect, rect2: Rect ): Rect
	{
		const rect = new Rect();

		rect.top = Math.max( rect1.top, rect2.top );
		rect.bottom = Math.min( rect1.bottom, rect2.bottom );
		rect.right = Math.min( rect1.right, rect2.right );
		rect.left = Math.max( rect1.left, rect2.left );

		// keep the rect from going inside out
		if ( rect.top > rect.bottom )
			rect.top = rect.bottom;
		if ( rect.left > rect.right )
			rect.left = rect.right;

		return rect;
	}

	getVisibleBoundingRect( rect: Rect, element: HTMLElement | null ): Rect
	{
		if ( element === null )
			throw new Error( 'Starting element in getVisibleBoundingRect is null' );

		this.debugLogRect( 'getVisibleBoundingRect', rect );

		do
		{
			const parent: HTMLElement | null = element!.parentElement;
			if ( parent !== null )
			{
				const parentRect = Rect.fromDOMREct( parent.getBoundingClientRect() );
				rect = this.rectIntersect( rect, parentRect );
				this.debugLogRect( `${parent.outerHTML}`, rect );
			}

			element = parent;
		} while ( element !== document.body && element !== null );

		// Finally, intersect with content rect
		const content = document.getElementsByTagName( 'lit-content' );
		if ( content === null || content.length === 0 )
			throw new Error( 'Can\'t find content container element' );
		const contentRect = Rect.fromDOMREct( content[0].getBoundingClientRect() );
		rect = this.rectIntersect( rect, contentRect );

		this.debugLogRect( '<div id=\'content\'>', rect );

		return rect;
	}

	render( timeDeltaSecs: number, timeAccumSecs: number )
	{
		const webgl = WebGL.getInstance();
		const { gl, canvas } = webgl;
		if ( gl === undefined || canvas === undefined || this.scene === undefined )
			return;

		if ( this.texturesLoading > 0 )
			return;

		if ( this.fadeEnd < 0 )
		{
			if ( webgl.getFadeEnabled() === true )
			{
				this.fadeStart = timeAccumSecs;
				this.fadeEnd = timeAccumSecs + WebGLViewport.fadeInDurSecs;
			}
			else
			{
				// skip fade as requested
				timeAccumSecs = 1.0;
				this.fadeEnd = 0.0;
			}
		}

		let fadeValue = 1.0;
		if ( timeAccumSecs > this.fadeEnd )
		{
			this.fadeEnd = 0.0;
			// turn off loading SVG so it doesn't interfere with visibility DOM calculations
			for ( let i = 0; i < this.container.children.length; i++ )
				this.container.children.item( i )?.remove();
		}
		else
		{
			fadeValue = ( timeAccumSecs - this.fadeStart ) / WebGLViewport.fadeInDurSecs;
			fadeValue = Math.min( fadeValue, 1.0 );
		}

		// The boundingClientRect from WebGLElement isn't trustworthy, so use the Div rect but start from the web-gl element.
		const viewRect = this.container.getBoundingClientRect();
		const visRect = this.getVisibleBoundingRect( viewRect, this.element );
		const visWidthRaw = visRect.right - visRect.left;
		const visHeightRaw = visRect.bottom - visRect.top;

		this.debugLogRect( 'vis', visRect );
		this.debugLogRect( 'view', viewRect );

		if ( visWidthRaw <= 0 || visHeightRaw <= 0 )
			return;

		if ( WebGL.DEBUG_RENDERS || WebGL.DEBUG_VIEWPORT_LEVEL >= 1 )
			// eslint-disable-next-line no-console
			console.log( `Rendering element ${this.container.id}: ${this.drawObjects.length} objects` );

		const vpWidth = viewRect.right - viewRect.left + 1;
		const vpHeight = viewRect.bottom - viewRect.top;
		const vpLeft = viewRect.left;
		const vpBottom = canvas.clientHeight - viewRect.bottom;

		const border = 2;
		const visLeft = visRect.left;
		const visBottom = canvas.clientHeight - visRect.bottom + border;
		const visWidth = visWidthRaw + ( border / 2 ); // fudge factor
		const visHeight = visHeightRaw - border;

		gl.enable( gl.SCISSOR_TEST );
		gl.clearColor(
			this.scene.clearColor![0],
			this.scene.clearColor![1],
			this.scene.clearColor![2],
			this.scene.clearColor![3]
		);
		gl.clearDepth( this.scene.clearDepth! );
		gl.clearStencil( this.scene.clearStencil! );

		gl.viewport( vpLeft, vpBottom, vpWidth, vpHeight );
		gl.scissor( visLeft, visBottom, visWidth, visHeight );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );

		gl.enable( gl.CULL_FACE );

		// Calculate common matrices to update each object's uniforms
		const projection = m4.perspective(
			( this.scene.fovYDeg! * Math.PI ) / 180,
			vpWidth / vpHeight,
			this.scene.near!,
			this.scene.far!
		);
		const up = [0, 1, 0];

		const view = m4.identity();
		const viewProjection = m4.identity();
		m4.lookAt( this.scene.eye!, this.scene.lookAt!, up, this.camera );
		m4.inverse( this.camera, view );
		m4.multiply( projection, view, viewProjection );

		const globalAlpha = fadeValue;
		if ( fadeValue >= 1.0 )
		{
			gl.disable( gl.BLEND );
			gl.blendFunc( gl.ONE, gl.ZERO );
		}
		else
		{
			gl.enable( gl.BLEND );
			gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
		}

		this.sceneObjects?.forEach( object =>
		{
			// const { datum } = object;
			const { uniforms } = object;
			const world = uniforms.u_world;

			m4.identity( world );

			// Perform animation interpolation
			object.animate( timeDeltaSecs );
			const xform = object.getTransform();
			const colorObj = object.getColor();

			if ( xform.rotAxis !== undefined && xform.rotRad !== undefined )
				m4.axisRotate( world, xform.rotAxis, xform.rotRad, world );

			m4.translate( world, xform.pos ?? [0, 0, 0], world );

			m4.transpose(
				m4.inverse( world, uniforms.u_worldInverseTranspose ),
				uniforms.u_worldInverseTranspose
			);

			m4.multiply(
				viewProjection,
				uniforms.u_world,
				uniforms.u_worldViewProjection
			);

			uniforms.u_color = [colorObj.color[0], colorObj.color[1], colorObj.color[2], colorObj.alpha * globalAlpha];
		} );

		drawObjectList( gl!, this.drawObjects );
	}

	public getAnimated(): boolean
	{
		let maxTime = 0.0;

		this.sceneObjects?.forEach( object =>
		{
			maxTime = Math.max( maxTime, object.maxTime );
		} );

		return maxTime > 0.0;
	}
}
