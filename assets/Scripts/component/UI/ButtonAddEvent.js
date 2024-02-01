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
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");
cc.Class({
    extends: cc.Component,

    properties: {
        addNew: cc.Node,
        box: cc.EditBox,
    },

    clickButtonAddNew() {
        this.addNew.active = false;
        this.box.node.active = true;
        this.box.string = "";
    },

    enterText() {
        this.addNew.active = true;
        this.box.node.active = false;
        Emitter.instance.emit(EventCode.SPINE_CTRL.CREATE_EVENT_KEY, this.box.string.trim());
    },

    onLeave() {
        if (this.box.string.trim() !== "") {
            return;
        }
        this.addNew.active = true;
        this.box.node.active = false;
    },
});
