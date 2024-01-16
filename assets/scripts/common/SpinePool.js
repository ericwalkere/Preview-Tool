const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,
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
        // todo
    },
});
