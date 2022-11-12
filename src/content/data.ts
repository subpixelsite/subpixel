import { Post } from './post.js'

export const POSTS: Post[] = 
[
	{
		id: 0,
		title: 'Mipmapping',
		author: 'Chris Lambert',
		dateCreated: 0,
		tags: ['Textures', 'Geometry'],
		description: 'What are mipmaps and why do we need them?  What is the difference between linear and anisotropic?',
		body: '',
	},
	{
		id: 1,
		title: 'Texture Filtering',
		author: 'Chris Lambert',
		dateCreated: 0,
		tags: ['Textures', 'Geometry'],
		description: 'What is the purpose of texture filtering?  Why would I ever choose blurry over sharp?',
		body: '',
	},
	{
		id: 2,
		title: 'Antialiasing',
		author: 'Chris Lambert',
		dateCreated: 0,
		tags: ['Postprocessing'],
		description: 'Why do we need it?  What is the best kind, and why can\'t we always do that?',
		body: '',
	}
];