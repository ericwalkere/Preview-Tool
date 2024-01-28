const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        buttonSprite: cc.Sprite,
        playSpriteFrame: cc.SpriteFrame,
        pauseSpriteFrame: cc.SpriteFrame,

        _isPaused: true,
    },

    onLoad() {
        this.initEvents();
    },

    start() {
        this.setPaused(true);
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.BUTTON.SET_PAUSED, this.setPaused, this);
    },

    setPaused(paused) {
        this._isPaused = paused;
        if (this._isPaused) {
            this.buttonSprite.spriteFrame = this.playSpriteFrame;
        } else {
            this.buttonSprite.spriteFrame = this.pauseSpriteFrame;
        }
    },

    onClick() {
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_PAUSED, !this._isPaused);
    },
});
