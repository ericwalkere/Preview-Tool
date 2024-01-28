const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { removeEvents, registerEvent } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        defaultColor: cc.color("#ffffff"),
        loopColor: cc.color("#5569ff"),

        _isLoop: false,
    },

    onLoad() {
        this.initEvents();
    },

    start() {
        this.setLoop(false);
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.BUTTON.SET_LOOP, this.setLoop, this);
    },

    setLoop(loop) {
        this._isLoop = loop;
        if (this._isLoop) {
            this.node.color = this.loopColor;
        } else {
            this.node.color = this.defaultColor;
        }
    },

    onClick() {
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_LOOP, !this._isLoop);
    },
});
