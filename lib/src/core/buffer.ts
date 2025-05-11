import { Context } from "./gl";

export class Buffer {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject | null = null;
  private buffers: Map<string, WebGLBuffer> = new Map();
  private indexType: number | null = null;

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
      throw new Error("No active VAO. Call createVao() first");
    }

    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error(`Failed to create buffer for ${name}`);
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, 0, 0);
    this.buffers.set(name, buffer);
  }

  public createElement(data: Uint16Array | Uint32Array) {
    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create element buffer");
    }

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    this.indexType =
      data instanceof Uint32Array
        ? this.gl.UNSIGNED_INT
        : this.gl.UNSIGNED_SHORT;
    this.buffers.set("index", buffer);
  }

  public draw(count: number) {
    this.bind();

    if (this.buffers.has("index")) {
      this.gl.drawElements(this.gl.TRIANGLES, count, this.indexType!, 0);
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, count);
    }

    this.unbind();
  }

  public bind() {
    if (!this.vao) {
      throw new Error("No VAO created. Call createVao() first");
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
    this.indexType = null;
  }
}
