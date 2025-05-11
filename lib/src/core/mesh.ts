import { Matrix4 } from "../math/matrices";
import { Vector3 } from "../math/vectors";
import { Context } from "./gl";
import { Geometry } from "./geometry";
import { Material } from "./material";

export class Mesh {
  geometry: Geometry;
  material: Material;
  modelMatrix: Matrix4;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry;
    this.material = material;
    this.modelMatrix = new Matrix4();
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.scale = new Vector3(1, 1, 1);
  }

  updateModelMatrix(): void {
    this.modelMatrix.setIdentity();

    const rotateXMatrix = new Matrix4().makeRotationX(this.rotation.x);
    const rotateYMatrix = new Matrix4().makeRotationY(this.rotation.y);
    const rotateZMatrix = new Matrix4().makeRotationZ(this.rotation.z);

    const translateMatrix = new Matrix4().makeTranslation(
      this.position.x,
      this.position.y,
      this.position.z
    );

    this.modelMatrix
      .multiply(rotateZMatrix)
      .multiply(rotateYMatrix)
      .multiply(rotateXMatrix)
      .multiply(translateMatrix);
  }

  render(viewMatrix: Matrix4, projectionMatrix: Matrix4): void {
    const gl = Context.useGl();

    // Update model matrix
    this.updateModelMatrix();

    // Activate the material's shader program and set uniforms
    this.material.use();
    this.material.setMatrix4("modelMatrix", this.modelMatrix);
    this.material.setMatrix4("viewMatrix", viewMatrix);
    this.material.setMatrix4("projectionMatrix", projectionMatrix);

    // Bind the geometry's VAO
    if (this.geometry.vao) {
      gl.bindVertexArray(this.geometry.vao);

      // Draw the geometry
      if (this.geometry.indices) {
        gl.drawElements(
          gl.TRIANGLES,
          this.geometry.indices.length,
          this.geometry.indices instanceof Uint16Array
            ? gl.UNSIGNED_SHORT
            : gl.UNSIGNED_INT,
          0
        );
      } else {
        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.vertexCount);
      }

      // Unbind VAO
      gl.bindVertexArray(null);
    }
  }
}
