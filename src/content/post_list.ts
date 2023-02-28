// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { AppElement } from '../appelement.js';
import { Database } from './data.js';
import { PostData } from './post_data.js';

@customElement( 'lit-posts' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostList extends AppElement
{
	// static styles = css`
	// `;

	@property( { type: Array } ) posts?: PostData[];

	pageNavEvent( event: Event )
	{
		const post = ( event as CustomEvent ).detail as PostData;
		Router.go( `/posts/${post.id}` );
	}

	constructor()
	{
		super();

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

		const db = Database.getDB();
		const posts = db.getPostsList();

		return html`

		<div class="flex flex-wrap justify-around p-8 gap-8">
			${posts?.map( post => html`<post-tile .post="${post}"></post-tile>` )}
		</div>
    `;
	}
}
