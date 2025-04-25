import { Context } from "./core/gl";
import { ShaderProgram } from "./core/shader-program";

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export class Renderer {
  private gl: WebGL2RenderingContext;
  private backgroundColor: Vector3;
  private meshes: Mesh[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    {
      backgroundColor = {
        x: 0.1,
        y: 0.1,
        z: 0.1,
      },
    }: {
      backgroundColor?: Vector3;
    }
  ) {
    // Create context
    const context = Context.initialize(canvas);
    this.gl = context.gl;

    // Set props
    this.backgroundColor = backgroundColor;

    // Setup
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.viewport(0, 0, canvas.width, canvas.height);
  }

  add(mesh: Mesh): void {
    if (!mesh.geometry.vao) {
      mesh.geometry.upload();
    }
    this.meshes.push(mesh);
  }

  render() {
    // Clear the canvas
    this.gl.clearColor(
      this.backgroundColor.x,
      this.backgroundColor.y,
      this.backgroundColor.z,
      1.0
    );
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Render all meshes
    for (const mesh of this.meshes) {
      mesh.render();
    }
  }
}

export class Mesh {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  public material: Material;
  public geometry: Geometry;

  constructor(geometry: Geometry, material: Material) {
    this.gl = Context.getInstance().gl;

    this.material = material;
    this.geometry = geometry;

    this.program = new ShaderProgram(
      this.material.vertexShader,
      this.material.fragmentShader
    ).program;
  }

  render() {
    // Check if the program exists and is valid
    if (!this.program) {
      console.error("Shader program is null");
      return;
    }

    console.log(this.program);

    // Use current meshes program
    this.gl.useProgram(this.program);

    // Bind the geometry's VAO
    if (this.geometry.vao) {
      this.gl.bindVertexArray(this.geometry.vao);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.geometry.vertexCount);

      // Unbind VAO
      this.gl.bindVertexArray(null);
    }
  }
}

export class Material {
  private gl: WebGL2RenderingContext;
  public vertexShader: string;
  public fragmentShader: string;

  constructor({
    vertexShader,
    fragmentShader,
  }: {
    vertexShader: string;
    fragmentShader: string;
  }) {
    this.gl = Context.getInstance().gl;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
  }
}

export class Geometry {
  private gl: WebGL2RenderingContext;
  private buffers: {
    position?: WebGLBuffer;
  } = {};

  public positions: Float32Array;
  public vertexCount: number;
  public vao: WebGLVertexArrayObject | null = null;

  constructor(positions: Float32Array) {
    this.gl = Context.getInstance().gl;
    this.positions = positions;
    this.vertexCount = positions.length / 3;
  }

  public upload() {
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    // Position buffer
    this.buffers.position = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.positions,
      this.gl.STATIC_DRAW
    );
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindVertexArray(null);
  }

  dispose(): void {
    if (this.vao) {
      this.gl.deleteVertexArray(this.vao);
    }
    if (this.buffers.position) {
      this.gl.deleteBuffer(this.buffers.position);
    }

    this.vao = null;
    this.buffers = {};
  }
}
