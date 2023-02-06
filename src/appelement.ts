import { LitElement } from 'lit';
import { AfterLeaveObserver, BeforeEnterObserver, RouterLocation } from '@vaadin/router';
import { WebGL } from './webgl/webgl.js';

export class AppElement extends LitElement implements BeforeEnterObserver, AfterLeaveObserver
{
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public onBeforeEnter( location: RouterLocation ): void
	{
		window.scrollTo( 0, 0 );
	}

	public onAfterLeave(): void
	{
		// Delete created webgl elements
		const webgl = WebGL.getInstance();
		webgl.onNavigateAway();
	}
}
