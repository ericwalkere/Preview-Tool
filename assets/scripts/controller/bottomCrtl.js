// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");
cc.Class({
    extends: cc.Component,

    properties: {
        startTimeText: cc.Label,
        endTimeText: cc.Label,
        slide: cc.Slider,
    },

    onLoad() {
        registerEvent(EventCode.UI_BOTTOM.TIME_BAR, this.init, this);
    },

    init(track) {
        this.track = track;
        this.endTimeText.string = track.animation.duration.toFixed(2);
    },

    update(dt) {
        // if(this._coolDown >= this.endTime) return;
        // this._coolDown += dt;
        // this.slide.progress = this._coolDown;
    },
});
