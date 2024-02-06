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

        this.node.on("mouseenter", this.onEnter.bind(this));
        this.node.on("mouseleave", this.onExit.bind(this));
        this.node.on("mousedown", this.onClick.bind(this));
        this.removeBtn.on("click", this.removeEvent.bind(this));

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.startDragging, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.endDragging, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.endDragging, this);

        this.isDragging = false;
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
    },

    endDragging(event) {
        if (!this.isDragging) return;

        this.isDragging = false;
        Emitter.instance.emit(EventCode.TIMELINE.REMOVE_EVENT_KEY);
        Emitter.instance.emit(EventCode.SPINE_CTRL.REMOVE_EVENT_KEY, this.data);
        Emitter.instance.emit(EventCode.SPINE_CTRL.ADD_EVENT_KEY, {
            anim: this.data.anim,
            event: this.data.event,
            time: this.newTime,
        });
        Emitter.instance.emit(EventCode.SPINE_CTRL.DRAG_EVENT, false);
        // Emitter.instance.emit(EventCode.MENU.UPDATE_ANIM_EVENT);
    },

    onClick(event) {
        if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
            this.removeBtn.active = true;
            this.anim.play();
        }
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
