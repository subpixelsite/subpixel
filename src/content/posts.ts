// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Router } from "@vaadin/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement, property } from "lit-element";
import { POSTS } from './data.js';
import { Post } from './post.js';

@customElement('lit-posts')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Posts extends LitElement
{
	@property({ type: Array }) posts?: Post[];

	render() 
	{
		Posts.loadPostTile();

		const event = new CustomEvent('pageNav', { detail: "posts", bubbles: true, composed: true } );
		this.dispatchEvent( event );

		return html`
			<h2>Posts</h2>
			${this.posts?.map(
				post => html`<post-tile .post="${post}"></post-tile>`
			)}
		`;
	}

	protected firstUpdated(): void
	{
		this.posts = POSTS;
		this.addEventListener('readMore', event => 
		{
			const post = (event as CustomEvent).detail as Post;
			Router.go(`/posts/${post.id}`);
		});
	}

	static async loadPostTile()
	{
		await import('./post-tile.js');
	}
}