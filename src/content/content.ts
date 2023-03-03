/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement } from 'lit/decorators.js';
import install from '@twind/with-web-components';
import config from '../twind.config.js';
import { Geometry, ScrollBarStyles } from '../styles.js';

const withTwind = install( config );

@customElement( 'lit-content' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Content extends withTwind( LitElement )
{
	static styles = [
		Geometry,
		ScrollBarStyles,
		css`
		`
	];

	render()
	{
		return html`
<div class="block w-[var(--pw)] m-auto overflow-x-clip overflow-y-auto bg-white font-sans h-[var(--h-content)] min-h-[var(--h-content)]">
	<slot class="lit-content"></slot>
</div>
			`;
	}
}
