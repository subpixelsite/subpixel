// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement, css, property } from "lit-element";
import { Post } from "./post.js";

@customElement('post-tile')
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
	`;

	@property({type: Object}) post?: Post;

	render()
	{
		return html
		`
			<div class="post-tile">
				<div class="post-description">
					<h1>${this.post?.title}</h1>
					<h2>${this.post?.author}</h2>
					<p>
						${this.post?.description}
					</p>
					<p class="post-footer">
						<button class="post-link" @click="${this.handleClick}">Read More</button>
					</p>
				</div>
			</div>
		`;
	}

	private handleClick()
	{
		const event = new CustomEvent('readMore', { detail: "readMore", bubbles: true, composed: true } );
		this.dispatchEvent( event );
	}
}
