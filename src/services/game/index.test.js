import * as wordEvents from '../word/events'
import * as events from './events'
import { $game } from './store'

jest.mock('../../constants', () => ({
  WORDS: ['four'],
  MAX_GUESSES: 4
}))

describe('after start', () => {
  beforeEach(() => {
    events.start()
  })

  afterEach(() => {
    events.reset()
  })

  test('should set random word', () => {
    expect($game.getState().word).toEqual('FOUR')
  })

  describe('after guess letter', () => {
    test('incorrect letter', () => {
      wordEvents.guessLetter('A')
      const state = $game.getState()

      expect(state.guessedWord).toBe(false)
      expect(state.hung).toBe(false)
    })

    test('correct word', () => {
      wordEvents.guessLetter('O')
      wordEvents.guessLetter('F')
      wordEvents.guessLetter('R')
      wordEvents.guessLetter('U')
      const state = $game.getState()

      expect(state.guessedWord).toBe(true)
      expect(state.hung).toBe(false)
    })

    test('we should get hung', () => {
      wordEvents.guessLetter('A')
      wordEvents.guessLetter('B')
      wordEvents.guessLetter('C')
      wordEvents.guessLetter('D')
      const state = $game.getState()

      expect(state.guessedWord).toBe(false)
      expect(state.hung).toBe(true)
    })
  })
})
