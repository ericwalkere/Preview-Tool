const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: require("FileImport"),

    properties: {
        _eventName: "",
    },

    acceptFile() {
        return "audio/mpeg,audio/wav,audio/ogg";
    },

    loadFile(file) {
        const path = URL.createObjectURL(file);
        const type = file.name.split(".").pop();
        cc.loader.load({ url: path, type }, (err, audioClip) => {
            if (err) {
                cc.error("ERROR:", err);
                return;
            }

            Emitter.instance.emit(EventCode.SPINE_CTRL.SET_EVENT_LISTENER, this._eventName, () => {
                cc.audioEngine.playEffect(audioClip, false);
            });
        });
    },

    setEventName(eventName) {
        this._eventName = eventName;
    },
});
