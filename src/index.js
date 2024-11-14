import Cube from './cube.js'

console.log('LMAO')

const main = () => {
  const canvas = document.getElementById('canvas')

  const engine = new BABYLON.Engine(canvas, true)

  const scene = new BABYLON.Scene(engine)

  const camera = new BABYLON.FreeCamera(
    'camera1',
    new BABYLON.Vector3(0, 1, -10),
    scene
  )

  camera.setTarget(BABYLON.Vector3.Zero())

  camera.attachControl(canvas, true)

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 0, -1),
    scene
  )

  light.intensity = 0.7

  setInterval(() => {
    const cube = new Cube(scene)
    cube.startAnimation()

    setTimeout(() => {
      cube.stopAnimation()
      cube.delete()
    }, 1700)
  }, 800)

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}

main()
