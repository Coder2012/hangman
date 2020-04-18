import * as PIXI from 'pixi.js'
import { wordService } from './services/word'
import { gameService } from './services/game'

import Keyboard from './keyboard'

let anim
let statusText
let guessText
let startButton
let keyboard
let elapsed = Date.now()

let style = new PIXI.TextStyle({
  fontFamily: 'Chelsea Market',
  fontSize: 32,
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6
})

const app = new PIXI.Application({
  autoResize: true,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio
})

document.body.appendChild(app.view)

const loader = app.loader
loader.add('images/particle.png')
loader.add('images/data.json').load(setup)

// eslint-disable-next-line no-func-assign
updateGuessText = updateGuessText.bind(this)

wordService.$.updates.watch(({ mask, failed }) => {
  updateGuessText(mask)
  updateAnimation(failed)
})

gameService.$.watch(({ guessedWord, hung }) => {
  if (guessedWord || hung) {
    gameOver(guessedWord)
  }
})

function setup () {
  var frames = []

  for (var i = 1; i < 8; i++) {
    console.log(`frame_${i}.png`)
    frames.push(PIXI.Texture.fromFrame(`frame_${i}.png`))
  }

  anim = new PIXI.extras.AnimatedSprite(frames)
  anim.x = app.screen.width * 0.5 - anim.width * 0.5
  anim.y = 110
  app.stage.addChild(anim)

  statusText = new PIXI.Text("Let's Play HANGMAN", style)
  statusText.x = app.screen.width * 0.5 - statusText.width * 0.5
  statusText.y = 30

  guessText = new PIXI.Text('', style)
  guessText.y = statusText.y + 40

  keyboard = new Keyboard(app, loader)
  app.stage.addChild(keyboard)

  app.stage.addChild(statusText)
  app.stage.addChild(guessText)
  keyboard.x = app.screen.width * 0.5 - keyboard.width * 0.5
  keyboard.y = app.screen.height - 60 - keyboard.height

  addActions()
  animate()
}

function updateStatusText (msg, color = '#00ff99') {
  statusText.text = msg
  statusText.style.fill = ['#ffffff', color]
  statusText.x = app.screen.width * 0.5 - statusText.width * 0.5
}

function updateGuessText (msg) {
  guessText.text = msg.split('').join(' ')
  guessText.x = app.screen.width * 0.5 - guessText.width * 0.5
}

function updateAnimation (frame) {
  anim.gotoAndStop(frame)
}

function gameOver (hasWon) {
  if (hasWon) {
    updateStatusText('YOU WON!!!')
  } else {
    updateStatusText('OHHH UNLUCKY!', '#990000')
  }

  startButton.visible = true
}

function restartGame () {
  updateStatusText("Let's Play HANGMAN")
}

function addActions () {
  startButton = new PIXI.Sprite()
  startButton.interactive = true
  startButton.on('pointerdown', () => {
    startButton.visible = false
    restartGame()
    gameService.start()
  })

  let startText = new PIXI.Text('START GAME', {
    fontFamily: 'Chelsea Market',
    fontSize: 32,
    fill: '#628297'
  })

  let background = new PIXI.Graphics()
  background.beginFill(0x00ff00, 0.2)
  background.drawRoundedRect(0, 0, 240, 40, 8)
  background.endFill()

  startText.x = background.width * 0.5 - startText.width * 0.5
  startButton.x = app.screen.width * 0.5 - background.width * 0.5
  startButton.y = app.screen.height - 60

  startButton.addChild(background, startText)
  app.stage.addChild(startButton)
}

function animate () {
  const now = Date.now()
  if (keyboard) keyboard.update((now - elapsed) * 0.001)

  elapsed = now
  app.renderer.render(app.stage)
  requestAnimationFrame(animate)
}
