import { Router } from '@vaadin/router';
import { setDefaults } from 'twgl.js';
import { WebGL } from './webgl/webgl.js';
import './app.js'; // Preload 'app' for better performance
import './webgl/webglelement.js'; // Preload 'web-gl' for better performance

const routes = [
	{
		path: '/',
		component: 'lit-app',
		children: [
			{
				path: '',
				component: 'lit-content',
				action: async () =>
				{
					await import( './content/content.js' );
				},
				children: [
					{
						path: '',
						redirect: 'home'
					},
					{
						path: 'home',
						component: 'lit-home',
						action: async () =>
						{
							await import( './content/home.js' );
						}
					},
					{
						path: 'posts',
						component: 'lit-posts',
						action: async () =>
						{
							await import( './content/post_list.js' );
						}
					},
					{
						path: 'posts/:id',
						component: 'lit-post',
						action: async () =>
						{
							await import( './content/post_item.js' );
						}
					}
				]
			},
			{
				path: 'about',
				component: 'lit-about',
				action: async () =>
				{
					await import( './about/about.js' );
				}
			},
			{
				path: 'admin',
				component: 'lit-admin',
				action: async () =>
				{
					await import( './admin/admin.js' );
				},
				children: [
					{
						path: '',
						redirect: 'admin/list'
					},
					{
						path: 'list',
						component: 'lit-editlist',
						action: async () =>
						{
							await import( './admin/editlist.js' );
						}
					},
					{
						path: 'editor/:id',
						component: 'lit-editor',
						action: async () =>
						{
							await import( './admin/editor.js' );
						}
					},
					{
						path: 'editor',
						component: 'lit-editor',
						action: async () =>
						{
							await import( './admin/editor.js' );
						}
					}
				]
			}
		]
	}
];

const outlet = document.getElementById( 'outlet' );
export const router = new Router( outlet );
router.setRoutes( routes );

// One-time TWGL and WebGL initialization here
setDefaults( { attribPrefix: 'a_' } );

const glSelector = document.querySelector( '#webgl' ) as HTMLCanvasElement;
WebGL.initContext( glSelector );
