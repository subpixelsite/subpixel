import { WebGLScene } from 'webgl/webglscene.js';

export interface PostData
{
	id: number;
	title: string;
	author: string;
	dateCreated: number;
	tags: string[];
	hdrJSON: any | null;
	hdrWGL: WebGLScene | null; // First priority
	hdrSVG: string; // Second priority
	hdrImg: string; // Third priority
	hdrAlt: string; // Alt text for header visual
	description: string;
	body: string;
}
