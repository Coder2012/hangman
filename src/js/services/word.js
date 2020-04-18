import { createEvent, createStore } from 'effector-logger';
import { start, guessLetter } from '../events/game';
import words from '../words';

const initialState = {
  word: '',
  mask: '',
  failed: 0,
  guessedLetter: false,
  correctLetter: false,
  guessedWord: false,
};

export const $word = createStore(initialState, { name: 'word' })
  .on(start, (state) => {
    const randInt = Math.floor(Math.random() * words.length);
    const word = words[randInt].toUpperCase();
    return {
      ...state,
      word,
      mask: [...word].map(() => '_').join(''),
    };
  })
  .on(guessLetter, (state, guessedLetter) => {
    const letterMap = [...state.word].map((letter) => (letter === guessedLetter ? guessedLetter : false));
    const mask = [...state.mask].map((_, index) => (letterMap[index] ? guessedLetter : state.mask[index]));

    return letterMap.some(Boolean)
      ? {
          ...state,
          mask: mask.join(''),
          guessedLetter,
          correctLetter: true,
          ...(mask.includes('_') ? {} : { guessedWord: true }),
        }
      : {
          ...state,
          failed: state.failed + 1,
          guessedLetter,
          correctLetter: false,
        };
  });
