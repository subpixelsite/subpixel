/* eslint-disable lines-between-class-members */
import { WebGLObject } from './webglobject.js';

export class WebGLScene {
  clearColor?: number[];
  clearDepth?: number;
  clearStencil?: number;

  fovYDeg?: number;
  near?: number;
  far?: number;
  eye?: number[];
  lookAt?: number[];

  objects?: WebGLObject[];
}

export const webGLSceneDefault: WebGLScene = {
  clearColor: [0.25, 0.25, 0.25, 1.0],
  clearDepth: 1.0,
  clearStencil: 0,
  fovYDeg: 60,
  near: 0.5,
  far: 100,
  eye: [3, 3, -10],
  lookAt: [0, 0, 0],
  objects: [],
};
