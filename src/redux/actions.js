export const START_GAME = 'START_GAME'
export const END_GAME = 'END_GAME'
export const SHOW_KEYBOARD = 'SHOW_KEYBOARD'
export const SELECTED_KEY = 'SELECTED_KEY'
export const CORRECT_KEY = 'CORRECT_KEY'

export const startGame = () => { return { type: START_GAME }}
export const showKeyboard = (value) => { return { type: SHOW_KEYBOARD, visibility: value }}
export const selectedKey = (value) => { return { type: SELECTED_KEY, id: value }}
export const correctKey = (value) => { return { type: CORRECT_KEY, id: value }}