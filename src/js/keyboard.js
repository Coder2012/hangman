import * as PIXI from 'pixi.js'
// import Particles from './particles'

import { wordService } from './services/word'

class Keyboard extends PIXI.Container {
  constructor(app, loader) {
    super()

    this.renderer = app.renderer
    this.stage = app.stage
    this.loader = loader
    this.interactiveChildren = false
    this.keySize = 38
    this.keys = []

    this.createKeys()
    this.createEmitter()

    wordService.$.watch((state) => {
      this.setSelectedKey(state.guessedLetter, state.correctLetter)
    })
  }

  setSelectedKey(id, correct) {
    let color

    if (correct) {
      color = '#00ff00'
      // this.particles.position = { x: this.keys[id].x + this.keySize / 2, y: this.keys[id].y + this.keySize / 2 }
      // this.particles.emit = true
      // setTimeout(() => {
      //   this.particles.emit = false
      // }, 500)
    } else {
      color = '#ff0000'
    }

    if (id) {
      this.keys[id].text.style.fill = color
      this.keys[id].interactive = false
    }
  }

  createKeys() {
    let x = 0
    let y = 0

    for (let n = 0; n < 26; n++) {
      let key = this.addKey(String.fromCharCode(65 + n))
      key.on('pointerdown', () => wordService.guessLetter(key.id))
      key.interactive = true
      this.keys[key.id] = key

      key.x = x
      key.y = y

      x += this.keySize

      if (x > 5 * this.keySize) {
        x = 0
        y += this.keySize
      }

      this.addChild(key)
    }
  }

  addKey(letter) {
    let key = new PIXI.Sprite()
    key.addChild(this.addBackground())

    let text = this.addText(letter)
    text.x = this.keySize * 0.5 - text.width * 0.5
    text.y = (this.keySize * 0.5 - text.height * 0.5) - 3
    key.addChild(text)

    key.id = letter
    key.text = text
    return key
  }

  addText(letter) {
    return new PIXI.Text(letter, {
      fontFamily: 'Bungee',
      fontSize: 34,
      fill: '#444444',
    })
  }

  addBackground() {
    const textbg = new PIXI.Graphics()
    textbg.lineStyle(4, 0x333333, 1)
    textbg.beginFill(0x999999, 1)
    textbg.drawRoundedRect(0, 0, this.keySize, this.keySize, 8)
    textbg.endFill()

    return textbg
  }

  createEmitter() {
    // this.particles = new Particles(this, this.loader)
    // this.particles.position = new PIXI.Point(0, 0)
    // this.particles.init()
  }

  reset() {
    Object.keys(this.keys).forEach((id) => {
      const key = this.keys[id]
      key.text.style.fill = '#333333'
      key.interactive = true
    })
  }

  start() {
    this.interactiveChildren = true
  }

  stop() {
    this.interactiveChildren = false
  }

  update(value) {
    // this.particles.update(value)
  }
}

export default Keyboard
