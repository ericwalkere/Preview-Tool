const Emitter = require("EventEmitter");
const EventCode = require("EventCode");
cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,

        audioCheck:cc.Node,
        addAudio:cc.Node,
    },

    onLoad() {
        this.node.on("click", this.onClick.bind(this));
        this.addAudio.on('click', this.addSound.bind(this));
    },

    getJson(json) {
        this.json = json;
    },

    setData(text, type) {
        this.text.string = text;
        this.textValue = text;
        this.type = type;

        if(type === 'event'){
            this.addAudio.addComponent('AudioImport').setEventName(text);
            this.addAudio.active = true;
        }
    },

    addSound(){
        cc.log('click add audio');

        //if has sound 
        this.audioCheck.active = true;
    },

    onClick() {
        switch (this.type) {
            case "anim":
                
                Emitter.instance.emit(EventCode.SPINE_POOL.REMOVE_EVENT_CHILDREN);
                const set = new Set();
                Emitter.instance.emit(EventCode.TIMELINE.SET_CHILDREN);
                Emitter.instance.emit(
                    EventCode.SPINE_CTRL.SET_ANIM,
                    this.textValue
                );
                if (this.json.animations[this.textValue].events) {
                    const anim = this.json.animations[this.textValue];
                    for (let i = 0; i < anim.events.length; i++) {
                        Emitter.instance.emit(
                            EventCode.TIMELINE.SET_EVENT_KEY,
                            anim.events[i].time,
                            anim.events[i].name
                        );
                    }
                    this.json.animations[this.textValue].events.forEach((e) => {
                        set.add(e.name);
                    });
                }
                set.forEach((element) => {
                    Emitter.instance.emit(EventCode.SPINE_POOL.LOAD_EVENT_BY_ANIM, element);
                });
                Emitter.instance.emit('clickAnim', this.textValue);
                break;
            case "skin":
                cc.log("click skin :", this.textValue);
                break;
            case "event":
                cc.log("click event :", this.textValue);
                break;
        }
    },
});
