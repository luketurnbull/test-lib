export class Material {
  public vertexShader: string = `#version 300 es
   in vec3 position;
   in vec3 normal;
   in vec2 uv;
  `;
  public fragmentShader: string = `#version 300 es
   precision highp float;

   out vec4 fragColor;
  `;

  constructor({
    vertexShader,
    fragmentShader,
  }: {
    vertexShader: string;
    fragmentShader: string;
  }) {
    this.vertexShader = `${this.vertexShader}
      ${vertexShader}
    `;
    this.fragmentShader = `${this.fragmentShader}
      ${fragmentShader}
    `;
  }
}
