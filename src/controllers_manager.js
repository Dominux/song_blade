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
  }

  _createBlade(side, mesh) {
    const blade = BABYLON.MeshBuilder.CreateCylinder(
      `${side} blade`,
      { height: 1, diameter: 0.05 },
      this.scene
    )

    blade.position.z += 0.3
    blade.rotation.x = -Math.PI / 2

    blade.parent = mesh
  }
}
