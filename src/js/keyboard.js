import * as PIXI from 'pixi.js'
import Particles from './particles'
import store from '../redux/configureStore'
import { selectedKey } from '../redux/actions';
import { MAX_GUESSES } from './constants';

class Keyboard extends PIXI.Container {
    constructor(app, loader) {
        super()

        this.renderer = app.renderer
        this.stage = app.stage
        this.loader = loader
        this.interactive = true
        this.particles 
        this.keySize = 48
        this.keys = []

        this.createKeys()
        this.createEmitter()
        this.setVisibility()

        this.setSelectedKey = this.setSelectedKey.bind(this)
        this.onComplete = this.onComplete.bind(this)
        this.observeStore(store, (state) => state, this.setSelectedKey)
        this.observeStore(store, (state) => state.complete, this.onComplete)
    }

    onComplete(complete) {
        console.log('onComplete', complete)
        if(complete) {
            this.enable(false)
        }else{
            this.enable(true)
        }
    }

    observeStore(store, select, onChange) {
        let currentState;
      
        function handleChange() {
          let nextState = select(store.getState().game);
          if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
          }
        }
      
        let unsubscribe = store.subscribe(handleChange);
        handleChange();
        return unsubscribe;
    }
    
    setVisibility() {
        if(store.getState().game.showKeyboard !== this.visible) {
            this.visible = store.getState().game.showKeyboard
        }
    }

    setSelectedKey(state) {
        if(state.selectedKey === undefined) return

        let id = state.selectedKey
        let mask = state.mask
        let tint
        
        if(mask.includes(id)) {
            tint = 0x00ff00
            this.particles.position = { x: this.keys[id].x + this.keySize / 2, y: this.keys[id].y + this.keySize / 2 }
            this.particles.emit = true
            setTimeout(() => {
                this.particles.emit = false
            }, 500);
        }else{
            tint = 0xff0000
        }
        
        if(id) {
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

            if(x > 5 * this.keySize){
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

        key.id = letter
        key.text = text
        return key
    }

    addText(letter) {
        let text = new PIXI.Text(letter, {
            fontFamily: "Chelsea Market",
            fontSize: 48,
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

    createEmitter() {
        this.particles = new Particles(this, this.loader)
        this.particles.position = new PIXI.Point(0, 0)
        this.particles.init()
        // this.particles.emit = true
    }

    enable(value) {
        console.log('enable keys', value)
        Object.keys(this.keys).forEach(id => {
            let key = this.keys[id]
            key.interactive = value
            if(value) {
                key.text.tint = 0xffffff
            }
        })
    }

    update(value) {
        this.particles.update(value)
    }
}

export default Keyboard