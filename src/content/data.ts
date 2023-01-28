/* eslint-disable max-len */
import { PostData } from './post_data.js';

export const POSTS: PostData[] = [
	{
		id: 0,
		title: 'Mipmapping',
		author: 'Chris "Shader" Lambert',
		dateCreated: 1673735586720,
		tags: ['Textures', 'Geometry'],
		hdrInline: '<div id="inlinecontent"><h1>This is where content goes</h1></div>',
		hdrHref: undefined,
		hdrAlt: '',
		description:
			'What are mipmaps and why do we need them?  What is the difference between linear and anisotropic?',
		body: ''
	},
	{
		id: 1,
		title: 'Level of Detail',
		author: 'Chris "Shader" Lambert',
		dateCreated: 1673721586720,
		tags: ['Geometry'],
		hdrInline: undefined,
		hdrHref: 'assets/test/webgl1.json',
		description:
			'What are mipmaps and why do we need them?  What is the difference between linear and anisotropic?',
		body: ''
	},
	{
		id: 2,
		title: 'Texture Filtering',
		author: 'Chris "Shader" Lambert',
		dateCreated: 1673525586720,
		tags: ['Textures', 'Geometry'],
		hdrInline: '<svg width="100%" height="100%"><rect x="25%" y="25%" width="50%" height="50%" fill="#ff0000" />  <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(0,0,255);stroke-width:2" /></svg>',
		hdrHref: undefined,
		hdrAlt: 'A red box with a blue slash across it, signifying nothing',
		description:
			'What is the purpose of texture filtering?  Why would I ever choose blurry over sharp?',
		body: ''
	},
	{
		id: 3,
		title: 'Antialiasing',
		author: 'Chris "Shader" Lambert',
		dateCreated: 1672725586720,
		tags: ['Postprocessing'],
		hdrInline: undefined,
		hdrHref: 'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
		hdrAlt: 'A cat wondering when this is going to get done',
		description:
			"Why do we need it?  What is the best kind, and why can't we always do that?",
		body: `<b>WebGL Test</b><p>
		<web-gl width="128px" height="128px" fontsize="24" src="assets/test/webgl1.json"/><p>
		<web-gl width="100%" height="256px" fontsize="24" src="assets/test/webgl1.json"/>`
	},
	{
		id: 4,
		title: 'Anisotropy',
		author: 'Chris "Shader" Lambert',
		dateCreated: 1673635586720,
		tags: ['Textures', 'Geometry'],
		description:
			"What is it?  How do you control it, and why don't you always use it?",
		body: ''
	}
];
