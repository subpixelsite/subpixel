// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement, css, property } from "lit-element";
import { Post } from "./post.js";
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';

@customElement( 'post-tile' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostTile extends LitElement
{
	static styles = css
		`
		.post-tile
		{
			margin: 20px;
			display: flex;
			flex-direction: column;
			margin-bottom: 15px;
			background: white;
			overflow: hidden;
			border-radius: 10px;

			max-width: 300px;
		}
		.post-description
		{
			padding: 20px;
			background: white;
		}
		.post-footer
		{
			text-align: right;
		}
		.post-link
		{
			color: #008cba;
			// border-width: 0;
			// background-color: #ffffff;
		}
		h1 
		{
			margin: 0;
			font-size: 1.5rem;
		}
		h2
		{
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

	@property( { type: Object } ) post?: Post;

	render()
	{
		return html
			`
			<sl-card class="post-tile">
<!--
				<img
					slot="image"
					src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
					alt="A kitten sits patiently between a terracotta pot and decorative grasses."
				/>
-->
				<div class="post-description">
					<strong>${this.post?.title}</strong>
					<small>${this.post?.author}</small>
					<p>
						${this.post?.description}
					</p>
					<div slot="post-footer">
						<sl-button variant="primary" pill class="post-link" @click="${this.handleClick}">Read More</sl-button>
					</div>
				</div>
			</sl-card>
		`;
	}

	private handleClick()
	{
		const event = new CustomEvent( 'readMore', { detail: this.post, bubbles: true, composed: true } );
		this.dispatchEvent( event );
	}
}
