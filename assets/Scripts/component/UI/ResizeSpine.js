cc.Class({
    extends: cc.Component,

    properties: {
        spineNode: cc.Node,
    },

    onLoad() {
        this.spineNode.scale = cc.v2(0.6, 0.6);
    },

    setSize(slide) {
        this.spineNode.scale = cc.v2(slide.progress * 2, slide.progress * 2);
    },
});
