import * as PIXI from 'pixi.js';
import { $word, start, checkLetter } from './services/word';

import Keyboard from './keyboard';
import words from './words';

import store from '../redux/configureStore';
import {
  startGame,
  showKeyboard,
  incorrectKey,
  finishGame,
  setWord,
} from '../redux/actions';
import { MAX_GUESSES } from './constants';

// new stuff
$word.watch(console.log);
start()
checkLetter('A')
checkLetter('B')
checkLetter('C')

let word = [],
  anim,
  statusText,
  guessText,
  startButton,
  keyboard,
  elapsed = Date.now(),
  unsubscribe;

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
  dropShadowDistance: 6,
});

const app = new PIXI.Application({
  autoResize: true,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
});

document.body.appendChild(app.view);

const loader = app.loader;
// loader.add('fonts/font.fnt')
loader.add('images/particle.png');
loader.add('images/data.json').load(setup);

function subscribe() {
  return store.subscribe(() => {
    updateanim(store.getState().game.attemptsLeft);
    if (!store.getState().game.complete) {
      updateGuessText(store.getState().game.mask.join(' '));
    }
  });
}

onComplete = onComplete.bind(this);
updateGuessText = updateGuessText.bind(this);
observeStore(store, (state) => state.complete, onComplete);

function onComplete(complete) {
  console.log('app onComplete', complete);
  if (complete) {
    gameOver();
  }
}

function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState().game);
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

function setup() {
  var frames = [];

  for (var i = 1; i < 8; i++) {
    console.log(`frame_${i}.png`);
    frames.push(PIXI.Texture.fromFrame(`frame_${i}.png`));
  }

  anim = new PIXI.extras.AnimatedSprite(frames);
  anim.x = app.screen.width * 0.5 - anim.width * 0.5;
  anim.y = 110;
  app.stage.addChild(anim);

  statusText = new PIXI.Text("Let's Play HANGMAN", style);
  statusText.x = app.screen.width * 0.5 - statusText.width * 0.5;
  statusText.y = 30;

  guessText = new PIXI.Text('', style);
  guessText.y = statusText.y + 40;

  keyboard = new Keyboard(app, loader);
  app.stage.addChild(keyboard);

  app.stage.addChild(statusText);
  app.stage.addChild(guessText);
  keyboard.x = app.screen.width * 0.5 - keyboard.width * 0.5;
  keyboard.y = app.screen.height - 60 - keyboard.height;

  addActions();
  unsubscribe = subscribe();
  animate();
}

function getWord() {
  let len = words.length;
  word = words[Math.floor(Math.random() * len)].toUpperCase().split('');
  store.dispatch(setWord(word));
}

function updateStatusText(msg, color = '#00ff99') {
  statusText.text = msg;
  statusText.style.fill = ['#ffffff', color];
  statusText.x = app.screen.width * 0.5 - statusText.width * 0.5;
}

function updateGuessText(msg) {
  guessText.text = msg;
  guessText.x = app.screen.width * 0.5 - guessText.width * 0.5;
}

function updateanim(attemptsLeft) {
  let frame = MAX_GUESSES - attemptsLeft;
  anim.gotoAndStop(frame);
}

function gameOver() {
  if (hasSolved()) {
    updateStatusText('YOU WON!!!');
  } else {
    updateStatusText('OHHH UNLUCKY!', '#990000');
  }
  updateGuessText(store.getState().game.word.join(' '));
  startButton.visible = true;
  unsubscribe();
}

function restartGame() {
  updateStatusText("Let's Play HANGMAN");
  unsubscribe = subscribe();
  store.dispatch(startGame());
  store.dispatch(showKeyboard(true));

  getWord();
}

function hasSolved() {
  return store.getState().game.mask.indexOf('_') === -1;
}

function addActions() {
  startButton = new PIXI.Sprite();
  startButton.interactive = true;
  startButton.on('pointerdown', () => {
    startButton.visible = false;
    restartGame();
  });

  let startText = new PIXI.Text('START GAME', {
    fontFamily: 'Chelsea Market',
    fontSize: 32,
    fill: '#628297',
  });

  let background = new PIXI.Graphics();
  background.beginFill(0x00ff00, 0.2);
  background.drawRoundedRect(0, 0, 240, 40, 8);
  background.endFill();

  startText.x = background.width * 0.5 - startText.width * 0.5;
  startButton.x = app.screen.width * 0.5 - background.width * 0.5;
  startButton.y = app.screen.height - 60;

  startButton.addChild(background, startText);
  app.stage.addChild(startButton);
}

function animate() {
  const now = Date.now();
  if (keyboard) keyboard.update((now - elapsed) * 0.001);

  elapsed = now;
  app.renderer.render(app.stage);
  requestAnimationFrame(animate);
}
