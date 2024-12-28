import Blade from './blade.js'
import Cube from './cube.js'

export default class GameManager {
  /**
   *
   * @param {BABYLON.Scene} scene
   * @param {Blade} blade
   */
  constructor(scene, blade) {
    this._scene = scene
    this._blade = blade

    /** @type {Cube[]} */
    this._aliveCubes = []
  }

  onGameTick() {
    // checking if alive cubes are touched
    this._aliveCubes = this._aliveCubes.filter((cube) => {
      if (!cube.doesIntersect(this._blade)) {
        return true
      }

      cube.cut(this._blade)
      cube.stopAnimation()
      cube.delete()
      return false
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
