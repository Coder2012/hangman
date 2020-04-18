import { combine } from 'effector';
import { $word } from './word';

const maxGuesses = 6;

export const $game = combine($word, ({ guessedWord, failed }) => {
  return { guessedWord, hung: failed === maxGuesses };
});
