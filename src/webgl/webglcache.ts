import { WebGLViewport } from './webglviewport.js';

export class CachedViewport
{
	public divID: string;
	public html: string;
	public viewport: WebGLViewport;

	constructor( divID: string, html: string, viewport: WebGLViewport )
	{
		this.divID = divID;
		this.html = html;
		this.viewport = viewport;
	}
}
