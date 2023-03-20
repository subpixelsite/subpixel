/* eslint-disable lit-a11y/alt-text */
/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, html, LitElement } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, customElement, state } from 'lit/decorators.js';
import install from '@twind/with-web-components';
import { WebGLElement } from 'webgl/webglelement.js';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-glsl.min';
// import 'prismjs/plugins/previewers/prism-previewers.min';
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.min';
// import 'prismjs/plugins/line-highlight/prism-line-highlight.min';
// import 'prismjs/plugins/highlight-keywords/prism-highlight-keywords.min';
// import 'prismjs/plugins/toolbar/prism-toolbar.min';
// import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min';
import 'prismjs/themes/prism-okaidia.min.css';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import config from '../twind.config.js';
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { Colors, PostStyles, ScrollBarStyles } from '../styles.js';

const withTwind = install( config );

@customElement( 'gl-code' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class GLCode extends withTwind( LitElement )
{
	static styles = [
		Colors,
		PostStyles,
		ScrollBarStyles,
		css`
		// Prism
		code[class*=language-],pre[class*=language-]{color:#f8f8f2;background:0 0;text-shadow:0 1px rgba(0,0,0,.3);font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto;border-radius:.3em}:not(pre)>code[class*=language-],pre[class*=language-]{background:#272822}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#8292a2}.token.punctuation{color:#f8f8f2}.token.namespace{opacity:.7}.token.constant,.token.deleted,.token.property,.token.symbol,.token.tag{color:#f92672}.token.boolean,.token.number{color:#ae81ff}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#a6e22e}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url,.token.variable{color:#f8f8f2}.token.atrule,.token.attr-value,.token.class-name,.token.function{color:#e6db74}.token.keyword{color:#66d9ef}.token.important,.token.regex{color:#fd971f}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}
		pre[data-line]{position:relative;padding:1em 0 1em 3em}.line-highlight{position:absolute;left:0;right:0;padding:inherit 0;margin-top:1em;background:hsla(24,20%,50%,.08);background:linear-gradient(to right,hsla(24,20%,50%,.1) 70%,hsla(24,20%,50%,0));pointer-events:none;line-height:inherit;white-space:pre}@media print{.line-highlight{-webkit-print-color-adjust:exact;color-adjust:exact}}.line-highlight:before,.line-highlight[data-end]:after{content:attr(data-start);position:absolute;top:.4em;left:.6em;min-width:1em;padding:0 .5em;background-color:hsla(24,20%,50%,.4);color:#f4f1ef;font:bold 65%/1.5 sans-serif;text-align:center;vertical-align:.3em;border-radius:999px;text-shadow:none;box-shadow:0 1px #fff}.line-highlight[data-end]:after{content:attr(data-end);top:auto;bottom:.4em}.line-numbers .line-highlight:after,.line-numbers .line-highlight:before{content:none}pre[id].linkable-line-numbers span.line-numbers-rows{pointer-events:all}pre[id].linkable-line-numbers span.line-numbers-rows>span:before{cursor:pointer}pre[id].linkable-line-numbers span.line-numbers-rows>span:hover:before{background-color:rgba(128,128,128,.2)}
		pre[class*=language-].line-numbers{position:relative;padding-left:3.8em;counter-reset:linenumber}pre[class*=language-].line-numbers>code{position:relative;white-space:inherit}.line-numbers .line-numbers-rows{position:absolute;pointer-events:none;top:0;font-size:100%;left:-3.8em;width:3em;letter-spacing:-1px;border-right:1px solid #999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.line-numbers-rows>span{display:block;counter-increment:linenumber}.line-numbers-rows>span:before{content:counter(linenumber);color:#999;display:block;padding-right:.8em;text-align:right}
		.prism-previewer,.prism-previewer:after,.prism-previewer:before{position:absolute;pointer-events:none}.prism-previewer,.prism-previewer:after{left:50%}.prism-previewer{margin-top:-48px;width:32px;height:32px;margin-left:-16px;z-index:10;opacity:0;-webkit-transition:opacity .25s;-o-transition:opacity .25s;transition:opacity .25s}.prism-previewer.flipped{margin-top:0;margin-bottom:-48px}.prism-previewer:after,.prism-previewer:before{content:'';position:absolute;pointer-events:none}.prism-previewer:before{top:-5px;right:-5px;left:-5px;bottom:-5px;border-radius:10px;border:5px solid #fff;box-shadow:0 0 3px rgba(0,0,0,.5) inset,0 0 10px rgba(0,0,0,.75)}.prism-previewer:after{top:100%;width:0;height:0;margin:5px 0 0 -7px;border:7px solid transparent;border-color:rgba(255,0,0,0);border-top-color:#fff}.prism-previewer.flipped:after{top:auto;bottom:100%;margin-top:0;margin-bottom:5px;border-top-color:rgba(255,0,0,0);border-bottom-color:#fff}.prism-previewer.active{opacity:1}.prism-previewer-angle:before{border-radius:50%;background:#fff}.prism-previewer-angle:after{margin-top:4px}.prism-previewer-angle svg{width:32px;height:32px;-webkit-transform:rotate(-90deg);-moz-transform:rotate(-90deg);-ms-transform:rotate(-90deg);-o-transform:rotate(-90deg);transform:rotate(-90deg)}.prism-previewer-angle[data-negative] svg{-webkit-transform:scaleX(-1) rotate(-90deg);-moz-transform:scaleX(-1) rotate(-90deg);-ms-transform:scaleX(-1) rotate(-90deg);-o-transform:scaleX(-1) rotate(-90deg);transform:scaleX(-1) rotate(-90deg)}.prism-previewer-angle circle{fill:transparent;stroke:#2d3438;stroke-opacity:.9;stroke-width:32;stroke-dasharray:0,500}.prism-previewer-gradient{background-image:linear-gradient(45deg,#bbb 25%,transparent 25%,transparent 75%,#bbb 75%,#bbb),linear-gradient(45deg,#bbb 25%,#eee 25%,#eee 75%,#bbb 75%,#bbb);background-size:10px 10px;background-position:0 0,5px 5px;width:64px;margin-left:-32px}.prism-previewer-gradient:before{content:none}.prism-previewer-gradient div{position:absolute;top:-5px;left:-5px;right:-5px;bottom:-5px;border-radius:10px;border:5px solid #fff;box-shadow:0 0 3px rgba(0,0,0,.5) inset,0 0 10px rgba(0,0,0,.75)}.prism-previewer-color{background-image:linear-gradient(45deg,#bbb 25%,transparent 25%,transparent 75%,#bbb 75%,#bbb),linear-gradient(45deg,#bbb 25%,#eee 25%,#eee 75%,#bbb 75%,#bbb);background-size:10px 10px;background-position:0 0,5px 5px}.prism-previewer-color:before{background-color:inherit;background-clip:padding-box}.prism-previewer-easing{margin-top:-76px;margin-left:-30px;width:60px;height:60px;background:#333}.prism-previewer-easing.flipped{margin-bottom:-116px}.prism-previewer-easing svg{width:60px;height:60px}.prism-previewer-easing circle{fill:#2d3438;stroke:#fff}.prism-previewer-easing path{fill:none;stroke:#fff;stroke-linecap:round;stroke-width:4}.prism-previewer-easing line{stroke:#fff;stroke-opacity:.5;stroke-width:2}@-webkit-keyframes prism-previewer-time{0%{stroke-dasharray:0,500;stroke-dashoffset:0}50%{stroke-dasharray:100,500;stroke-dashoffset:0}100%{stroke-dasharray:0,500;stroke-dashoffset:-100}}@-o-keyframes prism-previewer-time{0%{stroke-dasharray:0,500;stroke-dashoffset:0}50%{stroke-dasharray:100,500;stroke-dashoffset:0}100%{stroke-dasharray:0,500;stroke-dashoffset:-100}}@-moz-keyframes prism-previewer-time{0%{stroke-dasharray:0,500;stroke-dashoffset:0}50%{stroke-dasharray:100,500;stroke-dashoffset:0}100%{stroke-dasharray:0,500;stroke-dashoffset:-100}}@keyframes prism-previewer-time{0%{stroke-dasharray:0,500;stroke-dashoffset:0}50%{stroke-dasharray:100,500;stroke-dashoffset:0}100%{stroke-dasharray:0,500;stroke-dashoffset:-100}}.prism-previewer-time:before{border-radius:50%;background:#fff}.prism-previewer-time:after{margin-top:4px}.prism-previewer-time svg{width:32px;height:32px;-webkit-transform:rotate(-90deg);-moz-transform:rotate(-90deg);-ms-transform:rotate(-90deg);-o-transform:rotate(-90deg);transform:rotate(-90deg)}.prism-previewer-time circle{fill:transparent;stroke:#2d3438;stroke-opacity:.9;stroke-width:32;stroke-dasharray:0,500;stroke-dashoffset:0;-webkit-animation:prism-previewer-time linear infinite 3s;-moz-animation:prism-previewer-time linear infinite 3s;-o-animation:prism-previewer-time linear infinite 3s;animation:prism-previewer-time linear infinite 3s}
		div.code-toolbar{position:relative}div.code-toolbar>.toolbar{position:absolute;z-index:10;top:.3em;right:.2em;transition:opacity .3s ease-in-out;opacity:0}div.code-toolbar:hover>.toolbar{opacity:1}div.code-toolbar:focus-within>.toolbar{opacity:1}div.code-toolbar>.toolbar>.toolbar-item{display:inline-block}div.code-toolbar>.toolbar>.toolbar-item>a{cursor:pointer}div.code-toolbar>.toolbar>.toolbar-item>button{background:0 0;border:0;color:inherit;font:inherit;line-height:normal;overflow:visible;padding:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}div.code-toolbar>.toolbar>.toolbar-item>a,div.code-toolbar>.toolbar>.toolbar-item>button,div.code-toolbar>.toolbar>.toolbar-item>span{color:#bbb;font-size:.8em;padding:0 .5em;background:#f5f2f0;background:rgba(224,224,224,.2);box-shadow:0 2px 0 0 rgba(0,0,0,.2);border-radius:.5em}div.code-toolbar>.toolbar>.toolbar-item>a:focus,div.code-toolbar>.toolbar>.toolbar-item>a:hover,div.code-toolbar>.toolbar>.toolbar-item>button:focus,div.code-toolbar>.toolbar>.toolbar-item>button:hover,div.code-toolbar>.toolbar>.toolbar-item>span:focus,div.code-toolbar>.toolbar>.toolbar-item>span:hover{color:inherit;text-decoration:none}

		.token.keyword {
			color: #66d9ef;
		}

		.token.keyword.keyword-attribute {
			color: #add4ff;
		}

		.token.keyword.keyword-varying {
			color: #73ff73;
		}

		.token.keyword.keyword-precision {
			color: #d8d8d8;
		}

		.token.keyword.keyword-uniform {
			color: #eba6e8;
		}

		.token.function {
			color: #ff7467;
		}

		.token.operator {
			color: #fff27f;
		}

		.token.punctuation {
			color: #999;
		}

		* {
			--h-panel-bar-raw: 30px;
			--h-panel-bar: calc( 30px + ( 2px * 2 ) );
			--h-panel-body: 400px;
			--h-panel: calc( var(--h-panel-body) + var(--h-panel-bar) );
			--w-panel-min: 42%;
			--w-panel-max: 75%;
			--col-frame: var(--sl-color-gray-400);
			--col-bg: var(--sl-color-gray-500);
			--col-code-bg: var(--sl-color-gray-700);
		}

		.split-panel-divider sl-split-panel {
			--divider-width: 2px;
		}
		
		.split-panel-divider sl-split-panel::part(divider) {
			background-color: var(--col-frame);
		}
		
		.split-panel-divider sl-split-panel::part(divider)::focus-visible {
			background-color: var(--sl-color-primary-600);
		}
		
		.split-panel-divider > sl-split-panel > sl-icon {
			position: absolute;
			border-radius: var(--sl-border-radius-small);
			background: var(--col-frame);
			color: var(--sl-color-neutral-0);
			padding: 0.4rem 0.05rem;
		}

		.split-panel-divider > sl-split-panel > sl-icon:hover {
			background: var(--sl-color-primary-300);
		}

		.split-panel-divider > sl-split-panel > sl-icon:active {
			background: var(--sl-color-primary-300);
		}

		.fullsize {
			width: 100%;
			margin: 0;
			padding: 0;
			display: block;
			text-align: center;
			height: 100%;
			box-sizing: border-box;
		}

		sl-tab-group::part(nav) {
			background-color: var(--col-bg);
		}

		sl-tab-group::part(base) {
			background-color: var(--col-code-bg);
		}

		sl-tab-group {
			--indicator-color: var(--sl-color-primary-300);
			--track-color: var(--sl-color-gray-600);
		}
		
		sl-tab::part(base) {
			height: var(--h-panel-bar-raw);
			color: white;
			padding-left: 10px;
			padding-right: 10px;
		}

		sl-tab::part(base):active {
			color: var(--sl-color-primary-400);
		}

		sl-tab::part(base):hover {
			color: var(--sl-color-primary-300);
		}

		sl-tab-panel code {
			font-family: 'Fira Code';
			font-size: 12px;
			line-height: 12px;
			color: white;
		}

		sl-tab-panel::part(base) {
			padding-top: 0px;
			padding-bottom: 0px;
		}

		.selectobject {
			margin-left: -0.25rem;
			margin-right: -0.25rem;
			vertical-align: middle;
		}

		.selectbutton {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
			color: white;
		}

		.selectbutton:hover {
			color: var(--sl-color-primary-300);
		}

		.scrollbox {
			height: var(--h-panel-body);
			overflow-x: auto;
			padding-left: 8px;
			min-width: 10px;
		}

		.codebox {
			box-sizing: border-box;
			overflow-x: visible;
			overflow-y: visible;
			padding-left: 0px;
			padding-right: 0px;
			min-width: 10px;
		}
		`
	];

	@property( { type: String } )
	src?: string;

	@state()
	vs: string = '';

	@state()
	fs: string = '';

	@state()
	tex: string = '';

	@state()
	fps: number = 0;

	@state()
	ms: number = 0;

	private wglElement?: WebGLElement;

	webglLoadedEvent( e: Event )
	{
		const element = ( e as CustomEvent ).detail as WebGLElement;
		this.wglElement = element;
		this.selectChange( 0 );
	}

	selectChange( d: number )
	{
		this.wglElement?.changeObjectSelection( d );

		const vsRaw = ( this.wglElement?.getSelectedVS() ?? '' ).trimStart().trimEnd();
		if ( Prism !== undefined && Prism.highlight !== undefined )
			this.vs = Prism.highlight( vsRaw, Prism.languages.glsl, 'glsl' );

		const fsRaw = ( this.wglElement?.getSelectedFS() ?? '' ).trimStart().trimEnd();
		if ( Prism !== undefined && Prism.highlight !== undefined )
			this.fs = Prism.highlight( fsRaw, Prism.languages.glsl, 'glsl' );

		this.tex = this.wglElement?.getSelectedTex() ?? '';
	}

	updateFPS( e: Event )
	{
		const event = e as CustomEvent;
		this.ms = event.detail;
		this.fps = 1000 / this.ms;
	}

	connectedCallback(): void
	{
		super.connectedCallback();

		this.addEventListener( 'webgl-loaded', e => this.webglLoadedEvent( e ) );
		this.addEventListener( 'fps-update', e => this.updateFPS( e ) );
	}

	disconnectedCallback(): void
	{
		super.disconnectedCallback();

		this.removeEventListener( 'webgl-loaded', e => this.webglLoadedEvent( e ) );
		this.removeEventListener( 'fps-update', e => this.updateFPS( e ) );
	}

	render()
	{
		const fps = this.fps.toFixed( 2 );
		const ms = this.ms.toFixed( 2 );

		return html`
<div class='split-panel-divider border-2 border-gray-400 rounded shadow'>
	<sl-split-panel class='overflow-clip' snap='50%' style='--min: var(--w-panel-min); --max: var(--w-panel-max);' primary='end' position=42>
		<sl-icon slot='divider' name='grip-vertical' style='font-size:8px'></sl-icon>
		<div slot='start' class='w-full flex flex-col bg-neutral-50'>
				<web-gl class='fullsize grow' src='${this.src ?? ''}' width='100%' height='var(--h-panel)' padr='2' padt='1'> </web-gl>
				<div class='w-full h-min flex flex-row px-1 gap-3 bg-gray-500 text-white text-xs'>
					<div class='font-mono text-[0.65rem]'>${fps} fps</div>
					<div class='font-mono text-[0.65rem]'>${ms} ms</div>
					<div class='glstatus prevent-select m-auto inline-block'>
						<span class='font-bold mr-2'>Select Object: </span>
						<sl-icon class='selectbutton selectobject' name="caret-left-fill" @click='${() => this.selectChange( -1 )}'></sl-icon>
						<sl-icon style='color:var(--sl-color-gray-300)' class='selectobject' name="dot"></sl-icon>
						<sl-icon class='selectbutton selectobject' name="caret-right-fill" @click='${() => this.selectChange( 1 )}'></sl-icon>
					</div>
				</div>
		</div>
		<div slot='end' class='h-[var(--h-panel)] inline-block w-full'>
			<sl-tab-group class='' size=small>
				<sl-tab slot='nav' panel='vs'>Vertex Shader</sl-tab>
				<sl-tab slot='nav' panel='fs'>Fragment Shader</sl-tab>
				<sl-tab slot='nav' panel='tex'>Texture</sl-tab>

				<sl-tab-panel name='vs'><div class='scrollbox'><pre class='line-numbers'><code>${unsafeHTML( this.vs )}</code></pre></div></sl-tab-panel>
				<sl-tab-panel name='fs'><div class='scrollbox'><pre className='line-numbers'><code>${unsafeHTML( this.fs )}</code></pre></div></sl-tab-panel>
				<sl-tab-panel name='tex'><img url='${this.tex}'></img></sl-tab-panel>
			</sl-tab-group>
		</div>
	</sl-split-panel>
</div>
			`;
	}
}
