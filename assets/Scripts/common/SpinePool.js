const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,
        _spineNode: null,
        itemPrefab: cc.Prefab,
    },

    onLoad() {
        this._spines = {};
        this._jsons = {};
        this._atlases = {};
        this._textures = {};

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
        registerEvent(EventCode.SPINE_POOL.GET_JSON, this.GETJSON, this);
    },

    addJson(name, json) {
        this._jsons[name] = json;
    },

    addAtlas(name, atlas) {
        this._atlases[name] = atlas;
    },

    addTexture(name, texture) {
        this._textures[name] = texture;
    },

    addSpine(name) {
        // ! bug #1: occur error when change spine
        const spine = new sp.SkeletonData();
        spine.skeletonJson = this._jsons[name];
        spine.atlasText = this._atlases[name];
        spine.textures.push(this._textures[name]);
        spine.textureNames.push(this._textures[name].name);
        this._spines[name] = spine;

        // todo
        this.loadSkeletonData(spine);
        Emitter.instance.emit(EventCode.EXPORT.GET_JSON, spine.skeletonJson);
        Emitter.instance.emit(EventCode.MENU.GET_JSON, spine.skeletonJson);
    },

    loadSkeletonData(data) {
        if (!this._spineNode) {
            const node = cc.instantiate(this.spinePrefab);
            node.parent = this.node;
            this._spineNode = node.getComponent(sp.Skeleton);
        }
        this._spineNode.getComponent("SpineController").loadSkeleton(data);
    },

    loadSpines() {
        const spineNames = Object.keys(this._spines);
        cc.log(spineNames);
        // todo
    },

    GETJSON(json) {
        cc.error("json mới nè e híu");
        cc.log(json);
    },
});
