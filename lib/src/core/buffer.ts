import { Context } from "./gl";

export class Buffer {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject | null = null;
  private buffers: Map<number, WebGLBuffer> = new Map();

  constructor() {
    this.gl = Context.useGl();
  }

  public begin() {
    this.vao = this.gl.createVertexArray();
    this.bind();
  }

  public end() {
    this.unbind();
  }

  public addAttribute(
    attributeIndex: number,
    data: Float32Array,
    size: number
  ): this {
    if (!this.vao) {
      throw new Error("No active VAO. Call beginVAO() first");
    }

    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create buffer");
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(attributeIndex);
    this.gl.vertexAttribPointer(
      attributeIndex,
      size,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.buffers.set(attributeIndex, buffer);
    return this;
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
