const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,
        _loop: false,
    },

    onLoad() {
        this.initEvents();

        this._eventListeners = {};
        this.spine.setEventListener((_, event) => {
            const listener = this._eventListeners[event.data.name];
            listener && listener();
        });
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.SPINE_CTRL.SET_ANIM, this.setAnimation, this);
        registerEvent(EventCode.SPINE_CTRL.SET_SKIN, this.setSkin, this);
        registerEvent(EventCode.SPINE_CTRL.SET_EVENT_LISTENER, this.setEventListener, this);
        registerEvent(EventCode.SPINE_CTRL.SET_LOOP, this.setAnimLoop, this);
        registerEvent(EventCode.SPINE_CTRL.SET_PAUSED, this.setPaused, this);
        registerEvent(EventCode.SPINE_CTRL.UPDATE_TIME, this.updateTime, this);
    },

    update(dt) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        let currentTime = trackEntry.animationLast;
        if (this.spine.paused) currentTime = trackEntry.trackTime;
        Emitter.instance.emit(EventCode.TIMELINE.UPDATE_TIMELINE, currentTime);
    },

    updateTime(time) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        this.spine.paused = false;
        this.spine.update(time - trackEntry.trackTime);
        this.spine.paused = true;
    },

    setAnimation(name) {
        const trackEntry = this.spine.setAnimation(0, name, this._loop);
        this.spine.paused = false;
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

    setSkin(name) {
        // this.spine.setSkin(name);
    },

    setEventListener(name, callback) {
        this._eventListeners[name] = callback;
    },
});
