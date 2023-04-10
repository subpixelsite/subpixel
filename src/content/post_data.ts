import { marshall, unmarshall, NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { DEFAULT_VARIANT } from './alert.js';

// eslint-disable-next-line no-shadow
export enum ElementType
{
	Invalid = 0,
	Post = 1,
	Tag = 2,
	Thread = 3
}

/* eslint-disable no-shadow */
export enum ElementStatus
{
	Invalid = 0,
	Hidden = 1,
	Visible = 2
}

/* eslint-disable dot-notation */
export class ElementData
{
	name: string = '';						// partition key - 							entity identifier/url
	type: number = ElementType.Post;		// sort key - 		GSI_TY partition key -	enum - 0 is invalid
	status: number = ElementStatus.Hidden;	// 					GSI_TY sort key - 		PostStatus
	title: string = '';
	author: string = 'Chris Lambert';
	dateCreated: number = Date.now();		// set on creation only
	datePosted: number = 0;					// set on save when status changes to VISIBLE
	dateModified: number = Date.now();		// set on save
	tags: string[] = [];					// array of tag strings
	hdrInline: string = '';					// inline header HTML data
	hdrHref: string = ''; 					// URL to header visual
	hdrAlt: string = ''; 					// Alt-text for header image
	description: string = '';
	markdown: string = '';
	content: string = '';
	next: string = '';
}

export class ElementDataDB
{
	pk: string = '';
	sk: string = '';
	st: string = '';
	ti: string = '';
	au: string = '';
	dc: string = '';
	dp: string = '';
	dm: string = '';
	tg: Record<string, NativeAttributeValue> = {};
	hi: string = '';
	hr: string = '';
	ha: string = '';
	de: string = '';
	md: string = '';
	co: string = '';
	ne: string = '';
}

export const recordToElementData = ( db: Record<string, NativeAttributeValue>, pk: string, sk?: string ): ElementData =>
// eslint-disable-next-line arrow-body-style
{
	return {
		name: pk,
		type: parseInt( sk ?? '1', 10 ),
		status: parseInt( db['st'] ?? '1', 10 ),
		title: db['ti'] ?? '',
		author: db['au'] ?? '',
		dateCreated: parseInt( db['dc'] ?? '0', 10 ),
		datePosted: parseInt( db['dp'] ?? '0', 10 ),
		dateModified: parseInt( db['dm'] ?? '0', 10 ),
		tags: db['tg'] !== undefined ? Array.from( db['tg'] ) : [],
		hdrInline: db['hi'] ?? '',
		hdrHref: db['hr'] ?? '',
		hdrAlt: db['ha'] ?? '',
		description: db['de'] ?? '',
		markdown: db['md'] ?? '',
		content: db['co'] ?? '',
		next: db['ne'] ?? ''
	};
};

export const dbToElementData = ( db: ElementDataDB ): ElementData =>
{
	// This function is not currently called

	const post: ElementData = {
		name: db.pk,
		type: parseInt( db.sk, 10 ),
		status: parseInt( db.st, 10 ),
		title: db.ti,
		author: db.au,
		dateCreated: parseInt( db.dc, 10 ),
		datePosted: parseInt( db.dp, 10 ),
		dateModified: parseInt( db.dm, 10 ),
		tags: [],		// This is currently incomplete
		hdrInline: db.hi,
		hdrHref: db.hr,
		hdrAlt: db.ha,
		description: db.de,
		markdown: db.md,
		content: db.co,
		next: db.ne
	};

	const tg = unmarshall( db.tg );
	console.log( `dbToElementData: tags Record: ${JSON.stringify( tg, null, 2 )}` );

	return post;
};

export const elementToDBData = ( post: ElementData ): ElementDataDB =>
{
	const db: ElementDataDB = {
		pk: post.name,
		sk: `${post.type}`,
		st: `${post.status}`,
		ti: post.title,
		au: post.author,
		dc: `${post.dateCreated}`,
		dp: `${post.datePosted}`,
		dm: `${post.dateModified}`,
		tg: marshall( post.tags ),
		hi: post.hdrInline,
		hr: post.hdrHref,
		ha: post.hdrAlt,
		de: post.description,
		md: post.markdown,
		co: post.content,
		ne: post.next
	};

	return db;
};

declare global
{
	interface Window
	{
		showdown: any;
	}
}

// let twoSpaces: { type: string; regex: RegExp; replace: string; };
let webglCache: { type: string; filter: any; };
let glCodeCache: { type: string; filter: any; };
let drawer = [];
let alert;
let bindings: { type: string; regex: RegExp; replace: string; }[] = [];
const classMap: { [key: string]: string; } = {};

// Define all the classes I want to set for each HTML tag
classMap['h1'] = 'header1';
classMap['h2'] = 'header2';
classMap['web-gl'] = 'webglembed webglpost';
classMap['svg'] = 'svgembed';
classMap['p'] = 'clearfix';
classMap['ul'] = 'unordered-list';
classMap['ol'] = 'ordered-list';

let webglCacheCounter = 0;
let drawerMatches: string[] = [];
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
			const pat = /<web-gl (?!id=)/g;
			const matches = text.match( pat );
			if ( matches === null )
				return text;
			// eslint-disable-next-line no-param-reassign
			text = text.replace( pat, () => { webglCacheCounter += 1; return `<web-gl id="${webglCacheCounter}" `; } );

			return text;
		}
	};

	glCodeCache = {
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

	drawer = [
		{
			type: 'lang',
			regex: /%drawer-start[^%]*%([^]+?)%drawer-end%/gim,
			replace: ( s: string, match: string ) =>
			{
				const matches = s.match( /%drawer-start title=([^%]+)%/i );
				let title = '';
				if ( matches !== null && matches.length === 2 )
					// eslint-disable-next-line prefer-destructuring
					title = matches[1];

				drawerMatches.push( match );
				return `%DRAWER-PLACEHOLDER---${title}---${drawerMatches.length - 1}%`;
			}
		},
		{
			type: 'output',
			filter: ( text: string ) =>
			{
				for ( let i = 0; i < drawerMatches.length; i++ )
				{
					const pat = `%DRAWER-PLACEHOLDER---(.*)---${i}%`;

					// eslint-disable-next-line max-len, no-param-reassign
					text = text.replace( new RegExp( pat, 'g' ), `<sl-details summary=$1 class="content-details">${drawerMatches[i]}</sl-details>` );
				}

				drawerMatches = [];
				return text;
			}
		}
	];

	alert = {
		type: 'lang',
		regex: /<alert([^>])*>(.)*<\/alert>/gim,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		replace: ( s: string, match: string ) =>
		{
			let variant = DEFAULT_VARIANT;
			// let icon = DEFAULT_ICON;

			const pat = /<alert([^>]*)>/i;
			const matches = s.match( pat );
			if ( matches !== null )
			{
				if ( matches.length > 1 )
				{
					// extract variant and icon if present

					// const iconMatch = s.match( /icon=(['"][^=>]+['"])/ );
					// if ( iconMatch !== null )
					// {
					// 	if ( iconMatch.length > 1 )
					// 		// eslint-disable-next-line prefer-destructuring
					// 		icon = iconMatch[1];
					// }

					const varMatch = s.match( /variant=(['"][^=>]+['"])/ );
					if ( varMatch !== null )
					{
						if ( varMatch.length > 1 )
							// eslint-disable-next-line prefer-destructuring
							variant = varMatch[1];
					}
				}
			}

			const content = s.match( /<alert[^>]*>(.*)<\/alert>/gi ) ?? '';
			return `<lit-alert variant=${variant}>${content}</lit-alert>`;
		}
	};

	converter = new window.showdown.Converter(
		{
			extensions: [
				...bindings,
				// twoSpaces,
				webglCache,
				glCodeCache,
				...drawer,
				alert
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
