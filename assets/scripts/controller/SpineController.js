const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");
const { clamp } = require("math");

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,
        _loop: false,
    },

    onLoad() {
        this.initEvents();
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.SPINE_CTRL.SET_ANIM, this.setAnimation, this);
        registerEvent(EventCode.SPINE_CTRL.SET_SKIN, this.setSkin, this);
        registerEvent(EventCode.SPINE_CTRL.SET_LOOP, this.setAnimLoop, this);
        registerEvent(EventCode.SPINE_CTRL.SET_PAUSED, this.setPaused, this);
        registerEvent(EventCode.SPINE_CTRL.UPDATE_TIME, this.updateTime, this);
    },

    update(dt) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        let currentTime = trackEntry.animationLast;
        if (currentTime <= 0) currentTime = trackEntry.trackTime;
        Emitter.instance.emit(EventCode.TIMELINE.UPDATE_TIMELINE, currentTime);
    },

    updateTime(time) {
        const animation = this.spine.animation;
        this.spine.paused = false;
        this.spine.setAnimation(0, animation, this._loop);
        this.spine.update(time);
        this.spine.paused = true;
    },

    setAnimation(name) {
        const trackEntry = this.spine.setAnimation(0, name, this._loop);
        Emitter.instance.emit(EventCode.TIMELINE.SET_DURATION_TIME, trackEntry.animationEnd);
    },

    setAnimLoop(loop) {
        const trackEntry = this.spine.getCurrent(0);
        trackEntry.loop = loop;
        this._loop = loop;
    },

    setPaused(paused) {
        this.spine.paused = paused;
    },

    setSkin(name) {},
});
