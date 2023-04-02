/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
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

	@state()
	footerVisible: boolean = true;

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
		this.addEventListener( 'pageNav', () => this.pageNavEvent() );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();
		this.removeEventListener( 'pageNav', () => this.pageNavEvent() );
		WebGL.setScrollListener( undefined );
	}

	public setFooterVisible( visible: boolean )
	{
		this.footerVisible = visible;
	}

	render()
	{
		const buildType = process.env.NODE_ENV;
		const buildDateRaw = '__buildDate__';
		const res = buildDateRaw.match( /"([^"]*)"/ );
		const buildDate = ( res !== null && res.length === 2 ) ? res[1] : buildDateRaw;
		const buildString = `${buildDate} ${buildType}`;

		const display = this.footerVisible ? 'initial' : 'none';

		return html`
<div id="scroll-container" class="block w-[var(--sm-pw)] lg:w-[var(--pw)] m-auto overflow-x-clip overflow-y-auto bg-white font-sans h-[var(--sm-h-content)] min-h-[var(--sm-h-content)] lg:h-[var(--h-content)] lg:min-h-[var(--h-content)]">
	<slot class="lit-content"></slot>
	<div class='legal-footer' style='display: ${display}'>
		<div class='px-4 pb-2 mt-1 flex flex-row justify-between' style='font-size: 12px'>
			<div class='inline text-gray-600'>
				<sl-icon name='c-circle' label='Copyright' class='pr-1'></sl-icon>
				Chris Lambert 2023
			</div>
			<span class='text-gray-300'>${buildString}</span>
		</div>
	</div>
</div>
			`;
	}
}
