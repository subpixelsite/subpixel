// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LitElement,
  html,
  customElement,
  state,
  property,
  css,
} from 'lit-element';
import { POSTS } from './data.js';
import { PostData } from './post_data.js';

@customElement('lit-post')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PostItem extends LitElement implements BeforeEnterObserver {
  static styles = css`
    .post-tile {
      margin: 20px;
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      background: white;
      overflow: hidden;
      border-radius: 10px;
    }
    .post-description {
      padding: 20px;
      background: white;
    }
    .post-footer {
      text-align: right;
    }
    .post-link {
      color: #008cba;
      // border-width: 0;
      // background-color: #ffffff;
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    h2 {
      font-size: 1rem;
      font-weight: 300;
      color: #5e5e5e;
      margin-top: 5px;
    }
  `;

  @state()
  postId: number = -1;

  @property({ type: Object })
  post?: PostData;

  @property({ type: Array })
  posts?: PostData[];

  render() {
    return html`
      <h1>${this.post?.title}</h1>
      <h2>${this.post?.author}</h2>
      <p>${this.post?.body}</p>
    `;
  }

  public onBeforeEnter(location: RouterLocation) {
    this.posts = POSTS;

    const id = location.params.id as string;
    this.postId = parseInt(id, 10);

    if (this.posts) {
      this.post = this.posts.find(p => {
        if (p.id === this.postId) {
          return p;
        }
        return null;
      });
    }
  }
}
