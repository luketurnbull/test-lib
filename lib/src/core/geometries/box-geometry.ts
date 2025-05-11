import { Geometry } from "../geometry";

export class BoxGeometry extends Geometry {
  constructor(width = 1, height = 1, depth = 1) {
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;

    // Create vertices for the box
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
      3, // Front
      4,
      5,
      6,
      4,
      6,
      7, // Back
      8,
      9,
      10,
      8,
      10,
      11, // Top
      12,
      13,
      14,
      12,
      14,
      15, // Bottom
      16,
      17,
      18,
      16,
      18,
      19, // Right
      20,
      21,
      22,
      20,
      22,
      23, // Left
    ]);

    super(positions, normals, uvs, indices);
  }
}
