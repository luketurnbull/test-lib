import { Context } from "./gl";

export class Geometry {
  positions: Float32Array;
  normals?: Float32Array;
  uvs?: Float32Array;
  indices?: Uint16Array | Uint32Array;
  vertexCount: number;
  vao: WebGLVertexArrayObject | null = null;
  buffers: {
    position?: WebGLBuffer;
    normal?: WebGLBuffer;
    uv?: WebGLBuffer;
    index?: WebGLBuffer;
  } = {};

  constructor(
    positions: Float32Array,
    normals?: Float32Array,
    uvs?: Float32Array,
    indices?: Uint16Array | Uint32Array
  ) {
    this.positions = positions;
    this.normals = normals;
    this.uvs = uvs;
    this.indices = indices;

    // Calculate vertex count
    this.vertexCount = positions.length / 3;
  }

  static createBox(width = 1, height = 1, depth = 1): Geometry {
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;

    // 8 corners of a cube
    const positions = new Float32Array([
      // Front face
      -w,
      -h,
      d,
      w,
      -h,
      d,
      w,
      h,
      d,
      -w,
      h,
      d,
      // Back face
      -w,
      -h,
      -d,
      -w,
      h,
      -d,
      w,
      h,
      -d,
      w,
      -h,
      -d,
      // Top face
      -w,
      h,
      -d,
      -w,
      h,
      d,
      w,
      h,
      d,
      w,
      h,
      -d,
      // Bottom face
      -w,
      -h,
      -d,
      w,
      -h,
      -d,
      w,
      -h,
      d,
      -w,
      -h,
      d,
      // Right face
      w,
      -h,
      -d,
      w,
      h,
      -d,
      w,
      h,
      d,
      w,
      -h,
      d,
      // Left face
      -w,
      -h,
      -d,
      -w,
      -h,
      d,
      -w,
      h,
      d,
      -w,
      h,
      -d,
    ]);

    const normals = new Float32Array([
      // Front face
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      // Back face
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      // Top face
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      // Bottom face
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      // Right face
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      // Left face
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    ]);

    const uvs = new Float32Array([
      // Front face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Back face
      1, 0, 1, 1, 0, 1, 0, 0,
      // Top face
      0, 1, 0, 0, 1, 0, 1, 1,
      // Bottom face
      1, 1, 0, 1, 0, 0, 1, 0,
      // Right face
      1, 0, 1, 1, 0, 1, 0, 0,
      // Left face
      0, 0, 1, 0, 1, 1, 0, 1,
    ]);

    const indices = new Uint16Array([
      0,
      1,
      2,
      0,
      2,
      3, // Front face
      4,
      5,
      6,
      4,
      6,
      7, // Back face
      8,
      9,
      10,
      8,
      10,
      11, // Top face
      12,
      13,
      14,
      12,
      14,
      15, // Bottom face
      16,
      17,
      18,
      16,
      18,
      19, // Right face
      20,
      21,
      22,
      20,
      22,
      23, // Left face
    ]);

    return new Geometry(positions, normals, uvs, indices);
  }

  // Upload the geometry data to the GPU
  upload(): void {
    const gl = Context.useGl();

    // Create VAO
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // Position buffer
    this.buffers.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    // Normal buffer (if available)
    if (this.normals) {
      this.buffers.normal = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
      gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    }

    // UV buffer (if available)
    if (this.uvs) {
      this.buffers.uv = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.uv);
      gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
    }

    // Index buffer (if available)
    if (this.indices) {
      this.buffers.index = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    }

    gl.bindVertexArray(null);
  }

  dispose(): void {
    const gl = Context.useGl();

    // Clean up WebGL resources
    if (this.vao) gl.deleteVertexArray(this.vao);
    if (this.buffers.position) gl.deleteBuffer(this.buffers.position);
    if (this.buffers.normal) gl.deleteBuffer(this.buffers.normal);
    if (this.buffers.uv) gl.deleteBuffer(this.buffers.uv);
    if (this.buffers.index) gl.deleteBuffer(this.buffers.index);

    this.vao = null;
    this.buffers = {};
  }
}
