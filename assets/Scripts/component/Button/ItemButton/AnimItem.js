const Emitter = require("EventEmitter");
const EventCode = require("EventCode");

cc.Class({
    extends: require("LoadDataButton"),

    properties: {
        checkMark: cc.Node,
    },

    onClick() {
        this.checkMark.active = true;
        Emitter.instance.emit(EventCode.MENU.GET_ANIM_NAME, this.value);
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_ANIM, this.value);
        Emitter.instance.emit(EventCode.TIMELINE.GET_ANIM, this.value);
        Emitter.instance.emit(EventCode.MENU.UPDATE_ANIM_EVENT);
    },
});
