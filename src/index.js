globalThis.HK = await HavokPhysics()

import ControllersManager from './controllers_manager.js'
import GameManager from './game_manager.js'

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

  scene.enablePhysics(BABYLON.Vector3.Zero(), new BABYLON.HavokPlugin())

  const camera = new BABYLON.FreeCamera(
    'camera1',
    new BABYLON.Vector3(0, 2, -10),
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

  const controllersManager = new ControllersManager()

  await addXRSupport(scene, controllersManager)

  return scene
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
          let blade
          if (isLeft) controllersManager.assignLeftController(mesh)
          else {
            blade = controllersManager.assignRightController(mesh)

            const gameManager = new GameManager(scene, controllersManager.blade)

            setInterval(() => gameManager.spawnCube(), 400)

            scene.onBeforeRenderObservable.add(() => gameManager.onGameTick())
          }
        })
      })
    })
  })
}

await main()
