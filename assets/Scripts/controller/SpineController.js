const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,

        _isLoop: false,
        _isCompleted: false,
        eventEfx: cc.Prefab,
    },

    onLoad() {
        this.initEvents();

        this._eventListeners = {};
        this.spine.setEventListener((trackEntry, event) => {
            this.showEvenKey(event.data.name);
            cc.log(trackEntry.animation.name, event.data.name, event.time);

            const listeners = this._eventListeners[trackEntry.animation.name];
            if (!listeners) return;
            const listener = listeners[event.data.name];
            listener && listener();
        });

        this.spine.setCompleteListener(() => {
            if (!this._isLoop) {
                this.setPaused(true);
                this._isCompleted = true;
                this.node.removeAllChildren();
            }
        });
    },

    canShow(isShow = true) {
        this.isShow = isShow;
    },

    showEvenKey(name) {
        if (this.isShow) {
            const eventKeyEfx = cc.instantiate(this.eventEfx);
            eventKeyEfx.getComponent("EventKeyEfx").setText(name);
            eventKeyEfx.parent = this.node;
        }
    },

    start() {
        const json = this.getJson();
        json.listeners = {};
        this._eventListeners = json.listeners;
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.SPINE_CTRL.SET_ANIM, this.setAnimation, this);
        registerEvent(EventCode.SPINE_CTRL.SET_SKIN, this.setSkin, this);
        registerEvent(EventCode.SPINE_CTRL.SET_EVENT_LISTENER, this.setEventListener, this);
        registerEvent(EventCode.SPINE_CTRL.REMOVE_EVENT_LISTENER, this.removeEventListener, this);
        registerEvent(EventCode.SPINE_CTRL.SET_LOOP, this.setLoop, this);
        registerEvent(EventCode.SPINE_CTRL.SET_PAUSED, this.setPaused, this);
        registerEvent(EventCode.SPINE_CTRL.UPDATE_TIME, this.updateTime, this);
        registerEvent(EventCode.SPINE_CTRL.ADD_EVENT_KEY, this.addEventKey, this);
        registerEvent(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.removeEventKey, this);
        registerEvent(EventCode.SPINE_CTRL.SHOW_EVENT, this.canShow, this);
    },

    update(dt) {
        // ! bug
        // if (this._isCompleted && this._isLoop) return;

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

    loadSkeleton(skeletonData) {
        // todo: reload skeleton when update skeleton data
        // ? fix: this method use to fix bug #1
    },

    setAnimation(name) {
        const trackEntry = this.spine.setAnimation(0, name, this._isLoop);
        this._isCompleted = false;
        this.setPaused(false);
        Emitter.instance.emit(EventCode.TIMELINE.SET_DURATION_TIME, trackEntry.animationEnd);
        Emitter.instance.emit(EventCode.TIMELINE.UPDATE_TIMELINE, 0);
    },

    setLoop(loop) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        if (!this._isCompleted) {
            const time = trackEntry.getAnimationTime();
            this.updateTime(time);
        }
        trackEntry.loop = loop;
        this._isLoop = loop;
        Emitter.instance.emit(EventCode.BUTTON.SET_LOOP, loop);
    },

    setPaused(paused) {
        if (!paused && this._isCompleted) {
            this.updateTime(0);
            this._isCompleted = false;
        }
        this.spine.paused = paused;
        Emitter.instance.emit(EventCode.BUTTON.SET_PAUSED, paused);
    },

    setSkin(name) {
        // this.spine.setSkin(name);
    },

    setEventListener(anim, event, callback) {
        if (!this._eventListeners[anim]) {
            this._eventListeners[anim] = {};
        }
        this._eventListeners[anim][event] = callback;
    },

    removeEventListener(anim, event) {
        const listeners = this._eventListeners[anim];
        if (!listeners || !listeners[event]) return;
        delete listeners[event];
    },

    getJson() {
        return this.spine.skeletonData.skeletonJson;
    },

    reloadJson() {
        const trackEntry = this.spine.getCurrent(0);
        this.spine.skeletonData.skeletonJson = this.getJson();
        this.spine._updateSkeletonData();

        if (!trackEntry) return;
        const name = trackEntry.animation.name;
        const time = trackEntry.getAnimationTime();
        const paused = this.spine.paused;
        this.spine.paused = false;
        this.spine.setAnimation(0, name, this._isLoop);
        this.spine.update(time);
        this.spine.paused = paused;
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
            const eventTime = { time, name: event };
            animation.events.push(eventTime);
            animation.events.sort((a, b) => a.time - b.time);
            this.reloadJson();
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
