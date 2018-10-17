import { combineReducers } from 'redux'
import { START_GAME, SHOW_KEYBOARD, SELECTED_KEY, CORRECT_KEY } from './actions'
import initialState from './initialState'

function game(state = initialState, action) {
    switch (action.type) {
        case START_GAME:
            return Object.assign({}, state, {
                isRunning: true
            })

        case SHOW_KEYBOARD:
            return Object.assign({}, state, {
                showKeyboard: action.visibility
            })

        case SELECTED_KEY:
            return Object.assign({}, state, {
                selectedKey: action.id
            })

        case CORRECT_KEY:
            return Object.assign({}, state, {
                correctKey: action.id
            })

            default:
                return state;
    }
}

const hangman = combineReducers({
    game
})

export default hangman