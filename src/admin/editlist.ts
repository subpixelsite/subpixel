/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement, state } from 'lit/decorators.js';
import { Router, RouterLocation } from '@vaadin/router';
import { AppElement } from '../appelement.js';
import { Database } from '../content/data.js';
import { ElementData, ElementStatus } from '../content/post_data.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { Colors, ScrollBarStyles } from '../styles.js';

@customElement( 'lit-editlist' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class EditList extends AppElement
{
	static styles = [
		Colors,
		ScrollBarStyles,
		css`
		/* * {
			--h-admin-top: calc( 100vh - var(--h-navbar) * 2 );
		} */

		.posts-table thead tr {
			background-color: #13476f;
			color: #ffffff;
			text-align: left;
		}

		.posts-table th,
		.posts-table td {
			padding: 12px 15px;
		}

		.posts-table th:first-of-type,
		.posts-table td:first-of-type {
			padding-left: 30px;
			padding-right: 30px;
		}

		.posts-table tbody tr {
			border-bottom: 1px solid #7f7f7f;
			transition: var(--sl-transition-fast) transform ease, var(--sl-transition-fast) text-shadow ease;
		}

		.posts-table tbody tr:nth-of-type(even) {
			background-color: #dfdfdf;
		}

		.posts-table tbody tr:last-of-type {
			border-bottom: 3px solid #13476f;
		}

		.posts-table tbody tr.active {
			background-color: #bfccd6;
		}

		.posts-table tbody tr:hover {
			transform: translate( -1px, -1px );
			text-shadow: 4px 4px 4px #d2d2d2, 0 0 20px var(--sl-color-primary-600);
			cursor: pointer;
		}
		`
	];

	@state()
	activeRowIndex: number = -1;

	@property( { type: Array } ) posts?: ElementData[];

	pageNavEvent( event: Event )
	{
		const post = ( event as CustomEvent ).detail as ElementData;
		Router.go( `/admin/editor/${post.name}` );
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

	public onBeforeEnter( location: RouterLocation )
	{
		super.onBeforeEnter( location );

		const db = Database.getDB();
		db.getPostsList( posts => this.updatePostData( posts ) );
	}

	connectedCallback(): void
	{
		super.connectedCallback();

		this.addEventListener( 'edit', e => this.pageNavEvent( e ) );
		document.addEventListener( 'keydown', e => this.dokeydown( e ) );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();

		this.removeEventListener( 'edit', e => this.pageNavEvent( e ) );
		document.removeEventListener( 'keydown', e => this.dokeydown( e ) );
	}

	protected firstUpdated(): void
	{
		this.updateRows();
		this.requestUpdate();
	}

	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'editlist',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		return html`
<div class="h-[var(--h-content)] flex flex-wrap flex-col justify-start">
	<div class="overflow-y-auto flex flex-wrap justify-start border-solid border-2 border-black">
		<table class="posts-table border-collapse m-0 text-sm w-full">
			<thead><tr>
				<th>Name</th>
				<th>Vis</th>
				<th>Title</th>
				<th>Tags</th>
				<th>Created</th>
				<th>Description</th>
			</tr></thead>
			<tbody class="text-xs">
				${this.posts?.map( post => html`
				<tr id='${post.name}' @click='${this.goToPost}'>
					<td class='font-mono text-xs min-w-max'>${post.name}</td>
					<td style='font-size:20px; color:${post.status === ElementStatus.Visible ? '#00cf00' : '#afafaf'};'>
						<sl-icon slot="icon" name="${post.status === ElementStatus.Visible ? 'check-lg' : 'dot'}"></sl-icon>
					</td>
					<td class='font-bold min-w-max'>${post.title}</td>
					<td class='flex flex-wrap min-w-max gap-1'>${post.tags.map( tag => html`<sl-tag class="tag" size="small" variant="primary" pill>${tag}</sl-tag>` )}</td>
					<td class='font-mono'>${new Date( post.dateCreated ).toLocaleDateString( 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' } )}</td>
					<td class=''>${post.description}</td>
				</tr>
				` )}
			</tbody>
		</table>
	</div>
</div>
`;
	}

	updateRows()
	{
		const body = this.shadowRoot!.querySelector( 'tbody' );
		if ( body === null )
			throw new Error( 'Couldn\'t find table body' );

		const rows = body.getElementsByTagName( 'tr' );

		for ( let i = 0; i < rows.length; i++ )
		{
			const row = rows.item( i );
			row!.className = i === this.activeRowIndex ? 'active' : 'normal';
		}
	}

	private goToPostIndex( postIndex: number )
	{
		if ( this.posts !== undefined )
			this.goToPostID( this.posts[postIndex].name );
	}

	private goToPostID( postID: string )
	{
		Router.go( `/admin/editor/${postID}` );
	}

	private goToPost( event: Event )
	{
		if ( event.target === null )
			return;

		const target = event.target as HTMLElement;
		const row = target.closest( 'tr' );
		if ( row === null )
			return;

		this.goToPostID( row.id );
	}

	private dokeydown( event: KeyboardEvent )
	{
		if ( event.ctrlKey || event.altKey || event.metaKey || event.shiftKey )
			return;

		let handled: boolean = false;

		const maxPosts = this.posts !== undefined ? this.posts.length : 1;

		if ( event.code === 'ArrowUp' )
		{
			if ( this.activeRowIndex === -1 )
				this.activeRowIndex = maxPosts;

			this.activeRowIndex = Math.max( 0, this.activeRowIndex - 1 );
			handled = true;
		}

		if ( event.code === 'ArrowDown' )
		{
			this.activeRowIndex = Math.min( maxPosts - 1, this.activeRowIndex + 1 );
			handled = true;
		}

		if ( event.code === 'Enter' )
		{
			if ( this.activeRowIndex >= 0 && this.activeRowIndex < maxPosts )
				this.goToPostIndex( this.activeRowIndex );
			handled = true;
		}

		if ( event.code === 'Escape' )
		{
			this.activeRowIndex = -1;
			handled = true;
		}

		if ( handled )
		{
			event.preventDefault();
			event.stopPropagation();
			this.updateRows();

			const body = this.shadowRoot!.querySelector( 'tbody' );
			if ( body === null )
				throw new Error( 'Couldn\'t find table body' );

			const rows = body.getElementsByTagName( 'tr' );
			if ( this.activeRowIndex >= 0 && this.activeRowIndex < rows.length )
				rows.item( this.activeRowIndex )!.scrollIntoView( { behavior: 'smooth', block: 'nearest', inline: 'nearest' } );
		}
	}
}
