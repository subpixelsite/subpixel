export interface PostData
{
	id: number;
	title: string;
	author: string;
	dateCreated: number;
	tags: string[];
	hdrInline?: string;		// inline header HTML data
	hdrHref?: string; 		// URL to header visual
	hdrAlt?: string; 		// Alt-text for header image
	description: string;
	body: string;
}

export function initPostData()
{
	window.showdown.setOption( 'strikethrough', true );
}

export function convertMDtoHTML( md: string ): string
{
	const converter = new window.showdown.Converter();
	const output = converter.makeHtml( md );
	return output;
}
