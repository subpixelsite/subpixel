// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement, css } from 'lit-element';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property } from 'lit/decorators.js';

@customElement('lit-app')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class App extends LitElement {

	static styles = css`
	.header {
		padding: 20px;
		font-size: 25px;
		text-align: center;
		background: white;
	}

	.topnav {
		background-color: #4f4c4c;
		overflow: hidden;
	}

	.topnav a {
		float: left;
		color: #f2f2f2;
		text-align: center;
		padding: 14px 16px;
		text-decoration: none;
		font-size: 17px;
	}

	.topnav a:hover {
		background-color: #ddd;
		color: black;
	}

	.topnav a.active {
		background-color: #008CBA;
		color: white;
	}
	`;

	@property() homeClass: string = '';

	@property() postsClass: string = '';
	
	@property() aboutClass: string = '';

	constructor()
	{
		super();

		this.addEventListener('pageNav', (e: Event) => 
		{
			// Ugly and evil but TS is broken like this
			const {detail} = (e as CustomEvent);

			const active = 'active';
			const inactive = '';

			this.homeClass = (detail === 'home') ? active : inactive;
			this.postsClass = (detail === 'posts') ? active : inactive;
			this.aboutClass = (detail === 'about') ? active : inactive;
		});
	}

	render() {
		return html`
		<div class="topnav">
			<a class=${this.homeClass} name="Home" href="/">Home</a>
			<a class=${this.postsClass} name="Posts" href="posts">Posts</a>
			<a class=${this.aboutClass} name="About" href="about">About</a>
		</div>
		<div class="header">
			<h2>Lambert on Shading</h2>
		</div>

		<slot></slot>
		`;
	}
};