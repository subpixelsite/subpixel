/* eslint-disable lit-a11y/alt-text */
/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html, LitElement } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement, state } from 'lit/decorators.js';
import install from '@twind/with-web-components';
import { WebGLElement } from 'webgl/webglelement.js';
import config from '../twind.config.js';
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
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
		* {
			--panel-height: 300px;
			--col-frame: var(--sl-color-gray-400);
			--col-bg: var(--sl-color-gray-500);
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

		/* .split-panel-divider sl-split-panel:focus-within sl-icon {
			background-color: var(--sl-color-primary-600);
			color: var(--sl-color-neutral-0);
		} */
		
		.split-panel-divider sl-icon {
			position: absolute;
			border-radius: var(--sl-border-radius-small);
			background: var(--col-frame);
			color: var(--sl-color-neutral-0);
			padding: 0.5rem 0.125rem;
		}

		.fullsize {
			width: 100%;
			margin: 0;
			padding: 0;
			display: block;
			text-align: center;
			height: var(--panel-height);
			box-sizing: border-box;
		}

		sl-tab-group::part(base) {
			background-color: var(--col-bg);
		}

		sl-tab-group {
			--indicator-color: var(--sl-color-primary-300);
			--track-color: var(--sl-color-gray-600);
			background-color: var(--col-bg);
			height: 100%;
		}
		
		sl-tab::part(base) {
			height: 30px;
			color: white;
		}

		sl-tab::part(base):active {
			color: var(--sl-color-primary-400);
		}

		sl-tab::part(base):hover {
			color: var(--sl-color-primary-300);
		}

		/* sl-tab-panel {
		} */

		sl-tab-panel::part(base) {
			background-color: var(--col-bg);
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

	webglLoadedEvent( e: Event )
	{
		const element = ( e as CustomEvent ).detail as WebGLElement;
		console.log( `${element.className} load event` );
	}

	connectedCallback(): void
	{
		super.connectedCallback();

		this.addEventListener( 'webgl-loaded', e => this.webglLoadedEvent( e ) );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();

		this.removeEventListener( 'webgl-loaded', e => this.webglLoadedEvent( e ) );
	}

	render()
	{
		return html`
<div class='split-panel-divider border-2 border-gray-400 rounded shadow'>
	<sl-split-panel class='overflow-clip' snap='50%'>
		<sl-icon slot='divider' name='grip-vertical' style='font-size:8px'></sl-icon>
		<div slot='start' class='h-[var(--panel-height)] bg-neutral-50 inline-block w-full'>		
			<web-gl class='fullsize' src='${this.src ?? ''}' width='100%' height='var(--panel-height)' padr='2' padt='1'> </web-gl>
		</div>
		<div slot='end' class='h-[var(--panel-height)] bg-neutral-50 inline-block w-full'>
			<sl-tab-group size=small>
				<sl-tab slot='nav' panel='vs'>Vertex Shader</sl-tab>
				<sl-tab slot='nav' panel='fs'>Fragment Shader</sl-tab>
				<sl-tab slot='nav' panel='tex'>Texture</sl-tab>

				<sl-tab-panel name='vs'>Vertex Shader Panel</sl-tab-panel>
				<sl-tab-panel name='fs'>Fragment Shader Panel</sl-tab-panel>
				<sl-tab-panel name='tex'>Texture Panel</sl-tab-panel>
			</sl-tab-group>
		</div>
	</sl-split-panel>
</div>
			`;
	}
}
