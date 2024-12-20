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
    this._cubesToMakeAlive = []

    /** @type {Cube[]} */
    this._aliveCubes = []

    /** @type {Cube[]} */
    this._touchedCubes = []
  }

  onGameTick() {
    // checking touched cubes
    // this._touchedCubes = this._touchedCubes.filter((cube) => {
    //   if (cube.doesIntersect(cube.touchedBlade)) {
    //     // cube.stopAnimation()
    //     // TODO: ...cube cutting logic
    //     console.log('cut')
    //     cube.delete()

    //     return false
    //   } else {
    //     return true
    //   }
    // })

    // checking if alive cubes are touched
    this._aliveCubes = this._aliveCubes.filter((cube) => {
      // console.log(cube._cube.position.z, this._blade.mesh.position.z)
      if (cube.doesIntersect(this._blade)) {
        cube.touch(this._blade)
        cube.stopAnimation()
        cube.delete()
        // this._touchedCubes.push(cube)
        return false
      } else {
        return true
      }
    })

    // adding cubes to alive ones
    for (const cube of this._cubesToMakeAlive) {
      this._aliveCubes.push(cube)
    }
    this._cubesToMakeAlive = []
  }

  spawnCube() {
    const cube = new Cube(this._scene)
    cube.startAnimation()

    console.log('animation started')

    this._aliveCubes.push(cube)
    // setTimeout(() => this._aliveCubes.push(cube), 2000)
    // this._cubesToMakeAlive.push(cube)

    setTimeout(() => {
      cube.stopAnimation()
      cube.delete()
    }, 6000)
  }
}
