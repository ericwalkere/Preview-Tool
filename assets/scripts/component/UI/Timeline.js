const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        slider: require("SliderUpdate"),

        _durationTime: 0,
    },

    setDurationTime(durationTime) {
        this._durationTime = durationTime;
    },

    updateTimeline(currentTime) {
        const progress = this._durationTime === 0 ? 1 : currentTime / this._durationTime;
        this.slider.progress = progress;
    },

    onSlide(slide) {
        const currentTime = slide.progress * this._durationTime;
        Emitter.instance.emit(EventCode.SPINE_CTRL.UPDATE_TIME, currentTime);
    },
});
