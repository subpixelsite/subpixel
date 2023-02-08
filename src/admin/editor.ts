// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property, state } from 'lit/decorators.js';
import { RouterLocation } from '@vaadin/router';
import { WebGL } from '../webgl/webgl.js';
import { AppElement } from '../appelement.js';
// import { POSTS } from './data.js';
import { PostData, convertMDtoHTML } from '../content/post_data.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import { POSTS } from '../content/data.js';

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
			overflow: none;
		}

		.edit-tools {
			height: 40px;
			margin-top: 10px;
		}

		.admin-container {
			display: flex;
			gap: 20px;
			flex-grow: 1;
			max-height: calc( 100% - 50px );
		}

		.edit-panel {
			display: flex;
			flex-grow: 1;
			max-height: 100%;
		}

		.preview-panel {
			display: flex;
			max-width: 1140px;
			flex-grow: 2;
			max-height: 100%;
			border: 1px solid #000000;
		}

		#editPostTextBox {
			width: 100%;
			max-height: 100vh - 160px;
			font-size: 13px;
			background-color: #efefef;
			resize: none;
			overflow-y: scroll;
		}

		#previewPostBox {
			max-width: 100%;
			max-height: 100vh - 160px;
			font-size: 15px;
			overflow-y: scroll;
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
			margin: 10px;
		}

		.svgembed {
			float: right;
			align-self: end;
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

	@state()
	postId: number = -1;

	@property( { type: Object } )
	post?: PostData;

	@property( { type: Array } )
	posts?: PostData[];

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

	public onBeforeEnter( location: RouterLocation )
	{
		super.onBeforeEnter( location );

		this.posts = POSTS;

		const id = location.params.id as string;
		this.postId = parseInt( id, 10 );

		if ( this.posts )
		{
			this.post = this.posts.find( p =>
			{
				if ( p.id === this.postId )
					return p;

				return null;
			} );
		}
	}

	setLoadEnabled( event: Event )
	{
		const webgl = WebGL.getInstance();
		webgl.setLoadEnabled( this.loadWebGL );

		const target = event.target as HTMLInputElement;
		this.loadWebGL = target.checked;
		webgl.setLoadEnabled( this.loadWebGL );
	}

	private scrollPanel = -1;
	private scrollTimer?: ReturnType<typeof setTimeout>;

	protected resetScrollTimer()
	{
		if ( this.scrollTimer != null )
			clearTimeout( this.scrollTimer );

		this.scrollTimer = setTimeout( () =>
		{
			this.scrollPanel = -1;
		}, 20 );
	}

	scrollPreview()
	{
		const textArea = this.shadowRoot!.getElementById( 'editPostTextBox' ) as HTMLInputElement | null;
		if ( textArea === null )
			throw new Error( 'Couldn\'t find text area DOM element' );

		const previewArea = this.shadowRoot!.getElementById( 'previewPostBox' ) as HTMLDivElement | null;
		if ( previewArea === null )
			throw new Error( 'Couldn\'t find preview area DOM element' );

		if ( this.scrollPanel === -1 )
		{
			this.scrollPanel = 0;
			const scrollScale = textArea.scrollTop / ( textArea.scrollHeight - textArea.clientHeight );
			previewArea.scrollTop = ( previewArea.scrollHeight - previewArea.clientHeight ) * scrollScale;
			this.resetScrollTimer();
		}
	}

	scrollTextArea()
	{
		const previewArea = this.shadowRoot!.getElementById( 'previewPostBox' ) as HTMLDivElement | null;
		if ( previewArea === null )
			throw new Error( 'Couldn\'t find preview area DOM element' );

		const textArea = this.shadowRoot!.getElementById( 'editPostTextBox' ) as HTMLInputElement | null;
		if ( textArea === null )
			throw new Error( 'Couldn\'t find text area DOM element' );

		if ( this.scrollPanel === -1 )
		{
			this.scrollPanel = 1;
			const scrollScale = previewArea.scrollTop / ( previewArea.scrollHeight - previewArea.clientHeight );
			textArea.scrollTop = ( textArea.scrollHeight - textArea.clientHeight ) * scrollScale;
			this.resetScrollTimer();
		}
	}

	protected firstUpdated(): void
	{
		const webgl = WebGL.getInstance();
		webgl.setLoadEnabled( this.loadWebGL );

		// Listen to checkbox
		const webGLCheckbox = this.shadowRoot!.getElementById( 'load-webgl' );
		webGLCheckbox?.addEventListener( 'sl-change', this.setLoadEnabled );

		// Listen for (and debounce) HTML update on MD input
		const textArea = this.shadowRoot!.getElementById( 'editPostTextBox' ) as HTMLInputElement | null;
		if ( textArea === null )
			throw new Error( 'Couldn\'t find text area DOM element' );

		const previewArea = this.shadowRoot!.getElementById( 'previewPostBox' );
		if ( previewArea === null )
			throw new Error( 'Couldn\'t find preview area DOM element' );

		textArea.textContent = '';
		if ( this.post !== undefined )
		{
			textArea.value = this.post.body;
			this.doConversion();
		}

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

		// Try to make scrolling match by document %
		textArea.addEventListener( 'scroll', () => this.scrollPreview() );
		previewArea.addEventListener( 'scroll', () => this.scrollTextArea() );
	}

	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'editor',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		return html`
<div class="top">
	<div class="admin-container">
		<div class="edit-panel">
			<textArea id="editPostTextBox"> </textArea>
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

	public onBeforeLeave()
	{
		const webGLCheckbox = this.shadowRoot!.getElementById( 'load-webgl' );
		webGLCheckbox?.removeEventListener( 'sl-change', this.setLoadEnabled );

		const textArea = this.shadowRoot!.getElementById( 'editPostTextBox' ) as HTMLInputElement | null;
		if ( textArea !== null )
			textArea.removeEventListener( 'scroll', () => this.scrollPreview() );

		const previewArea = this.shadowRoot!.getElementById( 'previewPostBox' );
		if ( previewArea !== null )
			previewArea.addEventListener( 'scroll', () => this.scrollTextArea() );
	}
}
