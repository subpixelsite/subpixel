/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement } from 'lit/decorators.js';
import install from '@twind/with-web-components';
import config from '../twind.config.js';
import { Geometry, ScrollBarStyles } from '../styles.js';
import { WebGL } from '../webgl/webgl.js';

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

	pageNavEvent()
	{
		const scroller = this.shadowRoot?.getElementById( 'scroll-container' ) as HTMLDivElement;
		if ( scroller === null )
			throw new Error( "Couldn't get scroll-container div element" );
		if ( scroller !== undefined )
		{
			WebGL.setScrollListener( scroller );

			scroller.scrollTo( 0, 0 );
			scroller.scroll( 0, 0 );
		}
	}

	connectedCallback(): void
	{
		super.connectedCallback();
		this.addEventListener( 'pageNav', this.pageNavEvent );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();
		this.removeEventListener( 'pageNav', this.pageNavEvent );
		WebGL.setScrollListener( undefined );
	}

	render()
	{
		return html`
<div id="scroll-container" class="block w-[var(--pw)] m-auto overflow-x-clip overflow-y-auto bg-white font-sans h-[var(--h-content)] min-h-[var(--h-content)]">
	<slot class="lit-content"></slot>
</div>
			`;
	}
}
