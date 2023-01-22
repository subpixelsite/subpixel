// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement, css, property } from 'lit-element';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js';
import { svg, TemplateResult } from 'lit-element/lit-element.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { PostData } from './post_data.js';
import { WebGLElement } from '../webgl/webglelement.js';

@customElement( 'post-tile' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostTile extends LitElement
{
	static styles = css`
    .post-tile {
      margin: 10px;
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      background: white;
      overflow: hidden;
      border-radius: 10px;

      max-width: 300px;
    }
    .post-description {
      padding: 0px;
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
		font-size: var(--sl-font-size-small)
	}
	.postImage {
		min-height: 150px;
	}
	.footer-container {
		display: grid;
		grid-template-columns: 10fr 1fr;
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

	private wglScene?: WebGLElement;

	firstUpdated( changedProperties: Map<string, unknown> )
	{
		if ( changedProperties.has( 'post' ) )
		{
			const oldValue = changedProperties.get( 'post' ) as PostData | undefined;
			const newValue = this.post;
			if (
				newValue !== oldValue
				&& this.post !== undefined
				&& this.post.hdrWGL !== null
			)
			{
				// initialize WebGL scene
				this.updateComplete.then( () =>
				{
					this.wglScene = new WebGLElement( this.post!.hdrWGL!, this.shadowRoot!, '.postImage' );
					this.wglScene.init();
				} );
			}
		}
	}

	static errorVisual( text: string ): TemplateResult<2>
	{
		const viewWidth = 100;
		const viewHeight = 56;
		const stride = 20;
		const travel = 33;
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
				<svg slot="image" viewbox="0 0 100 56" width="100%" height="100%" role="img" aria-labelledby="svgTitle">
					<filter id="visBlur">
						<feGaussianBlur in="SourceGraphic" stdDeviation="1" />
					</filter>
					<title id="svgTitle">${text}</title>
					<rect width="100%" height="100%" fill="#000000"/>
					<polygon points="${points}" style="fill:#ffff00;stroke-width:0" filter="url(#visBlur)"/></polygon>
					<rect width="100%" height="100%" fill="#ffffff" fill-opacity="60%"/>
					<text x="50%" y="50%" font-size="6" text-anchor="middle" alignment-baseline="central" fill="#363636">[ ${text} ]</text>
				</svg>
			`;
	}

	static getPostVisual( post: PostData ): TemplateResult<1> | TemplateResult<2>
	{
		let visual;
		if ( post.hdrWGL !== null )
		{
			visual = html`<div slot="image" class="postImage">Your browser does not seem to support WebGL.</div>`;
		} else if ( post.hdrSVG.length > 0 )
		{
			const content = `
				<svg slot="image" width="100%" height="100%" role="img" aria-labelledby="svgTitle">
					<title id="svgTitle" > ${post.hdrAlt} </title>
					${post.hdrSVG}
				</svg>
			`;

			visual = svg`${unsafeHTML( content )}`;
		} else if ( post.hdrImg.length > 0 )
		{
			visual = html`<img slot="image" src="${post.hdrImg}" alt="${post.hdrAlt}" />`;
		} else
		{
			visual = PostTile.errorVisual( 'missing visual' );
		}

		return visual;
	}

	render()
	{
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
					<strong>${this.post.title}</strong><br>
					<small>${this.post.author}</small>
					<p>${this.post.description}</p>
					<sl-divider></sl-divider>
					<div slot="post-footer" class="footer-container">
						<div class="footer-item">
							<p class="post-date">
								<sl-relative-time .date="${this.getDateObject()}" format="long" sync></sl-relative-time>
							</p>
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
}
