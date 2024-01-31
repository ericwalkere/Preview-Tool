const Emitter = require("EventEmitter");
const EventCode = require("EventCode");

cc.Class({
    extends: require('LoadData'),

    onClick() {
        Emitter.instance.emit(EventCode.TIMELINE.ADD_EVENT_TO_ANIM, this.value);
        Emitter.instance.emit(EventCode.MENU.FILTER_ALL);
    },
});
