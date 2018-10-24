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
            let word = state.word
            let attempts = state.attemptsLeft
            let foundChars = getCharsInWord(word, action.id)

            foundChars.forEach(item => {
                mask[item.index] = item.char
            })

            if(!foundChars.length) {
                attempts --
            }

            let isComplete = isGameComplete(attempts, mask, word)

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

function getCharsInWord(arr, id) {
    return arr.map((char, index) => {
        if(char === id) {
            return { index: index, char: char }
        }
    }).filter(obj => obj && obj.index >= 0)
}

function isGameComplete(attempts, mask, word) {
    return (attempts === 0) || mask.every((value, index) => value === word[index])
}

const hangman = combineReducers({
    game
})

export default hangman