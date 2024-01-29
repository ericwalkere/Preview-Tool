const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        hintText: cc.Label,
        removeBtn: cc.Node,
        anim:cc.Animation
    },

    onLoad() {
        this.node.on("mouseenter", this.onEnter.bind(this));
        this.node.on("mouseleave", this.onExit.bind(this));
        this.node.on("mousedown", this.onClick.bind(this));
        this.removeBtn.on("click", this.removeEvent.bind(this));
    },

    onClick() {
        this.removeBtn.active = true;
        this.anim.play();
    },

    removeEvent() {
        if (this.data) {
            Emitter.instance.emit(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.data);
            Emitter.instance.emit(EventCode.MENU.UPDATE_EVENT);
        }
    },

    onEnter() {
        this.hintText.node.active = true;
    },

    onExit() {
        this.hintText.node.active = false;
    },

    hint(data) {
        this.hintText.string = data.event;
        this.data = data;
    },
});
