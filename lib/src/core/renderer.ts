import { Mesh } from "./mesh";
import { Vector3 } from "../math/vectors";
import { Context } from "./gl";

export class Renderer {
  private gl: WebGL2RenderingContext;
  private backgroundColor: Vector3 = {
    x: 0.1,
    y: 0.1,
    z: 0.1,
  };
  private isTransparent: boolean = false;
  private meshes: Mesh[] = [];

  public canvas: HTMLCanvasElement;

  constructor(
    canvas: HTMLCanvasElement | string,
    options?: {
      backgroundColor?: Vector3;
      isTransparent?: boolean;
    }
  ) {
    if (typeof canvas === "string") {
      const element = document.getElementById(canvas);

      if (!element) {
        throw new Error(`No canvas found with ID: ${canvas}`);
      }

      if (!(element instanceof HTMLCanvasElement)) {
        throw new Error(`Element with ID ${canvas} is not a canvas!`);
      }

      this.canvas = element;
    } else {
      this.canvas = canvas;
    }

    // initialize canvas
    this.gl = Context.initialize(this.canvas);

    // Set options
    if (options?.backgroundColor) {
      this.backgroundColor = options.backgroundColor;
    }

    if (options?.isTransparent) {
      this.isTransparent = options.isTransparent;
    }

    // Setup
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  public add(mesh: Mesh): void {
    if (!mesh.geometry.vao) {
      mesh.geometry.upload();
    }

    this.meshes.push(mesh);
  }

  public render() {
    this.clearCanvas();

    for (const mesh of this.meshes) {
      mesh.render();
    }
  }

  private clearCanvas() {
    this.gl.clearColor(
      this.backgroundColor.x,
      this.backgroundColor.y,
      this.backgroundColor.z,
      this.isTransparent ? 0.0 : 1.0
    );

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
