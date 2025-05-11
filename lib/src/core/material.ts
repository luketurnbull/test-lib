import { Vector3 } from "../math/vectors";
import { ShaderProgram } from "./shader-program";
import { Matrix4 } from "../math/matrices";
import { Context } from "./gl";

export class Material {
  private shaderProgram: ShaderProgram;
  private gl: WebGL2RenderingContext;

  constructor(vertexShader: string, fragmentShader: string) {
    this.gl = Context.useGl();
    this.shaderProgram = new ShaderProgram(vertexShader, fragmentShader);
  }

  use(): void {
    this.shaderProgram.use();
  }

  setMatrix4(name: string, value: Matrix4): void {
    const location = this.shaderProgram.getUniformLocation(name);
    this.gl.uniformMatrix4fv(location, false, value.elements);
  }

  setVector3(name: string, value: Vector3): void {
    const location = this.shaderProgram.getUniformLocation(name);
    this.gl.uniform3f(location, value.x, value.y, value.z);
  }

  setFloat(name: string, value: number): void {
    const location = this.shaderProgram.getUniformLocation(name);
    this.gl.uniform1f(location, value);
  }

  setInt(name: string, value: number): void {
    const location = this.shaderProgram.getUniformLocation(name);
    this.gl.uniform1i(location, value);
  }

  dispose(): void {
    this.shaderProgram.dispose();
  }
}

// Create a basic material with lighting
export class BasicMaterial extends Material {
  constructor(color = new Vector3(1, 1, 1)) {
    const vertexShader = `#version 300 es
     layout(location = 0) in vec3 position;
     layout(location = 1) in vec3 normal;
     layout(location = 2) in vec2 uv;
     
     uniform mat4 modelMatrix;
     uniform mat4 viewMatrix;
     uniform mat4 projectionMatrix;
     
     out vec3 vNormal;
     out vec2 vUv;
     out vec3 vPosition;
     
     void main() {
       vNormal = mat3(modelMatrix) * normal;
       vUv = uv;
       vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
       gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
     }`;

    const fragmentShader = `#version 300 es
     precision highp float;
     
     in vec3 vNormal;
     in vec2 vUv;
     in vec3 vPosition;
     
     uniform vec3 color;
     uniform vec3 lightPosition;
     
     out vec4 fragColor;
     
     void main() {
       vec3 normal = normalize(vNormal);
       vec3 lightDir = normalize(lightPosition - vPosition);
       
       float diffuse = max(dot(normal, lightDir), 0.0);
       float ambient = 0.2;
       
       vec3 finalColor = color * (ambient + diffuse);
       fragColor = vec4(finalColor, 1.0);
     }`;

    super(vertexShader, fragmentShader);

    // Set default uniforms
    this.use();
    this.setVector3("color", color);
    this.setVector3("lightPosition", new Vector3(5, 5, 5));
  }
}
