const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        timeline: require("Timeline"),
        currentTime: cc.Label,
        durationTime: cc.Label,
        // play/pause
        // loop
        _isLoop: false,
        _isPause: true,
        loopButton: cc.Node,

        buttonSprite: cc.Sprite,
        playSprite: cc.SpriteFrame,
        pauseSprite: cc.SpriteFrame,
    },

    onLoad() {
        this.initEvents();
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.TIMELINE.UPDATE_TIMELINE, this.updateTimeline, this);
        registerEvent(EventCode.TIMELINE.SET_DURATION_TIME, this.setDurationTime, this);
    },

    updateTimeline(currentTime) {
        this.timeline.updateTimeline(currentTime);
        this.currentTime.string = currentTime.toFixed(2);
    },

    setDurationTime(duration) {
        this.timeline.setDurationTime(duration);
        this.durationTime.string = duration.toFixed(2);
    },

    setLoop() {
        this._isLoop = !this._isLoop;

        if (this._isLoop) {
            this.loopButton.color = cc.color("#5569FF");
        } else {
            this.loopButton.color = cc.color("#FFFFFF");
        }
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_LOOP, this._isLoop);
    },

    setPause() {
        this._isPause = !this._isPause;

        if (this._isPause) {
            this.buttonSprite.spriteFrame = this.playSprite;
        } else {
            this.buttonSprite.spriteFrame = this.pauseSprite;
        }
        Emitter.instance.emit(EventCode.SPINE_CTRL.SET_PAUSED, this._isPause);
    },

    
});
