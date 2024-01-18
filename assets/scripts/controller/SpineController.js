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

        this.spine.setCompleteListener(() => {
            // this.spine.clearTrack(0);
        });

        cc.log(this.spine)
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.SPINE_CTRL.SET_ANIM, this.setAnimation, this);
        registerEvent(EventCode.SPINE_CTRL.SET_SKIN, this.setSkin, this);
        registerEvent(EventCode.SPINE_CTRL.SET_LOOP, this.setAnimLoop, this);
    },

    update(dt) {
        const trackEntry = this.spine.getCurrent(0);
        if (!trackEntry) return;

        if (trackEntry.animationLast === trackEntry.animationEnd) {
            return;
        }

        cc.log("run");
        Emitter.instance.emit(
            EventCode.TIMELINE.UPDATE_TIMELINE,
            trackEntry.animationLast,
            trackEntry.animationEnd
        );
    },

    setAnimation(name) {
        const track = this.spine.setAnimation(0, name, this._loop);
        Emitter.instance.emit(
            EventCode.TIMELINE.SET_DURATION_TIME,
            track.animationEnd
        );
    },

    setAnimLoop(loop) {
        const trackEntry = this.spine.getCurrent(0);
        trackEntry.loop = loop;
        this._loop = loop;
    },

    setSkin(name) {},
});
