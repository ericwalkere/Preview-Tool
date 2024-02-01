const Emitter = require("EventEmitter");
const EventCode = require("EventCode");

cc.Class({
    extends: require("LoadData"),

    properties: {
        audioButton:cc.Node,
        audioCheck: cc.Node,
    },

    setAudioImport(anim, event, hasListener) {
        const audioImport = this.audioButton.addComponent("AudioImport");
        audioImport.setEventName(event);
        audioImport.setAnim(anim);
        if (hasListener) {
            this.audioCheck.active = true;
        }
    },

    onClick() {
        Emitter.instance.emit(EventCode.MENU.FILTER_EVENT, this.value);
    },
});
