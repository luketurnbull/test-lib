import { Buffer } from "./buffer";

export class Geometry {
  private buffer: Buffer;
  public positions: Float32Array;
  public vertexCount: number;

  constructor(positions: Float32Array) {
    this.buffer = new Buffer();

    this.positions = positions;
    this.vertexCount = positions.length / 3;
  }

  public upload() {
    this.buffer.begin();

    // Add positions attributes to location 0
    this.buffer.addAttribute(0, this.positions, 3);

    // TODO: Add normals
    //  if (this.normals) {
    //    this.buffer.addAttribute(1, this.normals, 3);
    //  }

    // TODO: Add UVs
    //  if (this.uvs) {
    //    this.bufferManager.addAttribute(2, this.uvs, 2);
    //  }

    this.buffer.end();
  }

  public draw() {
    this.buffer.bind();
    this.buffer.draw(this.vertexCount);
    this.buffer.unbind();
  }

  dispose(): void {
    this.buffer.dispose();
  }
}
