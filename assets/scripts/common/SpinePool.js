const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,
        itemPrefabs: cc.Prefab,
        anims: cc.Node,
        sounds: cc.Node,
        skins: cc.Node,

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
        this.loadAnimations(name);
        this.loadSkins(name);
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
        this.anims.removeAllChildren();
        for (let i = 0; i < animations.length; i++) {
            const anim = cc.instantiate(this.itemPrefabs);
            anim.getComponent("loadData").setData(animations[i], this._spineNode);
            anim.parent = this.anims;
        }
    },

    loadSkins(name) {
        const skins = Object.keys(this._jsons[name].skins);
        this.skins.removeAllChildren();
        for (let i = 0; i < skins.length; i++) {
            const skin = cc.instantiate(this.itemPrefabs);
            skin.parent = this.skins;
        }
    },
});
