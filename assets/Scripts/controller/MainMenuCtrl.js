const Emitter = require("EventEmitter");
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

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.MENU.GET_JSON, this.getJson, this);
        registerEvent(EventCode.MENU.SET_CHILDREN, this.removeChildren, this);
        registerEvent(EventCode.MENU.LOAD_EVENT, this.loadAnimEvent, this);
        registerEvent(EventCode.MENU.UPDATE_EVENT, this.updateEvents, this);
        registerEvent(EventCode.MENU.FILTER_EVENT, this.filterEvent, this);
        registerEvent(EventCode.MENU.ADD_AUDIO, this.addAudio, this);
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
            this.createItem(events[i], "eventAll", this.addEventList);
        }
    },

    loadAnimEvent(name) {
        this.animName = name;
        const set = new Set();
        const anim = this._json.animations[name];
        if (anim.events) {
            for (let i = 0; i < anim.events.length; i++) {
                let data = {
                    time: anim.events[i].time,
                    name: anim.events[i].name,
                };
                Emitter.instance.emit(EventCode.TIMELINE.SET_EVENT_KEY, data);
            }
            anim.events.forEach((e) => {
                set.add(e.name);
            });
        }
        set.forEach((element) => {
            this.createItem(element, "animEvent", this.eventList);
        });
    },

    filterEvent(name) {
        const anim = this._json.animations[this.animName];
        if (anim.events) {
            for (let i = 0; i < anim.events.length; i++) {
                if (anim.events[i].name === name) {
                    Emitter.instance.emit(EventCode.TIMELINE.SET_EVENT_KEY, anim.events[i]);
                }
            }
        }
    },

    updateEvents() {
        Emitter.instance.emit(EventCode.TIMELINE.SET_CHILDREN);
        Emitter.instance.emit(EventCode.MENU.SET_CHILDREN);
        this.loadAnimEvent(this.animName);
        this.loadEvent();
    },

    addAudio() {
        cc.error("TODO Add sound", this.animName);
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
