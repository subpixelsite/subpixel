// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, customElement, property } from 'lit-element';
import { Router } from '@vaadin/router';
import { AppElement } from '../appelement.js';
import { POSTS } from './data.js';
import { PostData } from './post_data.js';

@customElement( 'lit-posts' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostList extends AppElement
{
	@property( { type: Array } ) posts?: PostData[];

	render()
	{
		PostList.loadPostTile();

		const event = new CustomEvent( 'pageNav', {
			detail: 'posts',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		return html`
      <h2>Posts</h2>
      ${this.posts?.map( post => html`<post-tile .post="${post}"></post-tile>` )}
    `;
	}

	protected firstUpdated(): void
	{
		this.posts = POSTS;
		this.addEventListener( 'readMore', event =>
		{
			const post = ( event as CustomEvent ).detail as PostData;
			Router.go( `/posts/${post.id}` );
		} );
	}

	static async loadPostTile()
	{
		await import( './post_tile.js' );
	}
}
