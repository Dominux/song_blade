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

  /**
   *
   * @param {Blade} blade
   */
  cut(blade) {
    const utilCut = BABYLON.MeshBuilder.CreateBox('cube', {
      updatable: true,
      height: 10,
      width: 0.08,
      depth: 10,
    })
    utilCut.position = blade.mesh.position
    utilCut.rotation = blade.mesh.rotation
    utilCut.setPivotPoint(new BABYLON.Vector3(-0.04, 0, 0))
    utilCut.scaling.set(40, 1, 1)

    let meshCSG = BABYLON.CSG2.FromMesh(this._cube)
    let saberCSG = BABYLON.CSG2.FromMesh(utilCut)

    let lBooleanCSG = meshCSG.subtract(saberCSG)
    let rBooleanCSG = meshCSG.intersect(saberCSG)

    let lMesh = lBooleanCSG.toMesh('lMesh', this._scene, { centerMesh: false })
    let rMesh = rBooleanCSG.toMesh('rMesh', this._scene, { centerMesh: false })

    // utilCut.dispose()

    let objsToDelete = []
    {
      const params = [
        { mesh: lMesh, x: -0.5 },
        { mesh: rMesh, x: 0.5 },
      ]

      objsToDelete = [lMesh, rMesh]
      objsToDelete.push(
        ...params.map((param) => {
          const body = new BABYLON.PhysicsBody(
            param.mesh,
            BABYLON.PhysicsMotionType.DYNAMIC,
            false,
            this._scene
          )

          body.applyImpulse(
            new BABYLON.Vector3(param.x, 0, 0.3),
            BABYLON.Vector3.Zero()
          )

          return body
        })
      )
    }

    setTimeout(() => {
      for (const obj of objsToDelete) {
        obj.dispose()
      }
    }, 1000)
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
