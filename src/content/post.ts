// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement } from "lit-element";

@customElement('lit-post')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Post extends LitElement
{
	render() 
	{
		return html`
			<h2>This is a POST</h2>
		`;
	}
}