import { combine } from 'effector'
import { $word } from '../word/store'
import { MAX_GUESSES } from '../../constants'

export const $game = combine($word, ({ guessedWord, failed }) => {
  return { guessedWord, hung: failed === MAX_GUESSES }
})
