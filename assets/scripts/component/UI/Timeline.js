const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        slider: require("SliderUpdate"),

        _durationTime: 0,

        eventKey: cc.Prefab,
        eventNode: cc.Node,
    },

    onLoad() {
        registerEvent(
            EventCode.TIMELINE.SET_EVENT_KEY,
            this.createEventKey,
            this
        );
        registerEvent(
            EventCode.TIMELINE.SET_CHILDREN,
            this.removeChildren,
            this
        );
    },

    setDurationTime(durationTime) {
        this._durationTime = durationTime;
    },

    updateTimeline(currentTime) {
        const progress =
            this._durationTime === 0 ? 1 : currentTime / this._durationTime;
        this.slider.progress = progress;
    },

    onSlide(slide) {
        const currentTime = slide.progress * this._durationTime;
        Emitter.instance.emit(EventCode.SPINE_CTRL.UPDATE_TIME, currentTime);
    },

    createEventKey(eventTime, eventName) {
        const percent = eventTime / this._durationTime;
        const key = cc.instantiate(this.eventKey);
        key.getComponent('clickEvent').hint(eventName);
        key.x = percent * 600;
        key.parent = this.eventNode;
    },

    removeChildren() {
        const arr = this.eventNode.children;
        arr.forEach(element => {
            element.destroy();
        });
    },
});
