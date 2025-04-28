import { Context } from "./gl";

export class Buffer {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject | null = null;
  private buffers: Map<string, WebGLBuffer> = new Map();

  constructor() {
    this.gl = Context.useGl();
  }

  public createVao() {
    this.vao = this.gl.createVertexArray();
    this.bind();
  }

  public createArray(
    name: string,
    location: number,
    data: Float32Array,
    size: number
  ) {
    if (!this.vao) {
      throw new Error("No active VAO. Call begin() first");
    }

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, 0, 0);
    this.buffers.set(name, buffer);
  }

  public createElement(data: Uint16Array) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  }

  public draw(count: number) {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, count);
  }

  public bind() {
    if (!this.vao) {
      throw new Error("No VAO created. Call beginVAO() first");
    }

    this.gl.bindVertexArray(this.vao);
  }

  public unbind() {
    this.gl.bindVertexArray(null);
  }

  dispose(): void {
    if (this.vao) {
      this.gl.deleteVertexArray(this.vao);
      this.vao = null;
    }

    this.buffers.forEach((buffer) => {
      this.gl.deleteBuffer(buffer);
    });

    this.buffers.clear();
  }
}
