import { css } from 'lit';

export const Colors = css`
	* {
		--col-primary-darker: rgb( 63, 82, 97);
		--col-primary-dark: #648198;
		--col-primary-light: #7ac6ff;
		--col-primary-lighter: rgb( 185, 225, 255 );
		--col-bg-light: #efefef;
	}
`;

export const NavButtonStyles = css`

	.navButtons > sl-button {
		margin: 10px;
		--txt-shadow-size: 8px;
		--txt-shadow-col: rgba(0, 0, 0, 0.5);
	}

	.navButtons > sl-button::part(label) {
		font-weight: var(--sl-font-weight-semibold);
		font-size: var(--sl-font-size-x-large);
		margin: 0 0px;
		text-shadow: 2px 2px var(--txt-shadow-size) var(--txt-shadow-col);
		transition: var(--sl-transition-fast) text-shadow ease;
	}
	
	.navButtons > sl-button::part(base) {
		align-items: center;
		transition: var(--sl-transition-fast) transform ease, var(--sl-transition-fast) color ease;
	}
	
	.navButtons > sl-button.pageActive::part(base) {
		color: white;
	}
	
	.navButtons > sl-button.pageInactive::part(base) {
		color: var(--col-primary-light);
	}

	.navButtons > sl-button::part(label):hover {
		text-shadow: 4px 4px var(--txt-shadow-size) var(--txt-shadow-col);
	}

	.navButtons > sl-button::part(base):hover {
		transform: translate(-2px, -2px);
		color: white;
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
		color: #ffffff;
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
	}`;

export const PostStyles = css`

	* {
		--vis-width: 328px;
		--vis-height: 200px;
		--vis-bg-color: var(--col-bg-light);
		--vis-padding: 10px;
		--vis-padded-width: calc(var(--vis-width) + (var(--vis-padding) * 2));
		--vis-padded-height: calc(var(--vis-height) + (var(--vis-padding) * 2));
	}

	.post-visual {
		height: var(--vis-height);
		width: var(--vis-width);
		max-height: var(--vis-height);
		max-width: var(--vis-width);
		background-color: var(--vis-bg-color);
	}
`;
