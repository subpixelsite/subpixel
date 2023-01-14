/* eslint-disable lines-between-class-members */
import { BufferInfo, primitives } from 'twgl.js';
import { WebGLObject } from './webglobject.js';

export interface WebGLSphereData {
  sphere?: {
    radius: number;
    subDAxis?: number;
    subDHeight?: number;
  };
}

export class WebGLSphere extends WebGLObject {
  public createBufferInfo(gl: WebGLRenderingContext): BufferInfo | undefined {
    if (this.data.sphere === undefined)
      throw new Error('Undefined sphere data in createBufferInfo');

    return primitives.createSphereBufferInfo(
      gl,
      this.data.sphere.radius,
      this.data.sphere.subDAxis ?? 24,
      this.data.sphere.subDHeight ?? 12
    );
  }
}
