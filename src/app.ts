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
import { initPostData } from './content/post_data.js';

@customElement( 'lit-app' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class App extends LitElement
{
	static styles = [
		baseStyles,
		css`
			.topNav {
				background-image: linear-gradient(to top right, rgb(191 201 241), var(--sl-color-neutral-0));
			}

			.navContent > .navButtons {
				display: flex;
				flex-wrap: wrap;
				justify-items: space-between;
			}

			.navContent {
				display: flex;
				justify-content: space-between;
				align-items: center;
				/* align-content: center; */
				gap: 10px 10px;
				padding-left: 15px;
				padding-right: 15px;
				/* padding-top: 10px;
				padding-bottom: 10px; */
				margin: auto;
				max-width: 1140px;
				overflow: visible;
			}

			.navButtons > sl-button {
				margin: 10px;
			}

			.navButtons > sl-button::part(label) {
				font-weight: var(--sl-font-weight-semibold);
				font-size: var(--sl-font-size-large);
				margin: 0 20px;
			}
			
			.navButtons > sl-button::part(base) {
				border-radius: var(--sl-border-radius-large);
				border-width: 2px;
				align-items: center;
			    box-shadow: var(--sl-shadow-medium);
				transition: var(--sl-transition-medium) transform ease, var(--sl-transition-medium) border ease;
			}
			
			.navButtons > sl-button.pageActive::part(base) {
				border-color: var(--sl-color-primary-400);
				border-width: 3px;
			}
			
			.navButtons > sl-button.pageInactive::part(base) {
				border-color: var(--sl-color-neutral-300);
			}
			
			.navButtons > sl-button::part(base):hover {
				transform: scale(1.07);
			}
			
			.navButtons > sl-button::part(base)::active {
				transform: scale(1.07);
			}
			
			.navButtons > sl-button::part(base):focus-visible {
				outline: dashed 2px var(--sl-color-primary-500);
				outline-offset: 2px;
			}

			.navBrand {
				justify-content: flex-start;
				padding-left: 15px;
				display: inline-block;
				font-family: monospace;
			}

			.brand-text {
				font-size: var(--sl-font-size-2x-large);
				font-weight: var(--sl-font-weight-bold);
				letter-spacing: 0.05em;
				color: #797979;
			}

			.brand-capital {
				font-weight: 600;
				vertical-align: text-top;
				letter-spacing: 0.00015em;
				/* color: #797979 */
			}

			.brand-lower {
				font-size: 1.75rem;
				font-weight: var(--sl-font-weight-bolder);
				vertical-align: 17%;
				/* color: #797979 */
			}

			@media(max-width: 768px) {
				.grid,
				.grid-3 {
					grid-template-columns: 1fr;
				}
			}

			@media(max-width: 520px) {
				.grid,
				.grid-3 {
					grid-template-columns: 1fr;
				}

				.flex {
					flex-direction: column;
				}

				.navContent {
					padding-bottom: 15px;
				}
			}

			.content {
				display: block;
				width: 1140px;
				padding-left: 15px;
				padding-right: 15px;
				margin: auto;
			}
			`];

	@property() homeClass: string = '';

	@property() postsClass: string = '';

	@property() aboutClass: string = '';

	constructor()
	{
		super();

		setBasePath( '/dist/shoelace' );
		initPostData();

		this.addEventListener( 'pageNav', ( e: Event ) =>
		{
			// Ugly and evil but TS is broken like this
			const { detail } = ( e as CustomEvent );

			const active = 'pageActive';
			const inactive = 'pageInactive';

			this.homeClass = ( detail === 'home' ) ? active : inactive;
			this.postsClass = ( detail === 'posts' ) ? active : inactive;
			this.aboutClass = ( detail === 'about' ) ? active : inactive;
		} );
	}

	render()
	{
		return html`
		<nav class="topNav">
			<div class="navContent">
				<div class="navBrand">
					<span class="brand-text"><span class="brand-capital">S</span><span class="brand-lower">UB</span><span class="brand-capital">P</span><span class="brand-lower">IXEL</span></span>
				</div>
				<div class="navButtons">
					<sl-button class=${this.homeClass}  name="Home"  href="/">HOME</sl-button>
					<sl-button class=${this.postsClass} name="Posts" href="posts">POSTS</sl-button>
					<sl-button class=${this.aboutClass} name="About" href="about">ABOUT</sl-button>
				</div>
			</div>
		</nav>
		<div class="content">
			<slot></slot>
		</div>
		`;
	}
}
