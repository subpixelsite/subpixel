// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RouterLocation } from '@vaadin/router';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, customElement, state, property, css, TemplateResult } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import { plainToClass } from 'class-transformer';
import { AppElement } from '../appelement.js';
import { POSTS } from './data.js';
import { PostData } from './post_data.js';
import { PostTile } from './post_tile.js';
import { WebGLViewport } from '../webgl/webglelement.js';
import { WebGLScene } from '../webgl/webglscene.js';

@customElement( 'lit-post' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostItem extends AppElement
{
	static styles = css`
		.lit-post {
			margin: 20px;
		}

		.post-description {
			padding: 20px;
			background: white;
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
			//line-height: var(--sl-line-height-loose);
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
		}
		.post-info {
			grid-column: 1 / 2;
		}
		.post-image {
			grid-column: 2 / 3;
		}
		.post-image-content {
			display: inline;
		}
		.postImage {
			min-height: 150px;
		}
	`;

	@state()
	postId: number = -1;

	@property( { type: Object } )
	post?: PostData;

	@property( { type: Array } )
	posts?: PostData[];

	private wglViewport?: WebGLViewport;

	firstUpdated( changedProperties: Map<string, unknown> )
	{
		if ( changedProperties.has( 'post' ) )
		{
			const oldValue = changedProperties.get( 'post' ) as PostData | undefined;
			const newValue = this.post;
			if (
				newValue !== oldValue
				&& this.post !== undefined
				&& ( this.post.hdrWGL !== null || this.post.hdrJSON !== null )
			)
			{
				// initialize WebGL scene
				if ( this.post.hdrJSON !== null )
				{
					this.updateComplete.then( () =>
					{
						const wgl = plainToClass( WebGLScene, this.post!.hdrJSON! );
						this.wglViewport = new WebGLViewport( wgl, this.shadowRoot!, '.postImage' );
						this.wglViewport.init();
					} );
				}
				else if ( this.post.hdrWGL !== null )
				{
					this.updateComplete.then( () =>
					{
						this.wglViewport = new WebGLViewport( this.post!.hdrWGL!, this.shadowRoot!, '.postImage' );
						this.wglViewport.init();
					} );
				}
			}
		}
	}

	render()
	{
		if ( this.post === undefined )
		{
			return html`
				<sl-alert variant="danger" open>
					<sl-icon slot="icon" name="emoji-frown"></sl-icon>
					<strong>This space unintentionally left blank...</strong><br>
					The requested post was not found.  Sorry about that.
				</sl-alert>
			`;
		}

		const visual = PostTile.getPostVisual( this.post );

		return html`
			<div class="lit-post">
				<div class="header-container">
					<div class="post-info">
						<h1 class="post-title">${this.post.title}</h1>
						<span class="post-author">by ${this.post.author}</span> <sl-icon name="dot"></sl-icon> 
							<span class="post-date">on ${this.getDateString()}</span>
						<div class="post-tag-set">${this.getTagsHTML()}</div>
					</div>
					<div class="post-image">
						<div class="post-image-content">
							${visual}
						</div>
					</div>
				</div>
				<sl-divider></sl-divider>
				<p class="post-content">
				${this.post.description}
				${this.post.body}
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
}
