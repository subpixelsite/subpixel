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
import { AppElement } from '../appelement.js';
import { Database, getTagsArray } from './data.js';
import { convertMDtoHTML, PostData } from './post_data.js';
import { PostTile } from './post_tile.js';
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
			margin: 20px;
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
		web-gl {
			display: block;
			width: 100%;
			height: 100%;
			min-height: 200px;
		}
	`];

	@property( { type: Object } )
	post?: PostData;

	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'posts',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		if ( this.post === undefined )
		{
			return html`
				<sl-alert class="block mt-10" variant="danger" open>
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
				<div class="block h-[var(--vis-padded-height)]">
					<div class="header grid h-full">
						<div class="col-start-1 col-span-1 flex flex-col">
							<h1 class="text-4xl font-semibold pb-2">${this.post.title}</h1>
							<div class="">
								<span class="text-base font-semibold text-gray-600 mt-1 pl-6">by ${this.post.author}</span> <sl-icon name="dot"></sl-icon> 
								<span class="text-base font-light text-gray-500 mt-1">on ${this.getDateString()}</span>
							</div>
							<div class="mt-3 mb-5 pl-5">${this.getTagsHTML()}</div>
							<div class="grow"></div>
							<div class="inline-block self-end pb-1">${this.post.description}</div>
						</div>
						<div class="post-image grid col-start-3 col-span-1 min-h-[var(--vis-padded-height)]">
							<div class="post-visual ml-2 p-[var(--vis-padding)] justify-center self-center">
								${visual}
							</div>
						</div>
					</div>
				</div>
				<sl-divider style="border-top-width: 3px; border-top-color: var(--sl-color-gray-200);"></sl-divider>
				<div class="">
				${unsafeHTML( body )}
				</div>
			</div>
			`;
	}

	getTagsHTML(): TemplateResult<1>
	{
		let htmlString = '';

		if ( this.post !== undefined )
		{
			getTagsArray( this.post.tags ).forEach( tag =>
			{
				htmlString += `<sl-tag class="tag ml-1" size="medium" variant="neutral" pill>${tag}</sl-tag>`;
			} );
		}

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

		const postId = location.params.id as string;
		const db = Database.getDB();
		this.post = db.getPostData( postId );
	}
}
