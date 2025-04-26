import { Geometry, Material, Mesh, Renderer } from "lib";
import "./style.css";

const vertexShader = `#version 300 es
layout(location = 0) in vec3 position;

void main() {
  gl_Position = vec4(position, 1.0);
}`;

const fragmentShader = `#version 300 es
precision highp float;

out vec4 fragColor;

void main() {
  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

class WebGLTest {
  private renderer: Renderer;

  constructor() {
    this.renderer = new Renderer("my-canvas");
    this.init();
  }

  init() {
    /**
     *   /\
     *  /__\
     */
    const triangle = new Geometry(
      new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0])
    );

    const material = new Material({
      vertexShader,
      fragmentShader,
    });

    const mesh = new Mesh(triangle, material);

    this.renderer.add(mesh);
    this.renderer.render();
  }
}

new WebGLTest();
