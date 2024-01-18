const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        timeline: require("SliderUpdate"),
        currentTime: cc.Label,
        durationTime: cc.Label,
        // play/pause
        // loop
        _isLoop: false,
        loopButton: cc.Node,
    },

    onLoad() {
        this.initEvents();
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(
            EventCode.TIMELINE.UPDATE_TIMELINE,
            this.updateTimeline,
            this
        );
        registerEvent(
            EventCode.TIMELINE.SET_DURATION_TIME,
            this.setDurationTime,
            this
        );
    },

    updateTimeline(currentTime, duration) {
        this.timeline.updateProgress(currentTime / duration);
        this.currentTime.string = currentTime.toFixed(2);
    },

    setDurationTime(duration) {
        this.durationTime.string = duration.toFixed(2);
    },

    setLoop() {
        this._isLoop = !this._isLoop;

        if (this._isLoop) {
            this.loopButton.color = cc.color("#5569FF");
            Emitter.instance.emit(EventCode.SPINE_CTRL.SET_LOOP, this._isLoop);
        } else {
            this.loopButton.color = cc.color("#FFFFFF");
            Emitter.instance.emit(EventCode.SPINE_CTRL.SET_LOOP, this._isLoop);
        }
    },

    setPause() {
        
    },
});
