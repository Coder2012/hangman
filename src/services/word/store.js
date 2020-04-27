import { domain } from '../domain'
import * as events from './events'
import * as gameEvents from '../game/events'
import { WORDS } from '../../constants'

const initialState = {
  word: '',
  mask: '',
  failed: 0,
  guessedLetter: false,
  correctLetter: false,
  guessedWord: false,
}

export const $word = domain
  .store(initialState, { name: 'word' })
  .on(gameEvents.start, (state) => {
    const randInt = Math.floor(Math.random() * WORDS.length)
    const word = WORDS[randInt].toUpperCase()
    return {
      ...state,
      word,
      mask: [...word].map(() => '_').join(''),
    }
  })
  .on(events.guessLetter, (state, guessedLetter) => {
    const letterMap = [...state.word].map((letter) => (letter === guessedLetter ? guessedLetter : false))
    const mask = [...state.mask].map((_, index) => (letterMap[index] ? guessedLetter : state.mask[index]))
    const notGuessed = letterMap.some(Boolean)

    return {
      ...state,
      ...(notGuessed ? { mask: mask.join('') } : { failed: state.failed + 1 }),
      guessedLetter,
      correctLetter: notGuessed,
      ...(mask.includes('_') ? {} : { guessedWord: true }),
    }
  })
  .reset(gameEvents.reset)
