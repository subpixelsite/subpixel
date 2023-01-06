import { Post } from './post.js';

export const POSTS: Post[] = [
  {
    id: 0,
    title: 'Mipmapping',
    author: 'Chris Lambert',
    dateCreated: 0,
    tags: ['Textures', 'Geometry'],
    hdrWGL: '',
    hdrSVG: '',
    hdrImg: '',
    hdrAlt: '',
    description:
      'What are mipmaps and why do we need them?  What is the difference between linear and anisotropic?',
    body: '',
  },
  {
    id: 1,
    title: 'Texture Filtering',
    author: 'Chris Lambert',
    dateCreated: 0,
    tags: ['Textures', 'Geometry'],
    hdrWGL: '',
    hdrSVG:
      '<rect x="25%" y="25%" width="50%" height="50%" fill="#ff0000" />  <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(0,0,255);stroke-width:2" /> ',
    hdrImg:
      'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
    hdrAlt: 'A red box with a blue slash across it, signifying nothing',
    description:
      'What is the purpose of texture filtering?  Why would I ever choose blurry over sharp?',
    body: '',
  },
  {
    id: 2,
    title: 'Antialiasing',
    author: 'Chris Lambert',
    dateCreated: 0,
    tags: ['Postprocessing'],
    hdrWGL: '',
    hdrSVG: '',
    hdrImg:
      'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
    hdrAlt: 'A cat wondering when this is going to get done',
    description:
      "Why do we need it?  What is the best kind, and why can't we always do that?",
    body: '',
  },
];
