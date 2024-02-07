const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");
const { inRange } = require("maths");

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,
        eventEfx: cc.Prefab,

        _isLoop: false,
        _isCompleted: false,

        _fromTime: 0,
        _toTime: 0,
        _isUpdate: false,
        _isReload: false,
        _isDragEvent: false,
    },

    onLoad() {
        this.initEvents();
        this.initSpineListeners();
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
        registerEvent(EventCode.SPINE_CTRL.SET_ALPHA, this.setPremultipliedAlpha, this);
        registerEvent(EventCode.SPINE_CTRL.UPDATE_TIME, this.updateAnimTime, this);
        registerEvent(EventCode.SPINE_CTRL.ADD_EVENT_KEY, this.addEventKey, this);
        registerEvent(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.removeEventKey, this);
        registerEvent(EventCode.SPINE_CTRL.SHOW_EVENT, this.canShow, this);
        registerEvent(EventCode.SPINE_CTRL.DRAG_EVENT, this.dragEvent, this);
    },

    initSpineListeners() {
        this.spine.setEventListener((trackEntry, event) => {
            if (this._isReload || this._isDragEvent) return;

            const time = event.time;
            if (this._isUpdate && !inRange(time, this._fromTime, this._toTime)) return;

            this.showEvenKey(event.data.name);

            const audios = this._audioListener[trackEntry.animation.name];
            if (!audios) return;
            const audio = audios[event.data.name];
            audio && audio.listener();
        });

        this.spine.setCompleteListener((trackEntry) => {
            if (!this._isLoop) {
                this.setPaused(true);
                this._isCompleted = true;
            }
        });
    },

    loadSkeleton(skeletonData) {
        this.spine.skeletonData = skeletonData;

        const json = this.getJson();
        if (!json.audioListeners) json.audioListeners = {};
        this._audioListener = json.audioListeners;
    },

    update(dt) {
        if (this._isCompleted && this._isLoop) return;

        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        let currentTime = trackEntry.getAnimationTime();
        Emitter.instance.emit(EventCode.TIMELINE.UPDATE_TIMELINE, currentTime);
    },

    updateTrackEntryTime(trackEntry, time) {
        this._fromTime = trackEntry.getAnimationTime();
        this._toTime = time;
        this._isUpdate = true;

        if (this._isLoop && time === trackEntry.animationEnd) time -= Number.EPSILON;
        const paused = this.spine.paused;
        this.spine.paused = false;
        this.spine.update(time - trackEntry.trackTime);
        this.spine.paused = paused;

        this._isUpdate = false;
        this._isCompleted = !this._isLoop && trackEntry.isComplete();
    },

    updateAnimTime(time) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        this.updateTrackEntryTime(trackEntry, time);
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
            this.updateTrackEntryTime(trackEntry, time);
        }
        trackEntry.loop = loop;
        this._isLoop = loop;
        Emitter.instance.emit(EventCode.BUTTON.SET_LOOP, loop);
    },

    setPaused(paused) {
        if (!paused && this._isCompleted) {
            this.restart();
            return;
        }
        this.spine.paused = paused;
        Emitter.instance.emit(EventCode.BUTTON.SET_PAUSED, paused);
    },

    restart() {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        const anim = trackEntry.animation.name;
        this.setAnimation(anim);
    },

    setPremultipliedAlpha(enabled) {
        this.spine.premultipliedAlpha = enabled;
    },

    setSkin(name) {
        this.spine.setSkin(name);
    },

    setEventListener(anim, event, audioData) {
        if (!this._audioListener[anim]) {
            this._audioListener[anim] = {};
        }
        this._audioListener[anim][event] = audioData;
    },

    removeEventListener(anim, event) {
        const json = this.getJson();
        const animation = json.animations[anim];
        if (animation.events && animation.events.some((value) => value.name === event)) return;

        const listeners = this._audioListener[anim];
        if (!listeners || !listeners[event]) return;
        delete listeners[event];
    },

    getJson() {
        return this.spine.skeletonData.skeletonJson;
    },

    reloadJson() {
        Emitter.instance.emit(EventCode.MENU.UPDATE_ANIM_EVENT);

        const trackEntry = this.spine.getCurrent(0);
        this.spine.skeletonData.skeletonJson = this.getJson();
        this.spine._updateSkeletonData();
        if (!trackEntry) return;

        this._isReload = true;
        const anim = trackEntry.animation.name;
        const time = trackEntry.getAnimationTime();
        const entry = this.spine.setAnimation(0, anim, this._isLoop);
        this.updateTrackEntryTime(entry, time);
        this._isReload = false;
        this._isDragEvent = false;
    },

    addEventKey(data) {
        const { anim, event, time } = data;
        const json = this.getJson();

        if (!json.events) json.events = {};
        if (!json.events[event]) json.events[event] = {};

        const animation = json.animations[anim];
        if (!animation.events) animation.events = [];

        const hasEventTime = animation.events.some((value) => value.name === event && value.time === time);
        if (hasEventTime) return;

        const eventTime = { time, name: event };
        animation.events.push(eventTime);
        animation.events.sort((a, b) => a.time - b.time);
        this.reloadJson();
    },

    removeEventKey(data) {
        const { anim, event, time } = data;
        const json = this.getJson();
        const animation = json.animations[anim];
        if (!animation || !animation.events) return;

        animation.events = animation.events.filter((value) => !(value.name === event && value.time === time));
        if (animation.events.length === 0) delete animation.events;

        let hasEvent = false;
        for (const key in json.animations) {
            const events = json.animations[key].events;
            if (events) {
                hasEvent = events.some((value) => value.name === event);
                if (hasEvent) break;
            }
        }
        if (!hasEvent) delete json.events[event];

        this.removeEventListener(anim, event);

        this.reloadJson();
    },

    dragEvent(isDragEvent) {
        this._isDragEvent = isDragEvent;
    },
});
