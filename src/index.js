globalThis.HK = await HavokPhysics()

import Blade from './blade.js'
import ControllersManager from './controllers_manager.js'
import GameManager from './game_manager.js'

console.log('Started')

const main = async () => {
  const canvas = document.getElementById('canvas')

  const engine = new BABYLON.Engine(canvas, true)

  await BABYLON.InitializeCSG2Async()

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

  scene.enablePhysics(
    new BABYLON.Vector3(0, -9.8, 0),
    new BABYLON.HavokPlugin()
  )

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

  const blade = new Blade(scene, 'asd')
  blade.mesh.position.y += 1
  blade.mesh.position.z -= 7
  blade.mesh.rotation = new BABYLON.Vector3(0, 0.3, 0.3)
  const gameManager = new GameManager(scene)
  setInterval(() => gameManager.spawnCube(), 400)
  scene.onBeforeRenderObservable.add(() => gameManager.onGameTick())
  gameManager.addBlade(blade)

  const controllersManager = new ControllersManager(scene)

  // await addXRSupport(scene, controllersManager, gameManager)

  return scene
}

/**
 *
 * @param {BABYLON.Scene} scene
 * @param {ControllersManager} controllersManager
 * @param {GameManager} gameManager
 */
const addXRSupport = async (scene, controllersManager, gameManager) => {
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
        controller.onMeshLoadedObservable.add((mesh) => {
          const blade = controllersManager.assignController(
            mesh,
            motionController.handedness
          )

          gameManager.addBlade(blade)
        })
      })
    })
  })
}

await main()
