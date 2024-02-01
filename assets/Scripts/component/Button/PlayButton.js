const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent } = require("eventHelper");

cc.Class({
    extends: require("CustomButton"),

    properties: {
        buttonSprite: cc.Sprite,
        playSpriteFrame: cc.SpriteFrame,
        pauseSpriteFrame: cc.SpriteFrame,

        _isPaused: true,
    },

    start() {
        this.setPaused(true);
    },

    initEvents() {
        registerEvent(EventCode.BUTTON.SET_PAUSED, this.setPaused, this);
    },

    onClick() {
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_PAUSED, !this._isPaused);
    },

    setPaused(paused) {
        this._isPaused = paused;
        if (this._isPaused) {
            this.buttonSprite.spriteFrame = this.playSpriteFrame;
        } else {
            this.buttonSprite.spriteFrame = this.pauseSpriteFrame;
        }
    },
});
