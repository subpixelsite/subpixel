import { WebGLObject } from './webglobject.js';

export class WebGLScene {
  clearColor?: number[];

  clearDepth?: number;

  clearStencil?: number;

  objects?: WebGLObject[];
}

export const webGLSceneDefault: WebGLScene = {
  clearColor: [0.25, 0.25, 0.25, 1.0],
  clearDepth: 1.0,
  clearStencil: 0,
};
