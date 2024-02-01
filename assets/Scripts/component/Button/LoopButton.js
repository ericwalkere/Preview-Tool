const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent } = require("eventHelper");

cc.Class({
    extends: require("CustomButton"),

    properties: {
        defaultColor: cc.color("#ffffff"),
        loopColor: cc.color("#5569ff"),

        _isLoop: false,
    },

    start() {
        this.setLoop(false);
    },

    initEvents() {
        registerEvent(EventCode.BUTTON.SET_LOOP, this.setLoop, this);
    },

    onClick() {
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_LOOP, !this._isLoop);
    },

    setLoop(loop) {
        this._isLoop = loop;
        if (this._isLoop) {
            this.node.color = this.loopColor;
        } else {
            this.node.color = this.defaultColor;
        }
    },
});
