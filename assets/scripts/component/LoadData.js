const Emitter = require("EventEmitter");
const EventCode = require("EventCode");
cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,

        audioCheck: cc.Node,
        addAudio: cc.Node,
    },

    onLoad() {
        this.node.on("click", this.onClick.bind(this));
        this.addAudio.on("click", this.addSound.bind(this));
    },

    setData(name, type, json) {
        this.text.string = name;
        this.value = name;
        this.type = type;
        this.json = json;

        switch (type) {
            case "anim":
                this.node.removeComponent(cc.Button);
                break;
            case "skin":
                this.node.removeComponent(cc.Button);
                break;
            case "animEvent":
                this.addAudio.addComponent("AudioImport").setEventName(name);
                this.addAudio.active = true;
                this.node.removeComponent(cc.Button);
                break;
            case "eventAll":
                this.node.removeComponent(cc.Toggle);
                break;
        }
    },

    getAnimName(name) {
        this.animName = name;
    },

    addSound() {
        cc.log("click add audio");

        //if has sound
        this.audioCheck.active = true;
    },

    onClick() {
        switch (this.type) {
            case "anim":
                this.eventName = this.value;
                Emitter.instance.emit(EventCode.MENU.SET_CHILDREN);
                Emitter.instance.emit(EventCode.TIMELINE.SET_CHILDREN);
                Emitter.instance.emit(EventCode.SPINE_CTRL.SET_ANIM, this.value);
                Emitter.instance.emit(EventCode.MENU.LOAD_EVENT, this.value);
                Emitter.instance.emit(EventCode.TIMELINE.GET_ANIM, this.value);
                break;
            case "skin":
                cc.log("click skin :", this.value);
                break;
            case "eventAll":
                Emitter.instance.emit(EventCode.TIMELINE.GET_EVENT_NAME, this.value);
                Emitter.instance.emit(EventCode.BUTTON.SAVE_KEY);
                break;
            case "animEvent":
                Emitter.instance.emit(EventCode.TIMELINE.SET_CHILDREN);
                Emitter.instance.emit(EventCode.MENU.FILTER_EVENT, this.value);
                break;
        }
    },
});
