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
import { NavButtonStyles } from './styles.js';
import { initPostData } from './content/post_data.js';

@customElement( 'lit-app' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class App extends LitElement
{
	static styles = [
		baseStyles,
		NavButtonStyles,
		css`
		.topNav {
			background-color: #6d90ab;
		}

		.title-capital {
			font-weight: 600;
			vertical-align: text-top;
			letter-spacing: 0.00015em;
		}

		.title-lower {
			font-size: 1.75rem;
			font-weight: var(--sl-font-weight-bolder);
			vertical-align: 17%;
		}

		.content {
			display: block;
			width: 1140px;
			padding-left: 15px;
			padding-right: 15px;
			margin: auto;
			overflow: none;
		}
		`];

	@property() homeClass: string = '';

	@property() postsClass: string = '';

	@property() aboutClass: string = '';

	pageNavEvent( e: Event )
	{
		// Ugly and evil but TS is broken like this
		const { detail } = ( e as CustomEvent );

		const active = 'pageActive';
		const inactive = 'pageInactive';

		this.homeClass = ( detail === 'home' ) ? active : inactive;
		this.postsClass = ( detail === 'posts' ) ? active : inactive;
		this.aboutClass = ( detail === 'about' ) ? active : inactive;
	}

	constructor()
	{
		super();

		setBasePath( '/dist/shoelace' );
		initPostData();

		this.addEventListener( 'pageNav', this.pageNavEvent );
	}

	render()
	{
		return html`
		<nav class="topNav">
			<div class="navContent">
				<div class="navTitle">
					<span class="title-text"><span class="title-capital">S</span><span class="title-lower">UB</span><span class="title-capital">P</span><span class="title-lower">IXEL</span></span>
				</div>
				<div class="navButtons">
					<sl-button class=${this.homeClass}  variant="text" name="Home"  href="/">HOME</sl-button>
					<sl-button class=${this.postsClass} variant="text" name="Posts" href="posts">POSTS</sl-button>
					<sl-button class=${this.aboutClass} variant="text" name="About" href="about">ABOUT</sl-button>
				</div>
			</div>
		</nav>
		<div class="content">
			<slot></slot>
		</div>
		`;
	}

	public onBeforeLeave()
	{
		this.removeEventListener( 'pageNav', this.pageNavEvent );
	}
}
