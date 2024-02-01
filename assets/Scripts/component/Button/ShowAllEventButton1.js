const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {},

    onClick() {
        Emitter.instance.emit(EventCode.MENU.FILTER_ALL);
    },
});
