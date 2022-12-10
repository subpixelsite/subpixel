// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement, css } from 'lit-element';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property } from 'lit/decorators.js';
import baseStyles from '@shoelace-style/shoelace/dist/themes/light.styles.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

@customElement( 'lit-app' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class App extends LitElement
{
	static styles = [
		baseStyles,
		css`
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

			const active = 'active';
			const inactive = '';

			this.homeClass = ( detail === 'home' ) ? active : inactive;
			this.postsClass = ( detail === 'posts' ) ? active : inactive;
			this.aboutClass = ( detail === 'about' ) ? active : inactive;
		} );
	}

	render()
	{
		return html`
		<nav class="topnav">
			<a class=${this.homeClass} name="Home" href="/">Home</a>
			<a class=${this.postsClass} name="Posts" href="posts">Posts</a>
			<a class=${this.aboutClass} name="About" href="about">About</a>
		</nav>
		<div class="header">
			<h2>Lambert on Shading</h2>
		</div>

<sl-alert open>
  <sl-icon slot="icon" name="info-circle"></sl-icon>
  This is a standard alert. You can customize its content and even the icon.
</sl-alert>

		<slot></slot>
		`;
	}
};