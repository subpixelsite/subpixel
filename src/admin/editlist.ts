/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { AppElement } from '../appelement.js';
import { POSTS } from '../content/data.js';
import { PostData } from '../content/post_data.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';

@customElement( 'lit-editlist' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class EditList extends AppElement
{
	static styles = css`
		.top {
			height: calc( 100vh - 200px );
			display: flex;
			flex-wrap: wrap;
			flex-direction: column;
			justify-content: flex-start;
		}

		.posts-container {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			overflow-y: scroll;
			height: 160px;
			border: 2px solid #000000;
		}

		.posts-table {
			border-collapse: collapse;
			margin: 0;
			font-size: 0.9em;
			font-family: sans-serif;
			width: 100%;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
		}

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
		}

		.posts-table tbody tr:nth-of-type(even) {
			background-color: #f3f3f3;
		}

		.posts-table tbody tr:last-of-type {
			border-bottom: 3px solid #13476f;
		}

		.posts-table tbody tr.active {
			background-color: #bfccd6;
		}

		.posts-table tbody tr:hover {
			transform: translate( -1px, -1px );
			text-shadow: 4px 4px 4px #d2d2d2, 0 0 20px #39a9ff;
			cursor: pointer;
		}

		.post-id {
			font-family: monospace;
			font-size: 1.2em;
			max-width: 15px;
		}

		.post-title {
			font-weight: var(--sl-font-weight-bold);
			min-width: 15vw;
		}

		.post-tags {
			display: flex;
			flex: wrap;
			min-width: 10vw;
		}

		.post-tag {
			display: flex;
			margin-left: 5px;
		}

		.post-created {
			font-family: monospace;
		}

		/* .post-description {

		} */
	`;

	@state()
	activeRowIndex: number = -1;

	@property( { type: Array } ) posts?: PostData[];

	pageNavEvent( event: Event )
	{
		const post = ( event as CustomEvent ).detail as PostData;
		Router.go( `/admin/editor/${post.id}` );
	}

	constructor()
	{
		super();
		this.posts = POSTS;
	}

	protected firstUpdated(): void
	{
		this.addEventListener( 'edit', this.pageNavEvent );

		document.addEventListener( 'keydown', this.dokeydown );

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
<div class="top">
	<div class="posts-container">
		<table class="posts-table">
			<thead><tr>
				<th>ID</th>
				<th>Title</th>
				<th>Tags</th>
				<th>Created</th>
				<th>Description</th>
			</tr></thead>
			<tbody>
				${this.posts?.map( post => html`
				<tr id='${post.id}' @click='${this.goToPost}'>
					<td class='post-id'>${post.id}</td>
					<td class='post-title'>${post.title}</td>
					<td class='post-tags'>${post.tags.map( tag => html`<sl-tag class="post-tag" size="small" variant="primary" pill>${tag}</sl-tag>` )}</td>
					<td class='post-created'>${new Date( post.dateCreated ).toLocaleDateString( 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' } )}</td>
					<td class='post-description'>${post.description}</td>
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

	private goToPostID( postID: number | string )
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

		const edit: EditList | null = document.querySelector( 'lit-editlist' );
		if ( edit === null )
			throw new Error( 'Couldn\'t find editlist in admin edit list' );

		if ( edit.posts === undefined )
			return;

		let handled: boolean = false;

		if ( event.code === 'ArrowUp' )
		{
			if ( edit.activeRowIndex === -1 )
				edit.activeRowIndex = edit.posts.length;

			edit.activeRowIndex = Math.max( 0, edit.activeRowIndex - 1 );
			handled = true;
		}

		if ( event.code === 'ArrowDown' )
		{
			edit.activeRowIndex = Math.min( edit.posts.length - 1, edit.activeRowIndex + 1 );
			handled = true;
		}

		if ( event.code === 'Enter' )
		{
			if ( edit.posts !== undefined && edit.activeRowIndex >= 0 && edit.activeRowIndex < edit.posts.length )
				edit.goToPostID( edit.activeRowIndex );
			handled = true;
		}

		if ( event.code === 'Escape' )
		{
			edit.activeRowIndex = -1;
			handled = true;
		}

		if ( handled )
		{
			event.preventDefault();
			event.stopPropagation();
			edit.updateRows();

			const body = edit.shadowRoot!.querySelector( 'tbody' );
			if ( body === null )
				throw new Error( 'Couldn\'t find table body' );

			const rows = body.getElementsByTagName( 'tr' );
			if ( edit.activeRowIndex >= 0 && edit.activeRowIndex < rows.length )
				rows.item( edit.activeRowIndex )!.scrollIntoView( { behavior: 'smooth', block: 'nearest', inline: 'nearest' } );
		}
	}

	public onBeforeLeave()
	{
		this.removeEventListener( 'edit', this.pageNavEvent );
		document.removeEventListener( 'keydown', this.dokeydown );
	}
}
