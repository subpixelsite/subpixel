import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import html from '@web/rollup-plugin-html';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { terser } from '@rollup/plugin-terser';
// import { generateSW } from 'rollup-plugin-workbox';
// import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';
// import path from 'path';

export default {
	input: 'index.html',
	output: {
		entryFileNames: '[hash].js',
		chunkFileNames: '[hash].js',
		assetFileNames: '[hash][extname]',
		format: 'es',
		dir: 'dist'
	},
	preserveEntrySignatures: false,

	plugins: [
		/** Enable using HTML as rollup entrypoint */
		html( {
			minify: true
			// SERVICE WORKER
			// injectServiceWorker: true,
			// serviceWorkerPath: 'dist/sw.js'
		} ),
		/** Resolve bare module imports */
		nodeResolve( {
			browser: true
		} ),
		minifyHTML(),
		/** Minify JS */
		terser( {
			module: true,
			ecma: 2020,
			compress: {
				unused: false,
				collapse_vars: false
			},
			output: {
				comments: false
			}
		} ),
		// css( {
		// 	output: 'bundle.css'
		// } ),
		copy( {
			copyOnce: true,
			targets: [
				{
					src: '.htaccess',
					dest: 'dist'
				},
				// {
				// 	src: '*.css',
				// 	dest: 'dist'
				// },
				{
					src: 'assets',
					dest: 'dist'
				},
				{
					src: '*.ico',
					dest: 'dist'
				},
				{
					src: '*.svg',
					dest: 'dist'
				},
				{
					src: '*.png',
					dest: 'dist'
				},
				{
					src: 'manifest.json',
					dest: 'dist'
				}
			]
		} ),
		/** Bundle assets references via import.meta.url */
		importMetaAssets(),
		/** Compile JS to a lower language target */
		babel( {
			babelHelpers: 'bundled',
			exclude: 'node_modules/**',
			presets: [
				[
					require.resolve( '@babel/preset-env' ),
					{
						targets: [
							'last 3 Chrome major versions',
							'last 3 Firefox major versions',
							'last 3 Edge major versions',
							'last 3 Safari major versions'
						],
						modules: false,
						bugfixes: true
					}
				]
			],
			plugins: [
				[
					require.resolve( 'babel-plugin-template-html-minifier' ),
					{
						modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
						failOnError: false,
						strictCSS: true,
						htmlMinifier: {
							collapseWhitespace: true,
							conservativeCollapse: true,
							removeComments: true,
							caseSensitive: true,
							minifyCSS: true
						}
					}
				]
			]
		} )
		/** Create and inject a service worker */
		// SERVICE WORKER
		// generateSW( {
		// 	globIgnores: ['polyfills/*.js', 'nomodule-*.js'],
		// 	navigateFallback: '/index.html',
		// 	// where to output the generated sw
		// 	swDest: path.join( 'dist', 'sw.js' ),
		// 	// directory to match patterns against to be precached
		// 	globDirectory: path.join( 'dist' ),
		// 	// cache any html js and css by default
		// 	globPatterns: ['**/*.{html,js,css,webmanifest}'],
		// 	skipWaiting: true,
		// 	clientsClaim: true,
		// 	runtimeCaching: [{ urlPattern: 'polyfills/*.js', handler: 'CacheFirst' }]
		// } )
	]
};
