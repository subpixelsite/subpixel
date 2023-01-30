/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, customElement, css, property } from 'lit-element';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js';
import { svg, TemplateResult } from 'lit-element/lit-element.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { AppElement } from '../appelement.js';
import { PostData } from './post_data.js';

@customElement( 'post-tile' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostTile extends AppElement
{
	static styles = css`
    .post-tile {
      margin: 0px;
      display: flex;
      flex-direction: column;
      background: white;
      overflow: hidden;
      border-radius: 10px;
	  --border-color: #000000;
	  --border-width: 1px;
	  --padding: 15px;
	  --border-radius: 10px;

      max-width: 360px;
    }
	.post-title {
		font-weight: var(--sl-font-weight-bold);
		font-size: var(--sl-font-size-large);
	}
    .post-description {
      padding: 0px;
	  font-size: var(--sl-font-size-medium);
      background: white;
    }
    .post-footer {
      text-align: right;
    }
    .post-link {
      color: #008cba;
      // border-width: 0;
      // background-color: #ffffff;
    }
	.post-date {
		font-weight: 200;
		color: #5e5e5e;
		text-align: left;
		font-size: var(--sl-font-size-small);
		align-self: end;
	}
	.post-visual {
		min-height: 168px;
		max-height: 200px;
		margin: 16px;
		background-color: #efefef;
	}
	.footer-container {
		display: grid;
		grid-template-columns: 10fr 1fr;
		align-items: end;
	}
    h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    h2 {
      font-size: 1rem;
      font-weight: 300;
      color: #5e5e5e;
      margin-top: 5px;
    }

    .post-tile small {
      color: var(--sl-color-neutral-500);
    }

    .post-tile [slot='footer'] {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;

	@property( { type: Object } ) post?: PostData;

	static errorVisual( text: string ): TemplateResult<2>
	{
		const viewWidth = 400;
		const viewHeight = 180;
		const stride = 40;
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
				<svg slot="image" clip-path="url(#clip2)" class="post-visual" width="100%" height="100%" role="img" aria-labelledby="svgTitle">
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
					<polygon points="${points}" style="fill:#ffff00;stroke-width:0" filter="url(#visBlur)"/></polygon>
					<rect width="100%" height="100%" fill="#ffffff" fill-opacity="80%"/>
					<text x="50%" y="25%" font-size="16" text-anchor="middle" alignment-baseline="central" fill="#5f5f5f">
					  <tspan x="50%" dy="1.2em">this space unintentionally</tspan>
					  <tspan x="50%" dy="1.2em">left blank</tspan>
					  <tspan x="50%" y="75%" font-size="12">[ ${text} ]</tspan>
					</text>
				</svg>
			`;
	}

	static getPostVisual( post: PostData ): TemplateResult<1> | TemplateResult<2>
	{
		if ( post.hdrInline !== undefined )
			return html`<div slot="image" width="100%" height="auto" class="post-visual">${unsafeHTML( post.hdrInline )}</div>`;

		if ( post.hdrHref !== undefined )
		{
			const href = post.hdrHref.toLowerCase();
			if ( href.endsWith( 'json' ) )
			{
				// eslint-disable-next-line max-len
				const embed = `<web-gl slot="image" width="100%" height="202px" class="post-visual" alt="${post.hdrAlt}" src='${post.hdrHref}'/>`;
				return html`${unsafeHTML( embed )}`;
			}

			const embed = `<img slot="image" width="100%" height="auto" class="post-visual" alt="${post.hdrAlt}" src='${post.hdrHref}'/>`;
			return html`${unsafeHTML( embed )}`;
		}

		return PostTile.errorVisual( 'missing visual' );
	}

	render()
	{
		this.loadWebGL();

		if ( this.post === undefined )
		{
			const visual = PostTile.errorVisual( 'missing post' );

			return html`
				<sl-card class="post-tile">
					${visual}
					<div class="post-description">
						<strong>Error fetching post</strong>
						<p>Post is undefined</p>
					</div>
				</sl-card>
			`;
		}

		const visual = PostTile.getPostVisual( this.post );

		return html`
			<sl-card class="post-tile">
				${visual}
				<div class="post-description">
					<span class="post-title">${this.post.title}</span><br>
					<small>${this.post.author}</small>
					<p>${this.post.description}</p>
					<sl-divider></sl-divider>
					<div slot="post-footer" class="footer-container">
						<div class="footer-item post-date">
							<sl-relative-time .date="${this.getDateObject()}" format="long" sync></sl-relative-time>
						</div>
						<div class="footer-item" align-items="flex-end">
							<sl-button variant="primary" pill class="post-link" @click="${this.handleClick}">Read More</sl-button>
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

		return new Date( this.post.dateCreated );
	}

	private handleClick()
	{
		const event = new CustomEvent( 'readMore', {
			detail: this.post,
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );
	}

	async loadWebGL()
	{
		await import( '../webgl/webglelement.js' );
	}
}
