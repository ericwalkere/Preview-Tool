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

    onClick() {
        this._isOpen = !this._isOpen;
        this.option.active = this._isOpen;

        if (this._isOpen) {
            Emitter.instance.emit(EventCode.MENU.LOAD_ANIM);
            if (this.anim) {
                this.anim.play();
                this.anim.on("finished",() => {
                        this._isOpen = !this._isOpen;},this);
            }
        } else {
            if (this.anim) {
                this.anim.stop();
            }
        }
    },
});
