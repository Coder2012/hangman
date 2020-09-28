import * as gameEvents from '../game/events'
import * as events from './events'
import { initialState, $word } from './store'

jest.mock('../../constants', () => ({
  WORDS: ['virus'],
}))

test('initial state should match', () => {
  expect($word.getState()).toEqual(initialState)
})

describe('after start', () => {
  beforeEach(() => {
    gameEvents.start()
  })

  afterEach(() => {
    gameEvents.reset()
  })

  test('should set random word', () => {
    expect($word.getState().word).toEqual('VIRUS')
  })

  test('should set correct mask', () => {
    expect($word.getState().mask).toEqual('_____')
  })

  describe('after guess letter', () => {
    test('incorrect letter', () => {
      events.guessLetter('A')
      const state = $word.getState();

      expect(state.guessedLetter).toBe('A')
      expect(state.correctLetter).toBe(false)
      expect(state.guessedWord).toBe(false)
      expect(state.failed).toEqual(1)
    })

    test('correct letter', () => {
      events.guessLetter('S')
      const state = $word.getState();

      expect(state.guessedLetter).toBe('S')
      expect(state.correctLetter).toBe(true)
      expect(state.guessedWord).toBe(false)
      expect(state.failed).toEqual(0)
    })

    test('failed count should should work with correct and incorrect guesses', () => {
      events.guessLetter('A')
      events.guessLetter('V')
      const state = $word.getState();

      expect(state.failed).toEqual(1)
    })

    test('guess correct word should work', () => {
      events.guessLetter('I')
      events.guessLetter('V')
      events.guessLetter('S')
      events.guessLetter('R')
      events.guessLetter('U')
      const state = $word.getState();

      expect(state.guessedWord).toBe(true)
    })
  })
})
