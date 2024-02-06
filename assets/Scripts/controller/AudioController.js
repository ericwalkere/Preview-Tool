const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        mAudio: cc.AudioSource,
    },

    onLoad() {
        registerEvent(EventCode.AUDIO.PLAY_SOUND, this.playSound, this);
    },

    onDestroy() {
        removeEvents(this);
    },

    playSound(sound) {
        this.mAudio.clip = sound;
        this.mAudio.play();
    },
});
