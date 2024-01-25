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
        _json: null,

        itemPrefab: cc.Prefab,
        animList: cc.Node,
        skinList: cc.Node,
        eventList: cc.Node,
        addEventList: cc.Node,
    },

    onLoad() {
        this.initEvents();
    },

    initEvents() {
        registerEvent(EventCode.MENU.GET_JSON, this.getJson, this);
        registerEvent(EventCode.MENU.SET_CHILDREN, this.removeChildren, this);
        registerEvent(EventCode.MENU.LOAD_EVENT, this.loadAnimEvent, this);
    },

    getJson(json) {
        this._json = json;
        this.loadAnims();
        this.loadSkins();
        this.loadEvent();
    },

    loadAnims() {
        this.animList.removeAllChildren();
        const animations = Object.keys(this._json.animations);
        for (let i = 0; i < animations.length; i++) {
            this.createItem(animations[i], "anim", this.animList);
        }
    },

    loadSkins() {
        const skins = Object.keys(this._json.skins);
        this.skinList.removeAllChildren();
        for (let i = 0; i < skins.length; i++) {
            this.createItem(skins[i], "skin", this.skinList);
        }
    },

    loadEvent() {
        this.addEventList.removeAllChildren();
        if (!this._json.events) return;
        const events = Object.keys(this._json.events);
        for (let i = 0; i < events.length; i++) {
            this.createItem(events[i], "event", this.addEventList);
        }
    },

    loadAnimEvent(name) {
        this.createItem(name, "event", this.eventList);
    },

    createItem(name, type, parent) {
        const item = cc.instantiate(this.itemPrefab);
        const data = item.getComponent("LoadData");
        data.setData(name, type, this._json);
        item.parent = parent;
    },

    removeChildren() {
        const arr = this.eventList.children;
        arr.forEach((element) => {
            element.destroy();
        });
    },
});
