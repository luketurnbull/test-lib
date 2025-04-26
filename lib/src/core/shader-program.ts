import { Context } from "./gl";

export class ShaderProgram {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;

  constructor(vertexSource: string, fragmentSource: string) {
    this.gl = Context.useGl();

    // Setup shaders
    const vertexShader = this.createShader(vertexSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.createShader(
      fragmentSource,
      this.gl.FRAGMENT_SHADER
    );

    this.program = this.createProgram(vertexShader, fragmentShader);

    // Clean up shaders after linking
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
  }

  private createShader(source: string, type: GLenum): WebGLShader {
    const shader = this.gl.createShader(type);

    if (!shader) {
      throw new Error("Failed to create vertex shader");
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Vertex shader compilation failed: ${info}`);
    }

    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error("Failed to create shader program");
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);

      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);
      this.gl.deleteProgram(program);

      throw new Error(`Shader program linking failed: ${info}`);
    }

    return program;
  }

  public use() {
    this.gl.useProgram(this.program);
  }
}
