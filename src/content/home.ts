// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement } from "lit-element";

@customElement('lit-home')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Home extends LitElement
{
	render() 
	{
		return html`
			<h2>This is HOME</h2>
		`;
	}
}