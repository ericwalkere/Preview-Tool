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
        cc.log("LOADED:", file.name);
        const path = URL.createObjectURL(file);
        const type = file.name.split(".").pop();
        cc.loader.load({ url: path, type }, (err, audioClip) => {
            URL.revokeObjectURL(path);
            if (err) {
                cc.error("ERROR:", err);
                return;
            }

            const anim = this._anim;
            const event = this._event;
            const audio = {
                name: file.name,
                listener: () => {
                    cc.audioEngine.playEffect(audioClip, false);
                    cc.log(`play sound at ${event} in ${anim}`);
                },
            };
            Emitter.instance.emit(EventCode.SPINE_CTRL.SET_EVENT_LISTENER, anim, event, audio);
            Emitter.instance.emit(EventCode.MENU.UPDATE_ANIM_EVENT);
        });
    },

    setAnim(anim) {
        this._anim = anim;
    },

    setEventName(event) {
        this._event = event;
    },
});
