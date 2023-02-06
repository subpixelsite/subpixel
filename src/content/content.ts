// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement } from 'lit/decorators.js';

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
