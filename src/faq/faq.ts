/* eslint-disable lit/no-invalid-html */
/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import { AppElement } from '../appelement.js';
import { Geometry, Colors } from '../styles.js';

@customElement( 'lit-faq' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class FAQ extends AppElement
{
	static styles = [
		Geometry,
		Colors,
		css`
		* {
			--txt-shadow-size: 4px;
			--txt-shadow-col: rgba(0, 0, 0, 0.25);
		}

		sl-details::part(header) {
			background-color: var( --sl-color-gray-500 )
		}

		sl-details::part(summary) {
			font-weight: var(--sl-font-weight-semibold);
			font-size: var(--sl-font-size-x-large);
			text-shadow: 2px 2px var(--txt-shadow-size) var(--txt-shadow-col);
			color: var( --sl-color-gray-300 );
			transition: var(--sl-transition-fast) text-shadow ease, var(--sl-transition-fast) transform ease, var(--sl-transition-fast) color ease;
		}

		sl-details::part(summary):hover {
			text-shadow: 4px 4px var(--txt-shadow-size) var(--txt-shadow-col);
			transform: translate(-2px, -2px);
			color: white;
		}

		sl-details::part(base) {
			outline: 0px;
			border: 3px solid var( --sl-color-primary-100 );
			background-color: var( --col-bg-light );
		}

		sl-button::part(label) {
			font-size: var(--sl-font-size-large);
		}

		sl-button::part(label):hover {
			font-size: calc( var(--sl-font-size-large) * 1.07 );
			transition: var(--sl-transition-fast) font-size ease;
		}

		.sl-button::part(base) {
			margin: 2px;
			padding: 2px;
		}

		.header {
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2)
		}

		hr.rounded {
			border-top: 6px solid var(--sl-color-gray-300);
			border-radius: 4px;
		}
		`];

	scrollToElement( id: string )
	{
		this.shadowRoot?.getElementById( id )?.scrollIntoView( { behavior: 'smooth', block: 'start', inline: 'nearest' } );
	}

	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'faq',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		return html`
<div class="mx-auto px-8 py-8 w-[var(--sm-pw)] lg:w-[var(--pw)]">
<article class="prose prose-l min-w-full prose-a:text-primary-600 hover:prose-a:text-primary-500">

<h2 class="float-right header text-gray-700">Frequently Asked Questions</h2>

<sl-button variant="text" size="small" name="WTH" @click='${() => this.scrollToElement( 'whath' )}'>
	<sl-icon slot="prefix" name="caret-right" label="What the hell?"></sl-icon>
	What the hell?
</sl-button><br/>
<sl-button variant="text" size="small" name="WTH" @click='${() => this.scrollToElement( 'whoth' )}'>
	<sl-icon slot="prefix" name="caret-right" label="Who the hell?"></sl-icon>
	Who the hell?
</sl-button><br/>
<sl-button variant="text" size="small" name="WTH" @click='${() => this.scrollToElement( 'howth' )}'>
	<sl-icon slot="prefix" name="caret-right" label="How the hell?"></sl-icon>
	How the hell?
</sl-button><br/>
<sl-button variant="text" size="small" name="WTH" @click='${() => this.scrollToElement( 'who' )}'>
	<sl-icon slot="prefix" name="caret-right" label="Who is this for, really?"></sl-icon>
	Who is this for, really?
</sl-button><br/>
<sl-button variant="text" size="small" name="WTH" @click='${() => this.scrollToElement( 'work' )}'>
	<sl-icon slot="prefix" name="caret-right" label="Is the author looking for work?"></sl-icon>
	Is the author looking for work?
</sl-button><br/>

<hr class="rounded">
<h3 id='whath'>What the hell?</h3>
<p>Subpixel is a site full of answers to your questions about GPUs and real-time rendering, especially as they pertain to video games.</p>

<hr class="rounded">
<h3 id='whoth'>Who the hell?</h3>
<p>I'm Chris Lambert, and I have no one to blame but myself.&nbsp This site sounded like a good idea at the time, back when I used to sleep and didn't know what "Flash of Unstyled Content" meant.
&nbsp I'm a games industry veteran going back to 1999, with credits such as Modern Warfare 2 (2009) and Titanfall to my name.</p>
<p>Trivia:</p>
<ul>
<li>I have no known relation to Johann Heinrich Lambert, who in <i>Photometria</i> (1760) described the
<a href="https://en.wikipedia.org/wiki/Lambert%27s_cosine_law">"cosine law"</a>, the formula fundamental to real-time rendering (and many other descriptions of natural phenomena, like physics).</li>
<li>"<a href="https://en.wikipedia.org/wiki/Lambertian_reflectance">Lambert shading</a>" is common in computer graphics, and widely known to artists.&nbsp <a href="https://en.wikipedia.org/wiki/Nominative_determinism">Nominative determinism</a> strikes again.</li>
<li>When I introduced myself at my first Infinity Ward all-hands meeting, I gave my full name and one of the artists 
shouted out "ohhhh SHADER".&nbsp Ever since, "Shader" has been my industry nickname / callsign.</li>
</ul>

<hr class="rounded">
<h3 id='howth'>How the hell?</h3>
<p>Late nights, trial and error, Stack Overflow... you know, the usual.</p>
<p>This site was developed mostly according to a production plan maintained in <a href="https://clickup.com/">ClickUp</a> and a personal To-Do file format I've been using for decades:</p>
<div class='w-full block'>
	<img class='mb-1' alt="CML, the Chris Markup Language" src="/assets/images/cml.png">
	<div class='w-full inline-block mb-3'>
		<div class='text-center text-sm'>
			CML, the Chris Markup Language
		</div>
	</div>
</div>
<p>The site itself is a Single Page Application written from scratch using <a href="https://www.typescriptlang.org/">Typescript</a>, <a href="https://lit.dev/">lit</a>,
<a href="https://github.com/vaadin/router">Vaadin Router</a>, <a href="https://shoelace.style/">Shoelace</a>, <a href="https://twind.dev/">Twind</a>,
<a href="https://showdownjs.com/">Showdown</a>, <a href="https://prismjs.com/">PrismJS</a>, and miscellaneous other libraries.</p>
<p>The backend uses AWS <a href="https://aws.amazon.com/s3/">storage</a>, <a href="https://aws.amazon.com/cloudfront/">caching</a>, and <a href="https://aws.amazon.com/products/databases/">database</a>
services to provide automatically-scaling high-availability worldwide access.&nbsp In theory.&nbsp In theory, theory is the same as practice... just not in practice.</p>
<p>Of the above, when I started developing the site in the second half of 2022, I knew a little Typescript.</p>

<hr class="rounded">
<h3 id='who'>Who is this for, really?</h3>
<p>Well, are you:</p>
<ul>
	<li>A game developer who doesn't <i>really</i> grok rendering?</li>
	<li>A seasoned vet who wants to better understand the details?</li>
	<li>A rookie who wants to prep for their first job in the industry?</li>
	<li>A student looking to supplement the dreary class materials?</li>
	<li>A gamer wanting to understand what the video settings mean?</li>
	<li>A random link-clicker who got here on accident?</li>
	<li>A search engine spider, crawling for keywords crypto nft metaverse gamification blockchain?</li>
</ul>
<p>This is (maybe) the site for you*!</p>
<p><span class="text-xs">* Increased understanding and/or sense of gratification not guaranteed.</span></p>

<hr class="rounded">
<h3 id='work'>Is the author looking for work?</h3>
<p>Perhaps!  You can find me on <a href="https://www.linkedin.com/in/clambert/">LinkedIn</a>.</p>

<hr class="rounded">
</article>
</div>
		`;
	}
}
