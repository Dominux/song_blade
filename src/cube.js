import Blade from './blade.js'

const createCubeAnimation = () => {
  const animationBox = new BABYLON.Animation(
    'moveForward',
    'position',
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  )
  // Animation keys
  const keys = [
    {
      frame: 0,
      value: new BABYLON.Vector3(0, 1, 30),
    },
    {
      frame: 200,
      value: new BABYLON.Vector3(0, 1, -30),
    },
  ]

  animationBox.setKeys(keys)

  return animationBox
}

const animationBox = createCubeAnimation()

export default class Cube {
  constructor(scene) {
    this._scene = scene

    this._cube = BABYLON.MeshBuilder.CreateBox(
      'cube',
      { size: 0.4 },
      this._scene
    )
    // this._cube.position.z = 30

    const cubeMaterial = new BABYLON.StandardMaterial(
      'Cube Material',
      this._scene
    )
    cubeMaterial.diffuseColor = BABYLON.Color3.Red()
    this._cube.material = cubeMaterial
  }

  startAnimation() {
    this._cube.animations.push(animationBox)

    this._animation = this._scene.beginAnimation(this._cube, 0, 200, true)
  }

  /**
   *
   * @param {Blade} blade
   */
  doesIntersect(blade) {
    return this._cube.intersectsMesh(blade.mesh, false)
  }

  touch(blade) {
    this._touchedBlade = blade
  }

  get touchedBlade() {
    return this._touchedBlade
  }

  stopAnimation() {
    this._animation.pause()
  }

  delete() {
    if (!this._cube.isDisposed()) this._cube.dispose()
  }
}
