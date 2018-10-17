import * as PIXI from 'pixi.js'
import store from '../redux/configureStore'
import { selectedKey } from '../redux/actions';

class Keyboard extends PIXI.Container {
    constructor(renderer) {
        super()

        this.renderer = renderer
        
        this.interactive = true
        this.keySize = 60
        this.keys = []

        this.createKeys()
        this.setVisibility()

        const unsubscribe = store.subscribe(() => {
            this.setVisibility()
            this.setSelectedKey()
        })
    }
    
    setVisibility() {
        if(store.getState().game.showKeyboard !== this.visible) {
            this.visible = store.getState().game.showKeyboard
        }
    }

    setSelectedKey() {
        let id = store.getState().game.selectedKey
        let correctId = store.getState().game.correctKey

        let tint = (id === correctId) ? 0x00ff00 : 0xff0000

        if(id) {
            // this.keys[id].alpha = 0.8
            this.keys[id].text.tint = tint
            this.keys[id].interactive = false
        }
    }

    createKeys() {
        let x = 0, y = 0

        for (let n = 0; n < 26; n++) {
            let key = this.addKey(String.fromCharCode(65 + n))
            key.on('pointerdown', () => store.dispatch(selectedKey(key.id)))
            this.keys[key.id] = key;
            
            key.x = x
            key.y = y

            x += this.keySize

            if(x > 3 * this.keySize){
                x = 0
                y += this.keySize
            }

            this.addChild(key)
        }
    }

    addKey(letter) {
        let key = new PIXI.Sprite()
        key.addChild(this.addBackground())
        
        let text = this.addText(letter)
        text.x = this.keySize * 0.5 - text.width * 0.5
        text.y = this.keySize * 0.5 - text.height * 0.5
        key.addChild(text)

        key.interactive = true
        key.id = letter
        key.text = text
        return key
    }

    addText(letter) {
        let text = new PIXI.Text(letter, {
            fontFamily: "Chelsea Market",
            fontSize: 64,
            fill: "#628297"
        })

        return text
    }

    addBackground() {
        var textbg = new PIXI.Graphics();
        textbg.lineStyle(2, 0x628297, 1);
        textbg.beginFill(0x000000, 0.2);
        textbg.drawRoundedRect(0, 0, this.keySize, this.keySize, 8);
        textbg.endFill();

        return textbg
    }
}

export default Keyboard