/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
import { createTexture, DrawObject, drawObjectList, m4, ProgramInfo, v3 } from 'twgl.js';
import { WebGL } from './webgl.js';
import { WebGLScene, webGLSceneDefault } from './webglscene.js';
import { WebGLObjectTransform } from './webgldata.js';
import { WebGLObject } from './webglobject.js';
import { WebGLCube } from './webglcube.js';
import { WebGLPlane } from './webglplane.js';
import { WebGLSphere } from './webglsphere.js';
import { WebGLElement } from './webglelement.js';
import { shaders } from './shaders.js';

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
	private element!: WebGLElement;
	private container!: HTMLDivElement;
	private camera: m4.Mat4 = m4.identity();
	private padr: number = 0;
	private padt: number = 0;

	private camDegX: number = 0;
	private camDegY: number = 0;
	private camDistance: number = 10;
	private orthoDelta: number = 0;
	private camOffset: v3.Vec3 = [0, 0, 0];

	private programInfo: Map<string, ProgramInfo> = new Map();

	private sceneObjects: WebGLObject[] = [];
	private drawObjects: DrawObject[] = [];
	private objSelect: number = 0;

	private texturesLoading: number = 0;
	private fadeStart: number = 0;
	private fadeEnd: number = -1;

	private frameIndex: number = 0;
	private benchFrameIndex: number = 0;
	private benchFrameTime: number = 0;
	private benchMSperFrames: number = 0;

	constructor( shadowRoot: ShadowRoot, elementName: string, padr: number, padt: number )
	{
		this.setContainer( shadowRoot, elementName );
		this.padr = padr;
		this.padt = padt;
	}

	public setContainer( shadowRoot: ShadowRoot, elementName: string )
	{
		const div = shadowRoot.querySelector( elementName );
		if ( div === null )
			throw new Error( `Couldn't find element by name in specified root: ${elementName}` );
		this.container = div as HTMLDivElement;
		this.element = shadowRoot.host as WebGLElement;
	}

	getVectorFromDeg( yaw: number, pitch: number, scale: number )
	{
		const xRad = ( pitch * Math.PI ) / 180;
		const yRad = ( yaw * Math.PI ) / 180;
		const cosX = Math.cos( xRad );
		return [
			Math.cos( yRad ) * cosX * scale,
			Math.sin( xRad ) * scale,
			Math.sin( yRad ) * cosX * scale
		];
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

		this.resetView();

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

			const pitch = scene.lightDeg !== undefined ? scene.lightDeg[0] : 45;
			const yaw = scene.lightDeg !== undefined ? scene.lightDeg[1] : 210;
			let toLight: v3.Vec3 = this.getVectorFromDeg( pitch, yaw, 1.0 );
			toLight = v3.negate( toLight );
			toLight = v3.normalize( toLight );
			const lightColor: number[] = scene.lightColor ?? [1.0, 1.0, 1.0];
			const ambientColor: v3.Vec3 = scene.ambientLight ?? [1, 1, 1];
			v3.mulScalar( ambientColor, scene.ambientStr ?? 1.0, ambientColor );

			// Create shader common constants (uniforms)
			const uniforms = {
				u_diffuse: diffuse,
				u_toLight: toLight,
				u_lightColor: lightColor,
				u_ambientLight: ambientColor,
				u_tint: [1, 1, 1, 1],
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

	public addCameraDeltaRot( rotdX: number, rotdY: number )
	{
		const mouseScale = 0.75;

		this.camDegY += ( rotdX * mouseScale );

		// Euler angles have to clamp the gimbal lock axis
		const degY = this.camDegX + ( rotdY * mouseScale );
		this.camDegX = Math.min( Math.max( degY, -89 ), 89 );
	}

	public addCameraDeltaOrthoScale( delta: number )
	{
		const mouseScale = 0.0025;

		this.orthoDelta += delta * mouseScale;
	}

	public addCameraDeltaDist( delta: number )
	{
		this.addCameraDeltaOrthoScale( delta );

		const mouseScale = 0.005;

		this.camDistance += delta * mouseScale;
	}

	public addCameraDeltaXlate( xlateX: number, xlateY: number )
	{
		const mouseScale = 0.0125;

		const camera = m4.identity();
		this.getLookAt( camera )!;
		const left = m4.getAxis( camera, 0 ) as unknown as v3.Vec3;
		const up = m4.getAxis( camera, 1 ) as unknown as v3.Vec3;

		this.camOffset = v3.add( v3.mulScalar( left, -xlateX * mouseScale ), this.camOffset );
		this.camOffset = v3.add( v3.mulScalar( up, xlateY * mouseScale ), this.camOffset );
	}

	public resetView()
	{
		this.camDegX = 0;
		this.camDegY = 0;
		this.camDistance = 0;
		this.orthoDelta = 0;
		this.camOffset = [0, 0, 0];
	}

	changeObjectSelection( delta: number )
	{
		const count = this.sceneObjects.length;
		if ( count === 0 )
			this.objSelect = 0;
		else
			// Modulus operation in JS
			this.objSelect = ( ( ( delta + this.objSelect ) % count ) + count ) % count;
	}

	getSelectedVS(): string
	{
		if ( this.objSelect >= 0 && this.objSelect < this.sceneObjects.length )
			return shaders.get( this.sceneObjects[this.objSelect].data.vs );
		return '';
	}

	getSelectedFS(): string
	{
		if ( this.objSelect >= 0 && this.objSelect < this.sceneObjects.length )
			return shaders.get( this.sceneObjects[this.objSelect].data.fs );
		return '';
	}

	getSelectedTex(): string
	{
		if ( this.objSelect >= 0 && this.objSelect < this.sceneObjects.length )
			return this.sceneObjects[this.objSelect].data.diffuse?.url ?? '';
		return '';
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

		// Don't let the check go too deep for performance reasons
		const shadowRootLimit = 1;
		let shadowRootCount = 0;

		do
		{
			let parent: HTMLElement | null = element!.parentElement;
			if ( parent === null && element.parentNode !== null )
			{
				if ( element.parentNode.parentElement !== null )
				{
					parent = element.parentNode.parentElement as HTMLElement;
				}
				else if ( shadowRootCount < shadowRootLimit )
				{
					parent = ( element.getRootNode() as ShadowRoot ).host.parentElement;
					shadowRootCount += 1;
				}
			}

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

	getLookAt( dest?: m4.Mat4 )
	{
		if ( this.scene === undefined )
		{
			dest = m4.identity();
			return;
		}

		const sceneDegX = this.scene.rotDeg !== undefined ? this.scene.rotDeg[1] : 0;
		const sceneDegY = this.scene.rotDeg !== undefined ? this.scene.rotDeg[0] : 0;
		const sceneCamDist = this.scene.camDist !== undefined ? this.scene.camDist : 0;
		const sceneLookAt = this.scene.lookAt !== undefined ? this.scene.lookAt : [0, 0, 0];

		const degX = this.camDegX + sceneDegX;
		const degY = this.camDegY + sceneDegY;
		const dist = this.camDistance + sceneCamDist;
		const up = [0, 1, 0];

		const eyeLocal = this.getVectorFromDeg( degY, degX, dist );

		const eye = v3.add( this.camOffset, eyeLocal );
		const lookAt = v3.add( this.camOffset, sceneLookAt );

		m4.lookAt( eye, lookAt, up, dest );
	}

	public turnOffLoading()
	{
		this.fadeEnd = 0.0;
		// turn off loading SVG so it doesn't interfere with visibility DOM calculations
		for ( let i = 0; i < this.container.children.length; i++ )
			this.container.children.item( i )?.remove();
	}

	applyXform( xform: WebGLObjectTransform, world: m4.Mat4 ): m4.Mat4
	{
		m4.translate( world, xform.pos ?? [0, 0, 0], world );

		let scale: v3.Vec3 = [1, 1, 1];
		if ( xform.scale !== undefined )
		{
			if ( typeof xform.scale === 'number' )
				scale = [xform.scale, xform.scale, xform.scale];
			else
				scale = xform.scale;
		}
		m4.scale( world, scale, world );

		if ( xform.rotAxis !== undefined && xform.rotDeg !== undefined )
			m4.axisRotate( world, xform.rotAxis, ( xform.rotDeg * Math.PI ) / 180, world );

		return world;
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
			this.turnOffLoading();
		}
		else
		{
			fadeValue = ( timeAccumSecs - this.fadeStart ) / WebGLViewport.fadeInDurSecs;
			fadeValue = Math.min( fadeValue, 1.0 );
		}

		// The boundingClientRect from WebGLElement isn't trustworthy, so use the Div rect but start from the web-gl element.
		const viewRect = this.container.getBoundingClientRect();
		if ( WebGL.DEBUG_VIEWPORT_LEVEL >= 1 )
			this.debugLogRect( `viewRect: ${this.container.id}`, viewRect );
		const visRect = this.getVisibleBoundingRect( viewRect, this.element );
		const visWidthRaw = visRect.right - visRect.left;
		const visHeightRaw = visRect.bottom - visRect.top;

		this.debugLogRect( 'vis', visRect );
		this.debugLogRect( 'view', viewRect );

		if ( visWidthRaw <= 0 || visHeightRaw <= 0 )
			return;

		// Update time benchmark
		this.frameIndex += 1;
		const now = Date.now();
		const deltaMs = now - this.benchFrameTime;
		if ( deltaMs > 1000 )
		{
			const deltaFrames = this.frameIndex - this.benchFrameIndex;
			this.benchFrameIndex = this.frameIndex;
			this.benchFrameTime = now;
			this.benchMSperFrames = deltaMs / deltaFrames;

			// fire 'fpsupdate' event
			const event = new CustomEvent( 'fps-update', {
				detail: this.benchMSperFrames,
				bubbles: true,
				composed: true
			} );
			this.element.dispatchEvent( event );
		}

		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console
			console.log( `Rendering element ${this.container.id}: ${this.drawObjects.length} objects` );

		const vpWidth = viewRect.right - viewRect.left + this.padr;
		const vpHeight = viewRect.bottom - viewRect.top + this.padt;
		const vpLeft = viewRect.left;
		const vpBottom = canvas.clientHeight - viewRect.bottom;

		const visWidth = visWidthRaw + this.padr;
		const visHeight = visHeightRaw + this.padt;
		const visLeft = visRect.left;
		const visBottom = canvas.clientHeight - visRect.bottom;

		gl.enable( gl.SCISSOR_TEST );
		gl.clearColor(
			this.scene.clearColor![0],
			this.scene.clearColor![1],
			this.scene.clearColor![2],
			this.scene.clearColor![3]
		);
		gl.clearDepth( this.scene.clearDepth! );
		gl.clearStencil( this.scene.clearStencil! );

		if ( WebGL.DEBUG_VIEWPORT_LEVEL >= 2 )
			// eslint-disable-next-line no-console
			console.log( `Scissor:  l ${visLeft},  b ${visBottom},  w ${visWidth},  h ${visHeight}` );

		gl.viewport( vpLeft, vpBottom, vpWidth, vpHeight );
		gl.scissor( visLeft, visBottom, visWidth, visHeight );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );

		gl.enable( gl.CULL_FACE );

		const aspectRatio = vpWidth / vpHeight;
		const near = this.scene.near ?? 0.1;
		const far = this.scene.far ?? 100.0;

		let projection;
		if ( this.scene.orthoDiag !== undefined && this.scene.orthoDiag > 0 )
		{
			const orthoDiag = this.scene.orthoDiag + this.orthoDelta;
			const rad = orthoDiag * 0.5;
			let x;
			let y;
			if ( aspectRatio > 1 )
			{
				x = rad * aspectRatio;
				y = rad;
			}
			else
			{
				x = rad;
				y = rad / aspectRatio;
			}

			projection = m4.ortho( -x, x, -y, y, near, far );
		}
		else
		{
			// Calculate common matrices to update each object's uniforms
			projection = m4.perspective(
				( this.scene.fovYDeg! * Math.PI ) / 180,
				aspectRatio,
				near,
				far
			);
		}

		const view = m4.identity();
		const viewProjection = m4.identity();
		this.getLookAt( this.camera )!;
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
			let world = uniforms.u_world;

			m4.identity( world );

			// Perform animation interpolation
			object.animate( timeDeltaSecs );
			const xform = object.getTransform();
			const colorObj = object.getColor();

			world = this.applyXform( xform, world );

			if ( object.data.rootxform !== undefined )
				world = this.applyXform( object.data.rootxform, world );

			m4.transpose(
				m4.inverse( world, uniforms.u_worldInverseTranspose ),
				uniforms.u_worldInverseTranspose
			);

			m4.multiply(
				viewProjection,
				uniforms.u_world,
				uniforms.u_worldViewProjection
			);

			uniforms.u_tint = [colorObj.color[0], colorObj.color[1], colorObj.color[2], colorObj.alpha * globalAlpha];
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

	public getAverageFrameDuration(): number
	{
		return ( Date.now() - this.benchFrameTime ) > 1000 ? 0 : this.benchMSperFrames;
	}
}
