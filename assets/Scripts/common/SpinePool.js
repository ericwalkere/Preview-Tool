const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,

        _spineNode: null,
        _spineName: "Untitled",
    },

    onLoad() {
        this.initEvents();

        this._json = {};
        this._atlas = {};
        this.refreshTextures();
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

    refreshTextures() {
        this._textures = [];
        this._textureNames = [];
    },

    addJson(json) {
        this._json = json;
    },

    addAtlas(atlas) {
        this._atlas = atlas;
    },

    addTexture(texture) {
        this._textures.push(texture);
        this._textureNames.push(texture.name);
    },

    addSpine(name) {
        const skeleton = new sp.SkeletonData();
        skeleton.skeletonJson = this._json;
        skeleton.atlasText = this._atlas;
        skeleton.textures = this._textures;
        skeleton.textureNames = this._textureNames;
        this.loadSkeletonData(skeleton);

        this._spineName = name;
        this.refreshTextures();
    },

    loadSkeletonData(data) {
        if (!this._spineNode) {
            const node = cc.instantiate(this.spinePrefab);
            node.parent = this.node;
            this._spineNode = node.getComponent(sp.Skeleton);
        }

        this._spineNode.getComponent("SpineController").loadSkeleton(data);
        Emitter.instance.emit(EventCode.MENU.GET_JSON, data.skeletonJson);

        Emitter.instance.emit(EventCode.MENU.LOAD_SKIN);
        Emitter.instance.emit(EventCode.MENU.UPDATE_EVENT);
        Emitter.instance.emit(EventCode.MENU.UPDATE_ANIM_EVENT);
        Emitter.instance.emit(EventCode.TIMELINE.REMOVE_EVENT_KEY);
        Emitter.instance.emit(EventCode.TIMELINE.SET_DURATION_TIME, 0);
        Emitter.instance.emit(EventCode.TIMELINE.UPDATE_TIMELINE, 0);
        Emitter.instance.emit(EventCode.MENU.SHOW_ANIM_NAME);
    },

    loadJson(json) {
        if (!this._spineNode) return;

        const skeleton = this._spineNode.skeletonData;
        skeleton.skeletonJson = json;
        this.loadSkeletonData(skeleton);
    },

    exportJson() {
        const json = Object.assign({}, this._json);
        Emitter.instance.emit(EventCode.EXPORT.GET_DATA, this._spineName, json);
    },
});
