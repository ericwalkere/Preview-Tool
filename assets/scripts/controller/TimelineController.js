const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        timeline: require("SliderUpdate"),
        currentTime: cc.Label,
        durationTime: cc.Label,
        // play/pause
        // loop
    },

    onLoad() {
        this.initEvents();
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.TIMELINE.UPDATE_TIMELINE, this.updateTimeline, this);
        registerEvent(EventCode.TIMELINE.SET_DURATION_TIME, this.setDurationTime, this);
    },

    updateTimeline(currentTime, durationTime) {
        const progress = durationTime === 0 ? 1 : currentTime / durationTime;
        this.timeline.updateProgress(progress);
        this.currentTime.string = currentTime.toFixed(2);
    },

    setDurationTime(duration) {
        this.timeline.getComponent("Timeline").setDurationTime(duration);
        this.durationTime.string = duration.toFixed(2);
    },
});
