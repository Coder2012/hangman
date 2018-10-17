import * as PIXI from 'pixi.js'
import keyboardJS from 'keyboardjs'
import Test from './test.js'
import Keyboard from './keyboard'
import words from './words'

import store from '../redux/configureStore'
import { startGame, showKeyboard, isKeyCorrect, correctKey } from '../redux/actions'

let word = [], mask = []

const unsubscribe = store.subscribe(() => {
  if(store.getState().game.selectedKey !== store.getState().game.correctKey) {
    updateGuess()
  }
})

store.dispatch(startGame())

const app = new PIXI.Application({
  autoResize: true,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio
})

document.body.appendChild(app.view)

const loader = app.loader
loader.add('fonts/font.fnt')
loader.add('images/data.json').load(setup)

function setup () {
  var text1 = new PIXI.Text('This is HANGMAN', {
    fontFamily: "Chelsea Market",
    fontSize: 32,
    fill: "#628297"
  });
  text1.x = (app.screen.width * 0.5) - (text1.width * 0.5);
  text1.y = 30;

  let keyboard = new Keyboard(app.renderer)
  app.stage.addChild(keyboard)
  
  app.stage.addChild(text1)
  keyboard.x = app.screen.width * 0.5 - keyboard.width * 0.5
  keyboard.y = app.screen.height - 60 - keyboard.height

  const test = new Test(app.ticker)

  addKeyboard()
  addActions()
  getWord()
}

function getWord() {
  let len = words.length
  word = words[Math.floor(Math.random() * len)].toUpperCase().split('')
  mask = Array.from({ length: word.length }, () => '-');
}

function updateGuess() {
  let letter = store.getState().game.selectedKey

  let foundChars = word.map((char, index) => {
    if(char === letter) {
      return { index: index, char: char }
    }
  }).filter(obj => obj && obj.index >= 0)

  foundChars.forEach(item => {
    mask[item.index] = item.char
  })

  if(mask.indexOf(letter) !== -1) {
    store.dispatch(correctKey(letter))
  }

  console.log(word, letter, foundChars, mask)
  console.log(hasSolved())
}

function hasSolved() {
  return mask.indexOf('-') === -1
}

function addActions() {
  let texture = loader.resources['images/data.json'].textures['keyboard.png']
  let keyboardButton = new PIXI.Sprite(texture)
  keyboardButton.interactive = true
  keyboardButton.tint = 0xff0000
  keyboardButton.x = app.screen.width - keyboardButton.width - 20
  keyboardButton.y = app.screen.height - keyboardButton.height - 20
  keyboardButton.on('pointerdown', () => {
    store.dispatch(showKeyboard(!store.getState().game.showKeyboard))
  })
  app.stage.addChild(keyboardButton)
}

function addKeyboard () {
  const keys = [
      { key:'a', press: aPress, release: aRelease }, 
      { key:'b', press: bPress, release: bRelease } 
    ]

  keys.forEach((map) => {
    keyboardJS.bind(map.key, (e) => {
      console.log(map.key + ' is pressed')
      map.press()
      e.preventRepeat()
    }, (e) => {
      console.log(map.key + ' is released')
      map.release()
    })
  })
}

function aPress () {
  console.log('called aPress function')
}

function aRelease () {
  console.log('called aRelease function')
}

function bPress () {
  console.log('called bPress function')
}

function bRelease () {
  console.log('called bRelease function')
}
