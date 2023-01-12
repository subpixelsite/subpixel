/* eslint-disable no-bitwise */
import {
  createProgramInfo,
  m4,
  ProgramInfo,
  resizeCanvasToDisplaySize,
} from 'twgl.js';
import { WebGLScene } from './webglscene.js';
import { webGLSceneDefault } from './webglscenedefault.js';
import { shaders } from './shaders.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class WebGL {
  public m4 = m4;

  public gl?: WebGLRenderingContext;

  private programInfo!: ProgramInfo;

  private scene?: WebGLScene;

  constructor(scene?: WebGLScene) {
    this.scene = { ...webGLSceneDefault, ...scene };
  }

  init(context: string) {
    if (this.scene === undefined) return;

    // THIS SHOULD ONLY BE DONE AT SITE INIT
    // twgl.setDefaults( { attribPrefix: "a_" } );

    const selector = document.querySelector(context) as HTMLCanvasElement;
    if (selector === null)
      throw new Error(`Couldn't find page context for WebGL: ${context}`);

    this.gl = selector.getContext('webgl') as WebGLRenderingContext;
    if (this.gl === null)
      throw new Error(`Couldn't get WebGL context for canvas ${context}`);

    this.scene.objects?.forEach(obj => {
      if (!shaders.has(obj.vertexShader)) {
        console.error(
          `Invalid vertex shader in scene object: ${obj.vertexShader}`
        );
        return;
      }
      if (!shaders.has(obj.fragmentShader)) {
        console.error(
          `Invalid fragment shader in scene object: ${obj.fragmentShader}`
        );
        return;
      }

      // Find and load shaders from shader library for each object
      this.programInfo = createProgramInfo(this.gl!, [
        shaders.get(obj.vertexShader),
        shaders.get(obj.fragmentShader),
      ]);
    });

    requestAnimationFrame(this.render);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number) {
    if (this.gl === undefined) return;

    const { gl } = this;

    resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    // gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.clearColor(0.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clearStencil(0);

    // twgl.draw

    requestAnimationFrame(this.render);
  }
}
