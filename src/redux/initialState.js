import { MAX_GUESSES } from "../js/constants";
import { correctKey } from "./actions";

const initialState = {
    showKeyboard: true,
    selectedKey: null,
    attemptsLeft: MAX_GUESSES,
    complete: false,
    incorrectKey: undefined,
    selectedKey: undefined,
    word: [],
    mask: []
}

export default initialState