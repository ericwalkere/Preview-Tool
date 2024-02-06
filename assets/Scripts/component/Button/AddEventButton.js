const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        addNew: cc.Node,
        box: cc.EditBox,
    },

    clickButtonAddNew() {
        this.addNew.active = false;
        this.box.node.active = true;
        this.box.string = "";
    },

    enterText() {
        this.addNew.active = true;
        this.box.node.active = false;
        Emitter.instance.emit(EventCode.TIMELINE.ADD_EVENT_TO_ANIM, this.box.string.trim());
    },

    onLeave() {
        if (this.box.string.trim() !== "") {
            return;
        }
        this.addNew.active = true;
        this.box.node.active = false;
    },
});
