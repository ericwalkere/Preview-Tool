const Emitter = require("EventEmitter");
const EventCode = require("EventCode");

cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
    },

    onLoad() {
        this.node.on("click", this.onClick.bind(this));
    },

    setData(value) {
        this.text.string = value;
        this.value = value;
    },

    onClick() {},
});
