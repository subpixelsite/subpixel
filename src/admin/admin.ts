// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, eventOptions } from 'lit/decorators.js';
import { WebGL } from '../webgl/webgl.js';
import { AppElement } from '../appelement.js';
// import { POSTS } from './data.js';
import { convertMDtoHTML } from '../content/post_data.js';

@customElement( 'lit-admin' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AdminPage extends AppElement
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
			height: calc(100vh - 180px);
			margin: 20px calc(50% - 50vw + 20px)
		}

		.admin-container {
			display: flex;
			gap: 20px;
			flex-grow: 1;
		}

		.edit-panel {
			width: 100%;
		}

		.preview-panel {
			width: 100%;
			flex-grow: 1;
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
			width: 600px;
			height: 250px;
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
	protected convertInterval: number = 1000;

	protected firstUpdated(): void
	{
		this.loadWebGL();

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
				const webgl = WebGL.getInstance();
				webgl.onNavigateAway();

				const event = ev.target as HTMLInputElement;
				previewArea.innerHTML = convertMDtoHTML( event.value );

				this.lastConvert = now;
			}
		} );
	}

	// @eventOptions( { capture: true, passive: true } )
	// openEditor()
	// {

	// }

	async loadWebGL()
	{
		await import( '../webgl/webglelement.js' );
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
</div>
		    `;
	}
}
