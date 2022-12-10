// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement, css } from 'lit-element';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property } from 'lit/decorators.js';
import baseStyles from '@shoelace-style/shoelace/dist/themes/light.styles.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

@customElement( 'lit-app' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class App extends LitElement
{
	static styles = [
		baseStyles,
		css`
			.topnav {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-evenly ;// + safe;
				align-items: center;
				/* align-content: center; */
				gap: 0 10px;
				/* padding-left: 10px;
				padding-right: 10px; */
				/* padding-top: 10px;
				padding-bottom: 10px; */
				background-image: linear-gradient(to top right, rgb(191 201 241), var(--sl-color-neutral-0));
				margin: 0 auto;
				max-width: 1200px;
				overflow: visible;
			}

			.topnav > sl-button::part(label) {
				font-weight: var(--sl-font-weight-semibold);
				font-size: var(--sl-font-size-large);
				margin: 0 20px;
			}
			
			.topnav > sl-button::part(base) {
				border-radius: var(--sl-border-radius-large);
				border-width: 2px;
				align-items: center;
			    box-shadow: var(--sl-shadow-medium);
				transition: var(--sl-transition-medium) transform ease, var(--sl-transition-medium) border ease;
			}
			
			.topnav > sl-button.pageActive::part(base) {
				border-color: var(--sl-color-primary-500);
			}
			
			.topnav > sl-button.pageInactive::part(base) {
				border-color: var(--sl-color-neutral-300);
			}
			
			.topnav > sl-button::part(base):hover {
				transform: scale(1.07);
			}
			
			.topnav > sl-button::part(base)::active {
				transform: scale(1.07);
			}
			
			.topnav > sl-button::part(base):focus-visible {
				outline: dashed 2px var(--sl-color-primary-500);
				outline-offset: 2px;
			}

			.title {
				display: flex;
				justify-content: flex-start;
				padding-left: 0px;
			}

			.title > h2 {
				font-size: var(--sl-font-size-x-large);
			}
			`];

	@property() homeClass: string = '';

	@property() postsClass: string = '';

	@property() aboutClass: string = '';

	constructor()
	{
		super();

		setBasePath( '/dist/shoelace' );

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
		<nav>
			<div class="topnav">
				<div class="title">
					<h2>Lambert on Shading</h2>
				</div>
				<sl-button class=${this.homeClass}  name="Home"  href="/">HOME</sl-button>
				<sl-button class=${this.postsClass} name="Posts" href="posts">POSTS</sl-button>
				<sl-button class=${this.aboutClass} name="About" href="about">ABOUT</sl-button>
			</div>
		</nav>

		<slot></slot>
		`;
	}
};