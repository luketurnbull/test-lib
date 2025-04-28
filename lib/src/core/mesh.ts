import { Geometry } from "./geometry";
import { Material } from "./material";
import { ShaderProgram } from "./shader-program";

export class Mesh {
  private program: ShaderProgram;
  //   private modelMatrix: ModelMatrix;

  public material: Material;
  public geometry: Geometry;

  constructor(geometry: Geometry, material: Material) {
    //  this.modelMatrix = new ModelMatrix();

    this.material = material;
    this.geometry = geometry;

    this.program = new ShaderProgram(
      this.material.vertexShader,
      this.material.fragmentShader
    );
  }

  create() {
    this.geometry.create(this.program);
  }

  render() {
    this.program.use();
    this.geometry.draw();
  }
}
