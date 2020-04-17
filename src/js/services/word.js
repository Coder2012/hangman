import { createEvent, createStore } from 'effector-logger';
import words from '../words';

const initialState = {
  word: '',
  mask: '',
  failed: 0,
  guessed: false,
};

export const start = createEvent('start');
export const checkLetter = createEvent('check letter');

export const $word = createStore(initialState, { name: 'word' })
  .on(start, (state) => {
    const word = words[Math.floor(Math.random() * words.length)].toUpperCase();
    return {
      ...state,
      word,
      mask: [...word].map(() => '_').join(''),
    };
  })
  .on(checkLetter, (state, guessedLetter) => {
    const letterMap = [...state.word].map((letter) => (letter === guessedLetter ? guessedLetter : false));
    const mask = [...state.mask].map((_, index) => (letterMap[index] ? guessedLetter : state.mask[index]));

    return letterMap.some(Boolean)
      ? {
          ...state,
          mask: mask.join(''),
          ...(mask.includes('_') ? {} : { guessed: true })
        }
      : { ...state, failed: state.failed + 1 };
  });
