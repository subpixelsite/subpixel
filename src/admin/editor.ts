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
import { PostData, convertMDtoHTML, PostStatus, initPostData } from '../content/post_data.js';
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
			--body-edit-height: calc( 100vh - 200px );
			--w-post: 960px;
			--input-spacing: 8px;
			--label-width: 100px;
			--gap-width: 0.5rem;
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

		.info-container {
			grid-template: 1fr / 1fr auto auto;
		}

		.info-details::part(base) {
			grid-column: 1 / 2;
			background-color: #dfdfdf;
			outline: 1px solid black;
		}

		.edit-panel {
			flex: 1 1 1px;
		}

		.preview-panel {
			flex: 2 1 1px;
		}

		.float-left {
			float: left;
			align-self: start;
		}

		.float-right {
			float: right;
			align-self: end;
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
			grid-template: 1fr / 1fr 1fr;
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

		.header-img {
			padding: var(--vis-padding);
			margin-left: calc( 10px + var(--label-width) + var(--gap-width));
			width: var(--vis-padded-width);
			max-width: var(--vis-padded-width);
			height: var(--vis-padded-height);
			max-height: var(--vis-padded-height);
		}

		.post-visual {
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
	protected fadeWebGL: boolean = false;
	protected visible: boolean = false;

	constructor()
	{
		super();

		initPostData();

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

		previewArea.innerHTML = convertMDtoHTML( textArea.value );

		this.lastConvert = Date.now();
	}

	public onBeforeEnter( location: RouterLocation )
	{
		super.onBeforeEnter( location );

		const db = Database.getDB();

		this.post = new PostData();
		this.post.name = location.params.name as string;

		const dbPost = db.getPostData( this.post.name );
		if ( dbPost !== undefined )
			this.post = { ...dbPost };

		this.visible = this.post?.status === PostStatus.Visible;
	}

	setVisible( event: Event )
	{
		const target = event.target as HTMLInputElement;
		this.visible = target.checked;
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

		const visibleCheckbox = this.shadowRoot!.getElementById( 'visible' );
		visibleCheckbox?.removeEventListener( 'sl-change', e => this.setVisible( e ) );

		const textArea = this.shadowRoot!.getElementById( 'editPostTextBox' ) as HTMLInputElement | null;
		if ( textArea !== null )
			textArea.removeEventListener( 'scroll', () => this.scrollPreview() );

		const previewArea = this.shadowRoot!.getElementById( 'previewPostBox' );
		if ( previewArea !== null )
			previewArea.removeEventListener( 'scroll', () => this.scrollTextArea() );

		WebGL.setScrollListener( undefined );
		WebGL.setDetailsListener( undefined );
	}

	protected firstUpdated(): void
	{
		const webgl = WebGL.getInstance();
		webgl.setFadeEnabled( this.fadeWebGL );

		const visibleCheckbox = this.shadowRoot!.getElementById( 'visible' );
		visibleCheckbox?.addEventListener( 'sl-change', e => this.setVisible( e ) );

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
			textArea.value = this.post.markdown;
			this.doConversion();
		}

		textArea.oninput = ( ev =>
		{
			const now = Date.now();
			if ( now - this.lastConvert > this.convertInterval )
			{
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
		WebGL.setScrollListener( previewArea );

		const details = this.shadowRoot!.getElementById( 'post-data' );
		if ( details === null )
			throw new Error( 'Couldn\'t find post details DOM element' );
		WebGL.setDetailsListener( details );
	}

	private handleCommit()
	{
		const form = this.shadowRoot!.querySelector( '.post-form' ) as HTMLFormElement | null;
		if ( form === null )
			throw new Error( 'Couldn\'t find form' );
		const data = serialize( form );

		const previewArea = this.shadowRoot!.getElementById( 'previewPostBox' );
		if ( previewArea === null )
			throw new Error( 'Couldn\'t find preview area DOM element' );
		const content = previewArea.innerHTML;

		const justPosted = this.post.status === PostStatus.Hidden && this.visible && this.post.datePosted === 0;

		// manually copy the data into the post
		this.post.name = data.name as string;
		this.post.status = this.visible ? PostStatus.Visible : PostStatus.Hidden;
		this.post.title = data.title as string;
		this.post.author = data.author as string;
		// this.post.dateCreated doesn't change
		this.post.datePosted = justPosted ? Date.now() : 0;
		this.post.dateModified = Date.now();
		this.post.tags = data.tags as string;
		this.post.hdrInline = data.hdrInline as string;
		this.post.hdrHref = data.hdrHref as string;
		this.post.hdrAlt = data.hdrAlt as string;
		this.post.description = data.description as string;
		this.post.markdown = data.markdown as string;
		this.post.content = content as string;

		// Until we have a functioning DB, dump the new post to the console.
		// eslint-disable-next-line no-console
		console.log( `
			'${this.post.name}',
			{
				name: '${this.post.name}',
				status: ${this.post.status},
				title: '${this.post.title}',
				author: '${this.post.author}',
				dateCreated: ${this.post.dateCreated},
				datePosted: ${this.post.datePosted},
				dateModified: ${this.post.dateModified},
				tags: '${this.post.tags}',
				hdrInline: '${this.post.hdrInline}',
				hdrHref: '${this.post.hdrHref}',
				hdrAlt: '${this.post.hdrAlt}',
				description: \`${this.post.description}\`,
				markdown: \`${this.post.markdown}\`,
				content: \`${this.post.content}\`
			}
		` );

		// save the post
		const db = Database.getDB();
		db.setPostData( this.post.name, this.post );

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
<div class="flex flex-col h-full p-5 overflow-hidden bg-white">
	<form class="post-form">
		<div class="flex flex-col gap-5 flex-auto">
			<div class="info-container grid h-auto">
				<sl-details id="post-data" summary="Post Data" class="info-details">
					<div class="info-panel grid gap-x-2.5 overflow-hidden">
						<div class="grid col-start-1 col-span-1 w-full p-0.5">
							<div class="flex flex-row gap-2">
								<sl-input class="edit-input grow" size=small label="Name" pill readonly name="name" .value=${this.post!.name}></sl-input>
								<sl-switch id="visible" class="self-stretch pt-1" size=small ?checked=${this.visible}>Visible</sl-switch>
							</div>
							<sl-input class="edit-input" size=small label="Title" pill name="title" .value=${this.post!.title}></sl-input>
							<sl-input class="edit-input" size=small label="Tags" pill name="tags" .value=${this.post!.tags}></sl-input>
							<sl-input class="edit-input" size=small label="Created" pill disabled readonly name="dateCreated" .value=${new Date( this.post!.dateCreated ).toString()}></sl-input>
							<sl-input class="edit-input" size=small label="Posted" pill disabled readonly name="datePosted" .value=${new Date( this.post!.datePosted ).toString()}></sl-input>
							<sl-input class="edit-input" size=small label="Modified" pill disabled readonly name="dateModified" .value=${new Date( this.post!.dateModified ).toString()}></sl-input>
							<sl-input class="edit-input" size=small label="Author" pill name="author" .value=${this.post!.author}></sl-input>
							<sl-textarea class="edit-input" size=small label="Description" name="description" autocomplete='off' autocorrect='on' spellcheck='true' inputmode='text' resize='none' .value=${this.post!.description}></sl-textarea>
						</div>
						<div class="grid col-auto w-full p-0.5">
							<div class="header-img block justify-self-center outline-1 outline outline-black m-2.5">
								<div class="post-visual justify-self-center fullsize">
									${visual}
								</div>
							</div>
							<sl-input class="edit-input" size=small label="Header Alt" pill name="hdrAlt" .value=${this.post!.hdrAlt}></sl-input>
							<sl-input class="edit-input" size=small label="Header HREF" pill name="hdrHref" .value=${this.post!.hdrHref}></sl-input>
							<sl-textarea class="edit-input" size=small label="Header Inline" name="hdrInline" autocomplete='off' autocorrect='on' spellcheck='true' inputmode='text' resize='none' .value=${this.post!.hdrInline}></sl-textarea>
						</div>
					</div>
				</sl-details>
				<sl-button variant="success" pill class="col-start-3 col-span-1 w-[100px] ml-1 justify-self-center self-center" @click="${this.handleCommit}">Save</sl-button>
			</div>
			<div class="flex gap-5 max-h-full">
				<div class="edit-panel flex flex-col max-h-full h-full overflow-hidden">
					<textArea id="editPostTextBox" class="w-full h-[var(--body-edit-height)] resize-none overflow-y-auto p-1 text-sm bg-[#ebeae5]" name="markdown"> </textArea>
				</div>
				<div class="preview-panel flex flex-col max-w-[var(--w-post)] max-h-full h-full overflow-hidden border border-black">
					<div id="previewPostBox" class="post-content max-w-full max-h-[100vh-160px] w-100 h-[var(--body-edit-height)] overflow-y-auto p-1 bg-[var(--col-bg-light)] text-sm"> </div>
				</div>
			</div>
		</div>
	</form>
</div>
		    `;
	}
}
