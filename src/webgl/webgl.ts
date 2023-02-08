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
	}

	public static getNextID(): number
	{
		const id = WebGL.nextId;
		WebGL.nextId += 1;
		return id;
	}

	public static DEBUG_RENDERS = false;

	public gl?: WebGLRenderingContext;
	public canvas?: HTMLCanvasElement;

	private animated: number = 0;
	private viewports: WebGLViewport[] = [];

	private requestId?: number;
	private lastTimeSecs: number = 0;

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

		window.addEventListener( 'resize', () => this.queueRender );
		window.addEventListener( 'scroll', () => this.queueRender );
	}

	public setAnimated( isAnimated: boolean )
	{
		this.animated += isAnimated ? 1 : -1;

		if ( this.animated < 0 )
			throw new Error( 'WebGL animated refcount is less than zero' );

		this.requestNewRender();
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

		// eslint-disable-next-line prefer-destructuring
		canvas.style.transform = `translateY(${window.scrollY}px)`;

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
	}

	singleRender( t: number )
	{
		if ( WebGL.DEBUG_RENDERS )
			// eslint-disable-next-line no-console
			console.log( 'Render requested' );

		this.render( t );
		this.requestId = undefined;
	}

	queueRender()
	{
		if ( this.requestId === undefined )
			this.requestId = requestAnimationFrame( () => this.singleRender );
	}

	public requestNewRender()
	{
		if ( this.animated > 0 )
		{
			const renderContinuously = ( t: number ) =>
			{
				this.render( t );
				if ( this.animated > 0 )
					requestAnimationFrame( renderContinuously );
			};
			requestAnimationFrame( renderContinuously );
		}
		else
		{
			this.queueRender();
		}
	}

	public onNavigateAway()
	{
		// Clear all added elements
		this.viewports.length = 0;
		this.animated = 0;

		window.removeEventListener( 'resize', () => this.queueRender );
		window.removeEventListener( 'scroll', () => this.queueRender );

		this.requestNewRender();
	}
}
