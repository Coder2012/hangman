import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'

class Particles {
  constructor (container, loader) {
    this._container = container
    this._loader = loader
    this._position = undefined
    this._emit = false
    this._config = {
      "alpha": {
        "start": 0.8,
        "end": 0.4
      },
      "scale": {
        "start": 0.6,
        "end": 0.3
      },
      "color": {
        "start": "e3f9ff",
        "end": "0ec8f8"
      },
      "speed": {
        "start": 200,
        "end": 200
      },
      "startRotation": {
        "min": 0,
        "max": 0
      },
      "rotationSpeed": {
        "min": 0,
        "max": 0
      },
      "lifetime": {
        "min": 0.4,
        "max": 0.4
      },
      "frequency": 0.2,
      "emitterLifetime": 0.5,
      "maxParticles": 32,
      "pos": {
        "x": 0,
        "y": 0
      },
      "addAtBack": false,
      "spawnType": "burst",
      "particlesPerWave": 8,
      "particleSpacing": 45,
      "angleStart": 0
    }
  }

  init () {
    this._emitterContainer = new PIXI.ParticleContainer()
    this._emitterContainer.setProperties({
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    })
    this._container.addChild(this._emitterContainer)
    this._emitter = new particles.Emitter(this._emitterContainer, [this._loader.resources['assets/particle.png'].texture], this._config)
    this._emitter.updateOwnerPos(this.position.x, this.position.y)
  }
  get position () {
    return this._position
  }
  set position (newPosition) {
    this._position = newPosition
    if(this._emitter) {
      this._emitter.resetPositionTracking()
      this._emitter.updateOwnerPos(this.position.x, this.position.y)
    }
  }
  get emitter () {
    return this._emitter
  }
  set emitter (newEmitter) {
    this.emitter = newEmitter
  }
  get emit () {
    return this._emit
  }
  set emit (value) {
    this._emit = value
  }
  update (value) {
    this._emitter.emit = this._emit
    this._emitter.update(value)
  }
}
export default Particles
