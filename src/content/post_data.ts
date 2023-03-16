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

let bindings: { type: string; regex: RegExp; replace: string; }[] = [];
const classMap: { [key: string]: string; } = {};

// Define all the classes I want to set for each HTML tag
classMap['h1'] = 'header1';
classMap['h2'] = 'header2';
classMap['web-gl'] = 'webglembed';
classMap['svg'] = 'svgembed';
classMap['p'] = 'clearfix';

export function initPostData()
{
	bindings = Object.keys( classMap )
		.map( key => ( {
			type: 'output',
			regex: new RegExp( `<${key}(.*)>`, 'g' ),
			replace: `<${key} class="${classMap[key]}" $1>`
		} ) );

	window.showdown.setOption( 'strikethrough', true );
}

export function convertMDtoHTML( md: string ): string
{
	const converter = new window.showdown.Converter(
		{
			extensions: [
				...bindings
			]
		}
	);
	converter.setOption( 'smoothLivePreview', true );
	converter.setOption( 'simpleLineBreaks', true );
	const output = converter.makeHtml( md );
	return output;
}
