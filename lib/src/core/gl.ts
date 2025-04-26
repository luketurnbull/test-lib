export class Context {
  private static instance: Context;
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;

  private constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const gl = this.canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("No WebGL2 context available");
    }

    this.gl = gl;
  }

  public static initialize(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    if (this.instance) {
      return this.instance.gl;
    }

    this.instance = new Context(canvas);

    return this.instance.gl;
  }

  public static useGl() {
    if (!this.instance) {
      throw new Error("Context is not initialized. Call initialize() first");
    }

    return this.instance.gl;
  }
}
