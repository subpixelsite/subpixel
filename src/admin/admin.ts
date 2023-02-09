// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property } from 'lit/decorators.js';
import { AppElement } from '../appelement.js';
import { NavButtonStyles } from '../styles.js';
// import { POSTS } from './data.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement( 'lit-admin' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AdminPage extends AppElement
{
	static styles = [
		NavButtonStyles,
		css`
		.admin-top {
			display:flex;
			flex-direction:column;
			height: calc(100vh - 120px);
			margin: 0 calc(50% - 50vw);
			margin-top: 0;
			overflow: none;
		}

		.topNav {
			background-color: #be908e;
		}

		.title-text {
			font-size: var(--sl-font-size-x-large);
		}

		.content {
			display: block;
			width: 100vw;
			margin: auto;
		}
	`];

	@property() listClass: string = '';

	@property() editorClass: string = '';

	pageNavEvent( e: Event )
	{
		const { detail } = ( e as CustomEvent );
		const active = 'pageActive';
		const inactive = 'pageInactive';

		this.listClass = ( detail === 'editlist' ) ? active : inactive;
		this.editorClass = ( detail === 'editor' ) ? active : inactive;
	}

	constructor()
	{
		super();

		this.addEventListener( 'pageNav', this.pageNavEvent );
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
				<span class="title-text">ADMIN</span>
			</div>
			<div class="navButtons">
				<sl-button class=${this.listClass}   variant="text" name="List"   href="admin/list">LIST</sl-button>
				<sl-button class=${this.editorClass} variant="text" name="Editor" href="admin/editor">EDITOR</sl-button>
			</div>
		</div>
	</nav>
	<div class="content">
		<slot></slot>
	</div>
</div>
		    `;
	}

	public onBeforeLeave()
	{
		this.removeEventListener( 'pageNav', this.pageNavEvent );
	}
}
