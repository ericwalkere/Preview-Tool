
cc.Class({
    extends: cc.Component,

    properties: {
        hintText: cc.Label,
    },

    onLoad() {
        this.node.on("mouseenter", this.onEnter.bind(this));
        this.node.on("mouseleave", this.onExit.bind(this));
    },

    onEnter() {
        this.hintText.node.active = true;
    },

    onExit() {
        this.hintText.node.active = false;
    },

    hint(text) {
        this.hintText.string = text;
    },
});
