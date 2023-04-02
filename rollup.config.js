import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import html from '@web/rollup-plugin-html';
import minifyHTML from 'rollup-plugin-minify-html-literals';
// import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import styles from 'rollup-plugin-styles';
// import { generateSW } from 'rollup-plugin-workbox';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';
// import path from 'path';

const prod = process.env.BUILD === 'production';

const getPluginsConfig = () =>
{
	const OUTPUT = prod ? 'dist' : 'test';

	const config = [
		/** Enable using HTML as rollup entrypoint */
		html( {
			minify: prod
			// SERVICE WORKER
			// injectServiceWorker: true,
			// serviceWorkerPath: 'dist/sw.js'
		} ),
		copy( {
			copyOnce: true,
			targets: [
				// {
				// 	src: 'src/content/*.css',
				// 	dest: 'out-tsc/src/content'
				// },
				{
					src: '*.css',
					dest: OUTPUT
				},
				{
					src: '.htaccess',
					dest: OUTPUT
				},
				{
					src: 'assets',
					dest: OUTPUT
				},
				{
					src: '*.ico',
					dest: OUTPUT
				},
				{
					src: '*.svg',
					dest: OUTPUT
				},
				{
					src: '*.png',
					dest: OUTPUT
				},
				{
					src: 'manifest.json',
					dest: OUTPUT
				}
			]
		} ),
		commonjs( {
			// include: 'node_modules/**'
		} ),
		/** Resolve bare module imports */
		nodeResolve( {
			// jsnext: true,
			browser: true,
			extensions: ['.mjs', '.js', '.json', '.node']
			// ,
			// preferBuiltins: false
		} ),
		replace( {
			preventAssignment: true,
			'process.env.NODE_ENV': JSON.stringify( prod ? 'production' : 'development' ),
			__buildDate__: () => JSON.stringify( new Date().toLocaleString(
				'en-US',
				{
					month: 'short',
					day: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					hour12: false,
					minute: '2-digit',
					timeZoneName: 'short'
				}
			) )
		} ),
		minifyHTML(),
		/** Minify JS */
		terser(	prod
			? { // PROD
				module: true,
				ecma: 2020,
				compress: {
					unused: false,
					collapse_vars: false
				},
				output: {
					comments: false
				}
			} : { // DEV
				module: true,
				ecma: 2020,
				compress: {
					keep_infinity: true,
					pure_getters: true,
					keep_fnames: true,
					passes: 10
				},
				output: {
					comments: false
				},
				toplevel: true,
				warnings: true,
				mangle: {
					keep_fnames: true
				}
			} ),
		styles(),
		css( {
			output: 'bundle.css'
		} ),
		/** Bundle assets references via import.meta.url */
		// importMetaAssets(),
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
				],
				[
					require.resolve( 'babel-plugin-prismjs' ),
					{
						languages: ['c', 'clike', 'css', 'css-extras', 'glsl'],
						// eslint-disable-next-line max-len
						plugins: ['line-highlight', 'line-numbers', 'highlight-keywords', 'previewers', 'toolbar', 'copy-to-clipboard'],
						theme: 'okaidia',
						css: true
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
	];

	return config;
};

export default () =>
{
	// CURRENTLY BUILDING TO out-tsc AND dist at the same time in DEV mode!  Copying only to dist...
	// ... need to figure out how to do just the right thing in Dev...
	// tsc builds to out-tsc, it seems... everything else goes to dist

	// eslint-disable-next-line no-console
	console.log( `Bundling for ${prod ? 'production' : 'development'}` );

	const devBundle = {
		input: 'index.html',
		output: {
			format: 'es',
			dir: 'test',
			sourcemap: true,
			compact: false
		},
		preserveEntrySignatures: false,
		// watch: {
		// 	include: [
		// 		'src/**',
		// 		'types/**',
		// 		'./*.ts',
		// 		'./*.html',
		// 		'./*.css',
		// 		'./*.json'
		// 	]
		// },

		plugins: getPluginsConfig( prod )
	};

	const prodBundle = {
		input: 'index.html',
		output: {
			entryFileNames: '[hash].js',
			chunkFileNames: '[hash].js',
			assetFileNames: '[hash][extname]',
			format: 'es',
			dir: 'dist'
		},
		preserveEntrySignatures: false,

		plugins: getPluginsConfig( prod )
	};

	return prod ? prodBundle : devBundle;
};
