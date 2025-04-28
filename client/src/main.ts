import { Material, Mesh, Renderer, BoxGeometry } from "lib";
import "./style.css";

const vertexShader = `
  out vec2 vUv;
  out vec3 vNormal;

  void main() {
    vNormal = normal;
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

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
    // const triangle = new Geometry(
    //   new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0])
    // );

    const material = new Material({
      vertexShader,
      fragmentShader,
    });

    // const mesh = new Mesh(triangle, material);

    // this.renderer.add(mesh);

    const box = new BoxGeometry(1, 1, 1);
    const boxMesh = new Mesh(box, material);

    this.renderer.add(boxMesh);

    this.renderer.render();
  }
}

new WebGLTest();
