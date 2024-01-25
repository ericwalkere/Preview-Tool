const Emitter = require("EventEmitter");
const key = require("EventCode");
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

        if (type === "event") {
            this.addAudio.addComponent("AudioImport").setEventName(name);
            this.addAudio.active = true;
        }
    },

    addSound() {
        cc.log("click add audio");

        //if has sound
        this.audioCheck.active = true;
    },

    onClick() {
        switch (this.type) {
            case "anim":
                const anim = this.json.animations[this.value];
                const set = new Set();

                if (anim.events) {
                    for (let i = 0; i < anim.events.length; i++) {
                        let data = {
                            time: anim.events[i].time,
                            name: anim.events[i].name,
                        };
                        Emitter.instance.emit(key.TIMELINE.SET_EVENT_KEY, data);
                    }
                    anim.events.forEach((e) => {
                        set.add(e.name);
                    });
                }

                set.forEach((element) => {
                    Emitter.instance.emit(key.MENU.LOAD_EVENT, element);
                });

                Emitter.instance.emit(key.MENU.SET_CHILDREN);
                Emitter.instance.emit(key.TIMELINE.SET_CHILDREN);
                Emitter.instance.emit(key.SPINE_CTRL.SET_ANIM, this.value);
                Emitter.instance.emit("clickAnim", this.value);

                break;
            case "skin":
                cc.log("click skin :", this.value);
                break;
            case "event":
                cc.log("click event :", this.value);
                break;
        }
    },

    loadEvent() {
        this.text.string = this.value;
        this.type = "event";
    },
});
