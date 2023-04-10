/* eslint-disable indent */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement } from 'lit/decorators.js';
import { RouterLocation, Router } from '@vaadin/router';
import { Geometry } from '../styles.js';
import { AppElement } from '../appelement.js';
import { Database } from './data.js';
import { ElementData, ElementStatus } from './post_data.js';

@customElement( 'lit-posts' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostList extends AppElement
{
	static styles = [
		Geometry,
		css`
		`
	];

	@property( { type: Array } ) posts?: ElementData[];

	goToPage( event: Event )
	{
		const post = ( event as CustomEvent ).detail as string;
		Router.go( `/posts/${post}` );
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
		this.addEventListener( 'readMore', e => this.goToPage( e ) );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();
		this.removeEventListener( 'readMore', e => this.goToPage( e ) );
	}

	private updatePostData( posts: ElementData[] | undefined )
	{
		// console.log( `SetPostData: post input ${JSON.stringify( post, null, 2 )}, error currently ${this.error}` );

		if ( posts === undefined )
		{
			// Show error page
			// this.error = true;
		}
		else
		{
			// deep copy post to page
			this.posts = JSON.parse( JSON.stringify( posts ) );
			// this.error = false;
		}

		this.requestUpdate();
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
		<div class="flex flex-wrap justify-evenly p-[var(--post-gap)] gap-[var(--post-gap)]">
			${this.posts?.map( post => html`<post-tile .post="${post}"></post-tile>` )}
		</div>
    `;
	}

	public onBeforeEnter( location: RouterLocation )
	{
		super.onBeforeEnter( location );

		const db = Database.getDB();
		db.getPostsList( posts => this.updatePostData( posts ), ElementStatus.Visible );
	}
}
