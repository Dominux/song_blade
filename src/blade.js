export default class Blade {
  constructor(scene, side) {
    this._scene = scene

    this._mesh = BABYLON.MeshBuilder.CreateCylinder(
      `${side} blade`,
      { height: 1, diameter: 0.05 },
      scene
    )

    // let isDirectionRight = true

    // scene.onPointerDown = () => {
    //   const animationBox = createBladeAnimation(isDirectionRight)
    //   this._mesh.animations.push(animationBox)
    //   scene.beginAnimation(this._mesh, 0, 10, true)

    //   isDirectionRight = !isDirectionRight
    // }
  }

  get mesh() {
    return this._mesh
  }
}

const createBladeAnimation = (isDirectionRight) => {
  const animationBox = new BABYLON.Animation(
    'moveBlade',
    'position',
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  )
  // Animation keys
  const keys = [
    {
      frame: 0,
      value: new BABYLON.Vector3(-1, 1, -7),
    },
    {
      frame: 10,
      value: new BABYLON.Vector3(1, 1, -7),
    },
  ]

  if (isDirectionRight) {
    const tempVal = keys[1].value
    keys[1].value = keys[0].value
    keys[0].value = tempVal
  }

  animationBox.setKeys(keys)

  return animationBox
}
