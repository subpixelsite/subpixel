/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, PropertyValueMap, css, html, TemplateResult } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement, state } from 'lit/decorators.js';
import { svg } from 'lit-html';
import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { WebGL } from './webgl.js';
import { WebGLViewport } from './webglviewport.js';
import { WebGLScene } from './webglscene.js';
import { CachedViewport } from './webglcache.js';

// Wrap an string into an array of strings based on a width of characters.
// Works based on chars, so prefer a monospace font.
export function wrapTextElement(
	text: string,
	width: number,
	splitOnHyphen: boolean
): string[]
{
	const words: string[] = [];
	// Copy the original text content to fuck with if necessary?
	const content: string = text;

	// Make an array of words
	content.split( /\s+/ )
		.forEach( w =>
		{
			if ( splitOnHyphen )
			{
				const subWords = w.split( '-' );
				for ( let i = 0; i < subWords.length - 1; i++ )
					words.push( subWords[i] + '-' );
				words.push( subWords[subWords.length - 1] + ' ' );
			} else
			{
				words.push( w + ' ' );
			}
		} );

	// Start with one line
	const output: string[] = [];
	let row = 0;

	let line = ''; // The current value of the line
	let prevLine = ''; // The value of the line before the last word (or sub-word) was added
	let nWordsInLine = 0; // Number of words in the line
	for ( let i = 0; i < words.length; i++ )
	{
		const word = words[i];
		prevLine = line;
		line += word;
		nWordsInLine += 1;
		output[row] = line.trim();
		if ( output[row].length > width && nWordsInLine > 1 )
		{
			// The line is too long, and it contains more than one word.
			// Remove the last word and add it to a new row.
			output[row] = prevLine.trim();
			prevLine = '';
			line = word;
			nWordsInLine = 1;
			row += 1;
			output[row] = word.trim();
		}
	}

	return output;
}

@customElement( 'web-gl' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class WebGLElement extends LitElement
{
	static styles = css`
		:host {
			display: inline-block;
		}

		.web-gl-container {
			display:inline-block;
			box-sizing: border-box;
			overflow: hidden;
			width: 100%;
			height: 100%;
			min-width: 100px;
			min-height: 100px;
		}

		.web-gl-errortext {
			text-anchor: middle;
			fill: #afafaf;
		}

		.svgTspan {
			white-space: inherit;
			font-family: monospace;
		}
	`;

	private wglViewport?: WebGLViewport;

	@property( { type: String } )
	errorText?: string;

	@property( { type: String } )
	src?: string;

	@property( { type: Boolean } )
	alwaysload?: boolean;

	@property( { type: Number } )
	padr?: number;

	@property( { type: Number } )
	padt?: number;

	@state()
	angleX: number = 0;

	@state()
	angleY: number = 0;

	@state()
	drag = false;

	private idNumber: number = 0;
	private divID: string = '';
	private wrappedText?: string[];
	private loadEnabled: boolean = true;

	constructor()
	{
		super();
		this.idNumber = WebGL.getNextID();
		this.divID = `web-gl-container-${this.idNumber}`;
	}

	setErrorText( error: string | undefined )
	{
		this.errorText = error;
		this.wrappedText = undefined;
	}

	getWrappedErrorText(): string[] | undefined
	{
		// This could include a general WebGL error state
		const errorText = this.getError();

		if ( errorText !== undefined && this.wrappedText === undefined )
		{
			// Using a monospace font and character count to wrap, so this ratio is fontsize to font character width (smaller means skinnier presumed font)
			const fontSizeFudgeRatio = 0.57;

			const boxWidth = parseInt( window.getComputedStyle( this ).width, 10 );
			const fontSize = parseInt( window.getComputedStyle( this ).fontSize, 10 );

			const wrapWidthPixels = boxWidth;
			const fontSizePixels = fontSize ?? 1;

			const wrapWidth = wrapWidthPixels / fontSizePixels / fontSizeFudgeRatio;

			this.wrappedText = wrapTextElement( errorText, wrapWidth, true );
		}

		return this.wrappedText;
	}

	public onResizeEvent()
	{
		// re-wrap lines and force a render update
		this.setErrorText( this.errorText );
		WebGL.getInstance().refreshSingleRender();
		this.requestUpdate();
	}

	resetView()
	{
		this.wglViewport?.resetView();
	}

	onMouseDown()
	{
		this.drag = true;

		// console.log( `mousedown: drag: ${this.drag}` );
	}

	onMouseMove( e: Event )
	{
		if ( window.getSelection() )
			window.getSelection()!.removeAllRanges();
		else if ( document.getSelection() )
			document.getSelection()!.empty();

		if ( this.drag )
		{
			const event = e as MouseEvent;
			const mouseZoomScale = 5;

			// console.log( `x,y: ${event.x}, ${event.y} -- move x,y: ${event.movementX}, ${event.movementY}` );

			const PRIMARY = 1;
			const SECONDARY = 2;
			const BOTH = 3;
			const MIDDLE = 4;

			if ( event.buttons === PRIMARY )
				this.wglViewport?.addCameraDeltaRot( event.movementX, event.movementY );
			else if ( event.buttons === SECONDARY )
				this.wglViewport?.addCameraDeltaDist( event.movementY * mouseZoomScale );
			else if ( event.buttons === BOTH || event.buttons === MIDDLE )
				this.wglViewport?.addCameraDeltaXlate( event.movementX, event.movementY );
		}
	}

	onMouseUp( e: Event )
	{
		// console.log( `mouseup: drag: ${this.drag}` );

		if ( this.drag === true )
			e.preventDefault();

		this.drag = false;
	}

	handleWheel( e: Event )
	{
		e.preventDefault();

		const event = e as WheelEvent;
		this.wglViewport?.addCameraDeltaDist( event.deltaY );

		// console.log( `delta wheel: ${event.deltaY}, mode: ${event.deltaMode}` );
	}

	handleContextMenu( e: Event ): boolean
	{
		e.preventDefault();

		// console.log( 'onContextMenu' );

		return false;
	}

	changeObjectSelection( delta: number )
	{
		this.wglViewport?.changeObjectSelection( delta );
	}

	getSelectedVS(): string
	{
		return this.wglViewport?.getSelectedVS() ?? '';
	}

	getSelectedFS(): string
	{
		return this.wglViewport?.getSelectedFS() ?? '';
	}

	getSelectedTex(): string
	{
		return this.wglViewport?.getSelectedTex() ?? '';
	}

	getAnimated(): boolean
	{
		return this.wglViewport?.getAnimated() ?? false;
	}

	connectedCallback(): void
	{
		super.connectedCallback();

		this.addEventListener( 'mousedown', () => this.onMouseDown() );
		this.addEventListener( 'mousemove', e => this.onMouseMove( e ) );
		this.addEventListener( 'mouseup', e => this.onMouseUp( e ) );
		this.addEventListener( 'wheel', e => this.handleWheel( e ) );
		this.addEventListener( 'contextmenu', e => this.handleContextMenu( e ) );

		// Fire off an initial resize event to get an SVG text update if needed
		this.onResizeEvent();
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();

		this.removeEventListener( 'mousedown', () => this.onMouseDown() );
		this.removeEventListener( 'mousemove', e => this.onMouseMove( e ) );
		this.removeEventListener( 'mouseup', e => this.onMouseUp( e ) );
		this.removeEventListener( 'wheel', e => this.handleWheel( e ) );
		this.removeEventListener( 'contextmenu', e => this.handleContextMenu( e ) );
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected firstUpdated( _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown> ): void
	{
		const gl = WebGL.getInstance();
		const content = this.outerHTML;

		let cachedVP = gl.getViewport( this.divID, content );
		if ( cachedVP === undefined )
		{
			if ( WebGL.DEBUG_VIEWPORT_LEVEL >= 1 )
				// eslint-disable-next-line no-console
				console.log( `Creating new <web-gl> viewport '${this.divID}' for '${content}'` );

			cachedVP = new CachedViewport( this.divID, content, new WebGLViewport( this.shadowRoot!, `#${this.divID}`, this.padr ?? 1, this.padt ?? 0 ) );
			gl.addViewport( cachedVP );
		}

		this.wglViewport = cachedVP.viewport;

		// in case there's a URL waiting, fetch it
		this.fetchHref();
	}

	setWebGLData( scene: WebGLScene )
	{
		if ( this.wglViewport !== undefined )
			this.wglViewport.init( scene );
	}

	public setLoadEnabled( enabled: boolean )
	{
		this.loadEnabled = enabled;

		// Lazy load any missing data
		if ( this.wglViewport !== undefined && !this.wglViewport.isInitialized() )
			this.fetchHref();
	}

	fetchWebGLData( url: string )
	{
		if ( this.wglViewport === undefined )
			return;

		fetch( url.toString() )
			.then( response =>
			{
				if ( !response.ok )
					throw new Error( `Fetch failed with status ${response.status}` );
				return response.json();
			} )
			.then( data =>
			{
				const wgl = plainToClass( WebGLScene, data );
				this.wglViewport!.init( wgl );

				// fire 'loaded' event
				const event = new CustomEvent( 'webgl-loaded', {
					detail: this,
					bubbles: true,
					composed: true
				} );
				this.dispatchEvent( event );
			} )
			.catch( error =>
			{
				this.setErrorText( error.toString() );
				WebGL.getInstance().refreshSingleRender();
				this.requestUpdate();
				throw new Error( `${error}` );
			} );
	}

	fetchHref()
	{
		if ( this.src === undefined )
			return;

		if ( !this.loadEnabled && this.alwaysload !== true )
			return;

		const url = new URL( this.src!, window.location.origin );
		this.fetchWebGLData( url.href );
	}

	update( changedProperties: Map<string, unknown> )
	{
		super.update( changedProperties );

		if ( changedProperties.has( 'href' ) )
		{
			const oldValue = changedProperties.get( 'href' ) as string | undefined;
			const newValue = this.src;
			if ( newValue !== oldValue && this.src !== undefined )
				this.fetchHref();
		}
	}

	showLoading(): TemplateResult<1>
	{
		return html`
			<svg width="100%" height="100%" role="img" aria-labelledby="label">
				<title id="label">Loading...</title>
				<rect width="100%" height="100%" fill="#dfdfdf"/>
				<text x="50%" y="50%" font-family="serif" font-size="60" text-anchor="middle" alignment-baseline="central" fill="#afafaf">
					<tspan x="50%">.<animate attributeName="opacity" values="0.2;1;1;0.2" dur="2s" begin="-1s" repeatCount="indefinite"/></tspan>
					<tspan dx="0%">.<animate attributeName="opacity" values="0.2;1;1;0.2" dur="2s" begin="-0.5s" repeatCount="indefinite"/></tspan>
					<tspan dx="0%">.<animate attributeName="opacity" values="0.2;1;1;0.2" dur="2s" repeatCount="indefinite"/></tspan>
				</text>
				<rect width="100%" height="100%" opacity="0%" fill="#dfdfdf"><animate attributeName="opacity" values="1;1;0" dur="1.0s"></rect>
			</svg>`;
	}

	getError(): string | undefined
	{
		return WebGL.error ?? this.errorText;
	}

	showError(): TemplateResult<1> | undefined
	{
		const errorText = this.getError();
		if ( errorText === undefined )
			return undefined;

		const wrappedText = this.getWrappedErrorText();
		if ( wrappedText === undefined )
			throw new Error( 'Failed to get wrapped error text' );

		const { fontSize } = window.getComputedStyle( this );

		const tspans = wrappedText.map( i => svg`<tspan x="50%" dy="1em" class="svgTspan">${i}</tspan>` );

		const output = html`
			<svg width="100%" height="100%" role="img" aria-labelledby="label">
				<title id="label">${errorText}</title>
				<rect width="100%" height="100%" fill="#cfcfcf"/>
				<text width="100%" x="50" y="50" class="web-gl-errortext" font-size="${fontSize}" alignment-baseline="central">
					${tspans}
				</text>
			</svg>
		`;

		return html`${output}`;
	}

	render()
	{
		return html`
			<div class="web-gl-container" id="${this.divID}" >
				${this.showError() ?? this.showLoading()}
			</div>
			`;
	}
}
