const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,

        _isLoop: false,
        _isComplete: false,
    },

    onLoad() {
        this.initEvents();

        this._eventListeners = {};
        this.spine.setEventListener((_, event) => {
            const listener = this._eventListeners[event.data.name];
            listener && listener();
        });

        this.spine.setCompleteListener(() => {
            if (!this._isLoop) {
                this.setPaused(true);
                this._isComplete = true;
            }
        });
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.SPINE_CTRL.SET_ANIM, this.setAnimation, this);
        registerEvent(EventCode.SPINE_CTRL.SET_SKIN, this.setSkin, this);
        registerEvent(EventCode.SPINE_CTRL.SET_EVENT_LISTENER, this.setEventListener, this);
        registerEvent(EventCode.SPINE_CTRL.SET_LOOP, this.setLoop, this);
        registerEvent(EventCode.SPINE_CTRL.SET_PAUSED, this.setPaused, this);
        registerEvent(EventCode.SPINE_CTRL.UPDATE_TIME, this.updateTime, this);
        registerEvent(EventCode.SPINE_CTRL.ADD_EVENT_KEY, this.addEventKey, this);
        registerEvent(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.removeEventKey, this);
    },

    update(dt) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        const currentTime = trackEntry.getAnimationTime();
        Emitter.instance.emit(EventCode.TIMELINE.UPDATE_TIMELINE, currentTime);
    },

    updateTime(time) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        const paused = this.spine.paused;
        this.spine.paused = false;
        this.spine.update(time - trackEntry.trackTime);
        this.spine.paused = paused;
    },

    setAnimation(name) {
        const trackEntry = this.spine.setAnimation(0, name, this._isLoop);
        this._isComplete = false;
        this.setPaused(false);
        Emitter.instance.emit(EventCode.TIMELINE.SET_DURATION_TIME, trackEntry.animationEnd);
        Emitter.instance.emit(EventCode.TIMELINE.UPDATE_TIMELINE, 0);
    },

    setLoop(loop) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        if (!this._isComplete) {
            const time = trackEntry.getAnimationTime();
            this.updateTime(time);
        }
        trackEntry.loop = loop;
        this._isLoop = loop;
        Emitter.instance.emit(EventCode.BUTTON.SET_LOOP, loop);
    },

    setPaused(paused) {
        if (!paused && this._isComplete) this.updateTime(0);
        this.spine.paused = paused;
        Emitter.instance.emit(EventCode.BUTTON.SET_PAUSED, paused);
    },

    restart() {
        this.updateTime(0);
        this.setPaused(false);
    },

    setSkin(name) {
        // this.spine.setSkin(name);
    },

    setEventListener(name, callback) {
        this._eventListeners[name] = callback;
    },

    getJson() {
        return this.spine.skeletonData.skeletonJson;
    },

    addEventKey(data) {
        const { anim, event, time } = data;
        const json = this.getJson();
        if (!json.events) {
            json.events = {};
        }

        if (!json.events[event]) {
            json.events[event] = {};
        }

        const animation = json.animations[anim];
        if (!animation.events) {
            animation.events = [];
        }

        const hasEventTime = animation.events.some((value) => value.name === event && value.time === time);
        if (!hasEventTime) {
            const eventTime = { name: event, time };
            animation.events.push(eventTime);
        }
    },

    removeEventKey(data) {
        const { anim, event, time } = data;
        const json = this.getJson();
        const animation = json.animations[anim];
        if (!animation.events) {
            return;
        }

        animation.events = animation.events.filter((value) => value.name !== event && value.time !== time);
    },
});
