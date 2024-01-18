// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const Emitter = require("EventEmitter");
const EventCode = require("EventCode");
cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
    },

    onLoad() {
        this.node.on("click", this.onClick.bind(this));
    },

    setData(text, type) {
        this.text.string = text;
        this.textValue = text;
        this.type = type;
    },

    onClick() {
        switch (this.type) {
            case "anim":
                Emitter.instance.emit(
                    EventCode.SPINE_CTRL.SET_ANIM,
                    this.textValue
                );
                break;
            case "skin":
                cc.log("click skin :", this.textValue);
                break;
            case "event":
                cc.log("click event :", this.textValue);
                break;
        }
    },
});
