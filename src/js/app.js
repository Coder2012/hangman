import * as PIXI from 'pixi.js'

import Keyboard from './keyboard'
import words from './words'

import store from '../redux/configureStore'
import { startGame, showKeyboard, incorrectKey, finishGame, setWord } from '../redux/actions'

let word = [], mask = [], statusText, guessText, startButton, keyboard, elapsed = Date.now()

const app = new PIXI.Application({
  autoResize: true,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio
})

document.body.appendChild(app.view)

const loader = app.loader
loader.add('fonts/font.fnt')
loader.add('images/particle.png')
loader.add('images/data.json').load(setup)

function setup () {
  statusText = new PIXI.Text('Let\'s Play HANGMAN', {
    fontFamily: "Chelsea Market",
    fontSize: 32,
    fill: "#628297"
  });
  statusText.x = (app.screen.width * 0.5) - (statusText.width * 0.5)
  statusText.y = 30

  guessText = new PIXI.Text('', {
    fontFamily: "Chelsea Market",
    fontSize: 32,
    fill: "#628297"
  });
  
  guessText.y = statusText.y + 40

  keyboard = new Keyboard(app, loader)
  app.stage.addChild(keyboard)
  
  app.stage.addChild(statusText)
  app.stage.addChild(guessText)
  keyboard.x = app.screen.width * 0.5 - keyboard.width * 0.5
  keyboard.y = app.screen.height - 60 - keyboard.height

  addActions()
  subscribe()
  animate()
}

function getWord() {
  let len = words.length
  word = words[Math.floor(Math.random() * len)].toUpperCase().split('')
  store.dispatch(setWord(word))
}

function updateGuess() {
  let letter = store.getState().game.selectedKey

  updateGuessText()

  if(hasSolved() || store.getState().game.attemptsLeft === 0) {
    // store.dispatch(finishGame())
  }
}

function updateGuessText() {
  guessText.text = store.getState().game.mask.join(' ')
  guessText.x = (app.screen.width * 0.5) - (guessText.width * 0.5);
}

function gameOver() {
  if(hasSolved()) {
    console.log('well done')
  }else{
    console.log('unlucky!')
  }
  startButton.visible = true;
}

function restartGame() {
  store.dispatch(startGame())
  store.dispatch(showKeyboard(true))

  getWord()
  updateGuessText()
}

function hasSolved() {
  return mask.indexOf('_') === -1
}

function addActions() {
  startButton = new PIXI.Sprite()
  startButton.interactive = true
  startButton.on('pointerdown', () => {
    startButton.visible = false
    restartGame()
  })

  let startText = new PIXI.Text('START GAME', {
    fontFamily: "Chelsea Market",
    fontSize: 32,
    fill: "#628297"
  })

  let background = new PIXI.Graphics()
  background.beginFill(0x00ff00, 0.2);
  background.drawRoundedRect(0, 0, 240, 40, 8);
  background.endFill();
  
  startText.x = (background.width * 0.5) - (startText.width * 0.5)
  startButton.x = (app.screen.width * 0.5) - (background.width * 0.5)
  startButton.y = app.screen.height - 60
  
  startButton.addChild(background, startText)
  app.stage.addChild(startButton)
}

function subscribe() {
  store.subscribe(() => {
    let state = store.getState().game
    if(!state.complete && state.selectedKey) {
      updateGuess()
    }else if(state.complete){
      gameOver()
    }
  
  })
}

function animate () {
  const now = Date.now()
  if (keyboard) keyboard.update((now - elapsed) * 0.001)

  elapsed = now
  app.renderer.render(app.stage)
  requestAnimationFrame(animate)
}
