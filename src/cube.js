export default class Cube {
  constructor(scene) {
    this._scene = scene

    this._cube = BABYLON.MeshBuilder.CreateBox(
      'cube',
      { size: 0.4 },
      this._scene
    )

    // Setting only the basic mass properties
    this._body = new BABYLON.PhysicsBody(
      this._cube,
      BABYLON.PhysicsMotionType.DYNAMIC,
      false,
      scene
    )
    this._body.setMassProperties({
      mass: 1,
    })

    const cubeMaterial = new BABYLON.StandardMaterial(
      'Cube Material',
      this._scene
    )
    cubeMaterial.diffuseColor = BABYLON.Color3.Red()
    this._cube.material = cubeMaterial
  }

  startMovingTowardsPlayer() {
    this._body.applyForce(
      new BABYLON.Vector3(0, 0, -300),
      BABYLON.Vector3.Zero()
    )
  }

  delete() {
    this._cube.dispose()
    this._body.dispose()
  }
}
