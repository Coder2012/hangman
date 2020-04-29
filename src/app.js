import * as PIXI from 'pixi.js'
import { wordService } from 'services/word'
import { gameService } from 'services/game'
import { MAX_GUESSES } from '@/constants'

import Keyboard from '@/keyboard'

let anim
let statusText
let guessText
let startButton
let keyboard
let buttonFlasher

let style = new PIXI.TextStyle({
  fontFamily: 'Bungee',
  fontSize: 26,
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
})

const app = new PIXI.Application({
  antialias: true,
  autoDensity: true,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
})

document.body.appendChild(app.view)

const loader = PIXI.Loader.shared
loader.add('assets/particle.png')
loader.add('assets/data.json').load(setup)

// eslint-disable-next-line no-func-assign
updateGuessText = updateGuessText.bind(this)

wordService.$.updates.watch(({ mask, failed }) => {
  updateGuessText(mask)
  updateAnimation(failed)
})

gameService.$.watch(({ word, guessedWord, hung }) => {
  if (guessedWord || hung) {
    updateGuessText(word)
    gameOver(guessedWord)
  }
})

function setup() {
  const scale = 0.5
  const sheet = PIXI.Loader.shared.resources["assets/data.json"].spritesheet;
  anim = new PIXI.AnimatedSprite(sheet.animations["image"]);

  anim.x = app.screen.width * 0.5 - anim.width * 0.5 * scale
  anim.y = 110
  anim.scale.x = scale
  anim.scale.y = scale
  app.stage.addChild(anim)

  statusText = new PIXI.Text("Let's Play HANGMAN", style)
  statusText.x = app.screen.width * 0.5 - statusText.width * 0.5
  statusText.y = 30

  guessText = new PIXI.Text('', style)
  guessText.y = statusText.y + 40

  keyboard = new Keyboard(loader)
  app.stage.addChild(keyboard)

  app.stage.addChild(statusText)
  app.stage.addChild(guessText)
  keyboard.x = app.screen.width * 0.5 - keyboard.width * 0.5
  keyboard.y = app.screen.height - 60 - keyboard.height

  addActions()
  flashOn()
}

function updateStatusText(msg, color = '#00ff99') {
  statusText.text = msg
  statusText.style.fill = ['#ffffff', color]
  statusText.x = app.screen.width * 0.5 - statusText.width * 0.5
}

function updateGuessText(msg) {
  guessText.text = msg.split('').join(' ')
  guessText.x = app.screen.width * 0.5 - guessText.width * 0.5
}

function updateAnimation(frame) {
  anim.gotoAndStop(frame)
}

function gameOver(hasWon) {
  if (hasWon) {
    updateStatusText('WELL DONE YOU WON')
  } else {
    updateStatusText('UNLUCKY YOU LOST', '#990000')
  }
  keyboard.stop()
  startButton.visible = true
}

function restartGame() {
  updateStatusText("Let's Play HANGMAN")
  gameService.reset()
  keyboard.reset()
  keyboard.start()
  gameService.start()
}

function addActions() {
  startButton = new PIXI.Sprite()
  startButton.interactive = true
  startButton.on('pointerdown', () => {
    startButton.visible = false
    restartGame()
  })

  let startText = new PIXI.Text('START GAME', {
    fontFamily: 'Bungee',
    fontSize: 24,
    fill: '#628297',
  })

  let background = new PIXI.Graphics()
  background.beginFill(0x00ff00, 1)
  background.drawRoundedRect(0, 0, 180, 30, 8)
  background.endFill()
  background.alpha = 0.2

  startText.x = background.width * 0.5 - startText.width * 0.5
  startButton.x = app.screen.width * 0.5 - background.width * 0.5
  startButton.y = app.screen.height - 50

  startButton.addChild(background, startText)
  app.stage.addChild(startButton)
}

function flashOn() {
  let background = startButton.getChildAt(0)

  buttonFlasher = setInterval(() => {
    background.alpha = background.alpha === 0.2 ? 0.8 : 0.2
  }, 500)
}
