import { Geometry } from "./geometry";
import { Context } from "./gl";
import { Material } from "./material";
import { ShaderProgram } from "./shader-program";

export class Mesh {
  private gl: WebGL2RenderingContext;
  private program: ShaderProgram;
  public material: Material;
  public geometry: Geometry;

  constructor(geometry: Geometry, material: Material) {
    this.gl = Context.useGl();

    this.material = material;
    this.geometry = geometry;

    this.program = new ShaderProgram(
      this.material.vertexShader,
      this.material.fragmentShader
    );
  }

  render() {
    this.program.use();

    if (this.geometry.vao) {
      this.gl.bindVertexArray(this.geometry.vao);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.geometry.vertexCount);
      this.gl.bindVertexArray(null);
    }
  }
}
