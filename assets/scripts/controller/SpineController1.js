const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,
    },

    onLoad() {
        this.initEvents();

        this.spine.setCompleteListener(() => {
            this.spine.clearTrack(0);
        });
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.SPINE_CTRL.SET_ANIM, this.setAnimation, this);
        registerEvent(EventCode.SPINE_CTRL.SET_SKIN, this.setSkin, this);
    },

    update(dt) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        cc.log("run");
        Emitter.instance.emit(EventCode.TIMELINE.UPDATE_TIMELINE, trackEntry.animationLast, trackEntry.animationEnd);
    },

    setAnimation(name, loop = false) {
        const track = this.spine.setAnimation(0, name, loop);
        Emitter.instance.emit(EventCode.TIMELINE.SET_DURATION_TIME, track.animationEnd);
    },

    setSkin(name) {},
});
