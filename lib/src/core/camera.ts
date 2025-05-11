import { Matrix4 } from "../math/matrices";
import { Vector3 } from "../math/vectors";

export class Camera {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  viewMatrix: Matrix4;
  projectionMatrix: Matrix4;
  aspect: number;
  fov: number;
  near: number;
  far: number;

  constructor(aspect = 1, fov = Math.PI / 4, near = 0.1, far = 1000) {
    this.position = new Vector3(0, 0, 5);
    this.target = new Vector3(0, 0, 0);
    this.up = new Vector3(0, 1, 0);
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
    this.aspect = aspect;
    this.fov = fov;
    this.near = near;
    this.far = far;

    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }

  updateViewMatrix(): void {
    // Simple implementation - would normally use proper lookAt function
    // This is just a placeholder - you'd want a more robust implementation
    const z = new Vector3(
      this.position.x - this.target.x,
      this.position.y - this.target.y,
      this.position.z - this.target.z
    );
    // Normalize z
    const len = Math.sqrt(z.x * z.x + z.y * z.y + z.z * z.z);
    z.x /= len;
    z.y /= len;
    z.z /= len;

    // Cross product to get x axis
    const x = new Vector3(
      this.up.y * z.z - this.up.z * z.y,
      this.up.z * z.x - this.up.x * z.z,
      this.up.x * z.y - this.up.y * z.x
    );
    // Normalize x
    const xLen = Math.sqrt(x.x * x.x + x.y * x.y + x.z * x.z);
    x.x /= xLen;
    x.y /= xLen;
    x.z /= xLen;

    // Cross product to get y axis
    const y = new Vector3(
      z.y * x.z - z.z * x.y,
      z.z * x.x - z.x * x.z,
      z.x * x.y - z.y * x.x
    );

    // Set view matrix
    this.viewMatrix.elements.set([
      x.x,
      y.x,
      z.x,
      0,
      x.y,
      y.y,
      z.y,
      0,
      x.z,
      y.z,
      z.z,
      0,
      -(x.x * this.position.x + x.y * this.position.y + x.z * this.position.z),
      -(y.x * this.position.x + y.y * this.position.y + y.z * this.position.z),
      -(z.x * this.position.x + z.y * this.position.y + z.z * this.position.z),
      1,
    ]);
  }

  updateProjectionMatrix(): void {
    this.projectionMatrix.makePerspective(
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }
}
