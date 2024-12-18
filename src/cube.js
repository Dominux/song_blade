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
      value: new BABYLON.Vector3(0, 0, 50),
    },
    {
      frame: 140,
      value: new BABYLON.Vector3(0, 0, -20),
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

    const cubeMaterial = new BABYLON.StandardMaterial(
      'Cube Material',
      this._scene
    )
    cubeMaterial.diffuseColor = BABYLON.Color3.Red()
    this._cube.material = cubeMaterial

    this.state = 'alive'
  }

  startAnimation() {
    this._cube.animations.push(animationBox)

    this._animation = this._scene.beginAnimation(this._cube, 0, 140, true)
  }

  stopAnimation() {
    this._animation.pause()
  }

  delete() {
    this._cube.dispose()
  }
}
