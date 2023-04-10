/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js';
import { svg, TemplateResult, html, css } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { AppElement } from '../appelement.js';
import { ElementData } from './post_data.js';
import { Geometry, PostStyles } from '../styles.js';

@customElement( 'post-tile' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostTile extends AppElement
{
	static styles = [
		PostStyles,
		Geometry,
		css`
	* {
		--grad-col-1: var(--sl-color-gray-200);
		--grad-col-2: white;
	}

	.post-tile {
		--border-width: 0px;
		--padding: 15px;
		--border-radius: 12px;
	}
	.post-tile::part(base) {
		background-color: var(--sl-color-gray-300);
	}
	.post-tile::part(body) {
		padding-top: 0px;
	}
	.footer-item > sl-button::part(base):hover {
		transform: translate(-2px, -2px);
	}
	.footer-item > sl-button::part(base) {
		transition: var(--sl-transition-fast) transform ease, var(--sl-transition-fast) color ease;
	}
	.post-visual {
		height: var(--vis-height);
		width: var(--vis-width);
		max-height: var(--vis-height);
		max-width: var(--vis-width);
	}
	.letterbox {
		background-color: var(--sl-color-gray-900);
	}
	.visual-border {
		border: var(--vis-image-border) solid var(--sl-color-gray-400);
	}
	.footer-container {
		display: grid;
		grid-template-columns: 10fr 1fr;
	}
	web-gl {
		display: block;
		width: 100%;
		height: 100%;
	}
	`];

	@property( { type: Object } ) post?: ElementData;

	static errorVisual( text: string ): TemplateResult<2>
	{
		const viewWidth = 400;
		const viewHeight = 220;
		const stride = 60;
		const travel = 44;
		const y1 = -5;
		const y2 = viewHeight - y1;
		let points = '';
		// All stripes start from the top right, but stripeX will define the bottom left
		for ( let sx = -travel; sx < viewWidth; sx += stride * 2 )
		{
			const x0 = sx;
			const x1 = sx + stride;
			const x2 = sx + travel + stride * 2;
			const x3 = sx + travel + stride;
			points += `${x2},${y1} ${x1},${y2}, ${x0},${y2} ${x3},${y1}  `;
		}

		return svg`
				<svg slot="image" width="100%" height="100%" clip-path="url(#clip2)" class="overflow-clip" role="img" aria-labelledby="svgTitle">
					<defs>
						<clipPath id="clip">
							<rect width="100%" height="100%" x="0" y="0"/>
						</clipPath>
					</defs>
					<filter id="visBlur">
						<feGaussianBlur in="SourceGraphic" stdDeviation="8" />
					</filter>
					<title id="svgTitle">${text}</title>
					<rect width="100%" height="100%" fill="#000000"/>
					<polygon points="${points}" style="fill:#ffdf00;stroke-width:0" filter="url(#visBlur)"/></polygon>
					<rect width="100%" height="100%" fill="#ffffff" fill-opacity="85%"/>
					<text x="50%" y="25%" font-size="16" text-anchor="middle" alignment-baseline="central" fill="#5f5f5f">
					  <tspan x="50%" dy="1.2em">this space unintentionally</tspan>
					  <tspan x="50%" dy="1.2em">left blank</tspan>
					  <tspan x="50%" y="75%" font-size="12">[ ${text} ]</tspan>
					</text>
				</svg>
			`;
	}

	static getPostVisual( post: ElementData ): TemplateResult<1> | TemplateResult<2>
	{
		if ( post.hdrInline.length > 0 )
			return html`${unsafeHTML( post.hdrInline )}`;

		if ( post.hdrHref.length > 0 )
		{
			const href = post.hdrHref.toLowerCase();
			if ( href.endsWith( 'json' ) )
			{
				// esli=nt-disable-next-line max-len
				return html`<web-gl class="webglembed" width="100%" height="100%" alt="${post.hdrAlt}" src='${post.hdrHref}'></web-gl>`;
			}

			return html`
				<div width='100%' height='200px' max-height='var(--vis-height)' class="letterbox">
					<img class="object-scale-down max-h-[calc(var(--vis-height)-var(--vis-image-border)*2)] m-auto" alt="${post.hdrAlt}" src='${post.hdrHref}'/>
				</div>
			`;
		}

		return PostTile.errorVisual( 'missing visual' );
	}

	render()
	{
		if ( this.post === undefined )
		{
			const visual = PostTile.errorVisual( 'missing post' );

			return html`
				<sl-card class="post-tile">
					${visual}
					<div class="post-info">
						<strong>Error fetching post</strong>
						<p>Post is undefined</p>
					</div>
				</sl-card>
			`;
		}

		const visual = PostTile.getPostVisual( this.post );

		return html`
			<sl-card class="post-tile flex flex-col overflow-hidden shadow-md max-w-[var(--post-width)] m-0 mb-2 rounded-xl">
				<div slot="image" class="post-visual m-4">
					<div class="bg-[#efefef] w-full h-full visual-border">
						${visual}
					</div>
				</div>
				<div class="px-4 text-base">
					<span class="pt-0 text-xl font-bold">${this.post.title}</span><br>
					<span class="text-sm font-light text-gray-600 ml-6">by ${this.post.author}</span><br>
					<span class="inline-block font-normal text-base mt-4">${this.post.description}</span>
					<sl-divider></sl-divider>
					<div slot="text-right" class="footer-container items-end">
						<div class="footer-item font-light text-gray-500 text-left text-sm self-end">
							<sl-relative-time .date="${this.getDateObject()}" format="long" sync></sl-relative-time>
						</div>
						<div class="footer-item items-end">
							<sl-button variant="primary" pill @click="${this.handleClick}">Read More</sl-button>
						</div>
					</div>
				</div>
			</sl-card>
		`;
	}

	getDateObject(): Date
	{
		if ( this.post === undefined )
			throw new Error( 'Should not have been able to call this with an undefined post' );

		return new Date( this.post.datePosted );
	}

	private handleClick()
	{
		const event = new CustomEvent( 'readMore', {
			detail: this.post?.name,
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );
	}
}
