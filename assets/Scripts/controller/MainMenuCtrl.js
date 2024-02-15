const Emitter = require("EventEmitter");
const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        _json: null,

        animPrefab: cc.Prefab,
        skinPrefab: cc.Prefab,
        allEventPrefab: cc.Prefab,
        animEventPrefab: cc.Prefab,
        showAllEventButton: cc.Prefab,

        animList: cc.Node,
        skinList: cc.Node,
        eventList: cc.Node,
        allEventList: cc.Node,
        showEventButton: cc.Toggle,

        animText: cc.Label,
    },

    canShow() {
        Emitter.instance.emit(EventCode.SPINE_CTRL.SHOW_EVENT, this.showEventButton.isChecked);
    },

    onLoad() {
        this.initEvents();
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.MENU.GET_JSON, this.getJson, this);
        registerEvent(EventCode.MENU.LOAD_ANIM, this.loadAnims, this);
        registerEvent(EventCode.MENU.LOAD_SKIN, this.loadSkins, this);
        registerEvent(EventCode.MENU.GET_ANIM_NAME, this.getAnimName, this);
        registerEvent(EventCode.MENU.UPDATE_EVENT, this.loadEvent, this);
        registerEvent(EventCode.MENU.UPDATE_ANIM_EVENT, this.updateAnimEvents, this);
        registerEvent(EventCode.MENU.FILTER_EVENT, this.filterEventKey, this);
        registerEvent(EventCode.MENU.FILTER_ALL, this.filterAll, this);
    },

    getJson(json) {
        this._json = json;
        this.loadAnims();
        this.loadSkins();
        this.loadEvent();
        Emitter.instance.emit(EventCode.SPINE_CTRL.SHOW_EVENT, true);
    },

    getAnimName(anim) {
        this.animName = anim;
        this.animText.string = this.animName || "";
    },

    loadAnims() {
        this.animList.removeAllChildren();
        if (!this._json) return;
        const animations = Object.keys(this._json.animations);
        for (let i = 0; i < animations.length; i++) {
            this.createItem(this.animPrefab, animations[i], this.animList, "AnimItem");
        }
    },

    loadSkins() {
        const skins = Object.keys(this._json.skins);
        this.skinList.removeAllChildren();
        for (let i = 0; i < skins.length; i++) {
            this.createItem(this.skinPrefab, skins[i], this.skinList, "SkinItem");
        }
    },

    loadEvent() {
        this.allEventList.removeAllChildren();
        if (!this._json.events) return;
        const events = Object.keys(this._json.events);
        for (let i = 0; i < events.length; i++) {
            this.createItem(this.allEventPrefab, events[i], this.allEventList, "AllEventItem");
        }
    },

    loadAnimEvent() {
        if (!this.animName || !this._json.events || !this._json.animations[this.animName]) return;
        const set = new Set();
        const events = this._json.animations[this.animName].events;

        Emitter.instance.emit(EventCode.TIMELINE.REMOVE_EVENT_KEY);
        if (events) {
            const button = cc.instantiate(this.showAllEventButton);
            button.parent = this.eventList;
            events.forEach((element) => {
                Emitter.instance.emit(EventCode.TIMELINE.CREATE_EVENT_KEY, element, this.animName);
                set.add(element.name);
            });
        }
        set.forEach((element) => {
            const item = this.createItem(this.animEventPrefab, element, this.eventList, "AnimEventItem");
            const audioListeners = this._json.audioListeners;
            let audioData = null;
            if (audioListeners[this.animName] && audioListeners[this.animName][element]) {
                audioData = audioListeners[this.animName][element];
            }
            item.getComponent("AnimEventItem").setAudioImport(this.animName, element, audioData);
        });
    },

    filterEventKey(eventName) {
        const events = this._json.animations[this.animName].events;
        Emitter.instance.emit(EventCode.TIMELINE.REMOVE_EVENT_KEY);
        if (!events) return;
        events.forEach((element) => {
            if (eventName === element.name)
                Emitter.instance.emit(EventCode.TIMELINE.CREATE_EVENT_KEY, element, this.animName);
        });
    },

    filterAll() {
        const events = this._json.animations[this.animName].events;
        Emitter.instance.emit(EventCode.TIMELINE.REMOVE_EVENT_KEY);
        if (!events) return;
        events.forEach((element) => {
            Emitter.instance.emit(EventCode.TIMELINE.CREATE_EVENT_KEY, element, this.animName);
        });
    },

    updateAnimEvents() {
        this.removeChildren();
        this.loadAnimEvent();
    },

    createItem(prefab, name, parent, script) {
        const item = cc.instantiate(prefab);
        const data = item.getComponent(script);
        data.setData(name);
        item.parent = parent;
        return item;
    },

    removeChildren() {
        const arr = this.eventList.children;
        for (let i = 0; i < arr.length; i++) {
            arr[i].destroy();
        }
    },
});
