const Emitter = require("EventEmitter");
const EventCode = require("EventCode");
const { registerEvent } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        _isOpen: false,
        option: cc.Node,
        anim: cc.Animation,
    },

    start() {
        if (this.anim) this.anim.on("finished", () => (this._isOpen = false), this);
    },

    onClick() {
        this._isOpen = !this._isOpen;
        this.option.active = this._isOpen;

        if (this._isOpen) {
            Emitter.instance.emit(EventCode.MENU.LOAD_ANIM);
            if (this.anim) this.anim.play();
        } else {
            if (this.anim) this.anim.stop();
        }
    },
});
