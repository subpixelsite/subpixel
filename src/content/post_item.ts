// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RouterLocation } from '@vaadin/router';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, customElement, state, property, css, TemplateResult } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import { AppElement } from '../appelement.js';
import { POSTS } from './data.js';
import { convertMDtoHTML, PostData } from './post_data.js';
import { PostTile } from './post_tile.js';

@customElement( 'lit-post' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostItem extends AppElement
{
	static styles = css`
		.lit-post {
			margin: 20px;
		}

		.post-filler {
			flex-grow: 1
		}
		.post-description {
			display: inline-block;
			background: white;
			align-self: end;
			padding-bottom: 0.5em;
		}
		.post-footer {
			text-align: right;
		}
		.post-link {
			color: #008cba;
			// border-width: 0;
			// background-color: #ffffff;
		}
		.post-tag-set {
			margin-top: 10px;
			margin-bottom: 20px;
			padding-left: 20px;
		}
		.post-tag {
			margin-left: 5px;
		}
		h1 {
			margin: 0;
			font-size: 1.5rem;
		}
		.post-title {
			font-size: var(--sl-font-size-2x-large);
			padding-bottom: 5px;
		}
		.post-author {
			font-size: 1rem;
			font-weight: var(--sl-font-weight-semibold);
			color: #5e5e5e;
			margin-top: 5px;
			padding-left: 25px;
		}
		.post-date {
			font-size: 1rem;
			font-weight: 300;
			color: #b8b8b8;
			margin-top: 5px;
		}
		.header-container {
			display: grid;
			grid-template: [row1-start] 1fr 1fr [row1-end];
			justify-content: space-between;
			max-height: 200;
			height: 200;
		}
		.post-info {
			grid-column: 1 / 2;
			display: flex;
			flex-direction: column;
		}
		.post-image {
			grid-column: 2 / 3;
			display: grid;
			grid-template: [row1-start] 1fr 1fr [row1-end];
		}
		.post-image-content {
			grid-column: 2 / 3;
			margin-left: 5px;
		}
		.post-image-divider {
			grid-column: 1 / 2;
			margin-right: 0px;
			margin-left: 10px;
			padding-top: 20%;
			padding-bottom: 20%;
		}
		.error-alert {
			margin-top: 40px;
			display: block;
		}
		.post-visual {
			min-height: 168px;
			max-width: 328px;
			height: 100%;
			width: 100%;
			background-color: #efefef;
		}
		.post-divider {
			--width: 2px;
			--spacing: 15px;
		}
	`;

	@state()
	postId: number = -1;

	@property( { type: Object } )
	post?: PostData;

	@property( { type: Array } )
	posts?: PostData[];

	render()
	{
		this.loadWebGL();

		if ( this.post === undefined )
		{
			return html`
				<sl-alert class="error-alert" variant="danger" open>
					<sl-icon slot="icon" name="emoji-frown"></sl-icon>
					<strong>This space unintentionally left blank...</strong><br>
					The requested post was not found.  Sorry about that.
				</sl-alert>
			`;
		}

		const visual = PostTile.getPostVisual( this.post );

		const body = convertMDtoHTML( this.post.body );

		return html`
			<div class="lit-post">
				<div class="header-container">
					<div class="post-info">
						<h1 class="post-title">${this.post.title}</h1>
						<div class="post-author-date">
							<span class="post-author">by ${this.post.author}</span> <sl-icon name="dot"></sl-icon> 
								<span class="post-date">on ${this.getDateString()}</span>
						</div>
						<div class="post-tag-set">${this.getTagsHTML()}</div>
						<div class="post-filler"></div>
						<div class="post-description">${this.post.description}</div>
					</div>
					<div class="post-image">
						<div class="post-image-divider">
							<sl-divider vertical style="--width: 2px"></sl-divider>
						</div>
						<div class="post-image-content">
							${visual}
						</div>
					</div>
				</div>
				<sl-divider class="post-divider"></sl-divider>
				<p class="post-content">
				${unsafeHTML( body )}
				</p>
			</div>
			`;
	}

	getTagsHTML(): TemplateResult<1>
	{
		let htmlString = '';

		this.post?.tags.forEach( tag =>
		{
			htmlString += `<sl-tag class="post-tag" size="medium" variant="primary" pill>${tag}</sl-tag>`;
		} );

		return html`${unsafeHTML( htmlString )} `;
	}

	getDateObject(): Date
	{
		if ( this.post === undefined )
			throw new Error( 'Should not have been able to call this with an undefined post' );

		return new Date( this.post.dateCreated );
	}

	getDateString(): string
	{
		if ( this.post === undefined )
			throw new Error( 'Should not have been able to call this with an undefined post' );

		const date = this.getDateObject();
		return date.toLocaleDateString( undefined, { year: 'numeric', month: 'long', day: 'numeric' } );
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

	async loadWebGL()
	{
		await import( '../webgl/webglelement.js' );
	}
}
