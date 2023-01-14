// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LitElement, html, customElement } from 'lit-element';

@customElement('lit-content')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Content extends LitElement {
  render() {
    return html` <slot></slot> `;
  }
}
