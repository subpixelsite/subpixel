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
