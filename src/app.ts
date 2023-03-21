/* eslint-disable lit-a11y/click-events-have-key-events */
/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement } from 'lit/decorators.js';
import baseStyles from '@shoelace-style/shoelace/dist/themes/light.styles.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import 'reflect-metadata';
import install from '@twind/with-web-components';
import config from './twind.config.js';
import { Geometry, Colors, NavBarStyles, ScrollBarStyles } from './styles.js';
import { quips } from './quips.js';

const withTwind = install( config );

@customElement( 'lit-app' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class App extends withTwind( LitElement )
{
	static styles = [
		baseStyles,
		Geometry,
		Colors,
		NavBarStyles,
		ScrollBarStyles,
		css`
		* {
			--pw: var(--page-width);
			--h-navbar: calc(var(--navbutton-margin) * 2 + var(--navbar-text-height));
			--h-content: calc(100vh - var(--h-navbar));
		}
		
		.max-w-pw {
			max-width: var(--pw);
		}

		.w-pw {
			width: var(--pw);
		}

		.title-link {
			position: relative;
		}

		.title {
			position: absolute;
			left: 0;
			top: 0;
		}
		`];

	@property() postsClass: string = '';

	@property() faqClass: string = '';

	pageNavEvent( e: Event )
	{
		// Ugly and evil but TS is broken like this
		const { detail } = ( e as CustomEvent );

		const active = 'pageActive';
		const inactive = 'pageInactive';

		this.postsClass = ( detail === 'posts' ) ? active : inactive;
		this.faqClass = ( detail === 'faq' ) ? active : inactive;
	}

	constructor()
	{
		super();

		setBasePath( '/' );	// Shoelace looks in '<BasePath>/assets/icons/'
	}

	connectedCallback(): void
	{
		super.connectedCallback();
		this.addEventListener( 'pageNav', e => this.pageNavEvent( e ) );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();
		this.removeEventListener( 'pageNav', e => this.pageNavEvent( e ) );
	}

	goHome(): void
	{
		window.location.href = '/';
	}

	getQuip(): string
	{
		const lines = quips.split( '\n' ).filter( str => str );
		return lines[Math.floor( Math.random() * lines.length )];
	}

	render()
	{
		return html`
		<div class="bg-gray-200 min-w-screen h-screen">
			<nav class="bg-gray-500">
				<div class="bg-primary-700 flex justify-between items-center gap-2.5 px-4 m-auto max-w-[var(--pw)] max-h-[var(--h-navbar)] overflow-visible">
					<div class="justify-start pl-4 inline-block font-mono">
						<svg width="216px" height="40px" viewBox="0 0 216 40">
							<title>SUBPIXEL</title>
							<g style="overflow:hidden; font-size:45; font-weight: 800; font-family: Fira Code">
								<defs>
									<mask id="textMask">
										<text style="fill:white;" x="0" y="35">SUBPIXEL</text>
									</mask>
									<filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
										<feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
										<feOffset in="blur" dx="2" dy="2"/>
									</filter>
								</defs>
								<g mask="url(#textMask)">
									<rect x="0" y="0" width="216" height="40" style="fill:#7f7f7f"/>
									<text style="fill: #ffffff; filter: url(#innerShadow)" x="0" y="35" @click=${() => this.goHome()} cursor="pointer">SUBPIXEL</text>
								</g>
							</g>
						</svg>
					</div>
					<div class="self-end grow justify-self-start pb-[0.25rem] text-xs text-gray-200 font-sans italic overflow-x-clip">${this.getQuip()}</div>
					<div class="navButtons pb-1 my-[var(--navbutton-margin)] min-w-max flex flex-wrap">
						<sl-button class="${this.postsClass}" variant="text" name="Posts" href="posts">POSTS</sl-button>
						<sl-button class="${this.faqClass}" variant="text" name="FAQ" href="faq">FAQ</sl-button>
					</div>
				</div>
			</nav>
			<slot></slot>
		</div>
		`;
	}
}
