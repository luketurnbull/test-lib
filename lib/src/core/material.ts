export class Material {
  public vertexShader: string;
  public fragmentShader: string;

  private static vertexHeader = `in vec3 position;
   in vec3 normal;
   in vec2 uv;
  `;

  private static fragmentHeader = `precision highp float;
   out vec4 fragColor;
  `;

  constructor({
    vertexShader,
    fragmentShader,
  }: {
    vertexShader: string;
    fragmentShader: string;
  }) {
    this.vertexShader = `#version 300 es
  ${Material.vertexHeader}
  ${vertexShader}`;

    this.fragmentShader = `#version 300 es
  ${Material.fragmentHeader}
  ${fragmentShader}`;
  }
}
