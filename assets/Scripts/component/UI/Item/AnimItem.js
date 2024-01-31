const Emitter = require("EventEmitter");
const EventCode = require("EventCode");
cc.Class({
    extends: require("LoadData"),

    onClick() {
        Emitter.instance.emit(EventCode.MENU.GET_ANIM_NAME, this.value);
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_ANIM, this.value);
        Emitter.instance.emit(EventCode.TIMELINE.GET_ANIM, this.value);
        Emitter.instance.emit(EventCode.TIMELINE.REMOVE_EVENT_KEY);
        Emitter.instance.emit(EventCode.MENU.UPDATE_ANIM_EVENT);
    },
});
