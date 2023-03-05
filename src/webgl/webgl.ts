import { resizeCanvasToDisplaySize } from 'twgl.js';
import { WebGLViewport } from './webglviewport.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class WebGL
{
	// This is a singleton.
	private static instance: WebGL;

	// eslint-disable-next-line no-useless-constructor, no-empty-function
	private constructor() {}
	public static getInstance(): WebGL
	{
		if ( !WebGL.instance )
			WebGL.instance = new WebGL();

		return WebGL.instance;
	}

	public static error?: string;
	private static nextId: number = 1;

	public static initContext( canvas: HTMLCanvasElement )
	{
		if ( canvas === null )
			throw new Error( 'WebGL::initContext: selector is NULL' );

		const instance = WebGL.getInstance();
		instance.gl = canvas.getContext( 'webgl' ) as WebGLRenderingContext;
		if ( instance.gl === null )
		{
			WebGL.error = 'WebGL is not supported';
			return;
		}

		instance.canvas = canvas;

		instance.render = instance.render.bind( instance );

		instance.addEventListeners();
	}

	public static getNextID(): number
	{
		const id = WebGL.nextId;
		WebGL.nextId += 1;
		return id;
	}

	public static DEBUG_RENDERS = false;
	public static DEBUG_VIEWPORT_LEVEL = 0;		// 1: basic info, 2: detailed info

	public gl?: WebGLRenderingContext;
	public canvas?: HTMLCanvasElement;

	private scrollListenerElement?: HTMLElement;

	private animated: boolean = false;
	private animatedRequestId: number = 0;

	private singleRequestId?: number;
	private lastTimeSecs: number = 0;

	private viewports: WebGLViewport[] = [];

	private loadEnabled: boolean = true;

	// Map of vs/fs pair strings to runtime objects
	// private programInfo: Map<string, ProgramInfo> = new Map();

	public setLoadEnabled( enabled: boolean )
	{
		this.loadEnabled = enabled;
		this.viewports.forEach( viewport =>
		{
			viewport.setLoadEnabled( enabled );
		} );
	}

	public addViewport( viewport: WebGLViewport )
	{
		this.viewports.push( viewport );
		viewport.setLoadEnabled( this.loadEnabled );
	}

	public addEventListeners()
	{
		window.addEventListener( 'resize', () => this.resizeEvent() );
	}

	public updateAnimatedFlag()
	{
		this.animated = false;

		for ( let i = 0; i < this.viewports.length; i++ )
		{
			if ( this.viewports.at( i )!.getAnimated() )
			{
				this.animated = true;
				break;
			}
		}

		this.restartRendering();
	}

	public isAnyFading()
	{
		for ( let i = 0; i < this.viewports.length; i++ )
		{
			if ( this.viewports.at( i )!.isFading() )
				return true;
		}

		return false;
	}

	// public setProgramInfo( vs: string, fs: string, obj: WebGLObject )
	// {
	// 	if ( this.gl === undefined )
	// 		return;

	// 	const objShaderKey = `${vs}|${fs}`;
	// 	const programInfo = obj.createProgramInfo( this.gl );
	// 	this.programInfo.set( objShaderKey, programInfo );
	// }

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render( timeAccumMS: number )
	{
		const webgl = WebGL.getInstance();
		const { gl, canvas } = webgl;

		if ( gl === undefined )
			return;
		if ( canvas === undefined )
			throw new Error( 'Unexpected undefined canvas in WebGL::render' );

		const timeAccumSecs = timeAccumMS * 0.001;
		const timeDeltaSecs = timeAccumSecs - this.lastTimeSecs;
		this.lastTimeSecs = timeAccumSecs;

		resizeCanvasToDisplaySize( canvas );

		// First clear color with scissor disabled, then re-enable for rendering
		gl.enable( gl.DEPTH_TEST );
		gl.disable( gl.SCISSOR_TEST );
		gl.clearColor( 0, 0, 0, 0 );
		gl.clearDepth( 1.0 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );

		// Iterate elements to draw each as requested
		this.viewports.forEach( viewport =>
		{
			viewport.render( timeDeltaSecs, timeAccumSecs );
		} );

		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console
			console.log( `Rendering... elements ${this.viewports.length}, animated: ${this.animated}` );

		this.singleRequestId = 0;
	}

	private singleRender( t: number )
	{
		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console
			console.log( 'Single render' );

		this.render( t );
	}

	private queueRender()
	{
		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console, max-len
			console.log( `queue render event animated:${this.animated} animatedId:${this.animatedRequestId} singleId:${this.singleRequestId}` );

		if ( this.isAnimating() )
			return;

		// clear out stale animated render (eg, leftover from fading)
		this.stopAnimatedRender();

		// If a render isn't already in flight (eg, animated), request a new single
		if ( this.singleRequestId === 0 )
			this.singleRequestId = requestAnimationFrame( ( t: number ) => this.singleRender( t ) );
	}

	public resizeEvent()
	{
		for ( let i = 0; i < this.viewports.length; i++ )
			this.viewports.at( i )!.onResizeEvent();

		this.refreshSingleRender();
	}

	public static setScrollListener( element: HTMLElement | undefined )
	{
		const gl = WebGL.getInstance();
		if ( gl.scrollListenerElement !== element )
		{
			gl.scrollListenerElement = element;
			if ( gl.scrollListenerElement !== undefined )
				gl.scrollListenerElement.addEventListener( 'scroll', () => gl.scrollEvent() );
		}
	}

	scrollEvent()
	{
		this.refreshSingleRender();
	}

	startAnimatedRender()
	{
		const renderContinuously = ( t: number ) =>
		{
			this.render( t );
			if ( this.isAnimating() )
				this.animatedRequestId = requestAnimationFrame( renderContinuously );
		};
		this.animatedRequestId = requestAnimationFrame( renderContinuously );
	}

	stopAnimatedRender()
	{
		cancelAnimationFrame( this.animatedRequestId );
		this.animatedRequestId = 0;
	}

	isAnimating(): boolean
	{
		return this.animated || this.isAnyFading();
	}

	public restartRendering()
	{
		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console
			console.log( 'restart rendering' );

		this.stopAnimatedRender();

		if ( this.isAnimating() )
			this.startAnimatedRender();
		else
			this.queueRender();
	}

	public refreshSingleRender()
	{
		if ( this.isAnimating() )
			return;

		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console
			console.log( 'refresh single render' );

		this.queueRender();
	}

	public onNavigateAway()
	{
		// Clear all added elements
		this.viewports.length = 0;
		this.animated = false;

		this.stopAnimatedRender();
		this.refreshSingleRender();
	}
}
