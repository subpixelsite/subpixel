/* eslint-disable no-bitwise */
import {
  createProgramInfo,
  primitives,
  m4,
  ProgramInfo,
  resizeCanvasToDisplaySize,
  BufferInfo,
} from 'twgl.js';
import { WebGLScene, webGLSceneDefault } from './webglscene.js';
import { shaders } from './shaders.js';

interface DrawObject {
  shaderKey: string;

  bufferInfo: BufferInfo[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class WebGL {
  public m4 = m4;

  public gl?: WebGLRenderingContext;

  private programInfo: Map<string, ProgramInfo>;

  private scene: WebGLScene;

  private shadowRoot: ShadowRoot;

  private drawObjects: DrawObject[] = [];

  constructor(scene: WebGLScene, shadowRoot: ShadowRoot) {
    this.scene = { ...webGLSceneDefault, ...scene };
    this.shadowRoot = shadowRoot;
    this.programInfo = new Map();

    this.render = this.render.bind(this);
  }

  init(context: string) {
    if (this.scene === undefined) return;

    const selector = this.shadowRoot.querySelector(
      context
    ) as HTMLCanvasElement;
    if (selector === null)
      throw new Error(`Couldn't find page context for WebGL: ${context}`);

    this.gl = selector.getContext('webgl') as WebGLRenderingContext;
    if (!this.gl)
      throw new Error(`Couldn't get WebGL context for canvas ${context}`);

    this.scene.objects?.forEach(obj => {
      if (!shaders.has(obj.vertexShader)) {
        throw new Error(
          `Invalid vertex shader in scene object: ${obj.vertexShader}`
        );
      }
      if (!shaders.has(obj.fragmentShader)) {
        throw new Error(
          `Invalid fragment shader in scene object: ${obj.fragmentShader}`
        );
      }

      // Find and load shaders from shader library for each object
      const objShaderKey = `${obj.vertexShader}|${obj.fragmentShader}`;
      this.programInfo.set(
        objShaderKey,
        createProgramInfo(this.gl!, [
          shaders.get(obj.vertexShader),
          shaders.get(obj.fragmentShader),
        ])
      );

      const drawObj: DrawObject = {
        shaderKey: objShaderKey,
        bufferInfo: [],
      };

      // Create requested shapes
      obj.planes?.forEach(plane => {
        // let mat = m4.translation( plane.pos ?? [0, 0, 0] );

        // if ( plane.rotAxis !== undefined && plane.rotRad !== undefined )
        // 	mat = m4.axisRotate( mat, plane.rotAxis, plane.rotRad );

        drawObj.bufferInfo.push(
          primitives.createPlaneBufferInfo(
            this.gl!,
            plane.width,
            plane.height,
            plane.subDWidth ?? 1,
            plane.subDHidth ?? 1
          )
        );
      });

      obj.cubes?.forEach(cube => {
        drawObj.bufferInfo.push(
          primitives.createCubeBufferInfo(this.gl!, cube.size)
        );
      });

      obj.spheres?.forEach(sphere => {
        drawObj.bufferInfo.push(
          primitives.createSphereBufferInfo(
            this.gl!,
            sphere.radius,
            sphere.subDAxis ?? 16,
            sphere.subDHeight ?? 16
          )
        );
      });

      this.drawObjects.push(drawObj);
    });

    requestAnimationFrame(this.render);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number) {
    if (this.gl === undefined) return;

    // time in ms
    // time *= 0.001;

    const { gl } = this;

    resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.clearColor(
      this.scene.clearColor![0],
      this.scene.clearColor![1],
      this.scene.clearColor![2],
      this.scene.clearColor![3]
    );
    gl.clearDepth(this.scene.clearDepth!);
    gl.clearStencil(this.scene.clearStencil!);

    const projection = m4.perspective(
      (this.scene.fovYDeg! * Math.PI) / 180,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      this.scene.near!,
      this.scene.far!
    );
    const up = [0, 1, 0];

    const camera = m4.identity();
    const view = m4.identity();
    const viewProjection = m4.identity();
    m4.lookAt(this.scene.eye!, this.scene.lookAt!, up, camera);
    m4.inverse(camera, view);
    m4.multiply(projection, view, viewProjection);

    // this.scene.objects?.forEach( object =>
    // {
    // 	// iterate primitives for render in same order as creation

    // 	const world = m4.identity;
    // 	m4.identity( world );
    // 	if ( object.xform !== undefined )
    // 	{
    // 		let mat = m4.translation( object.xform.pos ?? [0, 0, 0] );

    // 		if ( plane.rotAxis !== undefined && plane.rotRad !== undefined )
    // 			mat = m4.axisRotate( mat, plane.rotAxis, plane.rotRad );
    // 	}
    // } );

    // twgl.draw

    requestAnimationFrame(this.render);
  }
}
