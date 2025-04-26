import { Context } from "./gl";

export class Geometry {
  private gl: WebGL2RenderingContext;
  private buffers: {
    position?: WebGLBuffer;
  } = {};

  public positions: Float32Array;
  public vertexCount: number;
  public vao: WebGLVertexArrayObject | null = null;

  constructor(positions: Float32Array) {
    this.gl = Context.useGl();
    this.positions = positions;
    this.vertexCount = positions.length / 3;
  }

  public upload() {
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    // Add positions to the buffer
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
