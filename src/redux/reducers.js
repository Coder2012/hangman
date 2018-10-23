import { combineReducers } from 'redux'
import { START_GAME, SHOW_KEYBOARD, SELECTED_KEY, FINISH_GAME, SET_WORD } from './actions'
import initialState from './initialState'

function game(state = initialState, action) {
    switch (action.type) {
        case START_GAME:
            return Object.assign({}, state, initialState)

        case FINISH_GAME:
            return Object.assign({}, state, {
                complete: true
            })

        case SHOW_KEYBOARD:
            return Object.assign({}, state, {
                showKeyboard: action.visibility
            })

        case SET_WORD:
            return Object.assign({}, state, {
                word: action.word,
                mask: Array.from({ length: action.word.length }, () => '_')
            })

        case SELECTED_KEY:
            let mask = state.mask
            let foundChars = state.word.map((char, index) => {
                if(char === action.id) {
                    return { index: index, char: char }
                }
            }).filter(obj => obj && obj.index >= 0)

            foundChars.forEach(item => {
                mask[item.index] = item.char
            })

            let attempts = state.attemptsLeft
            if(!foundChars.length) {
                attempts --
            }

            let isComplete = (attempts === 0) || (mask.length === state.word.length && mask.every((value, index) => value === state.word[index]))

            return Object.assign({}, state, {
                selectedKey: action.id,
                mask: mask,
                attemptsLeft: attempts,
                complete: isComplete
            })

            default:
                return state;
    }
}

const hangman = combineReducers({
    game
})

export default hangman