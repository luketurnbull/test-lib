import { Context } from "./gl";

export class ShaderProgram {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private attributes: Map<string, number> = new Map();
  private uniforms: Map<string, WebGLUniformLocation> = new Map();

  constructor(vertexSource: string, fragmentSource: string) {
    this.gl = Context.useGl();

    const vertexShader = this.createShader(vertexSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.createShader(
      fragmentSource,
      this.gl.FRAGMENT_SHADER
    );

    this.program = this.createProgram(vertexShader, fragmentShader);

    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);

    this.cacheAttributes();
    this.cacheUniforms();
  }

  private cacheAttributes(): void {
    const attributes = this.gl.getProgramParameter(
      this.program,
      this.gl.ACTIVE_ATTRIBUTES
    );

    for (let i = 0; i < attributes; i++) {
      const info = this.gl.getActiveAttrib(this.program, i);
      if (info) {
        console.log(info.name);
        const location = this.gl.getAttribLocation(this.program, info.name);
        this.attributes.set(info.name, location);
      }
    }
  }

  private cacheUniforms(): void {
    const numUniforms = this.gl.getProgramParameter(
      this.program,
      this.gl.ACTIVE_UNIFORMS
    );

    for (let i = 0; i < numUniforms; i++) {
      const info = this.gl.getActiveUniform(this.program, i);
      if (info) {
        const name = info.name;
        const location = this.gl.getUniformLocation(this.program, name);
        console.log(name);
        if (location) {
          this.uniforms.set(name, location);
        }
      }
    }
  }

  public getAttributeLocation(name: string): number {
    const location = this.attributes.get(name);
    if (location === undefined) {
      throw new Error(`Attribute '${name}' not found in shader program`);
    }

    return location;
  }

  public getUniformLocation(name: string): WebGLUniformLocation {
    const location = this.uniforms.get(name);
    if (location === undefined) {
      throw new Error(`Uniform '${name}' not found in shader program`);
    }

    return location;
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

  dispose(): void {
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }

    this.attributes.clear();
    this.uniforms.clear();
  }
}
