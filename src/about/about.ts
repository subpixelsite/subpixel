// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement } from 'lit/decorators.js';

@customElement( 'lit-about' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class About extends LitElement
{
	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'about',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		return html` <h2>About the site</h2> `;
	}
}
