/* eslint-disable arrow-body-style */
/* eslint-disable quotes */
/* eslint-disable quote-props */
import { defineConfig } from '@twind/core';
// import { slate } from '@twind/preset-tailwind/colors';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetTailwind from '@twind/preset-tailwind';
import presetTypography from '@twind/preset-typography';

// eslint-disable-next-line prefer-const
let DO_HASH = true;

// Uncomment to see Twind CSS
DO_HASH = false;

if ( !DO_HASH )
	// eslint-disable-next-line no-console
	console.warn( `DEVELOPMENT BUILD: Twind CSS hash disabled` );

export default defineConfig( {
	presets: [
		presetAutoprefix(),
		presetTailwind(),
		presetTypography( { defaultColor: 'slate' } )
	],
	hash: DO_HASH,
	theme: {
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
			mono: ['Source Code Pro', 'monospace']
		},
		hash: DO_HASH,
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			'white': '#ffffff',
			'black': '#000000',
			// "gray": slate,
			"primary": {
				50: '#FFFFFF',
				100: '#F7FBFE',
				200: '#D3E8F9',
				300: '#9ACAF1',
				400: '#57A7E8',
				500: '#228ce1',
				600: '#1972BA',
				700: '#155D97',
				800: '#125081',
				900: '#0F4571',
				950: '#0A2C47'
			},
			"gray": {
				50: '#f9fafb',
				100: '#f3f4f6',
				200: '#e5e7eb',
				300: '#d1d5db',
				400: '#9ca3af',
				500: '#6b7280',
				600: '#4b5563',
				700: '#374151',
				800: '#1f2937',
				900: '#111827',
				950: '#0d131e'
			}
		}
	}
} );
