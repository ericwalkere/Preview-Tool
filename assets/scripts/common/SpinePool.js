const EventCode = require("EventCode");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,
        itemPrefabs: cc.Prefab,
        animNode: cc.Node,
        eventNode: cc.Node,
        skinNode: cc.Node,

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
        this.loadEvent(name);
        // todo

        // cc.log(this._jsons);
        // this._spineNode.setEventListener(()=>{
        //     cc.log('alo');
        // })

        // this._jsons[name].animations['idle'].events = [];
        // cc.log(this._jsons[name].animations['idle']);
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
        this.animNode.removeAllChildren();
        for (let i = 0; i < animations.length; i++) {
            const anim = cc.instantiate(this.itemPrefabs);
            const data = anim.getComponent("LoadData");
            data.setData(animations[i], "anim");
            data.getJson(this._jsons[name]);
            anim.parent = this.animNode;
        }
    },

    loadSkins(name) {
        const skins = Object.keys(this._jsons[name].skins);
        this.skinNode.removeAllChildren();
        for (let i = 0; i < skins.length; i++) {
            const skin = cc.instantiate(this.itemPrefabs);
            skin.getComponent("LoadData").setData(skins[i], "skin");
            skin.parent = this.skinNode;
        }
    },

    loadEvent(name) {
        if(!this._jsons[name].events) return;
        
        const events = Object.keys(this._jsons[name].events);
        this.eventNode.removeAllChildren();
        for (let i = 0; i < events.length; i++) {
            const event = cc.instantiate(this.itemPrefabs);
            event.addComponent("AudioImport").setEventName(events[i]);
            event.getComponent("LoadData").setData(events[i], "event");
            event.parent = this.eventNode;
        }
    },
});
