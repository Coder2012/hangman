import * as PIXI from 'pixi.js'
import Particles from './particles'

import { wordService } from './services/word'

class Keyboard extends PIXI.Container {
  constructor (app, loader) {
    super()

    this.renderer = app.renderer
    this.stage = app.stage
    this.loader = loader
    this.interactive = true
    this.keySize = 48
    this.keys = []

    this.createKeys()
    this.createEmitter()

    wordService.$.watch((state) => {
      this.setSelectedKey(state.guessedLetter, state.correctLetter)
    })
  }

  setSelectedKey (id, correct) {
    let tint

    if (correct) {
      tint = 0x00ff00
      this.particles.position = { x: this.keys[id].x + this.keySize / 2, y: this.keys[id].y + this.keySize / 2 }
      this.particles.emit = true
      setTimeout(() => {
        this.particles.emit = false
      }, 500)
    } else {
      tint = 0xff0000
    }

    if (id) {
      this.keys[id].text.tint = tint
      this.keys[id].interactive = false
    }
  }

  createKeys () {
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

  addKey (letter) {
    let key = new PIXI.Sprite()
    key.addChild(this.addBackground())

    let text = this.addText(letter)
    text.x = this.keySize * 0.5 - text.width * 0.5
    text.y = this.keySize * 0.5 - text.height * 0.5
    key.addChild(text)

    key.id = letter
    key.text = text
    return key
  }

  addText (letter) {
    return new PIXI.Text(letter, {
      fontFamily: 'Chelsea Market',
      fontSize: 48,
      fill: '#628297'
    })
  }

  addBackground () {
    const textbg = new PIXI.Graphics()
    textbg.lineStyle(2, 0x628297, 1)
    textbg.beginFill(0x000000, 0.2)
    textbg.drawRoundedRect(0, 0, this.keySize, this.keySize, 8)
    textbg.endFill()

    return textbg
  }

  createEmitter () {
    this.particles = new Particles(this, this.loader)
    this.particles.position = new PIXI.Point(0, 0)
    this.particles.init()
  }

  enable (value) {
    Object.keys(this.keys).forEach((id) => {
      let key = this.keys[id]
      key.interactive = value
      if (value) {
        key.text.tint = 0x0000dd
      }
    })
  }

  update (value) {
    this.particles.update(value)
  }
}

export default Keyboard
