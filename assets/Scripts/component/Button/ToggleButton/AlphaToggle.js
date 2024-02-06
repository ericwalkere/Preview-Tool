const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    onLoad() {
        this.node.on("toggle", this.onToggle, this);
    },

    onDestroy() {
        this.node.off("toggle", this.onToggle, this);
    },

    onToggle(toggle) {
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_ALPHA, toggle.isChecked);
    },
});
