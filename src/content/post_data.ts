import { DEFAULT_VARIANT } from './alert.js';

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
