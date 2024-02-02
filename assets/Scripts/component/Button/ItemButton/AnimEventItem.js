const Emitter = require("EventEmitter");
const EventCode = require("EventCode");

cc.Class({
    extends: require("LoadDataButton"),

    properties: {
        audioButton: cc.Node,
        audioCheck: cc.Label,
    },

    setAudioImport(anim, event, audioData) {
        const audioImport = this.audioButton.addComponent("AudioImport");
        audioImport.setEventName(event);
        audioImport.setAnim(anim);
        if (audioData) {
            this.audioCheck.node.active = true;
            this.audioCheck.string = audioData.name;
        }
    },

    onClick() {
        Emitter.instance.emit(EventCode.MENU.FILTER_EVENT, this.value);
    },
});
