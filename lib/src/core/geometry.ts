import { Buffer } from "./buffer";

export class Geometry {
  protected positions: Float32Array;
  protected normals?: Float32Array;
  protected uvs?: Float32Array;
  protected indices?: Uint16Array | Uint32Array;
  protected vertexCount: number;
  protected buffer: Buffer;

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
    this.vertexCount = positions.length / 3;
    this.buffer = new Buffer();
  }

  /**
   * Upload geometry data to the GPU
   */
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

  /**
   * Draw the geometry
   */
  draw(): void {
    const count = this.indices ? this.indices.length : this.vertexCount;
    this.buffer.draw(count);
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.buffer.dispose();
  }
}
