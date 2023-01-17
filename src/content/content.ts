// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement, css } from 'lit-element';

@customElement( 'lit-content' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Content extends LitElement
{
	static styles = css`
		/* .lit-content { 
		} */
	`;

	render()
	{
		return html` <slot class="lit-content"></slot> `;
	}
}
