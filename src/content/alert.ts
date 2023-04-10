/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, css, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property } from 'lit/decorators.js';
import install from '@twind/with-web-components';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import config from '../twind.config.js';
import { Geometry, PostStyles } from '../styles.js';

export const DEFAULT_VARIANT = 'primary';
export const DEFAULT_ICON = '';

const withTwind = install( config );

@customElement( 'lit-alert' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Alert extends withTwind( LitElement )
{
	static styles = [
		PostStyles,
		Geometry,
		css`
	
	sl-alert
	{
		margin: 2rem;
	}

	sl-alert::part(base)
	{
		background-color: var(--sl-color-gray-100);
		border-width: 0px;
		border-top-width: 3px;
	}

	sl-alert::part(message)
	{
		padding: 0.75rem;
		margin-left: 1rem;
		line-height: 1.5em;
	}

	`];

	@property( { type: String } )
	variant: ( 'primary' | 'success' | 'neutral' | 'warning' | 'danger' ) = DEFAULT_VARIANT

	@property( { type: String } )
	icon: string = ''

	render()
	{
		const variant: ( 'primary' | 'success' | 'neutral' | 'warning' | 'danger' ) = this.variant ?? 'primary';
		let icon = '';

		if ( this.icon === '' || this.icon === undefined )
		{
			switch ( variant ?? 'primary' )
			{
				case 'success':
					icon = 'check2-circle';
					break;
				case 'neutral':
					icon = 'gear';
					break;
				case 'warning':
					icon = 'exclamation-triangle';
					break;
				case 'danger':
					icon = 'exclamation-octagon';
					break;
				case 'primary':
				default:
					icon = 'info-circle';
					break;
			}
		}

		return html`
<sl-alert class='font-sans' variant="${variant}" open>
	<sl-icon slot="icon" name="${icon}"></sl-icon>
	<slot></slot>
</sl-alert>
`;
	}
}
