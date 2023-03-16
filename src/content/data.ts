/* eslint-disable quotes */
/* eslint-disable max-len */
import { PostData } from './post_data.js';

export class Database
{
	// This is a singleton.
	private static instance: Database;
	public static getDB(): Database
	{
		if ( !Database.instance )
			Database.instance = new Database();

		return Database.instance;
	}

	private data: { [key: string]: PostData } = {};

	getPostData( key: string ): PostData | undefined
	{
		return this.data[key];
	}

	setPostData( key: string, datum: PostData )
	{
		this.data[key] = { ...datum };
	}

	getPostsList(): PostData[]
	{
		return Object.values( this.data );
	}

	private constructor()
	{
		this.setPostData(
			'mipmapping',
			{
				name: 'mipmapping',
				status: 2,
				title: 'Mipmapping',
				author: 'Chris Lambert',
				dateCreated: 1673735586720,
				dateModified: 1673735586720,
				tags: 'Textures, Geometry',
				hdrInline: '<div style="display:block;padding:10px">If this has no image it\'s just rendered as <i>inline</i> <a href="https://www.w3schools.com/html/">HTML</a> in the image slot with an automatic background color.</div>',
				hdrHref: '',
				hdrAlt: '',
				description:
					'What are mipmaps and why do we need them?  What is the difference between linear and anisotropic?',
				markdown: '',
				content: ''
			}
		);

		this.setPostData(
			'rasterization',
			{
				name: 'rasterization',
				status: 1,
				title: 'Rasterization',
				author: 'Chris Lambert',
				dateCreated: 1678923694583,
				dateModified: 1678923694583,
				tags: '',
				hdrInline: '',
				hdrHref: '',
				hdrAlt: '',
				description:
					'This is a WIP post and shouldn\'t show up in the list yet.',
				markdown: '',
				content: ''
			}
		);

		this.setPostData(
			'lod',
			{
				name: 'lod',
				status: 2,
				title: 'Level of Detail',
				author: 'Chris Lambert',
				dateCreated: 1673721586720,
				dateModified: 1673725586720,
				tags: 'Geometry',
				hdrInline: '',
				hdrAlt: '',
				hdrHref: 'assets/test/webgl1.json',
				description:
					'Why do I see low-resolution models pop in and out sometimes?  Why do we need them anyway?  Are there ways to avoid the pop?',
				markdown: '',
				content: ''
			}
		);

		this.setPostData(
			'texturefilters',
			{
				name: 'texturefilters',
				status: 2,
				title: 'Texture Filtering',
				author: 'Chris Lambert',
				dateCreated: 1673525586720,
				dateModified: 1673755586720,
				tags: 'Textures, Geometry',
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
				markdown: `
# Header 1 
Man I hope this works. 
- maybe a list? 
- Could be! 
- If not, I'm fucked 

*__SERIOUSLY FUCKED__* 
			`,
				content: ''
			}
		);

		this.setPostData(
			'antialiasing',
			{
				name: 'antialiasing',
				status: 2,
				title: 'Antialiasing',
				author: 'Chris Lambert',
				dateCreated: 1672725586720,
				dateModified: 1678932726683,
				tags: 'Postprocessing',
				hdrInline: '',
				hdrHref: 'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
				hdrAlt: 'A cat wondering when this is going to get done',
				description: `Why do we need it?  What is the best kind, and why can't we always do that?`,
				markdown: `**WebGL Test**  

<web-gl fontsize="24" width="100px" margin="10px" src="assets/test/webgl1.json"> </web-gl> 

<web-gl fontsize="24" src="assets/test/webgl1.json"> </web-gl> 
`,
				content: `<p class="clearfix"><strong>WebGL Test</strong>  </p><web-gl class="webglembed" fontsize="24" width="100px" margin="10px" padding="20px" src="assets/test/webgl1.json"> </web-gl><web-gl class="webglembed" fontsize="24" src="assets/test/webgl1.json"> </web-gl>`
			}
		);

		this.setPostData(
			'anisotropy',
			{
				name: 'anisotropy',
				status: 2,
				title: 'Anisotropy',
				author: 'Chris Lambert',
				dateCreated: 1673635586720,
				dateModified: 1673775586720,
				tags: 'Textures, Geometry',
				hdrInline: '',
				hdrAlt: '',
				hdrHref: '',
				description:
					"What is it?  How do you control it, and why don't you always use it?",
				markdown: `**WebGL Test**  

<web-gl src="assets/test/webgl2.json"></web-gl> 

`,
				content: `<b>WebGL Test</b><p> 

<web-gl class="webglembed" src="assets/test/webgl2.json"></web-gl> 

`
			}
		);
	}
}

export function getTagsArray( tagsString: string ): string[]
{
	return tagsString.split( /,/ ).map( tag => tag.trim() );
}

export function getTagsString( tagsArray: string[] ): string
{
	return tagsArray.join( ',' );
}
