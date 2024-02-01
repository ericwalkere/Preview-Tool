const { removeEvents } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    onLoad() {
        this.node.on("click", this.onClick, this);
        this.initEvents();
    },

    onDestroy() {
        this.node.off("click", this.onClick, this);
        removeEvents(this);
    },

    initEvents() {},

    onClick(target) {},
});
