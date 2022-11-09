// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement, css } from "lit-element";

@customElement('lit-posts')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Posts extends LitElement
{
	render() 
	{
		return html`
			<h2>Posts</h2>
			<ul>
				<li><a href="/posts/1">Mipmapping</a></li>
				<li><a href="/posts/2">Texture Filtering</a></li>
				<li><a href="/posts/3">Stencil</a></li>
			</ul>
		`;
	}
}