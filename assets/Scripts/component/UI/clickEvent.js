const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        hintText: cc.Label,
        removeBtn: cc.Node
    },

    onLoad() {
        this.node.on("mouseenter", this.onEnter.bind(this));
        this.node.on("mouseleave", this.onExit.bind(this));
        this.node.on('mousedown', this.onClick.bind(this));
    },

    onClick() {
        this.removeBtn.active = true;
    },

    removeEvent() {
        Emitter.instance.emit(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.data)
        this.node.destroy();
        this.removeBtn.active = false;
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
