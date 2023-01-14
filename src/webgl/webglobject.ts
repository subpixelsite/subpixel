import { BufferInfo, createProgramInfo, ProgramInfo } from 'twgl.js';
import { shaders } from './shaders.js';
import { WebGLCubeData } from './webglcube.js';
import { WebGLPlaneData } from './webglplane.js';
import { WebGLSphereData } from './webglsphere.js';

export interface WebGLObjectTransform {
  pos?: number[];
  rotAxis?: number[];
  rotRad?: number;
  scale?: number;
}

export interface WebGLObjectData
  extends WebGLPlaneData,
    WebGLSphereData,
    WebGLCubeData {
  vs: string;
  fs: string;
  xform: WebGLObjectTransform;
  // textures
}

export class WebGLObject {
  data: WebGLObjectData;

  uniforms?: any; // Map:  [string]: any

  constructor(data?: WebGLObjectData) {
    if (data !== undefined) {
      this.data = data;
    } else {
      this.data = {
        vs: 'pos.vs',
        fs: 'col.fs',
        xform: {
          pos: [0, 0, 0],
          rotAxis: [0, 1, 0],
          rotRad: 0,
          scale: 1,
        },
      };
    }
  }

  public createProgramInfo(gl: WebGLRenderingContext): ProgramInfo {
    if (!shaders.has(this.data.vs))
      throw new Error(`Invalid vertex shader in scene object: ${this.data.vs}`);
    if (!shaders.has(this.data.fs))
      throw new Error(
        `Invalid fragment shader in scene object: ${this.data.fs}`
      );

    return createProgramInfo(gl, [
      shaders.get(this.data.vs),
      shaders.get(this.data.fs),
    ]);
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public createBufferInfo(gl: WebGLRenderingContext): BufferInfo | undefined {
    return undefined;
  }
}
