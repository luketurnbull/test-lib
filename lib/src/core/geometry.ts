import { Buffer } from "./buffer";
import { ShaderProgram } from "./shader-program";

export class Geometry {
  private buffer: Buffer;
  private positions: Float32Array;
  private normals?: Float32Array;
  private uvs?: Float32Array;
  private indices?: Uint16Array;
  public vertexCount: number;

  constructor(
    positions: Float32Array,
    normals?: Float32Array,
    uvs?: Float32Array,
    indices?: Uint16Array
  ) {
    this.buffer = new Buffer();

    this.positions = positions;
    this.normals = normals;
    this.uvs = uvs;
    this.indices = indices;

    this.vertexCount = positions.length / 3;
  }

  public create(program: ShaderProgram) {
    this.buffer.createVao();
    this.buffer.bind();

    const positionLocation = program.getAttributeLocation("position");
    this.buffer.createArray("position", positionLocation, this.positions, 3);

    if (this.normals) {
      const normalLocation = program.getAttributeLocation("normal");
      this.buffer.createArray("normal", normalLocation, this.normals, 3);
    }

    if (this.uvs) {
      const uvLocation = program.getAttributeLocation("uv");
      this.buffer.createArray("uv", uvLocation, this.uvs, 2);
    }

    if (this.indices) {
      this.buffer.createElement(this.indices);
    }

    this.buffer.unbind();
  }

  public draw() {
    this.buffer.draw(this.indices ? this.indices.length : this.vertexCount);
  }

  dispose(): void {
    this.buffer.dispose();
  }
}

export class BoxGeometry extends Geometry {
  constructor(width: number, height: number, depth: number) {
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
      0, 0, 1, 0, 1, 1, 0, 1,
      // Top face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Bottom face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Right face
      0, 0, 1, 0, 1, 1, 0, 1,
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

    super(positions, normals, uvs, indices);
  }
}
