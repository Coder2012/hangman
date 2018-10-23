export const START_GAME = 'START_GAME'
export const FINISH_GAME = 'FINISH_GAME'
export const SHOW_KEYBOARD = 'SHOW_KEYBOARD'
export const SELECTED_KEY = 'SELECTED_KEY'
export const SET_WORD = 'SET_WORD'

export const startGame = () => { return { type: START_GAME }}
export const finishGame = () => { return { type: FINISH_GAME }}
export const setWord = (value) => { return { type: SET_WORD, word: value }}
export const showKeyboard = (value) => { return { type: SHOW_KEYBOARD, visibility: value }}
export const selectedKey = (value) => { return { type: SELECTED_KEY, id: value }}