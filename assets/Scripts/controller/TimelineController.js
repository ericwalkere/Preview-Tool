const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        timeline: require("Timeline"),
        currentTime: cc.Label,
        durationTime: cc.Label,
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

    updateTimeline(currentTime) {
        this.timeline.updateTimeline(currentTime);
        this.currentTime.string = currentTime.toFixed(2);
    },

    setDurationTime(duration) {
        this.timeline.setDurationTime(duration);
        this.durationTime.string = duration.toFixed(2);
    },
});
