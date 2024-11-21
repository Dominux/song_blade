export default class ControllersManager {
  constructor(scene) {
    this.scene = scene
  }

  assignLeftController(mesh) {
    this.left = mesh

    this._createBlade('left', mesh)
  }

  assignRightController(mesh) {
    this.right = mesh

    this._createBlade('right', mesh)

    setInterval(() => alert(mesh.getAbsolutePosition()), 5000)
  }

  _createBlade(side, mesh) {
    const blade = BABYLON.MeshBuilder.CreateCylinder(
      `${side} blade`,
      { diameter: 0.1 },
      this.scene
    )

    blade.parent = mesh

    // blade.position = mesh.getAbsolutePosition()
    // blade.rotation = mesh.absoluteRotationQuaternion()
  }
}
