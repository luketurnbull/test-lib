import { Vector3 } from "../math/vectors";
import { Camera } from "./camera";
import { Context } from "./gl";
import { Mesh } from "./mesh";

type RendererOptions = {
  backgroundColor?: Vector3;
};

export class Renderer {
  private canvas: HTMLCanvasElement;
  private clearColor: Vector3;
  private meshes: Mesh[] = [];

  constructor(
    canvas: HTMLCanvasElement | string,
    { backgroundColor }: RendererOptions
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

    this.clearColor = backgroundColor ?? new Vector3(0.1, 0.1, 0.1);

    Context.initialize(this.canvas);
    const gl = Context.useGl();

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }

  setClearColor(color: Vector3): void {
    this.clearColor = color;
  }

  setSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    Context.useGl().viewport(0, 0, width, height);
  }

  add(mesh: Mesh): void {
    mesh.geometry.upload();
    this.meshes.push(mesh);
  }

  render(camera: Camera): void {
    const gl = Context.useGl();

    console.log(this.clearColor);

    gl.clearColor(this.clearColor.x, this.clearColor.y, this.clearColor.z, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.updateViewMatrix();
    camera.updateProjectionMatrix();

    for (const mesh of this.meshes) {
      mesh.render(camera.viewMatrix, camera.projectionMatrix);
    }
  }
}
