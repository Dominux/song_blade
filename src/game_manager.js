import Cube from './cube.js'

export default class GameManager {
  /**
   *
   * @param {BABYLON.Scene} scene
   */
  constructor(scene) {
    this._scene = scene
    this._cubes = []
  }

  onGameTick() {}

  createCube() {
    const cube = new Cube(this._scene)

    this._cubes.push(cube)

    cube.startAnimation()

    setTimeout(() => {
      cube.stopAnimation()
      cube.delete()

      setTimeout(() => {
        if (cube._state === 'alive') {
          cube.stopAnimation()
          cube.delete()

          const i = this._cubes.indexOf(cube)
          if (i > -1) this._cubes.splice(i, 1)
        }
      }, 4000)
    }, 4000)
  }
}
