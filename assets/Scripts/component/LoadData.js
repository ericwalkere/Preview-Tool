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
                this.addAudio.active = true;
                this.node.removeComponent(cc.Button);
                break;
            case "eventAll":
                this.node.removeComponent(cc.Toggle);
                break;
        }
    },

    setAudioImport(anim, event, hasListener) {
        const audioImport = this.addAudio.addComponent("AudioImport");
        audioImport.setEventName(event);
        audioImport.setAnim(anim);
        if (hasListener) {
            this.audioCheck.active = true;
        }
    },

    onClick() {
        switch (this.type) {
            case "anim":
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
