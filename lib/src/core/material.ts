export class Material {
  public vertexShader: string;
  public fragmentShader: string;

  constructor({
    vertexShader,
    fragmentShader,
  }: {
    vertexShader: string;
    fragmentShader: string;
  }) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
  }
}
