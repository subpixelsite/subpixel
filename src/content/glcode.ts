/* eslint-disable lit-a11y/alt-text */
/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html, LitElement, PropertyValueMap } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement, state } from 'lit/decorators.js';
import install from '@twind/with-web-components';
import { WebGLElement } from 'webgl/webglelement.js';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-glsl.min';
import 'prismjs/themes/prism-okaidia.min.css';
import './gldata.js';
import config from '../twind.config.js';
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import { Colors, PostStyles } from '../styles.js';

const withTwind = install( config );

@customElement( 'gl-code' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class GLCode extends withTwind( LitElement )
{
	static styles = [
		Colors,
		PostStyles,
		css`
		.token.keyword {
			color: #66d9ef;
		}

		.token.keyword.keyword-attribute {
			color: #add4ff;
		}

		.token.keyword.keyword-varying {
			color: #73ff73;
		}

		.token.keyword.keyword-precision {
			color: #d8d8d8;
		}

		.token.keyword.keyword-uniform {
			color: #eba6e8;
		}

		.token.function {
			color: #ff7467;
		}

		.token.operator {
			color: #fff27f;
		}

		.token.punctuation {
			color: #999;
		}

		* {
			--h-panel-bar-raw: 30px;
			--h-panel-bar: calc( 30px + ( 2px * 2 ) );
			--h-panel-body: 400px;
			--h-panel: calc( var(--h-panel-body) + var(--h-panel-bar) );
			--w-panel-min: 42%;
			--w-panel-max: 73%;
			--col-frame: var(--sl-color-gray-400);
			--col-bg: var(--sl-color-gray-500);
			--col-code-bg: var(--sl-color-gray-700);
		}

		.split-panel-divider sl-split-panel {
			--divider-width: 2px;
		}
		
		.split-panel-divider sl-split-panel::part(divider) {
			background-color: var(--col-frame);
		}
		
		.split-panel-divider sl-split-panel::part(divider)::focus-visible {
			background-color: var(--sl-color-primary-600);
		}
		
		.split-panel-divider > sl-split-panel > sl-icon {
			position: absolute;
			border-radius: var(--sl-border-radius-small);
			background: var(--col-frame);
			color: var(--sl-color-neutral-0);
			padding: 0.4rem 0.05rem;
		}

		.split-panel-divider > sl-split-panel > sl-icon:hover {
			background: var(--sl-color-primary-300);
		}

		.split-panel-divider > sl-split-panel > sl-icon:active {
			background: var(--sl-color-primary-300);
		}

		.fullsize {
			width: 100%;
			margin: 0;
			padding: 0;
			display: block;
			text-align: center;
			height: 100%;
			box-sizing: border-box;
		}

		sl-tab-group::part(nav) {
			background-color: var(--col-bg);
		}

		sl-tab-group::part(base) {
			background-color: var(--col-code-bg);
		}

		sl-tab-group {
			--indicator-color: var(--sl-color-primary-300);
			--track-color: var(--sl-color-gray-600);
		}
		
		sl-tab::part(base) {
			height: var(--h-panel-bar-raw);
			color: white;
			padding-left: 10px;
			padding-right: 10px;
		}

		sl-tab::part(base):active {
			color: var(--sl-color-primary-400);
		}

		sl-tab::part(base):hover {
			color: var(--sl-color-primary-300);
		}

		sl-tab-panel code {
			font-family: 'Fira Code';
			font-size: 12px;
			line-height: 12px;
			color: white;
		}

		sl-tab-panel::part(base) {
			padding-top: 0px;
			padding-bottom: 0px;
		}

		.selectobject {
			margin-left: -0.25rem;
			margin-right: -0.25rem;
			vertical-align: middle;
		}

		.selectbutton {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
			color: white;
		}

		.selectbutton:hover {
			color: var(--sl-color-primary-300);
		}

		.scrollbox {
			height: var(--h-panel-body);
			overflow-x: auto;
			padding-left: 8px;
			min-width: 10px;
		}

		.codebox {
			box-sizing: border-box;
			overflow-x: visible;
			overflow-y: visible;
			padding-left: 0px;
			padding-right: 0px;
			min-width: 10px;
		}
		`
	];

	@property( { type: String } )
	src?: string;

	@state()
	vs: string = '';

	@state()
	fs: string = '';

	@state()
	tex: string = '';

	@state()
	fps: number = 0;

	@state()
	ms: number = 0;

	@state()
	fpsVisible: boolean = false;

	private wglElement?: WebGLElement;

	webglLoadedEvent( e: Event )
	{
		const element = ( e as CustomEvent ).detail as WebGLElement;
		this.wglElement = element;
		this.selectChange( 0 );

		this.fpsVisible = this.wglElement?.getAnimated() ?? false;
	}

	selectChange( d: number )
	{
		this.wglElement?.changeObjectSelection( d );

		const vsRaw = ( this.wglElement?.getSelectedVS() ?? '' ).trimStart().trimEnd();
		if ( Prism !== undefined && Prism.highlight !== undefined )
			this.vs = Prism.highlight( vsRaw, Prism.languages.glsl, 'glsl' );

		const fsRaw = ( this.wglElement?.getSelectedFS() ?? '' ).trimStart().trimEnd();
		if ( Prism !== undefined && Prism.highlight !== undefined )
			this.fs = Prism.highlight( fsRaw, Prism.languages.glsl, 'glsl' );

		this.tex = this.wglElement?.getSelectedTex() ?? '';
	}

	resetView()
	{
		this.wglElement?.resetView();
	}

	updateFPS( e: Event )
	{
		const event = e as CustomEvent;
		this.ms = event.detail;
		this.fps = 1000 / this.ms;
	}

	connectedCallback(): void
	{
		super.connectedCallback();

		this.addEventListener( 'webgl-loaded', e => this.webglLoadedEvent( e ) );
		this.addEventListener( 'fps-update', e => this.updateFPS( e ) );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();

		this.removeEventListener( 'webgl-loaded', e => this.webglLoadedEvent( e ) );
		this.removeEventListener( 'fps-update', e => this.updateFPS( e ) );
	}

	render()
	{
		const fps = this.fpsVisible ? this.fps.toFixed( 2 ) : '--.--';
		const ms = this.fpsVisible ? this.ms.toFixed( 2 ) : '--.--';

		return html`
<div class='split-panel-divider border-2 border-gray-400 rounded shadow'>
	<sl-split-panel class='overflow-clip' snap='50%' style='--min: var(--w-panel-min); --max: var(--w-panel-max);' primary='end' position=42>
		<sl-icon slot='divider' name='grip-vertical' style='font-size:8px'></sl-icon>
		<div slot='start' class='w-full flex flex-col bg-neutral-50'>
				<web-gl id="${this.id}" class='fullsize grow' src='${this.src ?? ''}' width='100%' height='var(--h-panel)' padr='2' padt='1'> </web-gl>
				<div class='w-full h-min flex flex-row px-1 gap-3 bg-gray-500 text-white text-xs justify-between'>
					<div class='font-mono text-[0.65rem]'>${fps} fps</div>
					<div class='font-mono text-[0.65rem]'>${ms} ms</div>
					<div class='glstatus prevent-select m-auto inline-block'>
						<div class='inline-block'>
							<span class='font-bold mr-1'>Select Object: </span>
							<div class='inline-block ml-1'>
								<sl-tooltip content="Prev Object">
									<sl-icon class='selectbutton selectobject' name="caret-left-fill" @click='${() => this.selectChange( -1 )}'></sl-icon>
								</sl-tooltip>
								<sl-icon style='color:var(--sl-color-gray-300)' class='selectobject' name="dot"></sl-icon>
								<sl-tooltip content="Next Object">
									<sl-icon class='selectbutton selectobject' name="caret-right-fill" @click='${() => this.selectChange( 1 )}'></sl-icon>
								</sl-tooltip>
							</div>
						</div>
					</div>
					<div>
						<sl-tooltip content="Reset camera">
							<sl-icon class='text-white align-middle' name='arrow-counterclockwise' @click='${() => this.resetView()}'></sl-icon>
						</sl-tooltip>
					</div>
				</div>
		</div>
		<div slot='end' class='h-[var(--h-panel)] inline-block w-full'>
			<gl-data vs=${this.vs} fs=${this.fs} tex=${this.tex}></gl-data>
		</div>
	</sl-split-panel>
</div>
			`;
	}
}
