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
    spine: sp.Skeleton,
  },

  onLoad() {
    registerEvent(EventCode.SPINE_CTRL.SET_ANIM, this.setAnimation, this);
  },

  setAnimation(name, loop = false) {
    let track = this.spine.setAnimation(0, name, loop);
  },
});
