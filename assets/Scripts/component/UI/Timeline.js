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

        removeBtn: cc.Node,
    },

    onLoad() {
        registerEvent(EventCode.TIMELINE.SET_EVENT_KEY, this.createEventKey, this);
        registerEvent(EventCode.TIMELINE.SET_CHILDREN, this.removeChildren, this);
        registerEvent(EventCode.TIMELINE.GET_ANIM, this.getAnim, this);
        registerEvent(EventCode.TIMELINE.GET_EVENT_NAME, this.getEventName, this);
    },

    getAnim(anim) {
        this.anim = anim;
        Emitter.instance.emit(EventCode.BUTTON.GET_EVENT, { anim: anim, event: "", time: this._durationTime });
    },

    getEventName(eventName) {
        Emitter.instance.emit(EventCode.BUTTON.GET_EVENT, {
            anim: this.anim,
            event: eventName,
            time: this._durationTime,
        });
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
        for (let i = 0 ; i < data.length ; i++) {
            const percent = data[i].time / this._durationTime;
            const key = cc.instantiate(this.eventKey);
            key.getComponent('clickEvent').hint(data[i].name);
            key.x = percent * 800;
            key.parent = this.eventNode;
            
            const keyNode = key.getComponent('clickEvent');
            if (keyNode) {
                key.on('mousedown', (event) => this.getRemoveData(event, data[i]), this);
            }
        }
    },

    getRemoveData(event, data) {
        this.removeBtn.active = true;
        this.dataKey = data;
    },

    removeEvent() {
        cc.log('remove KEY: ', this.dataKey)
        Emitter.instance.emit('REMOVE_KEY', this.dataKey);
        this.eventNode.children.active = false;
    },  

    removeChildren() {
        const arr = this.eventNode.children;
        arr.forEach((element) => {
            element.destroy();
        });
    },
});
