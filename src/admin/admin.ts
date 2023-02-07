// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property } from 'lit/decorators.js';
import { AppElement } from '../appelement.js';
// import { POSTS } from './data.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement( 'lit-admin' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AdminPage extends AppElement
{
	static styles = css`
		.admin-top {
			display:flex;
			flex-direction:column;
			height: calc(100vh - 180px);
			margin: 0 calc(50% - 50vw);
			margin-top: 0;
		}

		.topNav {
			background-image: linear-gradient(to top right, rgb(241 201 191), var(--sl-color-neutral-0));
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
			gap: 10px 10px;
			padding-left: 15px;
			padding-right: 15px;
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

		.navTitle {
			justify-content: flex-start;
			padding-left: 15px;
			display: inline-block;
			font-family: monospace;
		}

		.title-text {
			font-size: var(--sl-font-size-2x-large);
			font-weight: var(--sl-font-weight-bold);
			letter-spacing: 0.05em;
			color: #797979;
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
			width: 100vw;
			margin: auto;
		}
	`;

	@property() editorClass: string = '';

	constructor()
	{
		super();

		this.addEventListener( 'pageNav', ( e: Event ) =>
		{
			const { detail } = ( e as CustomEvent );
			const active = 'pageActive';
			const inactive = 'pageInactive';

			this.editorClass = ( detail === 'editor' ) ? active : inactive;
		} );
	}

	protected firstUpdated(): void
	{
		this.loadWebGL();
	}

	async loadWebGL()
	{
		await import( '../webgl/webglelement.js' );
	}

	render()
	{
		return html`
<div class="admin-top">
	<nav class="topNav">
		<div class="navContent">
			<div class="navTitle">
				<span class="title-text">ADMINISTRATION</span>
			</div>
			<div class="navButtons">
				<sl-button class=${this.editorClass} name="Editor" href="admin/editor">EDITOR</sl-button>
			</div>
		</div>
	</nav>
	<div class="content">
		<slot></slot>
	</div>
</div>
		    `;
	}
}
