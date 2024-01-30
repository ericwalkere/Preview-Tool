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

        contactMenu: cc.Node,
        slide: cc.Slider,
        _isOpen: false,
    },

    onLoad() {
        registerEvent(EventCode.BUTTON.GET_EVENT, this.getEvent, this);
        registerEvent(EventCode.BUTTON.SAVE_KEY, this.saveEventKey, this);
    },

    addNewToTimeLine() {
        this._isOpen = !this._isOpen;
        if (this._isOpen) {
            this.contactMenu.active = true;
        } else {
            this.contactMenu.active = false;
        }
    },

    quitContact() {
        this._isOpen = !this._isOpen;
        this.contactMenu.active = false;
    },

    clickButtonAddNew() {
        this.addNew.active = false;
        this.box.node.active = true;
        this.box.string = "";
    },

    enterText() {
        this.addNew.active = true;
        this.box.node.active = false;
        this.saveEventKey();
    },

    saveEventKey() {
        if (this.box.string.trim() !== "") {
            this.evenName = this.box.string;
            this.box.string = "";
        }

        Emitter.instance.emit(EventCode.SPINE_CTRL.ADD_EVENT_KEY, {
            anim: this.anim,
            event: this.evenName,
            time: this.slide.progress * this.duration,
        });

        Emitter.instance.emit(EventCode.MENU.UPDATE_EVENT);
    },

    getEvent(data) {
        this.anim = data.anim;
        this.evenName = data.event;
        this.duration = data.time;
    },

    onLeave() {
        if (this.box.string.trim() !== "") {
            return;
        }
        this.addNew.active = true;
        this.box.node.active = false;
    },
});
