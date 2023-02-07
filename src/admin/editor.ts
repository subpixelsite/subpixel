// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement } from 'lit/decorators.js';
import { WebGL } from '../webgl/webgl.js';
import { AppElement } from '../appelement.js';
// import { POSTS } from './data.js';
import { convertMDtoHTML } from '../content/post_data.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';

@customElement( 'lit-editor' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class EditorPage extends AppElement
{
	static styles = css`
		html,
		body {
			display: flex;
			padding: 20px;
		}

		.buttons-container {
			margin: 20px;
		}

		.edit-button > sl-button::part(label) {
			font-weight: var(--sl-font-weight-semibold);
			font-size: var(--sl-font-size-large);
			margin: 0 20px;
		}

		.edit-button > sl-button::part(base) {
			border-radius: var(--sl-border-radius-large);
			border-width: 2px;
			align-items: center;
			box-shadow: var(--sl-shadow-medium);
			transition: var(--sl-transition-medium) transform ease, var(--sl-transition-medium) border ease;

		}

		.edit-button > sl-button::part(base):hover {
			transform: scale(1.07);
		}
		
		.edit-button > sl-button::part(base)::active {
			transform: scale(1.07);
		}
		
		.edit-button > sl-button::part(base):focus-visible {
			outline: dashed 2px var(--sl-color-primary-500);
			outline-offset: 2px;
		}

		
		.top {
			display:flex;
			flex-direction:column;
			height: calc(100vh - 160px);
			padding: 20px;
		}

		.edit-tools {
			height: 40px;
			margin-top: 10px;
		}

		.admin-container {
			display: flex;
			gap: 20px;
			flex-grow: 1;
		}

		.edit-panel {
			display: flex;
			flex-grow: 1;
		}

		.preview-panel {
			display: flex;
			max-width: 1140px;
			flex-grow: 2;
			background-color: #efefef;
		}

		#editPostTextBox {
			width: 100%;
			height: 100%;
			font-size: 13px;
		}

		#previewPostBox {
			width: 100%;
			height: 100%;
			font-size: 15px;
		}

		.float-left {
			float: left;
			align-self: start;
		}

		.float-right {
			float: right;
			align-self: end;
		}

		.webglembed {
			float: right;
			align-self: end;
			width: 40%;
			aspect-ratio: 1.777;
			max-width: 50%;
			margin: 10px;
		}

		.clearfix:after {
			content: '';
			visibility: hidden;
			height: 0;
			display: block;
			clear: both;
		}
`;

	protected lastConvert: number = 0;
	protected convertInterval: number = 500;
	protected loadWebGL: boolean = false;

	protected doConversion(): void
	{
		const textArea = this.shadowRoot!.getElementById( 'editPostTextBox' ) as HTMLInputElement | null;
		if ( textArea === null )
			throw new Error( 'Couldn\'t find text area DOM element' );

		const previewArea = this.shadowRoot!.getElementById( 'previewPostBox' );
		if ( previewArea === null )
			throw new Error( 'Couldn\'t find preview area DOM element' );

		// Reset WebGL
		const webgl = WebGL.getInstance();
		webgl.onNavigateAway();

		previewArea.innerHTML = convertMDtoHTML( textArea.value );

		this.lastConvert = Date.now();
	}

	protected firstUpdated(): void
	{
		const webgl = WebGL.getInstance();
		webgl.setLoadEnabled( this.loadWebGL );

		// Listen to checkbox
		const webGLCheckbox = this.shadowRoot!.getElementById( 'load-webgl' );
		webGLCheckbox?.addEventListener( 'sl-change', event =>
		{
			const target = event.target as HTMLInputElement;
			this.loadWebGL = target.checked;
			webgl.setLoadEnabled( this.loadWebGL );
		} );

		// Listen for (and debounce) HTML update on MD input
		const textArea = this.shadowRoot!.getElementById( 'editPostTextBox' );
		if ( textArea === null )
			throw new Error( 'Couldn\'t find text area DOM element' );

		const previewArea = this.shadowRoot!.getElementById( 'previewPostBox' );
		if ( previewArea === null )
			throw new Error( 'Couldn\'t find preview area DOM element' );

		textArea.textContent = '';

		textArea.oninput = ( ev =>
		{
			const now = Date.now();
			if ( now - this.lastConvert > this.convertInterval )
			{
				// Reset WebGL
				webgl.onNavigateAway();

				const event = ev.target as HTMLInputElement;
				previewArea.innerHTML = convertMDtoHTML( event.value );

				this.lastConvert = now;
			}

			// queue a cleanup conversion after the last change
			setTimeout( () => { this.doConversion(); }, this.convertInterval );
		} );
	}

	render()
	{
		return html`
<div class="top">
	<div class="admin-container">
		<div class="edit-panel">
			<textarea id="editPostTextBox"> </textarea>
		</div>
		<div class="preview-panel">
			<div id="previewPostBox"> </div>
		</div>
	</div>
	<div class="edit-tools">
		<sl-checkbox id="load-webgl" ?checked=${this.loadWebGL}>Load WebGL Elements</sl-checkbox>
	</div>
</div>
		    `;
	}
}
