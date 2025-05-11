import { Buffer } from "./buffer";

export class Geometry {
  positions: Float32Array;
  normals?: Float32Array;
  uvs?: Float32Array;
  indices?: Uint16Array | Uint32Array;
  vertexCount: number;
  private buffer: Buffer;

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
    this.buffer = new Buffer();
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
    this.buffer.createVao();

    // Upload position attributes (required)
    this.buffer.createArray("position", 0, this.positions, 3);

    // Upload normal attributes (optional)
    if (this.normals) {
      this.buffer.createArray("normal", 1, this.normals, 3);
    }

    // Upload UV attributes (optional)
    if (this.uvs) {
      this.buffer.createArray("uv", 2, this.uvs, 2);
    }

    // Upload indices if available
    if (this.indices) {
      this.buffer.createElement(this.indices);
    }
  }

  draw(): void {
    const count = this.indices ? this.indices.length : this.vertexCount;
    this.buffer.draw(count);
  }

  dispose(): void {
    this.buffer.dispose();
  }
}
