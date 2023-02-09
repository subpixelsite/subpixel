import { css } from 'lit';

export const NavButtonStyles = css`

	.navButtons > sl-button {
		margin: 10px;
		--txt-shadow-size: 8px;
		--txt-shadow-col: rgba(0, 0, 0, 0.5);
	}

	.navButtons > sl-button::part(label) {
		font-weight: var(--sl-font-weight-semibold);
		font-size: var(--sl-font-size-x-large);
		margin: 0 20px;
		text-shadow: 2px 2px var(--txt-shadow-size) var(--txt-shadow-col);
		transition: var(--sl-transition-medium) text-shadow ease;
	}
	
	.navButtons > sl-button::part(base) {
		align-items: center;
		transition: var(--sl-transition-medium) transform ease, var(--sl-transition-medium) color ease;
	}
	
	.navButtons > sl-button.pageActive::part(base) {
		color: white;
	}
	
	.navButtons > sl-button.pageInactive::part(base) {
		color: #b4b4b4;
	}

	.navButtons > sl-button::part(label):hover {
		text-shadow: 4px 4px var(--txt-shadow-size) var(--txt-shadow-col);
	}

	.navButtons > sl-button::part(base):hover {
		transform: translate(-2px, -2px);
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

	.post-visual {
		min-height: 168px;
		max-width: 328px;
		width: 328px;
		background-color: #efefef;
	}
`;
