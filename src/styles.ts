import { css } from 'lit';

export const Geometry = css`
	* {
		--page-width: 60rem;
		--post-gap: 2rem;
	}
`;

export const Colors = css`
	* {
		--col-bg-light: #efefef;
	}
	/* Shoelace theme - #1b8ceb, #70889d */
	:root,
	:host,
	.sl-theme-light {
		--sl-color-primary-50: #FFFFFF;
		--sl-color-primary-100: #FCFEFF;
		--sl-color-primary-200: #D6EAFB;
		--sl-color-primary-300: #9ACCF6;
		--sl-color-primary-400: #53A8F0;
		--sl-color-primary-500: #1b8ceb;
		--sl-color-primary-600: #1172C4;
		--sl-color-primary-700: #0E5DA0;
		--sl-color-primary-800: #0C5089;
		--sl-color-primary-900: #0A4577;
		--sl-color-primary-950: #072C4B;

		--sl-color-gray-50: #f9fafb;
		--sl-color-gray-100: #f3f4f6;
		--sl-color-gray-200: #e5e7eb;
		--sl-color-gray-300: #d1d5db;
		--sl-color-gray-400: #9ca3af;
		--sl-color-gray-500: #6b7280;
		--sl-color-gray-600: #4b5563;
		--sl-color-gray-700: #374151;
		--sl-color-gray-800: #1f2937;
		--sl-color-gray-900: #111827;
		--sl-color-gray-950: #0d131e;
	}

	:root {
		a {
			color: red;
		}
	}

	sl-tag.tag::part(base) {
		border-color: var(--sl-color-primary-600);
		background-color: var(--sl-color-primary-200);
	}
`;

export const NavBarStyles = css`

	* {
		--navbutton-margin: 4px;
		/* specified in svg */
		--navbar-text-height: 40px;
	}

	.navButtons > sl-button {
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
		color: var(--sl-color-gray-400);
	}

	.navButtons > sl-button::part(label):hover {
		text-shadow: 4px 4px var(--txt-shadow-size) var(--txt-shadow-col);
	}

	.navButtons > sl-button::part(base):hover {
		transform: translate(-2px, -2px);
		color: white;
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
		--post-width: 400px;
		--vis-padding: 16px;
		--vis-width: calc(var(--post-width) - var(--vis-padding) * 2);
		--vis-height: 200px;
		--vis-bg-color: var(--col-bg-light);
		--vis-padded-width: calc(var(--vis-width) + (var(--vis-padding) * 2));
		--vis-padded-height: calc(var(--vis-height) + (var(--vis-padding) * 2));
		--vis-image-border: 2px;
	}
`;

export const ScrollBarStyles = css`
	* {
		--sb-thumb: var(--sl-color-gray-500);
		--sb-thumb-hover: var(--sl-color-gray-400);
		--sb-thumb-active: var(--sl-color-gray-500);
		--sb-track: var(--sl-color-gray-300);
	}

	/* Works on Firefox */
	* {
	scrollbar-width: auto;
	scrollbar-color: var(--sb-thumb) var(--sb-track);
	transition: scrollbar-color 0.3s ease-out;
	}

	*:hover {
	scrollbar-color: var(--sb-thumb-hover);
	}

	*:active {
	scrollbar-color: var(--sb-thumb-active);
	}

	/* Works on Chrome, Edge, and Safari */
	*::-webkit-scrollbar {
	width: 20px;
	}

	*::-webkit-scrollbar-track {
	background: var(--sb-track);
	}

	*::-webkit-scrollbar-thumb {
	background-color: var(--sb-thumb);
	border-radius: 20px;
	border: 3px solid var(--sb-track);
	}

	*::-webkit-scrollbar-thumb:hover {
	background-color: var(--sb-thumb-hover);
	}

	*::-webkit-scrollbar-thumb:active {
	background-color: var(--sb-thumb-active);
	}
`;
