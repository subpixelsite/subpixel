/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import { Colors } from '../styles.js';

@customElement( 'lit-faq' )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class FAQ extends LitElement
{
	static styles = [
		Colors,
		css`
		* {
			--txt-shadow-size: 8px;
			--txt-shadow-col: rgba(0, 0, 0, 0.5);
		}

		.container {
			margin-top: 15px;
		}

		sl-details::part(header) {
			background-color: var( --col-primary-dark )
		}

		sl-details::part(summary) {
			font-weight: var(--sl-font-weight-semibold);
			font-size: var(--sl-font-size-x-large);
			text-shadow: 2px 2px var(--txt-shadow-size) var(--txt-shadow-col);
			color: var( --col-primary-lighter );
			transition: var(--sl-transition-fast) text-shadow ease, var(--sl-transition-fast) transform ease, var(--sl-transition-fast) color ease;
		}

		sl-details::part(summary):hover {
			text-shadow: 4px 4px var(--txt-shadow-size) var(--txt-shadow-col);
			transform: translate(-2px, -2px);
			color: white;
		}

		sl-details::part(base) {
			outline: 0px;
			border: 1px solid var( --col-primary-darker );
			background-color: var( --col-bg-light );
		}

		.legalese {
			font-size: 0.75em;
		}
`];

	render()
	{
		const event = new CustomEvent( 'pageNav', {
			detail: 'faq',
			bubbles: true,
			composed: true
		} );
		this.dispatchEvent( event );

		return html`
<div class="container">

<sl-details summary="What the hell?" class="faq">
SubPixel is a site full of answers to your questions about GPUs and real-time rendering, especially as they pertain to video games.
</sl-details>

<sl-details summary="Who the hell?" class="faq">
This site is the brain-child and work product of me, Chris Lambert, an industry veteran since 1999
with credits like Modern Warfare 2 (2008) and Titanfall to my name.
<p></p>
Trivia:
<ul>
<li>I was once described by a stranger at a game industry event, non-ironically, as a "high functioning programmer".</li>
<li>I have has no known relation to Johann Heinrich Lambert, who in <i>Photometria</i> in 1760 described the
<a href="https://en.wikipedia.org/wiki/Lambert%27s_cosine_law">"cosine law"</a>.
This formula is fundamental to real-time rendering.  The phrase "Lambert shading" is common in computer graphics, and widely known to artists.
When I introduced himself at an Infinity Ward all-hands meeting, one of the artists, upon hearing my last name,
shouted out "ohhhh SHADER" and ever since, "Shader" has been my industry nickname and callsign.</li>
</ul>
</sl-details>

<sl-details summary="How the hell?" class="faq">
Late nights, web searches, Stack Overflow, the usual.  The site is a Single Page Application written from scratch using Typescript, Rollup, lit, Vaadin Router, Shoelace, Showdown, and misc other small libraries.
<p></p>
The backend uses AWS storage, caching, and database services to provide automatically-scaling high-availability worldwide access.
<p></p>
Of the above, when I started, I knew a little Typescript.
<p></p>
</sl-details>

<sl-details summary="Who is this for, really?" class="faq">
Are you:
<ul>
	<li>A game developer who doesn't <i>really</i> grok rendering?</li>
	<li>A seasoned vet who wants to better understand the details?</li>
	<li>A rookie who wants to prep for their first job in the industry?</li>
	<li>A student looking to supplement the dreary class materials?</li>
	<li>A gamer wanting to understand what the video settings mean?</li>
	<li>A random link-clicker who got here on accident?</li>
	<li>A search engine spider, crawling for keywords crypto nft metaverse gamification blockchain?</li>
</ul>
This is (maybe) the site for you*!

<p></p><span class="legalese">* Increased understanding and sense of gratification not guaranteed.  No warranty, express or otherwise, is implied.</span>
</sl-details>

<sl-details summary="Is the author available to hire?" class="faq">
I am looking for a new position in game development.  If you think we might be a good match, you reach me on LinkedIn:
<p></p>
<a href="https://www.linkedin.com/in/clambert/">https://www.linkedin.com/in/clambert/</a>
</sl-details>


<sl-details summary="What about doing more web development?" class="faq">
Dear God, no.
<p></p>
I'm pretty sure this site took years off my life.
</sl-details>

</div>
		`;
	}
}
