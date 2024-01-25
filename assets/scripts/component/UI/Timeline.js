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
        
        registerEvent('clickAnim', this.getDuration, this);

    },

    getDuration(anim){
        Emitter.instance.emit('getDuration', this._durationTime, anim);
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

    createEventKey(data) {
        const percent = data.time / this._durationTime;
        const key = cc.instantiate(this.eventKey);
        key.getComponent('clickEvent').hint(data.name);
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
