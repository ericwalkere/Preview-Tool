const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        slider: require("SliderUpdate"),

        hintText: cc.Label,
        removeBtn: cc.Node,
        anim: cc.Animation,
    },

    onLoad() {
        registerEvent('GET_TIME', this.getCurrentTime, this);

        this.node.on("mouseenter", this.onEnter.bind(this));
        this.node.on("mouseleave", this.onExit.bind(this));
        this.node.on("mousedown", this.onClick.bind(this));
        this.removeBtn.on("click", this.removeEvent.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_START, this.startDragging, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.endDragging, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.endDragging, this);

        this.isDragging = false;
    },

    getCurrentTime(currentTime) {
        this.newTime = currentTime;
    },

    startDragging(event) {
        this.isDragging = true;
        this.touchStartPos = event.getLocation();
        Emitter.instance.emit(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.data);
    },

    onDrag(event) {
        if (!this.isDragging) return;

        const keyPos = event.getLocation();
        const delta = keyPos.sub(this.touchStartPos);

        this.node.x += delta.x;

        if (this.node.x < 0) {
            this.node.x = 0;
            this.isDragging = false;

        }
        else if (this.node.x > 800) {
            this.node.x = 800;
            this.isDragging = false;
        }
        this.touchStartPos = keyPos;


    },

    endDragging(event) {
        this.isDragging = false;
        Emitter.instance.emit(EventCode.TIMELINE.REMOVE_EVENT_KEY);
        Emitter.instance.emit(EventCode.SPINE_CTRL.ADD_EVENT_KEY, { anim: this.data.anim, event: this.data.event, time: this.newTime });
        Emitter.instance.emit(EventCode.MENU.UPDATE_ANIM_EVENT);
    },

    onClick(event) {
        this.removeBtn.active = true;
        this.anim.play();

    },

    removeEvent() {
        if (this.data) {
            Emitter.instance.emit(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.data);
            Emitter.instance.emit(EventCode.TIMELINE.REMOVE_EVENT_KEY);
            Emitter.instance.emit(EventCode.MENU.UPDATE_ANIM_EVENT);
        }
    },

    onEnter() {
        this.hintText.node.active = true;
    },

    onExit() {
        this.hintText.node.active = false;
    },

    hint(data) {
        this.hintText.string = data.event;
        this.data = data;
    },
});
