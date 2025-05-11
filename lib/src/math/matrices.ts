export class Matrix4 {
  elements: Float32Array;

  constructor() {
    this.elements = new Float32Array([
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ]);
  }

  setIdentity(): Matrix4 {
    this.elements.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return this;
  }

  makeTranslation(x: number, y: number, z: number): Matrix4 {
    this.elements.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
    return this;
  }

  makeRotationX(theta: number): Matrix4 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.elements.set([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]);
    return this;
  }

  makeRotationY(theta: number): Matrix4 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.elements.set([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
    return this;
  }

  makeRotationZ(theta: number): Matrix4 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.elements.set([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return this;
  }

  makePerspective(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4 {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    this.elements.set([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (far + near) * nf,
      -1,
      0,
      0,
      2 * far * near * nf,
      0,
    ]);
    return this;
  }

  multiply(m: Matrix4): Matrix4 {
    const a = this.elements;
    const b = m.elements;
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i * 4 + j] =
          a[i * 4 + 0] * b[0 * 4 + j] +
          a[i * 4 + 1] * b[1 * 4 + j] +
          a[i * 4 + 2] * b[2 * 4 + j] +
          a[i * 4 + 3] * b[3 * 4 + j];
      }
    }

    this.elements = result;
    return this;
  }

  clone(): Matrix4 {
    const clone = new Matrix4();
    clone.elements.set(this.elements);
    return clone;
  }

  copy(m: Matrix4): Matrix4 {
    this.elements.set(m.elements);
    return this;
  }
}
