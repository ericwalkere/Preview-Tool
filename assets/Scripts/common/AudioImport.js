const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: require("FileImport"),

    properties: {
        _anim: "",
        _event: "",
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

            const anim = this._anim;
            const event = this._event;
            Emitter.instance.emit(EventCode.SPINE_CTRL.SET_EVENT_LISTENER, this._anim, this._event, () => {
                cc.audioEngine.playEffect(audioClip, false);
                cc.log(`play sound at ${event} in ${anim}`);
            });

            Emitter.instance.emit(EventCode.MENU.UPDATE_EVENT);
        });
    },

    setAnim(anim) {
        this._anim = anim;
    },

    setEventName(event) {
        this._event = event;
    },
});
