const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent, removeEvents } = require("eventHelper");
const { clamp } = require("maths");

cc.Class({
    extends: cc.Component,

    properties: {
        slider: require("SliderUpdate"),

        hintText: cc.Label,
        removeBtn: cc.Node,
        anim: cc.Animation,
    },

    onLoad() {
        registerEvent(EventCode.EVENT_KEY.GET_CURRENT_TIME, this.getCurrentTime, this);

        this.node.on("mouseenter", this.onEnter, this);
        this.node.on("mouseleave", this.onExit, this);
        this.node.on("mousedown", this.onClick, this);
        this.removeBtn.on("click", this.removeEvent, this);

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.startDragging, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.endDragging, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.endDragging, this);

        this.isDragging = false;
    },

    onDestroy() {
        removeEvents(this);

        this.node.off("mouseenter", this.onEnter, this);
        this.node.off("mouseleave", this.onExit, this);
        this.node.off("mousedown", this.onClick, this);
        this.removeBtn.off("click", this.removeEvent, this);

        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.startDragging, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.endDragging, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.endDragging, this);
    },

    getCurrentTime(currentTime) {
        this.newTime = currentTime;
    },

    startDragging(event) {
        if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT) {
            this.isDragging = true;
            Emitter.instance.emit(EventCode.SPINE_CTRL.DRAG_EVENT, true);
        }
    },

    onDrag(event) {
        if (!this.isDragging) return;

        const offset = this.node.convertToNodeSpaceAR(event.getLocation());
        this.node.x += offset.x;
        this.node.x = clamp(this.node.x, 0, 800);
        this.node.opacity = 160;
    },

    endDragging(event) {
        if (!this.isDragging) return;

        this.isDragging = false;
        Emitter.instance.emit(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.data);
        this.data.time = this.newTime;
        Emitter.instance.emit(EventCode.SPINE_CTRL.ADD_EVENT_KEY, this.data);
        Emitter.instance.emit(EventCode.SPINE_CTRL.DRAG_EVENT, false);
        this.node.opacity = 255;
    },

    onClick(event) {
        if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
            this.removeBtn.active = true;
            this.anim.play();
        }
    },

    removeEvent() {
        if (this.data) {
            Emitter.instance.emit(EventCode.SPINE_CTRL.DRAG_EVENT, false);
            Emitter.instance.emit(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.data);
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
