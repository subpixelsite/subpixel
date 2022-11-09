// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement } from "lit-element";

@customElement('lit-about')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class About extends LitElement
{
	render() 
	{
		return html`
			<h2>About the site</h2>
		`;
	}
}