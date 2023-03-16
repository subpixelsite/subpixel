/* eslint-disable indent */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { Geometry } from '../styles.js';
import { AppElement } from '../appelement.js';
import { Database } from './data.js';
import { PostData, PostStatus } from './post_data.js';

@customElement( 'lit-posts' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostList extends AppElement
{
	static styles = [
		Geometry,
		css`
		`
	];

	@property( { type: Array } ) posts?: PostData[];

	pageNavEvent( event: Event )
	{
		const post = ( event as CustomEvent ).detail as PostData;
		Router.go( `/posts/${post.name}` );
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
		this.addEventListener( 'readMore', e => this.pageNavEvent( e ) );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();
		this.removeEventListener( 'readMore', e => this.pageNavEvent( e ) );
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

		<div class="flex flex-wrap justify-evenly p-[var(--post-gap)] gap-[var(--post-gap)]">
		${posts?.map( post =>
		{
			if ( post.status === PostStatus.Visible )
				return html`<post-tile .post="${post}"></post-tile>`;
			return '';
		} )}
		</div>
    `;
	}
}
