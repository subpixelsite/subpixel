// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement } from 'lit/decorators.js';

@customElement( 'lit-home' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Home extends LitElement
{
	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'home',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		return html` <h2>This is HOME</h2> `;
	}
}
