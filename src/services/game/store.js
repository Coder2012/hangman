import { combine } from 'effector'
import { $word } from 'services/word/store'
import { MAX_GUESSES } from '@/constants'

export const $game = combine($word, ({ word, guessedWord, failed }) => {
  return { word, guessedWord, hung: failed === MAX_GUESSES }
})
