// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { AppElement } from '../appelement.js';
import { getPostData } from './data.js';
import { PostData } from './post_data.js';

@customElement( 'lit-posts' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostList extends AppElement
{
	static styles = css`
		.posts-container {
			padding-top: 30px;
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			gap: 30px 30px;
		}
	`;

	@property( { type: Array } ) posts?: PostData[];

	pageNavEvent( event: Event )
	{
		const post = ( event as CustomEvent ).detail as PostData;
		Router.go( `/posts/${post.id}` );
	}

	constructor()
	{
		super();
		this.posts = getPostData();
		PostList.loadPostTile();
	}

	static async loadPostTile()
	{
		await import( './post_tile.js' );
	}

	connectedCallback(): void
	{
		super.connectedCallback();
		this.addEventListener( 'readMore', this.pageNavEvent );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();
		this.removeEventListener( 'readMore', this.pageNavEvent );
	}

	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'posts',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		return html`
		<div class="posts-container">
			${this.posts?.map( post => html`<post-tile .post="${post}"></post-tile>` )}
		</div>
    `;
	}
}
