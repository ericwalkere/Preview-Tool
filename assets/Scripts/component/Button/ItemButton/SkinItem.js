const Emitter = require("EventEmitter");
const EventCode = require("EventCode");

cc.Class({
    extends: require("LoadDataButton"),

    onClick() {
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_SKIN, this.value);
    },
});
