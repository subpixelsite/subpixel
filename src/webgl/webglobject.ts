export interface WebGLObjectTransform {
  pos?: number[];
  rotAxis?: number[];
  rotRad?: number;
  scale?: number;
}

export class WebGLObject {
  vertexShader?: string;

  fragmentShader?: string;

  // geometry/primitives
  planes?: {
    width: number;
    height: number;
    subDWidth?: number;
    subDHidth?: number;
    xform?: WebGLObjectTransform;
  }[];

  cubes?: {
    size: number;
    xform?: WebGLObjectTransform;
  }[];

  spheres?: {
    radius: number;
    subDAxis?: number;
    subDHeight?: number;
    xform?: WebGLObjectTransform;
  }[];

  // textures
}
