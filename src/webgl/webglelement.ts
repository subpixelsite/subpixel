/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { customElement, property, LitElement, html, TemplateResult, css } from 'lit-element';
import { svg } from 'lit-html';
import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { PropertyValueMap } from 'lit';
import { WebGL } from './webgl.js';
import { WebGLViewport } from './webglviewport.js';
import { WebGLScene } from './webglscene.js';

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

export function getPixelWidth( attributeValue: string, parentElement: HTMLElement | null ): number
{
	let parentWidth = window.innerWidth;
	if ( parentElement !== null )
		parentWidth = parentElement.clientWidth;

	if ( attributeValue.endsWith( '%' ) )
	{
		const pct = parseInt( attributeValue, 10 ) / 100;
		return pct * parentWidth;
	}

	return parseInt( attributeValue, 10 );
}

export function getPixelHeight( attributeValue: string, parentElement: HTMLElement | null ): number
{
	let parentHeight = window.innerHeight;
	if ( parentElement !== null )
		parentHeight = parentElement.clientHeight;

	if ( attributeValue.endsWith( '%' ) )
	{
		const pct = parseInt( attributeValue, 10 ) / 100;
		return pct * parentHeight;
	}

	return parseInt( attributeValue, 10 );
}

@customElement( 'web-gl' )
export class WebGLElement extends LitElement
{
	static styles = css`
		.web-gl-container {
			display:inline-block;
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
	width: string = '128px';

	@property( { type: String } )
	height: string = '128px';

	@property( { type: String } )
	fontsize: string = '16';

	@property( { type: String } )
	errorText?: string;

	@property( { type: String } )
	src?: string;

	private idNumber: number = 0;
	private divID: string = '';
	private wrappedText?: string[];

	constructor()
	{
		super();
		this.idNumber = WebGL.getNextID();
		this.divID = `web-gl-container-${this.idNumber}`;
	}

	private onResizeEvent()
	{
		const fontSizeFudgeRatio = 0.6;

		// re-wrap lines and force a render update
		this.wrappedText = undefined;

		const errorText = this.getError();
		if ( errorText === undefined )
			return;

		const wrapWidthPixels = getPixelWidth( this.width, this.parentElement );
		const fontSizePixels = getPixelWidth( this.fontsize, this.parentElement ) ?? 1;

		const wrapWidth = wrapWidthPixels / fontSizePixels / fontSizeFudgeRatio;

		this.wrappedText = wrapTextElement( errorText, wrapWidth, true );

		this.requestUpdate();
	}

	connectedCallback(): void
	{
		super.connectedCallback();

		window.addEventListener( 'resize', () => this.onResizeEvent(), { capture: false, passive: true } );
		// Fire off an initial resize event to get an SVG text update if needed
		this.onResizeEvent();
	}

	protected firstUpdated( _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown> ): void
	{
		this.wglViewport = new WebGLViewport( this.shadowRoot!, `#${this.divID}` );
		// in case there's a URL waiting, fetch it
		this.fetchHref();
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();

		window.removeEventListener( 'resize', () => this.onResizeEvent() );
	}

	setWebGLData( scene: WebGLScene )
	{
		if ( this.wglViewport !== undefined )
			this.wglViewport.init( scene );
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
			} )
			.catch( error =>
			{
				throw new Error( `${error}` );
			} );
	}

	fetchHref()
	{
		if ( this.src === undefined )
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

		if ( this.wrappedText === undefined )
			return undefined;

		const tspans = this.wrappedText.map( i => svg`<tspan x="50%" dy="1em" class="svgTspan">${i}</tspan>` );

		const output = html`
			<svg width="100%" height="100%" role="img" aria-labelledby="label">
				<title id="label">${errorText}</title>
				<rect width="100%" height="100%" fill="#cfcfcf"/>
				<text width="100%" x="50" y="50" class="web-gl-errortext" font-size="${this.fontsize}" alignment-baseline="central">
					${tspans}
				</text>
			</svg>
		`;

		return html`${output}`;
	}

	render()
	{
		return html`
			<div class="web-gl-container" id="${this.divID}" style = "width:${this.width}; max-width:${this.width}; height:${this.height}; max-height:${this.height};" >
				${this.showError() ?? this.showLoading()}
			</div>
			`;
	}
}
