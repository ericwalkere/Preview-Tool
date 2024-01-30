const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,
        itemPrefab: cc.Prefab,

        _spineNode: null,
        _curName: "",
    },

    onLoad() {
        this._skeletons = {};
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
        registerEvent(EventCode.SPINE_POOL.LOAD_JSON, this.loadJson, this);
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
        const skeleton = new sp.SkeletonData();
        skeleton.skeletonJson = this._jsons[name];
        skeleton.atlasText = this._atlases[name];
        skeleton.textures.push(this._textures[name]);
        skeleton.textureNames.push(this._textures[name].name);
        this._skeletons[name] = skeleton;
        this._curName = name;

        this.loadSkeletonData(skeleton);
    },

    loadSkeletonData(data) {
        if (!this._spineNode) {
            const node = cc.instantiate(this.spinePrefab);
            node.parent = this.node;
            this._spineNode = node.getComponent(sp.Skeleton);
        }

        this._spineNode.getComponent("SpineController").loadSkeleton(data);
        Emitter.instance.emit(EventCode.EXPORT.GET_JSON, data.skeletonJson);
        Emitter.instance.emit(EventCode.MENU.GET_JSON, data.skeletonJson);
    },

    loadJson(json) {
        const name = this._curName;
        this._jsons[name] = json;
        this._skeletons[name].skeletonJson = json;
        this.loadSkeletonData(this._skeletons[name]);
    },
});
