// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, eventOptions } from 'lit/decorators.js';
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
			background-color: #cfcfcf;
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
`;

	protected firstUpdated(): void
	{

	}

	@eventOptions( { capture: true, passive: true } )
	openEditor()
	{
		// eslint-disable-next-line max-len
		const editor = window.open( 'about:blank', 'Editor', 'scrollbars=no,resizeable=yes,status=no,location=no,toolbar=no,menubar=no,width=1280,height=720,top=200,left=200' );
		if ( editor === null )
			throw new Error( 'Failed to open new Editor popup window' );

		const contents = `
			<html>
			<head>
				<style>
					html,
					body {
						padding: 0px;
						margin: 0px;
						background-color: #cfcfcf;
						min-height: 100vh;
						font-family: sans-serif;
					}

					.navContent {
						max-width: 1140;
					}

					.top {
						display:flex;
						flex-direction:column;
						height: 95%;
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
				</style>
				<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js"></script>
			</head>
			<body>
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
			</body>
			</html>
		`;

		editor.document.write( contents );

		const textArea = editor.document.getElementById( 'editPostTextBox' );
		if ( textArea === null )
			throw new Error( 'Couldn\'t find text area DOM element' );

		const previewArea = editor.document.getElementById( 'previewPostBox' );
		if ( previewArea === null )
			throw new Error( 'Couldn\'t find preview area DOM element' );

		textArea.textContent = '';

		textArea.oninput = ( ev =>
		{
			const event = ev.target as HTMLInputElement;
			previewArea.innerHTML = convertMDtoHTML( event.value );
		} );
	}

	render()
	{
		// const event = new CustomEvent( 'pageNav', {
		// 	detail: 'posts',
		// 	bubbles: true,
		// 	composed: true
		// } );
		// this.dispatchEvent( event );

		return html`
			<sl-button class='edit-button' name="Editor" @click=${this.openEditor}>Editor</sl-button>
		    `;
	}
}
