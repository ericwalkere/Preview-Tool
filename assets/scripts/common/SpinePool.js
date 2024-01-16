const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,

        _spineNode: null,
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
        registerEvent(EventCode.SPINE_POOL.LOAD_ANIMATIONS, this.loadAnimations, this);
        registerEvent(EventCode.SPINE_POOL.LOAD_SKINS, this.loadSkins, this);
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
        const spine = new sp.SkeletonData();
        spine.skeletonJson = this._jsons[name];
        spine.atlasText = this._atlases[name];
        spine.textures.push(this._textures[name]);
        spine.textureNames.push(this._textures[name].name);
        this._spines[name] = spine;

        this.loadSkeletonData(spine);
        // this.loadSpines();
        // this.loadAnimations(name);
        // this.loadSkins(name);
        // todo
    },

    loadSkeletonData(data) {
        if (!this._spineNode) {
            const node = cc.instantiate(this.spinePrefab);
            node.parent = this.node;
            this._spineNode = node.getComponent(sp.Skeleton);
        }
        this._spineNode.skeletonData = data;
    },

    loadSpines() {
        const spineNames = Object.keys(this._spines);
        cc.log(spineNames);
        // todo
    },

    loadAnimations(name) {
        const animations = Object.keys(this._jsons[name].animations);
        cc.log(animations);
        // todo
    },

    loadSkins(name) {
        const skins = Object.keys(this._jsons[name].skins);
        cc.log(skins);
        // todo
    },
});
