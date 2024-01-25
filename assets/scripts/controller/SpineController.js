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
                this.spine.paused = true;
                this._isComplete = true;
                cc.log("complete");
            }
        });
    },

    start() {
        cc.log(this.getJson());
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
    },

    update(dt) {
        if (this._isComplete) return;

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
        this.spine.paused = false;
        this._isComplete = false;
        Emitter.instance.emit(EventCode.TIMELINE.SET_DURATION_TIME, trackEntry.animationEnd);
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

    getJson() {
        return this.spine.skeletonData.skeletonJson;
    },
});
