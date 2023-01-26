/* eslint-disable max-len */
import { AnimBlendMode, AnimLoopMode } from '../webgl/webglscene.js';
import { PostData } from './post_data.js';

export const POSTS: PostData[] = [
	{
		id: 0,
		title: 'Mipmapping',
		author: 'Chris "Shader" Lambert',
		dateCreated: 1673735586720,
		tags: ['Textures', 'Geometry'],
		hdrJSON: null,
		hdrWGL: {
			fovYDeg: 45,
			lookAt: [0, 1, 0],
			objects: [
				{
					vs: 'pos.vs',
					fs: 'col.fs',
					xform: [],
					plane: {
						width: 4,
						height: 4
					}
				},
				{
					vs: 'postex.vs',
					fs: 'tex.fs',
					anim: {
						mode: AnimBlendMode.Linear,
						loop: AnimLoopMode.PingPong
					},
					xform: [
						{
							pos: [-1.0, 0.5, -1.0],
							key: { time: 0.0 }
						},
						{
							pos: [1.0, 0.5, -1.0],
							key: { time: 2.0, modeIn: AnimBlendMode.Sine }
						},
						{
							pos: [1.0, 0.5, 1.0],
							key: { time: 4.0, modeIn: AnimBlendMode.Discrete }
						},
						{
							pos: [-1.0, 0.5, 1.0],
							key: { time: 6.0, modeIn: AnimBlendMode.Sine }
						},
						{
							pos: [-1.0, 0.5, -1.0],
							key: { time: 8.0 }
						}
					],
					cube: {
						size: 1
					},
					diffuse: {
						url: 'https://farm6.staticflickr.com/5795/21506301808_efb27ed699_q_d.jpg',
						min: WebGLRenderingContext.NEAREST,
						mag: WebGLRenderingContext.NEAREST
					},
					color: [
						{
							color: [0, 0.0, 0.0],
							alpha: 1.0,
							key: { time: 0.0 }
						},
						{
							color: [0, 1.0, 1.0],
							alpha: 1.0,
							key: { time: 4.75, modeIn: AnimBlendMode.Sine }
						},
						{
							color: [0, 0.0, 1.0],
							alpha: 1.0,
							key: { time: 5.0 }
						},
						{
							color: [0, 0.0, 0.0],
							alpha: 1.0,
							key: { time: 8.0 }
						}
					]
				},
				{
					vs: 'pos.vs',
					fs: 'col.fs',
					xform: [{
						pos: [0, 2, 0]
					}],
					sphere: {
						radius: 1
					}
				}
			]
		},
		hdrSVG: '',
		hdrImg: '',
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
		hdrURL: 'assets/test/webgl1.json',
		hdrJSON: null,
		hdrWGL: null,
		hdrSVG: '',
		hdrImg: '',
		hdrAlt: '',
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
		hdrJSON: null,
		hdrWGL: null,
		hdrSVG: '<rect x="25%" y="25%" width="50%" height="50%" fill="#ff0000" />  <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(0,0,255);stroke-width:2" /> ',
		hdrImg: 'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
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
		hdrJSON: null,
		hdrWGL: null,
		hdrSVG: '',
		hdrImg: 'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
		hdrAlt: 'A cat wondering when this is going to get done',
		description:
			"Why do we need it?  What is the best kind, and why can't we always do that?",
		body: ''
	},
	{
		id: 4,
		title: 'Anisotropy',
		author: 'Chris "Shader" Lambert',
		dateCreated: 1673635586720,
		tags: ['Textures', 'Geometry'],
		hdrJSON: null,
		hdrWGL: null,
		hdrSVG: '',
		hdrImg: '',
		hdrAlt: '',
		description:
			"What is it?  How do you control it, and why don't you always use it?",
		body: ''
	}
];
