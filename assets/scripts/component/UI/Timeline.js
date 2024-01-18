const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        slide: cc.Slider,

        _durationTime: 0,
    },

    setDurationTime(durationTime) {
        this._durationTime = durationTime;
    },

    onSlide() {
        const currentTime = this.slide.progress * this._durationTime;
        Emitter.instance.emit(EventCode.SPINE_CTRL.UPDATE_TIME, currentTime);
    },
});
