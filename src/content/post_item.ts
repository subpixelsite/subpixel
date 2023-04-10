/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RouterLocation } from '@vaadin/router';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html, TemplateResult } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import './alert.js';
import { AppElement } from '../appelement.js';
import { Database } from './data.js';
import { ElementData, ElementStatus } from './post_data.js';
import { Colors, PostStyles } from '../styles.js';

@customElement( 'lit-post' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostItem extends AppElement
{
	static styles = [
		Colors,
		PostStyles,
		css`
		.lit-post {
			margin-top: 20px;
			margin-bottom: 20px;
			margin-left: 0px;
			margin-right: 0px;
		}

		.post-footer {
			text-align: right;
		}
		a {
			color: #008cba;
		}
		h1 {
			margin: 0;
			font-size: 1.5rem;
		}
		.header {
			/* grid-template: rowpx row% rowfr / column% columnpx columnfr */
			grid-template: 1fr 10px var(--vis-padded-width);
		}
		.post-image {
			grid-template: [row1-start] 1fr 1fr [row1-end];
		}
		.post-visual {
			height: var(--vis-height);
			width: var(--vis-width);
			max-height: var(--vis-height);
			max-width: var(--vis-width);
		}
		.post-divider {
			--width: 4px;
			--spacing: 15px;
			--color: #cfcfcf;
		}
	`];

	@property( { type: Object } )
	post?: ElementData;

	@state()
	error: boolean = false;

	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'posts',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		if ( this.error === true )
		{
			return html`
				<sl-alert class="block mt-10 mb-1 mx-2" variant="danger" open>
					<sl-icon slot="icon" name="emoji-frown"></sl-icon>
					<strong>This space unintentionally left blank...</strong><br>
					The requested post was not found.  Sorry about that.
				</sl-alert>
			`;
		}

		return html`
			<div class="lit-post">
				<div class="block pb-4">
					<div class="header grid h-full">
						<div class="col-start-1 col-span-1 flex flex-col">
							<h1 class="text-4xl font-semibold px-1 lg:px-0 mt-8 pb-2 self-center text-gray-700">${this.post?.title}</h1>
							<div class="self-center mt-2">
								<span class="text-base font-semibold text-gray-600 mt-1 pl-6">by ${this.post?.author}</span> <sl-icon name="dot"></sl-icon> 
								<span class="text-base font-light text-gray-500 mt-1">on ${this.getDateString()}</span>
							</div>
							<div class="mt-4 mb-12 pl-5 self-center">${this.getTagsHTML()}</div>
						</div>
					</div>
				</div>
				<!-- <sl-divider style="border-top-width: 3px; border-top-color: var(--sl-color-gray-200);"></sl-divider> -->
				<div class="post-content">
				${unsafeHTML( this.post?.content )}
				</div>
			</div>
			`;
	}

	getTagsHTML(): TemplateResult<1>
	{
		let htmlString = '';

		if ( this.post !== undefined )
		{
			console.log( `getTagsHTML: ${this.post.tags}\n${JSON.stringify( this.post.tags, null, 2 )}` );

			this.post.tags.forEach( tag =>
			{
				htmlString += `<sl-tag class="tag ml-1" size="medium" variant="neutral" pill>${tag}</sl-tag>`;
			} );
		}

		return html`${unsafeHTML( htmlString )} `;
	}

	getDateObject(): Date
	{
		if ( this.post === undefined )
			return new Date();

		return new Date( this.post.dateCreated );
	}

	getDateString(): string
	{
		if ( this.post === undefined )
			return '';

		const date = this.getDateObject();
		return date.toLocaleDateString( undefined, { year: 'numeric', month: 'long', day: 'numeric' } );
	}

	private updatePostData( post: ElementData | undefined )
	{
		console.log( `SetPostData: post input ${JSON.stringify( post, null, 2 )}, error currently ${this.error}` );

		if ( post === undefined )
		{
			// Show error page
			this.error = true;
		}
		else
		{
			// deep copy post to page
			this.post = JSON.parse( JSON.stringify( post ) );
			this.error = false;
		}
	}

	public onBeforeEnter( location: RouterLocation )
	{
		super.onBeforeEnter( location );

		const postName = location.params.name as string;
		const db = Database.getDB();
		db.getPostData( postName, post => this.updatePostData( post ), ElementStatus.Visible );
	}
}
