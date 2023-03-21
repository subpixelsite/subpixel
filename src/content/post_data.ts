/* eslint-disable no-shadow */
export enum PostStatus
{
	Invalid = 0,
	Hidden = 1,
	Visible = 2
}

/* eslint-disable dot-notation */
export class PostData
{
	name: string = '';
	status: number = PostStatus.Hidden;
	title: string = '';
	author: string = 'Chris Lambert';
	dateCreated: number = Date.now();	// set on creation only
	datePosted: number = 0;				// set on save when status changes to VISIBLE
	dateModified: number = Date.now();	// set on save
	tags: string = '';					// comma-delimited list of tags
	hdrInline: string = '';				// inline header HTML data
	hdrHref: string = ''; 				// URL to header visual
	hdrAlt: string = ''; 				// Alt-text for header image
	description: string = '';
	markdown: string = '';
	content: string = '';
}

declare global
{
	interface Window
	{
		showdown: any;
	}
}

// let twoSpaces: { type: string; regex: RegExp; replace: string; };
let webglCache: { type: string; filter: any; };
let bindings: { type: string; regex: RegExp; replace: string; }[] = [];
const classMap: { [key: string]: string; } = {};

// Define all the classes I want to set for each HTML tag
classMap['h1'] = 'header1';
classMap['h2'] = 'header2';
classMap['web-gl'] = 'webglembed';
classMap['svg'] = 'svgembed';
classMap['p'] = 'clearfix';

let webglCacheCounter = 0;
let converter: { setOption: ( arg0: string, arg1: boolean ) => void; makeHtml: ( arg0: string ) => any; } | undefined;

export function initPostData()
{
	bindings = Object.keys( classMap )
		.map( key => ( {
			type: 'output',
			regex: new RegExp( `<${key}(.*)>`, 'g' ),
			replace: `<${key} class="${classMap[key]}" $1>`
		} ) );

	// twoSpaces = {
	// 	type: 'lang',
	// 	// regex: /\. [^ ]*/gi,
	// 	regex: /\. +/gi,
	// 	replace: '.\u00a0 '
	// };

	webglCache = {
		type: 'output',
		filter: ( text: string ) =>
		{
			const pat = /<gl-code (?!id=)/g;
			const matches = text.match( pat );
			if ( matches === null )
				return text;
			// eslint-disable-next-line no-param-reassign
			text = text.replace( pat, () => { webglCacheCounter += 1; return `<gl-code id="${webglCacheCounter}" `; } );

			return text;
		}
	};

	converter = new window.showdown.Converter(
		{
			extensions: [
				...bindings,
				// twoSpaces,
				webglCache
			]
		}
	);
	if ( converter === undefined )
		throw new Error( 'Converter is undefined!' );
	converter.setOption( 'smoothLivePreview', true );
	converter.setOption( 'simpleLineBreaks', true );
}

export function convertMDtoHTML( md: string ): string
{
	webglCacheCounter = 0;
	const output = converter!.makeHtml( md );
	return output;
}
