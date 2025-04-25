// core/math.ts - Math utilities for matrices and vectors
export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
}

export class Matrix4 {
  elements: Float32Array;

  constructor() {
    this.elements = new Float32Array([
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ]);
  }

  setIdentity(): Matrix4 {
    this.elements.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return this;
  }

  makeTranslation(x: number, y: number, z: number): Matrix4 {
    this.elements.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
    return this;
  }

  makeRotationX(theta: number): Matrix4 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.elements.set([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]);
    return this;
  }

  makeRotationY(theta: number): Matrix4 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.elements.set([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
    return this;
  }

  makeRotationZ(theta: number): Matrix4 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.elements.set([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return this;
  }

  makePerspective(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4 {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    this.elements.set([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (far + near) * nf,
      -1,
      0,
      0,
      2 * far * near * nf,
      0,
    ]);
    return this;
  }

  multiply(m: Matrix4): Matrix4 {
    const a = this.elements;
    const b = m.elements;
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i * 4 + j] =
          a[i * 4 + 0] * b[0 * 4 + j] +
          a[i * 4 + 1] * b[1 * 4 + j] +
          a[i * 4 + 2] * b[2 * 4 + j] +
          a[i * 4 + 3] * b[3 * 4 + j];
      }
    }

    this.elements = result;
    return this;
  }

  clone(): Matrix4 {
    const clone = new Matrix4();
    clone.elements.set(this.elements);
    return clone;
  }

  copy(m: Matrix4): Matrix4 {
    this.elements.set(m.elements);
    return this;
  }
}

export class Geometry {
  positions: Float32Array;
  normals?: Float32Array;
  uvs?: Float32Array;
  indices?: Uint16Array | Uint32Array;
  vertexCount: number;
  vao: WebGLVertexArrayObject | null = null;
  buffers: {
    position?: WebGLBuffer;
    normal?: WebGLBuffer;
    uv?: WebGLBuffer;
    index?: WebGLBuffer;
  } = {};

  constructor(
    positions: Float32Array,
    normals?: Float32Array,
    uvs?: Float32Array,
    indices?: Uint16Array | Uint32Array
  ) {
    this.positions = positions;
    this.normals = normals;
    this.uvs = uvs;
    this.indices = indices;

    // Calculate vertex count
    this.vertexCount = positions.length / 3;
  }

  static createBox(width = 1, height = 1, depth = 1): Geometry {
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;

    // 8 corners of a cube
    const positions = new Float32Array([
      // Front face
      -w,
      -h,
      d,
      w,
      -h,
      d,
      w,
      h,
      d,
      -w,
      h,
      d,
      // Back face
      -w,
      -h,
      -d,
      -w,
      h,
      -d,
      w,
      h,
      -d,
      w,
      -h,
      -d,
      // Top face
      -w,
      h,
      -d,
      -w,
      h,
      d,
      w,
      h,
      d,
      w,
      h,
      -d,
      // Bottom face
      -w,
      -h,
      -d,
      w,
      -h,
      -d,
      w,
      -h,
      d,
      -w,
      -h,
      d,
      // Right face
      w,
      -h,
      -d,
      w,
      h,
      -d,
      w,
      h,
      d,
      w,
      -h,
      d,
      // Left face
      -w,
      -h,
      -d,
      -w,
      -h,
      d,
      -w,
      h,
      d,
      -w,
      h,
      -d,
    ]);

    const normals = new Float32Array([
      // Front face
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      // Back face
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      // Top face
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      // Bottom face
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      // Right face
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      // Left face
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    ]);

    const uvs = new Float32Array([
      // Front face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Back face
      1, 0, 1, 1, 0, 1, 0, 0,
      // Top face
      0, 1, 0, 0, 1, 0, 1, 1,
      // Bottom face
      1, 1, 0, 1, 0, 0, 1, 0,
      // Right face
      1, 0, 1, 1, 0, 1, 0, 0,
      // Left face
      0, 0, 1, 0, 1, 1, 0, 1,
    ]);

    const indices = new Uint16Array([
      0,
      1,
      2,
      0,
      2,
      3, // Front face
      4,
      5,
      6,
      4,
      6,
      7, // Back face
      8,
      9,
      10,
      8,
      10,
      11, // Top face
      12,
      13,
      14,
      12,
      14,
      15, // Bottom face
      16,
      17,
      18,
      16,
      18,
      19, // Right face
      20,
      21,
      22,
      20,
      22,
      23, // Left face
    ]);

    return new Geometry(positions, normals, uvs, indices);
  }

  // Upload the geometry data to the GPU
  upload(gl: WebGL2RenderingContext): void {
    // Create VAO
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // Position buffer
    this.buffers.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    // Normal buffer (if available)
    if (this.normals) {
      this.buffers.normal = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
      gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    }

    // UV buffer (if available)
    if (this.uvs) {
      this.buffers.uv = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.uv);
      gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
    }

    // Index buffer (if available)
    if (this.indices) {
      this.buffers.index = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    }

    gl.bindVertexArray(null);
  }

  dispose(gl: WebGL2RenderingContext): void {
    // Clean up WebGL resources
    if (this.vao) gl.deleteVertexArray(this.vao);
    if (this.buffers.position) gl.deleteBuffer(this.buffers.position);
    if (this.buffers.normal) gl.deleteBuffer(this.buffers.normal);
    if (this.buffers.uv) gl.deleteBuffer(this.buffers.uv);
    if (this.buffers.index) gl.deleteBuffer(this.buffers.index);

    this.vao = null;
    this.buffers = {};
  }
}

export class Material {
  gl: WebGL2RenderingContext;
  program: WebGLProgram | null = null;
  uniforms: { [key: string]: WebGLUniformLocation | null } = {};
  vertexShader: string;
  fragmentShader: string;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShader: string,
    fragmentShader: string
  ) {
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.compile();
  }

  compile(): void {
    const gl = this.gl;

    // Create and compile vertex shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertShader) throw new Error("Failed to create vertex shader");
    gl.shaderSource(vertShader, this.vertexShader);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(vertShader);
      gl.deleteShader(vertShader);
      throw new Error(`Vertex shader compilation failed: ${info}`);
    }

    // Create and compile fragment shader
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragShader) throw new Error("Failed to create fragment shader");
    gl.shaderSource(fragShader, this.fragmentShader);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(fragShader);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      throw new Error(`Fragment shader compilation failed: ${info}`);
    }

    // Create shader program
    this.program = gl.createProgram();
    if (!this.program) throw new Error("Failed to create shader program");

    gl.attachShader(this.program, vertShader);
    gl.attachShader(this.program, fragShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(this.program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteProgram(this.program);
      this.program = null;
      throw new Error(`Shader program linking failed: ${info}`);
    }

    // Clean up shaders after linking
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);

    // Cache uniform locations
    this.cacheUniforms();
  }

  cacheUniforms(): void {
    const gl = this.gl;
    if (!this.program) return;

    // Get the number of uniforms
    const numUniforms = gl.getProgramParameter(
      this.program,
      gl.ACTIVE_UNIFORMS
    );

    // Get each uniform
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(this.program, i);
      if (info) {
        const name = info.name;
        this.uniforms[name] = gl.getUniformLocation(this.program, name);
      }
    }
  }

  setMatrix4(name: string, value: Matrix4): void {
    const gl = this.gl;
    const location = this.uniforms[name];
    if (location) {
      gl.uniformMatrix4fv(location, false, value.elements);
    }
  }

  setVector3(name: string, value: Vector3): void {
    const gl = this.gl;
    const location = this.uniforms[name];
    if (location) {
      gl.uniform3f(location, value.x, value.y, value.z);
    }
  }

  setFloat(name: string, value: number): void {
    const gl = this.gl;
    const location = this.uniforms[name];
    if (location) {
      gl.uniform1f(location, value);
    }
  }

  setInt(name: string, value: number): void {
    const gl = this.gl;
    const location = this.uniforms[name];
    if (location) {
      gl.uniform1i(location, value);
    }
  }

  dispose(): void {
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    this.uniforms = {};
  }
}

// Create a basic material with lighting
export class BasicMaterial extends Material {
  constructor(gl: WebGL2RenderingContext, color = new Vector3(1, 1, 1)) {
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

    super(gl, vertexShader, fragmentShader);

    // Set default uniforms
    this.use();
    this.setVector3("color", color);
    this.setVector3("lightPosition", new Vector3(5, 5, 5));
  }

  use(): void {
    if (this.program) {
      this.gl.useProgram(this.program);
    }
  }
}

// core/mesh.ts - Mesh class combining geometry and material
export class Mesh {
  geometry: Geometry;
  material: Material;
  modelMatrix: Matrix4;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry;
    this.material = material;
    this.modelMatrix = new Matrix4();
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.scale = new Vector3(1, 1, 1);
  }

  updateModelMatrix(): void {
    this.modelMatrix.setIdentity();

    // TODO: Add scale matrix

    const rotateXMatrix = new Matrix4().makeRotationX(this.rotation.x);
    const rotateYMatrix = new Matrix4().makeRotationY(this.rotation.y);
    const rotateZMatrix = new Matrix4().makeRotationZ(this.rotation.z);

    const translateMatrix = new Matrix4().makeTranslation(
      this.position.x,
      this.position.y,
      this.position.z
    );

    this.modelMatrix
      .multiply(rotateZMatrix)
      .multiply(rotateYMatrix)
      .multiply(rotateXMatrix)
      .multiply(translateMatrix);
  }

  render(
    gl: WebGL2RenderingContext,
    viewMatrix: Matrix4,
    projectionMatrix: Matrix4
  ): void {
    // Update model matrix
    this.updateModelMatrix();

    // Set matrices
    this.material.setMatrix4("modelMatrix", this.modelMatrix);
    this.material.setMatrix4("viewMatrix", viewMatrix);
    this.material.setMatrix4("projectionMatrix", projectionMatrix);

    // Bind the geometry's VAO
    if (this.geometry.vao) {
      gl.bindVertexArray(this.geometry.vao);

      // Draw the geometry
      if (this.geometry.indices) {
        gl.drawElements(
          gl.TRIANGLES,
          this.geometry.indices.length,
          this.geometry.indices instanceof Uint16Array
            ? gl.UNSIGNED_SHORT
            : gl.UNSIGNED_INT,
          0
        );
      } else {
        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.vertexCount);
      }

      // Unbind VAO
      gl.bindVertexArray(null);
    }
  }
}

// core/camera.ts - Simple camera class
export class Camera {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  viewMatrix: Matrix4;
  projectionMatrix: Matrix4;
  aspect: number;
  fov: number;
  near: number;
  far: number;

  constructor(aspect = 1, fov = Math.PI / 4, near = 0.1, far = 1000) {
    this.position = new Vector3(0, 0, 5);
    this.target = new Vector3(0, 0, 0);
    this.up = new Vector3(0, 1, 0);
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
    this.aspect = aspect;
    this.fov = fov;
    this.near = near;
    this.far = far;

    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }

  updateViewMatrix(): void {
    // Simple implementation - would normally use proper lookAt function
    // This is just a placeholder - you'd want a more robust implementation
    const z = new Vector3(
      this.position.x - this.target.x,
      this.position.y - this.target.y,
      this.position.z - this.target.z
    );
    // Normalize z
    const len = Math.sqrt(z.x * z.x + z.y * z.y + z.z * z.z);
    z.x /= len;
    z.y /= len;
    z.z /= len;

    // Cross product to get x axis
    const x = new Vector3(
      this.up.y * z.z - this.up.z * z.y,
      this.up.z * z.x - this.up.x * z.z,
      this.up.x * z.y - this.up.y * z.x
    );
    // Normalize x
    const xLen = Math.sqrt(x.x * x.x + x.y * x.y + x.z * x.z);
    x.x /= xLen;
    x.y /= xLen;
    x.z /= xLen;

    // Cross product to get y axis
    const y = new Vector3(
      z.y * x.z - z.z * x.y,
      z.z * x.x - z.x * x.z,
      z.x * x.y - z.y * x.x
    );

    // Set view matrix
    this.viewMatrix.elements.set([
      x.x,
      y.x,
      z.x,
      0,
      x.y,
      y.y,
      z.y,
      0,
      x.z,
      y.z,
      z.z,
      0,
      -(x.x * this.position.x + x.y * this.position.y + x.z * this.position.z),
      -(y.x * this.position.x + y.y * this.position.y + y.z * this.position.z),
      -(z.x * this.position.x + z.y * this.position.y + z.z * this.position.z),
      1,
    ]);
  }

  updateProjectionMatrix(): void {
    this.projectionMatrix.makePerspective(
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }
}

export class Renderer {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  clearColor: Vector3;
  meshes: Mesh[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL2 not supported");
    }

    this.gl = gl;
    this.clearColor = new Vector3(0.1, 0.1, 0.1);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
  }

  setClearColor(color: Vector3): void {
    this.clearColor = color;
  }

  setSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  add(mesh: Mesh): void {
    // Upload geometry to GPU if not already done
    if (!mesh.geometry.vao) {
      mesh.geometry.upload(this.gl);
    }
    this.meshes.push(mesh);
  }

  render(camera: Camera): void {
    // Clear the canvas
    this.gl.clearColor(
      this.clearColor.x,
      this.clearColor.y,
      this.clearColor.z,
      1.0
    );
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Update camera matrices
    camera.updateViewMatrix();
    camera.updateProjectionMatrix();

    // Render all meshes
    for (const mesh of this.meshes) {
      mesh.render(this.gl, camera.viewMatrix, camera.projectionMatrix);
    }
  }
}

// Example usage
// This is a simple example to show how to use the library
export function createExample(canvas: HTMLCanvasElement): {
  renderer: Renderer;
  camera: Camera;
  mesh: Mesh;
  animate: () => void;
} {
  // Create renderer
  const renderer = new Renderer(canvas);
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor(new Vector3(0.1, 0.2, 0.3));

  // Create camera
  const camera = new Camera(
    canvas.width / canvas.height,
    Math.PI / 4,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Create geometry and material
  const boxGeometry = Geometry.createBox(1, 1, 1);
  const material = new BasicMaterial(renderer.gl, new Vector3(1, 0.5, 0.2));

  // Create mesh
  const mesh = new Mesh(boxGeometry, material);
  renderer.add(mesh);

  // Animation loop
  let lastTime = 0;
  const animate = (time = 0) => {
    const deltaTime = time - lastTime;
    lastTime = time;

    // Rotate the mesh
    mesh.rotation.x += 0.001 * deltaTime;
    mesh.rotation.y += 0.002 * deltaTime;

    // Render the scene
    renderer.render(camera);

    // Request next frame
    requestAnimationFrame(animate);
  };

  return { renderer, camera, mesh, animate };
}
