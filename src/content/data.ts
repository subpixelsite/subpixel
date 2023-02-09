/* eslint-disable max-len */
import { PostData } from './post_data.js';

export const POSTS: PostData[] = [
	{
		id: 0,
		title: 'Mipmapping',
		author: 'Chris Lambert',
		dateCreated: 1673735586720,
		dateModified: 1673735586720,
		tags: ['Textures', 'Geometry'],
		hdrInline: '<div style="display:block;padding:10px">If this has no image it\'s just rendered as <i>inline</i> <a href="https://www.w3schools.com/html/">HTML</a> in the image slot with an automatic background color.</div>',
		hdrHref: '',
		hdrAlt: '',
		description:
			'What are mipmaps and why do we need them?  What is the difference between linear and anisotropic?',
		body: ''
	},
	{
		id: 1,
		title: 'Level of Detail',
		author: 'Chris Lambert',
		dateCreated: 1673721586720,
		dateModified: 1673725586720,
		tags: ['Geometry'],
		hdrInline: '',
		hdrAlt: '',
		hdrHref: 'assets/test/webgl1.json',
		description:
			'Why do I see low-resolution models pop in and out sometimes?  Why do we need them anyway?  Are there ways to avoid the pop?',
		body: ''
	},
	{
		id: 2,
		title: 'Texture Filtering',
		author: 'Chris Lambert',
		dateCreated: 1673525586720,
		dateModified: 1673755586720,
		tags: ['Textures', 'Geometry'],
		hdrInline: `
		<svg width="100%" height="100%">
			<rect width="100%" height="100%" fill="white"/>
			<rect x="25%" y="25%" width="50%" height="50%" fill="#ff0000" />
			<line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(0,0,255);stroke-width:2" />
			<rect x="0" y="0" width="100%" height="100%" style="fill-opacity:0;stroke:black;" stroke-dasharray="8" />
		</svg>`,
		hdrHref: '',
		hdrAlt: 'A red box with a blue slash across it, signifying nothing',
		description:
			'What is the purpose of texture filtering?  Why would I ever choose blurry over sharp?',
		body: `# Header 1
Man I hope this works.
- maybe a list?
- Could be!
- If not, I'm fucked

*__SERIOUSLY FUCKED__*
		`
	},
	{
		id: 3,
		title: 'Antialiasing',
		author: 'Chris Lambert',
		dateCreated: 1672725586720,
		dateModified: 1672735586720,
		tags: ['Postprocessing'],
		hdrInline: '',
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
		author: 'Chris Lambert',
		dateCreated: 1673635586720,
		dateModified: 1673775586720,
		tags: ['Textures', 'Geometry'],
		hdrInline: '',
		hdrAlt: '',
		hdrHref: '',
		description:
			"What is it?  How do you control it, and why don't you always use it?",
		body: ''
	}
];
