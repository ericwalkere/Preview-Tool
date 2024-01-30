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
const { registerEvent } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        _isOpen: false,
        option: cc.Node,
        anim: cc.Animation,
    },

    onClick() {
        this._isOpen = !this._isOpen;
        if (this._isOpen) {
            this.option.active = true;
            if (this.anim) {
                this.anim.play();
                this.anim.on(
                    "finished",
                    () => {
                        this._isOpen = !this._isOpen;
                    },
                    this
                );
            }
        } else {
            this.option.active = false;
            if (this.anim) {
                this.anim.stop();
            }
        }
    },
});
