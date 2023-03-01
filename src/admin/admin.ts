/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property } from 'lit/decorators.js';
import { AppElement } from '../appelement.js';
import { Geometry, NavBarStyles } from '../styles.js';
// import { POSTS } from './data.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement( 'lit-admin' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AdminPage extends AppElement
{
	static styles = [
		NavBarStyles,
		Geometry,
		css`
		* {
			--h-admin-top: calc(100vh - var( --h-navbar ) * 2 );
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

		this.loadWebGL();
	}

	async loadWebGL()
	{
		await import( '../webgl/webglelement.js' );
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
	}

	render()
	{
		return html`
<div class="flex flex-col align-middle !w-screen h-[var(--h-admin-top)] mt-0 font-sans bg-gray-200">
	<nav class="bg-gray-500">
		<div class="bg-[#ba2828] pb-1 flex justify-between items-center gap-2.5 px-4 m-auto w-pw max-w-pw overflow-visible h-[var(--h-navbar)]">
			<div class="justify-start pl-5 inline-block">
				<span class="inline-block align-top title-text text-4xl text-white font-mono font-semibold">ADMIN</span>
			</div>
			<div class="navButtons">
				<sl-button class=${this.listClass}   variant="text" name="List"   href="admin/list">LIST</sl-button>
				<sl-button class=${this.editorClass} variant="text" name="Editor" href="admin/editor">EDITOR</sl-button>
			</div>
		</div>
	</nav>
	<div class="block w-full m-auto">
		<slot></slot>
	</div>
</div>
		    `;
	}
}
