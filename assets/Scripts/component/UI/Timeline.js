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
        this.initEvents();
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.TIMELINE.CREATE_EVENT_KEY, this.createEventKey, this);
        registerEvent(EventCode.TIMELINE.REMOVE_EVENT_KEY, this.removeChildren, this);
        registerEvent(EventCode.TIMELINE.GET_ANIM, this.getAnim, this);
        registerEvent(EventCode.TIMELINE.ADD_EVENT_TO_ANIM, this.addNewEventToAnim, this);
    },

    getAnim(anim) {
        this.anim = anim;
    },

    addNewEventToAnim(eventName) {
        const data = {
            anim: this.anim,
            event: eventName,
            time: this._durationTime * this.slider.progress,
        };
        Emitter.instance.emit(EventCode.SPINE_CTRL.ADD_EVENT_KEY, data);
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
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_PAUSED, true);
    },

    createEventKey(data, animName) {
        const percent = data.time / this._durationTime;
        const key = cc.instantiate(this.eventKey);
        key.getComponent("ClickEvent").hint({ anim: animName, event: data.name, time: data.time });
        key.x = percent * 800;
        key.parent = this.eventNode;
    },

    removeChildren() {
        const arr = this.eventNode.children;
        arr.forEach((element) => {
            element.destroy();
        });
    },
});
