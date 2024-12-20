import Blade from './blade.js'

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
    const blade = new Blade(this.scene, side)

    blade.mesh.position.z += 0.3
    blade.mesh.rotation.x = -Math.PI / 2

    blade.mesh.parent = mesh

    return blade
  }
}
