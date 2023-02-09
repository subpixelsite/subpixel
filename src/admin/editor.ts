/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property, state } from 'lit/decorators.js';
import { RouterLocation } from '@vaadin/router';
import { PostTile } from '../content/post_tile.js';
import { WebGL } from '../webgl/webgl.js';
import { AppElement } from '../appelement.js';
// import { POSTS } from './data.js';
import { PostData, convertMDtoHTML } from '../content/post_data.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import { getPostData, getTagsArray } from '../content/data.js';
import { PostStyles } from '../styles.js';

@customElement( 'lit-editor' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class EditorPage extends AppElement
{
	static styles = [
		PostStyles,
		css`
		* {
			box-sizing: border-box;
			--body-edit-height: calc( 100vh - 274px );
			--input-spacing: 8px;
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
			background-color: #efefef
		}

		.edit-tools {
			display: grid;
			height: 20px;
			justify-items: flex-end;
		}

		.admin-container {
			display: flex;
			flex-direction: column;
			gap: 20px;
			flex: 1 1 1px;
		}

		.edit-container {
			display: flex;
			flex: 1 1 1px;
			max-height: 100%;
		}

		.edit-body {
			display: flex;
			gap: 20px;
			flex: 1 1 1px;
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
			background-color: white;
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

		.info-details::part(base) {
			background-color: #dfdfdf;
			outline: 1px solid black;
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

		.edit-input {
			--label-width: 100px;
			--gap-width: 0.5rem;
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

	@state()
	postId: number = -1;

	@property( { type: Object } )
	post: PostData;

	@property( { type: Array } )
	posts?: PostData[];

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

		this.posts = getPostData();

		const id = location.params.id as string;
		this.postId = parseInt( id, 10 );

		if ( this.posts )
		{
			this.post = this.posts.find( p =>
			{
				if ( p.id === this.postId )
					return p;

				return null;
			} ) ?? new PostData();
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

		const visual = PostTile.getPostVisual( this.post );

		return html`
<div class="top">
	<div class="admin-container">
		<sl-details summary="Post Info" class="info-details">
			<div class="info-panel">
				<div class="input-panel-left">
					<sl-input class="edit-input" size=small label="ID" pill disabled readonly id="edit-id" .value=${this.post!.id.toString()}></sl-input>
					<sl-input class="edit-input" size=small label="Title" pill id="edit-title" .value=${this.post!.title}></sl-input>
					<sl-input class="edit-input" size=small label="Tags" pill id="edit-tags" .value=${getTagsArray( this.post!.tags ).join( ', ' )}></sl-input>
					<sl-input class="edit-input" size=small label="Created" pill disabled readonly id="edit-created" .value=${new Date( this.post!.dateCreated ).toString()}></sl-input>
					<sl-input class="edit-input" size=small label="Modified" pill disabled readonly id="edit-modified" .value=${new Date( this.post!.dateModified ).toString()}></sl-input>
					<sl-input class="edit-input" size=small label="Author" pill id="edit-author" .value=${this.post!.author}></sl-input>
					<sl-textarea class="edit-description" size=small label="Description" id="edit-description" autocomplete='off' autocorrect='on' spellcheck='true' inputmode='text' resize='none' .value=${this.post!.description}></sl-textarea>
				</div>
				<div class="input-panel-right">
					<div class="header-img">
						<div class="post-visual">
							${visual}
						</div>
					</div>
					<sl-input class="edit-input" size=small label="Header Alt" pill id="edit-hdr-alt" .value=${this.post!.hdrAlt}></sl-input>
					<sl-input class="edit-input" size=small label="Header HREF" pill id="edit-hdr-href" .value=${this.post!.hdrHref}></sl-input>
					<sl-textarea class="edit-input" size=small label="Header Inline" id="edit-hdr-inline" autocomplete='off' autocorrect='on' spellcheck='true' inputmode='text' resize='none' .value=${this.post!.hdrInline}></sl-textarea>
				</div>
			</div>
		</sl-details>
		<div class="edit-tools">
			<sl-switch id="load-webgl" ?checked=${this.loadWebGL}>Load WebGL Elements</sl-switch>
		</div>
		<div class="edit-container">
			<div class="edit-body">
				<div class="edit-panel">
					<textArea id="editPostTextBox"> </textArea>
				</div>
				<div class="preview-panel">
					<div id="previewPostBox"> </div>
				</div>
			</div>
		</div>
	</div>
</div>
		    `;
	}
}
