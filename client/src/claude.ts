import "./style.css";
import { Renderer, Camera, Geometry, BasicMaterial, Mesh, Vector3 } from "lib";

class WebGLApp {
  renderer: Renderer;
  camera: Camera;
  cube: Mesh;
  cube2: Mesh;
  time: number = 0;
  canvas: HTMLCanvasElement;

  constructor() {
    const app = document.getElementById("app");
    if (!app) {
      throw new Error("App id not found");
    }

    this.canvas = document.createElement("canvas");
    this.canvas.id = "webgl-canvas";
    app.appendChild(this.canvas);

    // Initialize renderer
    this.renderer = new Renderer(this.canvas);
    this.updateSize(); // Initial size setup
    this.renderer.setClearColor(new Vector3(0.05, 0.05, 0.1));

    // Set up camera
    this.camera = new Camera(
      this.canvas.clientWidth / this.canvas.clientHeight,
      Math.PI / 4,
      0.1,
      100
    );
    this.camera.position.z = 5;

    // Create a cube
    this.cube = this.createCube(1, new Vector3(0.8, 0.2, 0.3));
    this.renderer.add(this.cube);

    // Create a cube
    this.cube2 = this.createCube(-1, new Vector3(0.3, 0.8, 0.3));
    this.renderer.add(this.cube2);

    // Add resize listener
    window.addEventListener("resize", this.handleResize);

    // Start animation loop
    this.animate();
  }

  updateSize = () => {
    // Use clientWidth/Height to get the actual size of the canvas on screen
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    // Update renderer size
    this.renderer.setSize(width, height);

    // Update camera aspect ratio
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  };

  handleResize = () => {
    this.updateSize();
  };

  createCube(y: number, color: Vector3): Mesh {
    // Create cube geometry
    const geometry = Geometry.createBox(1, 1, 1);

    // Create material with custom color
    const material = new BasicMaterial(this.renderer.gl, color);

    // Create mesh
    const mesh = new Mesh(geometry, material);

    // Set initial position
    mesh.position.y = y;

    return mesh;
  }

  animate = (currentTime = 0) => {
    const deltaTime = (currentTime - this.time) / 1000; // Delta time in seconds
    this.time = currentTime;

    // Rotate the cubes
    this.cube.rotation.x += deltaTime * Math.PI * 0.5; // 90 degrees per second
    this.cube.rotation.y += deltaTime * Math.PI * 0.5;

    this.cube2.rotation.x += deltaTime * Math.PI * 0.3; // 54 degrees per second
    this.cube2.rotation.y += deltaTime * Math.PI * 0.7; // Different speed for variety

    // Render the scene
    this.renderer.render(this.camera);

    // Request the next frame
    requestAnimationFrame(this.animate);
  };
}

new WebGLApp();
