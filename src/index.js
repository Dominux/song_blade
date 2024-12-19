globalThis.HK = await HavokPhysics()

import ControllersManager from './controllers_manager.js'
import Cube from './cube.js'

console.log('Started')

const main = async () => {
  const canvas = document.getElementById('canvas')

  const engine = new BABYLON.Engine(canvas, true)

  const scene = await createScene()

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}

const createScene = async (engine) => {
  const scene = new BABYLON.Scene(engine)

  const physicsEngine = new BABYLON.HavokPlugin()
  scene.enablePhysics(BABYLON.Vector3.Zero(), physicsEngine)

  const camera = new BABYLON.FreeCamera(
    'camera1',
    new BABYLON.Vector3(1, 2, -10),
    scene
  )
  // camera.radius = 200

  camera.setTarget(BABYLON.Vector3.Zero())

  camera.attachControl(canvas, true)

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 4, -1),
    scene
  )

  light.intensity = 0.7

  {
    const blade = BABYLON.MeshBuilder.CreateCylinder(
      `blade`,
      { height: 1, diameter: 0.05 },
      scene
    )

    blade.position.z -= 6
    blade.position.x -= 0.7

    // physics aggregate
    const bladeAggregate = new BABYLON.PhysicsAggregate(
      blade,
      BABYLON.PhysicsShapeType.CYLINDER,
      { mass: 1 },
      scene
    )

    // const bladeBody = new BABYLON.PhysicsBody(
    //   blade,
    //   BABYLON.PhysicsMotionType.DYNAMIC,
    //   false,
    //   scene
    // )
    // bladeBody.setMassProperties({
    //   mass: 1,
    // })
    bladeAggregate.body.setCollisionCallbackEnabled(true)

    let direction = 'right'

    scene.onPointerDown = () => {
      let x

      if (direction === 'right') {
        x = 10
        direction = 'left'
      } else {
        x = -10
        direction = 'right'
      }

      bladeAggregate.body.applyImpulse(
        new BABYLON.Vector3(x, 0, 0),
        BABYLON.Vector3.Zero()
      )

      setTimeout(() => {
        bladeAggregate.body.applyImpulse(
          new BABYLON.Vector3(-x, 0, 0),
          BABYLON.Vector3.Zero()
        )
      }, 150)
    }
  }

  setInterval(() => {
    const cube = new Cube(scene)
    cube.startMovingTowardsPlayer()

    setTimeout(() => cube.delete(), 1900)
  }, 300)

  const controllersManager = new ControllersManager()

  runCollisionObservable(physicsEngine)
  // await addXRSupport(scene, controllersManager)

  return scene
}

/**
 *
 * @param {BABYLON.HavokPlugin} physicsEngine
 */
const runCollisionObservable = (physicsEngine) => {
  physicsEngine.onCollisionObservable.add((e) => {
    console.log(e.type)
  })
}

/**
 *
 * @param {BABYLON.Scene} scene
 * @param {ControllersManager} controllersManager
 */
const addXRSupport = async (scene, controllersManager) => {
  const env = scene.createDefaultEnvironment()

  // here we add XR support
  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [env.ground],
  })

  // assigning controllers
  xr.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      // hands are controllers to; do not want to go do this code; when it is a hand
      const isHand = controller.inputSource.hand
      if (isHand) return

      controller.onMotionControllerInitObservable.add((motionController) => {
        const isLeft = motionController.handedness === 'left'

        controller.onMeshLoadedObservable.add((mesh) => {
          if (isLeft) controllersManager.assignLeftController(mesh)
          else controllersManager.assignRightController(mesh)
        })
      })
    })
  })
}

await main()
