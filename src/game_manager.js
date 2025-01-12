import Blade from './blade.js'
import Cube from './cube.js'

export default class GameManager {
  /**
   *
   * @param {BABYLON.Scene} scene
   */
  constructor(scene) {
    this._scene = scene
    /** @type {Blade[]} */
    this._blades = []

    /** @type {Cube[]} */
    this._aliveCubes = []
  }

  /**
   *
   * @param {Blade} blade
   */
  addBlade(blade) {
    this._blades.push(blade)
  }

  onGameTick() {
    // checking if alive cubes are touched
    this._aliveCubes = this._aliveCubes.filter((cube) => {
      for (const blade of this._blades) {
        if (cube.doesIntersect(blade)) {
          cube.cut(blade)
          cube.stopAnimation()
          cube.delete()
          return false
        }
      }

      return true
    })
  }

  spawnCube() {
    const cube = new Cube(this._scene)
    cube.startAnimation()

    this._aliveCubes.push(cube)

    setTimeout(() => {
      this._removeCubeFromAlive(cube)
      cube.stopAnimation()
      cube.delete()
    }, 5000)
  }

  _removeCubeFromAlive(cube) {
    const index = this._aliveCubes.indexOf(cube)
    if (index > -1) this._aliveCubes.splice(index, 1)
  }
}
