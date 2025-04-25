import "./style.css";
import { Renderer, Camera, Geometry, BasicMaterial, Mesh, Vector3 } from "lib";

class WebGLApp {
  renderer: Renderer;
  camera: Camera;
  cube: Mesh;
  time: number = 0;

  constructor() {
    const app = document.getElementById("app");
    if (!app) {
      throw new Error("App id not found");
    }

    const canvas = document.createElement("canvas");
    canvas.id = "webgl-canvas";
    app.appendChild(canvas);
    if (!canvas) {
      throw new Error("Canvas element not found");
    }

    // Initialize renderer
    this.renderer = new Renderer(canvas);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setClearColor(new Vector3(0.05, 0.05, 0.1));

    // Set up camera
    this.camera = new Camera(
      canvas.clientWidth / canvas.clientHeight,
      Math.PI / 4,
      0.1,
      100
    );
    this.camera.position.z = 5;

    // Create a cube
    this.cube = this.createCube();
    this.renderer.add(this.cube);

    // Start animation loop
    this.animate();
  }

  createCube(): Mesh {
    // Create cube geometry
    const geometry = Geometry.createBox(1, 1, 1);

    // Create material with custom color
    const material = new BasicMaterial(
      this.renderer.gl,
      new Vector3(0.8, 0.2, 0.3)
    );

    // Create mesh
    const mesh = new Mesh(geometry, material);

    // Set initial position
    mesh.position.y = 0.5;

    return mesh;
  }

  animate = (currentTime = 0) => {
    const deltaTime = (currentTime - this.time) / 1000; // Delta time in seconds
    this.time = currentTime;

    // Rotate the cube
    this.cube.rotation.x += deltaTime * Math.PI * 0.5; // 90 degrees per second
    this.cube.rotation.y += deltaTime * Math.PI * 0.5;

    // Render the scene
    this.renderer.render(this.camera);

    // Request the next frame
    requestAnimationFrame(this.animate);
  };
}

new WebGLApp();
