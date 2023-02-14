/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property, state } from 'lit/decorators.js';
import { RouterLocation } from '@vaadin/router';
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { PostTile } from '../content/post_tile.js';
import { WebGL } from '../webgl/webgl.js';
import { AppElement } from '../appelement.js';
import { PostData, convertMDtoHTML } from '../content/post_data.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import { Database } from '../content/data.js';
import { Colors, PostStyles } from '../styles.js';

@customElement( 'lit-editor' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class EditorPage extends AppElement
{
	static styles = [
		Colors,
		PostStyles,
		css`
		* {
			box-sizing: border-box;
			--body-edit-height: calc( 100vh - 234px );
			--input-spacing: 8px;
			--label-width: 100px;
			--gap-width: 0.5rem;
		}

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
			height: 100%;
			padding: 20px;
			overflow: none;
			background-color: white;
		}

		.info-container {
			display: grid;
			grid-template: 1fr / 1fr auto auto;
			height: auto;
		}

		.info-details::part(base) {
			grid-column: 1 / 2;
			background-color: #dfdfdf;
			outline: 1px solid black;
		}

		#load-webgl {
			grid-column: 2 / 3;
			margin: 10px;
			justify-self: center;
			align-self: center;
		}

		.btn-commit {
			grid-column: 3 / 4;
			width: 100px;
			justify-self: center;
			align-self: center;
		}

		.admin-container {
			display: flex;
			flex-direction: column;
			gap: 20px;
			flex: 1 1 1px;
		}

		.body-container {
			display: flex;
			flex: 1 1 1px;
			gap: 20px;
			max-height: 100%;
		}

		.edit-panel {
			display: flex;
			flex: 1 1 1px;
			max-height: 100%;

			flex-direction: column;
			overflow: hidden;
			height: 100%;
		}

		.preview-panel {
			display: flex;
			max-width: 1140px;
			flex: 2 1 1px;
			max-height: 100%;
			border: 1px solid #000000;

			flex-direction: column;
			overflow: hidden;

			height: 100%;
		}

		#editPostTextBox {
			width: 100%;
			font-size: 13px;
			background-color: #ebeae5;
			resize: none;

			height: var(--body-edit-height);
			overflow-y: auto;
			padding: 1rem;
		}

		#previewPostBox {
			max-width: 100%;
			max-height: 100vh - 160px;
			font-size: 15px;
			width: 100%;
			background-color: var(--col-bg-light);
			padding: 5px;
			
			overflow-y: auto;
			height: var(--body-edit-height);
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

		.info-panel {
			display: grid;
			/* grid-template: rowpx row% rowfr / column% columnpx columnfr */
			grid-template: 1fr / 1fr 1fr;
			gap: 0px 10px;
			overflow: none;
		}
		
		.input-panel-left {
			display: grid;
			grid-column: 1 / 2;
			width: 100%;
			padding: 2px;
		}

		.input-panel-right {
			display: grid;
			grid-column: 2 / 3;
			width: 100%;
			padding: 2px;
		}

		.edit-inputs {
			width: 100%;
		}

		.edit-input + .edit-input {
			margin-top: var(--input-spacing);
		}

		.edit-input + sl-textarea.edit-input {
			margin-top: var(--input-spacing);
		}
	
		.edit-input::part(form-control) {
			display: grid;
			grid: auto / var(--label-width) 1fr;
			gap: var(--sl-spacing-3x-small) var(--gap-width);
			align-items: center;
		}

		.edit-input::part(form-control-label) {
			text-align: right;
		}

		.edit-width::part(form-control-help-text) {
			grid-column: span 2;
			padding-left: calc(var(--label-width) + var(--gap-width));
		}

		.edit-description {
			margin-top: 1em;
		}

		.header-img {
			display: block;
			justify-self: center;
			outline: 1px solid black;
			padding: var(--vis-padding);
			margin: 10px;
			margin-left: calc( 10px + var(--label-width) + var(--gap-width));
			width: var(--vis-padded-width);
			max-width: var(--vis-padded-width);
			height: var(--vis-padded-height);
			max-height: var(--vis-padded-height);
		}

		.post-visual {
			justify-self: center;
			height: var(--vis-height);
			width: var(--vis-width);
			max-height: var(--vis-height);
			max-width: var(--vis-width);
			background-color: var(--vis-bg-color);
		}
	`];

	@property( { type: Object } )
	post: PostData;

	protected lastConvert: number = 0;
	protected convertInterval: number = 500;
	protected loadWebGL: boolean = false;

	constructor()
	{
		super();

		this.post = new PostData();
	}

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

		const db = Database.getDB();

		this.post = new PostData();
		this.post.id = location.params.id as string;

		const dbPost = db.getPostData( this.post.id );
		if ( dbPost !== undefined )
			this.post = { ...dbPost };
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

		const webgl = WebGL.getInstance();
		webgl.requestNewRender();
	}

	connectedCallback(): void
	{
		super.connectedCallback();

		// Listeners are added after first update so that DOM objects to listen on exist
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();

		const webGLCheckbox = this.shadowRoot!.getElementById( 'load-webgl' );
		webGLCheckbox?.removeEventListener( 'sl-change', this.setLoadEnabled );

		const textArea = this.shadowRoot!.getElementById( 'editPostTextBox' ) as HTMLInputElement | null;
		if ( textArea !== null )
			textArea.removeEventListener( 'scroll', () => this.scrollPreview() );

		const previewArea = this.shadowRoot!.getElementById( 'previewPostBox' );
		if ( previewArea !== null )
			previewArea.removeEventListener( 'scroll', () => this.scrollTextArea() );
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
		textArea.addEventListener( 'scroll', () => this.scrollPreview(), { capture: false, passive: true } );
		previewArea.addEventListener( 'scroll', () => this.scrollTextArea(), { capture: false, passive: true } );
	}

	private handleCommit()
	{
		const form = this.shadowRoot!.querySelector( '.post-form' ) as HTMLFormElement | null;
		if ( form === null )
			throw new Error( 'Couldn\'t find form' );
		const data = serialize( form );

		// manually copy the data into the post
		this.post.id = data.id as string;
		this.post.title = data.title as string;
		this.post.author = data.author as string;
		// this.post.dateCreated doesn't change
		this.post.dateModified = Date.now();
		this.post.tags = data.tags as string;
		this.post.hdrInline = data.hdrInline as string;
		this.post.hdrHref = data.hdrHref as string;
		this.post.hdrAlt = data.hdrAlt as string;
		this.post.description = data.description as string;
		this.post.body = data.body as string;

		// save the post
		const db = Database.getDB();
		db.setPostData( this.post.id, this.post );

		this.requestUpdate();
	}

	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'editor',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		const visual = PostTile.getPostVisual( this.post );

		return html`
<div class="top">
	<form class="post-form">
		<div class="admin-container">
			<div class="info-container">
				<sl-details summary="Post Data" class="info-details">
					<div class="info-panel">
						<div class="input-panel-left">
							<sl-input class="edit-input" size=small label="ID" pill readonly name="id" .value=${this.post!.id}></sl-input>
							<sl-input class="edit-input" size=small label="Title" pill name="title" .value=${this.post!.title}></sl-input>
							<sl-input class="edit-input" size=small label="Tags" pill name="tags" .value=${this.post!.tags}></sl-input>
							<sl-input class="edit-input" size=small label="Created" pill disabled readonly name="dateCreated" .value=${new Date( this.post!.dateCreated ).toString()}></sl-input>
							<sl-input class="edit-input" size=small label="Modified" pill disabled readonly name="dateModified" .value=${new Date( this.post!.dateModified ).toString()}></sl-input>
							<sl-input class="edit-input" size=small label="Author" pill name="author" .value=${this.post!.author}></sl-input>
							<sl-textarea class="edit-input" size=small label="Description" name="description" autocomplete='off' autocorrect='on' spellcheck='true' inputmode='text' resize='none' .value=${this.post!.description}></sl-textarea>
						</div>
						<div class="input-panel-right">
							<div class="header-img">
								<div class="post-visual">
									${visual}
								</div>
							</div>
							<sl-input class="edit-input" size=small label="Header Alt" pill name="hdrAlt" .value=${this.post!.hdrAlt}></sl-input>
							<sl-input class="edit-input" size=small label="Header HREF" pill name="hdrHref" .value=${this.post!.hdrHref}></sl-input>
							<sl-textarea class="edit-input" size=small label="Header Inline" name="hdrInline" autocomplete='off' autocorrect='on' spellcheck='true' inputmode='text' resize='none' .value=${this.post!.hdrInline}></sl-textarea>
						</div>
					</div>
				</sl-details>
				<sl-switch id="load-webgl" ?checked=${this.loadWebGL}>Load WebGL Elements</sl-switch>
				<sl-button variant="success" pill class="btn-commit" @click="${this.handleCommit}">Save</sl-button>
			</div>
			<div class="body-container">
				<div class="edit-panel">
					<textArea id="editPostTextBox" name="body"> </textArea>
				</div>
				<div class="preview-panel">
					<div id="previewPostBox"> </div>
				</div>
			</div>
		</div>
	</form>
</div>
		    `;
	}
}
