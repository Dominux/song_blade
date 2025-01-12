import Blade from './blade.js'

export default class ControllersManager {
  constructor(scene) {
    this.scene = scene
  }

  /**
   *
   * @param {BABYLON.Mesh} mesh
   * @param {'left' | 'right'} side
   */
  assignController(mesh, side) {
    this.left = mesh

    return this._createBlade(side, mesh)
  }

  _createBlade(side, mesh) {
    const blade = new Blade(this.scene, side)

    blade.mesh.position.z -= 0.3
    blade.mesh.rotation.x = -Math.PI / 2

    blade.mesh.parent = mesh

    return blade
  }
}
