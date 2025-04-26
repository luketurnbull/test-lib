import { Buffer } from "./buffer";
import { ShaderProgram } from "./shader-program";

export class Geometry {
  private buffer: Buffer;
  public positions: Float32Array;
  public vertexCount: number;

  constructor(positions: Float32Array) {
    this.buffer = new Buffer();

    this.positions = positions;
    this.vertexCount = positions.length / 3;
  }

  public create() {
    this.buffer.begin();
  }

  public setupAttributes(program: ShaderProgram) {
    this.buffer.bind();

    // Add positions
    try {
      const positionLocation = program.getAttributeLocation("position");
      this.buffer.addAttribute("position", positionLocation, this.positions, 3);
    } catch (e) {
      console.warn(e);
    }
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
