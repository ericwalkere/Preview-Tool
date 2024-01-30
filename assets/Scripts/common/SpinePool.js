const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,

        _spineNode: null,
        _spineName: "",
    },

    onLoad() {
        this._json = null;
        this._atlas = null;
        this._texture = null;

        this.initEvents();
    },

    onDestroy() {
        removeEvents(this);
    },

    initEvents() {
        registerEvent(EventCode.SPINE_POOL.ADD_JSON, this.addJson, this);
        registerEvent(EventCode.SPINE_POOL.ADD_ATLAS, this.addAtlas, this);
        registerEvent(EventCode.SPINE_POOL.ADD_TEXTURE, this.addTexture, this);
        registerEvent(EventCode.SPINE_POOL.ADD_SPINE, this.addSpine, this);
        registerEvent(EventCode.SPINE_POOL.LOAD_JSON, this.loadJson, this);
        registerEvent(EventCode.SPINE_POOL.EXPORT_JSON, this.exportJson, this);
    },

    addJson(json) {
        this._json = json;
    },

    addAtlas(atlas) {
        this._atlas = atlas;
    },

    addTexture(texture) {
        this._texture = texture;
    },

    addSpine(name) {
        this._spineName = name;

        const skeleton = new sp.SkeletonData();
        skeleton.skeletonJson = this._json;
        skeleton.atlasText = this._atlas;
        skeleton.textures = [this._texture];
        skeleton.textureNames = [this._texture.name];
        this.loadSkeletonData(skeleton);
        Emitter.instance.emit(EventCode.MENU.UPDATE_EVENT);
    },

    loadSkeletonData(data) {
        if (!this._spineNode) {
            const node = cc.instantiate(this.spinePrefab);
            node.parent = this.node;
            this._spineNode = node.getComponent(sp.Skeleton);
        }

        this._spineNode.getComponent("SpineController").loadSkeleton(data);
        Emitter.instance.emit(EventCode.MENU.GET_JSON, data.skeletonJson);
    },

    loadJson(json) {
        if (!this._spineNode) return;

        const skeleton = this._spineNode.skeletonData;
        skeleton.skeletonJson = json;
        this.loadSkeletonData(skeleton);
        Emitter.instance.emit(EventCode.MENU.UPDATE_EVENT);
    },

    exportJson() {
        const json = Object.assign({}, this._json);
        Emitter.instance.emit(EventCode.EXPORT.GET_DATA, this._spineName, json);
    },
});
