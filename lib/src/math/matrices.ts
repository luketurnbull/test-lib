export class Matrix4 {
  public elements: number[][] = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

export class ModelMatrix extends Matrix4 {
  public scale() {}

  public rotateX() {}

  public rotateY() {}

  public rotateZ() {}

  public translate() {}
}

export class ProjectionMatrix extends Matrix4 {}

export class ViewMatrix extends Matrix4 {}
