cc.Class({
    extends: require("SliderUpdate"),

    properties: {
        handle: cc.Node,
        spineNode: cc.Node,
    },

    setSize() {
        this.spineNode.scale = cc.v2(
            this.slide.progress * 2,
            this.slide.progress * 2
        );
    },
});
