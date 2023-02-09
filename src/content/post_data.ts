/* eslint-disable dot-notation */
export class PostData
{
	id: number = -1;
	title: string = '';
	author: string = 'Chris Lambert';
	dateCreated: number = Date.now();
	dateModified: number = Date.now();
	tags: string = '';			// comma-delimited list of tags
	hdrInline: string = '';		// inline header HTML data
	hdrHref: string = ''; 		// URL to header visual
	hdrAlt: string = ''; 		// Alt-text for header image
	description: string = '';
	body: string = '';
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
			replace: `<${key} class="${classMap[key]}" $1`
		} ) );

	window.showdown.setOption( 'strikethrough', true );
}

export function convertMDtoHTML( md: string ): string
{
	const converter = new window.showdown.Converter(
		{ extensions: [...bindings] }
	);
	const output = converter.makeHtml( md );
	return output;
}
