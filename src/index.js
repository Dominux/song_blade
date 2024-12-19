globalThis.HK = await HavokPhysics()

import ControllersManager from './controllers_manager.js'
import GameManager from './game_manager.js'

console.log('Started')

const main = async () => {
  const canvas = document.getElementById('canvas')

  const engine = new BABYLON.Engine(canvas, true)

  const scene = await createScene()

  const gameManager = new GameManager(scene)

  setInterval(() => gameManager.createCube(), 200)

  lmao(scene)

  engine.runRenderLoop(() => {
    gameManager.onGameTick()

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

  // await addXRSupport(scene, controllersManager)

  return scene
}

const createBladeAnimation = (isDirectionRight) => {
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

const lmao = (scene) => {
  const blade = BABYLON.MeshBuilder.CreateCylinder(
    `blade`,
    { height: 1, diameter: 0.05 },
    scene
  )

  let isDirectionRight = true

  scene.onPointerDown = () => {
    const animationBox = createBladeAnimation(isDirectionRight)
    blade.animations.push(animationBox)
    scene.beginAnimation(blade, 0, 10, true)

    isDirectionRight = !isDirectionRight
  }
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
